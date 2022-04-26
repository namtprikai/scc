<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.userConditionModify") }}</span>
      </div>
      <el-table
        v-loading="isLoading"
        :data="paginationData"
        row-key="id"
        border
        fit
        max-height="600"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          :label="$t('labelText.id')"
          prop="id"
          align="center"
          width="80"
        />
        <el-table-column
          :label="$t('labelText.conditionLabel')"
          prop="label"
          align="center"
          min-width="200"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <!-- TODO: Pending redirect to edit condition -->
              <router-link :to="{name: '', params: {id: row.id}}" event="">
                <span>{{ row.label }}</span>
              </router-link>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('labelText.conditionConditionGroup')"
          prop="conditionGroupLabel"
          align="center"
          min-width="200"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <!-- TODO: Pending redirect to edit condition group -->
              <router-link
                :to="{name: '', params: {id: row.conditionGroupId}}"
                event=""
              >
                <span>{{ row.conditionGroupLabel }}</span>
              </router-link>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('text.enable')" align="center" width="100">
          <template slot-scope="{row}">
            <el-checkbox
              v-model="row.isCheck"
              @change="toggleRowSelection(row, $event)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="conditionsItemData.length > 0"
        :total="conditionsItemData.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
      <el-row :class="conditionsItemData.length > 0 ? '' : 'mt-32'">
        <el-button
          type="primary"
          @click.native.prevent="confirmDataModal"
          v-if="conditionsItemData.length > 0"
          >{{ $t("text.update") }}</el-button
        >
      </el-row>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmData"
      :title="$t('text.modifyScreenModalConfirmTitle')"
      @ok="handelUpdateUser"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IConditionGroup, ICondition } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { mapKeys, camelCase } from 'lodash'
import { getConditionGroups } from '@/api/condition-groups'
import { getConditions } from '@/api/conditions'
import { getUserConditions, updateUserConditions } from '@/api/users'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

export interface IConditionItemData {
  id: number
  label: string
  conditionGroupLabel: string
  conditionGroupId: number
  created: Date | null
  modified: Date | null
  isCheck: boolean
}

@Component({
  name: 'ChangeUserCondition',
  components: {
    Pagination,
    ConfirmDialog
  }
})
export default class extends Vue {
  confirmData: any = null;
  public confirmdialogVisible = false;
  isLoading = false;
  conditionsItemData: Array<IConditionItemData> = [];
  userConditions: Array<ICondition> = [];
  userConditionsOld: Array<ICondition> = [];
  userConditionsAdd: Array<ICondition> = [];
  userConditionsDelete: Array<ICondition> = [];

  @Prop({ default: () => null }) private userId!: number;

  created() {
    this.getListUserConditions()
  }

  private listQuery = {
    page: 1,
    limit: 10
  };

  get paginationData() {
    return this.conditionsItemData.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  async getListConditions() {
    try {
      // get list condition groups
      const conditionGroupsResponse = await getConditionGroups()
      const conditionGroups: Array<IConditionGroup> = []
      conditionGroupsResponse.data.forEach((element: any) => {
        conditionGroups.push(
          mapKeys(element, (v, k) => camelCase(k)) as IConditionGroup
        )
      })

      // get list conditions
      const conditionsResponse = await getConditions()
      const items: Array<IConditionItemData> = []
      conditionsResponse.data.forEach((item: any) => {
        const conditionDetail: IConditionItemData = mapKeys(item, (v, k) =>
          camelCase(k)
        ) as IConditionItemData
        const conditionGroup = conditionGroups.find(
          (x) => x.id === conditionDetail.conditionGroupId
        )
        // get ConditionLabel from condition group
        if (conditionGroup) {
          conditionDetail.conditionGroupLabel = conditionGroup.label
        }
        conditionDetail.isCheck = this.userConditions.some(
          (x) => item.id === x.id
        )
        items.push(conditionDetail)
      })
      this.conditionsItemData = items
    } catch (err) {}
  }

  async getListUserConditions() {
    this.isLoading = true
    try {
      const { data } = await getUserConditions(this.userId)
      const items: Array<ICondition> = []
      data.forEach((element: any) => {
        items.push(mapKeys(element, (v, k) => camelCase(k)) as ICondition)
      })
      this.userConditions = items
      this.userConditionsOld = [...this.userConditions]
    } catch (err) {}
    this.getListConditions()
    this.isLoading = false
  }

  toggleRowSelection(row: IConditionItemData, checked: boolean) {
    if (checked) {
      this.userConditions.push({ ...row })
    } else {
      this.userConditions = this.userConditions.filter(
        (item) => item.id !== row.id
      )
    }
    this.$emit('input', this.userConditions)
  }

  // confirm data
  confirmDataModal() {
    this.confirmData = []
    this.userConditionsAdd = this.userConditions.filter(
      (x) => !this.userConditionsOld.some((item) => item.id === x.id)
    )
    this.userConditionsDelete = this.userConditionsOld.filter(
      (x) => !this.userConditions.some((item) => item.id === x.id)
    )
    if (this.userConditionsAdd.length !== 0) {
      this.userConditionsAdd.forEach((item: any) => {
        this.confirmData.push({
          key: `${item.id}.${item.label}`,
          value: this.$tc('text.userConditionEnableYes')
        })
      })
    }
    if (this.userConditionsDelete.length !== 0) {
      this.userConditionsDelete.forEach((item: any) => {
        this.confirmData.push({
          key: `${item.id}.${item.label}`,
          value: this.$tc('text.userConditionEnableNo')
        })
      })
    }
    this.confirmdialogVisible = true
  }

  // submit update user condition
  async handelUpdateUser() {
    if (!this.userConditionsAdd.length && !this.userConditionsDelete.length) {
      return
    }
    try {
      await updateUserConditions(this.userId, {
        condition_id: this.userConditionsAdd.map((x) => x.id),
        delete_id: this.userConditionsDelete.map((x) => x.id)
      })
      // show pop up success message
      this.$alert(this.$t('message.userConditionModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      // set user origin data is user new data
      this.userConditionsAdd = []
      this.userConditionsDelete = []
      this.getListUserConditions()
    } catch (err) {}
  }
}
</script>
