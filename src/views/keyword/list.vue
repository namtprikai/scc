<template>
  <div
    class="container keyword-list-container"
    v-loading.fullscreen.lock="isLoading"
  >
    <div class="keyword-list-wrapper">
      <div class="keyword-list-title">
        <el-checkbox
          class="check-all"
          :indeterminate="isIndeterminate"
          v-model="isCheckAll"
          >{{ $t("labelText.keywordAllSelect") }}</el-checkbox
        >
        <div class="action-container">
          <div class="action">
            <el-button
              @click="confirmUpdate"
              :disabled="enableItems < 1"
              class="role-table__button"
              type="primary"
              size="small"
            >
              {{
                enableItems > 0
                  ? `${$t("text.updateMultiple")} (${enableItems})`
                  : $t("text.updateMultiple")
              }}
            </el-button>
            <el-button
              @click="confirmDelete"
              :disabled="enableItems < 1"
              class="role-table__button"
              type="danger"
              size="small"
            >
              {{
                enableItems > 0
                  ? `${$t("text.deleteMultiple")} (${enableItems})`
                  : $t("text.deleteMultiple")
              }}
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="list.length" class="keyword-list-content">
        <div v-for="item in list" :key="item.id" class="keyword-item">
          <div class="title">
            <div class="selection">
              <el-checkbox v-model="item.isEnabled" />
            </div>
            <div class="keyword-option">
              <div>
                <el-input class="label keyword-input" v-model="item.label" />
              </div>
              <div>
                <el-input-number
                  class=" weight keyword-input"
                  v-model="item.weight"
                  :controls="false"
                  :min="sliderOption.min"
                  :max="sliderOption.max"
                  @change="valueChange($event, item)"
                ></el-input-number>
              </div>
            </div>
          </div>

          <el-slider
            v-model="item.weight"
            :min="sliderOption.min"
            :max="sliderOption.max"
            :step="0.05"
          ></el-slider>
        </div>
      </div>
      <el-empty v-else></el-empty>

      <pagination
        v-show="keywords.length > 0"
        :total="keywords.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />

      <confirm-delete
        :dialogVisible.sync="deleteDialogVisible"
        :confirmData="deleteLabels"
        :title="$t('helpText.keywordDeleteOnce')"
        @ok="deleteKeyword"
      />
      <confirm-dialog
        :title="$t('text.modifyScreenModalConfirmTitle')"
        :dialogVisible.sync="confirmDialogVisible"
        :confirmData="updateData"
        @ok="updateKeyword"
      >
        <div slot="content" slot-scope="{data}">
          <el-table
            v-if="data.length"
            :empty-text="$t('helpText.screenItemNothingChanged')"
            :data="data"
            style="width: 100%"
            row-key="id"
            border
            fit
            highlight-current-row
          >
            <el-table-column
              align="center"
              :label="$t('text.keywordModalEditLabelBefore')"
            >
              <template slot-scope="{row}">
                <span>{{ row.originLabel }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              :label="$t('text.keywordModalEditLabelAfter')"
            >
              <template slot-scope="{row}">
                <span>{{ row.label }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('text.keywordModalEditKeywordWeight')"
            >
              <template slot-scope="{row}">
                <span>{{ row.weight }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="no-changed">
            {{ $t("helpText.screenItemNothingChanged") }}
          </div>
        </div>
      </confirm-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getListKeyword,
  searchValidation,
  updateKeyword,
  deleteKeyword
} from '@/api/keyword'
import Pagination from '@/components/Pagination/index.vue'
import { IValidationItemData } from '@/api/types'
import { camelizeKeys } from '@/utils/parse'
import ConfirmDelete from './components/ConfirmDelete.vue'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { ValidationError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { nextTick } from 'process'
import { error } from 'console'

export interface IKeywordDataItem {
  id: number
  label: string
  weight: number
  create: string
  modified: string
  isEnabled: boolean
}
export interface ConfirmDataUpdate {
  id: number
  originLabel: string
  label: string
  weight: number
}

@Component({
  name: 'ListKeyword',
  components: {
    Pagination,
    ConfirmDelete,
    ConfirmDialog
  }
})
export default class extends Vue {
  private validations: IValidationItemData[] = [];
  private originKeywords: IKeywordDataItem[] = [];
  private keywords: IKeywordDataItem[] = [];
  private isLoading = true;
  private listQuery = {
    page: 1,
    limit: 10
  };

  private sliderOption = {
    min: 0,
    max: 100
  };

  private confirmDialogVisible = false;
  private deleteDialogVisible = false;
  private deleteLabels: string[] = [];

  private updateData: ConfirmDataUpdate[] = [];

  created() {
    this.fetchSearchValidation()
    this.fetchKeyword()
  }

  // get indertinate select all checkbox
  private get isIndeterminate() {
    const isEnabelCount = this.list.filter(x => x.isEnabled).length
    return isEnabelCount > 0 && isEnabelCount < this.list.length
  }

  // get check all status select all checkbox
  private get isCheckAll() {
    return this.list.length > 0 && !this.list.find(x => !x.isEnabled)
  }

  // set check all
  private set isCheckAll(value) {
    this.list.forEach(element => {
      element.isEnabled = value
    })
  }

  // get list data pagination
  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.keywords.slice(start, end)
  }

  // get enable status edit&delete button
  private get enableItems() {
    return this.keywords.filter(x => x.isEnabled).length
  }

  // fetch search validation data
  async fetchSearchValidation() {
    const params = {
      table_name: JSON.stringify(['keywords']),
      colunm_name: JSON.stringify(['weight'])
    }
    try {
      const { data } = await searchValidation(params)
      this.validations = camelizeKeys(data)
      const weightValidation = this.validations.find(
        x => x.columnName === 'weight'
      )
      if (weightValidation) {
        this.sliderOption.min = weightValidation.min
        this.sliderOption.max = weightValidation.max
      }
    } catch (err) {
      //
    }
  }

  // fetch keyword data
  async fetchKeyword() {
    this.isLoading = true
    try {
      const { data } = await getListKeyword()
      this.originKeywords = data
      this.keywords = this.originKeywords.map(x => ({
        ...x,
        isEnabled: false
      }))
    } catch (err) {
      //
    }
    this.isLoading = false
  }

  // confirm delete
  confirmDelete() {
    this.deleteDialogVisible = true
    this.deleteLabels = this.keywords
      .filter(x => x.isEnabled)
      .map(y => y.label)
  }

  // handle delete keyword
  async deleteKeyword() {
    try {
      await deleteKeyword({
        keyword_id: this.keywords.filter(x => x.isEnabled).map(y => y.id)
      })
      // show modal create successfully
      this.$alert(this.$t('message.keywordDeleteSuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true,
        callback: () => {
          this.fetchKeyword()
        }
      })
    } catch (err) {
      // check if error 422
      if (err instanceof ValidationError) {
        if (err.data?.length) {
          const errors = err.data.find(x => x.value === 'keyword_id')
          // get message error
          if (errors && errors?.type?.length) {
            this.$message({
              message: getValidationMessage(errors.type[0]) as string,
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
      }
    }
  }

  // confirm update keyword
  confirmUpdate() {
    this.confirmDialogVisible = true
    const selectedItems = this.keywords.filter(x => x.isEnabled)
    this.updateData = []
    selectedItems.forEach(element => {
      const keyword = this.originKeywords.find(x => x.id === element.id)
      if (keyword) {
        if (!this.checkIsEqual(element, keyword)) {
          this.updateData.push({
            id: element.id,
            originLabel: keyword.label,
            label: element.label,
            weight: element.weight
          })
        }
      }
    })
  }

  // update keyword
  async updateKeyword() {
    if (!this.updateData.length) return
    try {
      await updateKeyword(
        this.updateData.map(x => ({
          label: x.label,
          id: x.id,
          weight: x.weight
        }))
      )
      // show modal create successfully
      this.$alert(this.$t('message.keywordModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true,
        callback: () => {
          this.fetchKeyword()
        }
      })
    } catch (err) {
      // check if error 422
      if (err instanceof ValidationError) {
        if (err.data?.length) {
          const errors = err.data[0]
          // get message error
          if (errors && errors?.type?.length) {
            this.$message({
              message: getValidationMessage(
                errors.type[0],
                this.getErrorValue(errors.value)
              ) as string,
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
      }
    }
  }

  // check two keyword object equal
  checkIsEqual(value: IKeywordDataItem, other: IKeywordDataItem) {
    return value.label === other.label && value.weight === other.weight
  }

  // round two number after '.'
  valueChange(event: number, keyword: IKeywordDataItem) {
    nextTick(() => {
      this.$set(keyword, 'weight', Math.round(event * 100) / 100)
    })
  }

  getErrorValue(key:string) {
    switch (key) {
      case 'label':
        return this.$t('labelText.keywordLabel')
      case 'weight':
        return this.$t('labelText.keywordWeight')
    }
  }
}
</script>

<style lang="scss" scoped>
.keyword-list-container {
  .keyword-list-wrapper {
    border: 1px solid #ebebeb;
    padding: 20px;
    border-radius: 4px;
    .keyword-list-title {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 20px;
    }
    .action-container {
      flex: 1;
      flex-direction: row-reverse;
      .action {
        float: right;
      }
    }
    .keyword-list-content {
      .keyword-item {
        border-bottom: 1px solid #ebebeb;
        margin-top: 10px;
        ::v-deep .keyword-input {
          width: auto;
          input {
            text-align: center !important;
          }
        }
        .title {
          display: flex;
          align-items: center;
          .keyword-option {
            flex: 1;
            text-align: center;
            .label {
              margin-bottom: 10px;
            }
          }
        }
      }
    }

    @media (max-width: 375px) {
      ::v-deep .check-all {
        .el-checkbox__label {
          display: none;
        }
      }
    }
  }
  .no-changed {
    text-align: center;
  }
}
</style>
