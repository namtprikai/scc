<template>
  <div class="container ">
    <el-card class="box-card">
      <div class="policy-group-info">
        <template>
          <span>{{ $t('text.policyGroupInfo') }}</span>
        </template>>
      </div>

    <el-form ref="form" :model="policyGroupData" label-position="top" :rules="rules">
      <el-form-item :label="$t('labelText.id')">
            <el-input
              type="number"
              v-model="policyGroupId"
              disabled
              tabindex="1"
            ></el-input>
      </el-form-item>

      <el-form-item :label="$t('labelText.created')">
            <el-date-picker
              class="width-full"
              type="date"
              disabled
              v-model="policyGroupData.created"
              tabindex="2"
            ></el-date-picker>
      </el-form-item>

      <el-form-item :label="$t('labelText.modified')">
            <el-date-picker
              class="width-full"
              type="date"
              disabled
              v-model="policyGroupData.modified"
              tabindex="3"
            ></el-date-picker>
      </el-form-item>

        <el-form-item  :label="$t('labelText.policyGroupLabel')" :error="dataError.label" prop="label">
          <el-input
            type="text"
            tabindex="4"
            v-model="policyGroupData.label"
            autofocus

          />
        </el-form-item>

        <el-form-item :label="$t('labelText.policyGroupDescription')" :error="dataError.description">
          <el-input
            type="text"
            v-model="policyGroupData.description"
            tabindex="5"
          />
        </el-form-item>

        <el-form-item :label="$t('labelText.memo')" :error="dataError.config">
          <div class="json-editor">
            <json-editor
            :objData="policyGroupData.config"
            v-model="policyGroupData.config"
            tabindex="7" >
            </json-editor>
          </div>
        </el-form-item>
      <div class="title-table">
        <template>
          <span>{{ $t('text.policyGroupPolicyAddDelete') }}</span>
        </template>
      </div>
      <el-table
        v-loading="isLoading"
        :data="list"
        border
        fit
        max-height="600"
        highlight-current-row
        row-key="id"
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('labelText.id')"
          prop="id"
          align="center"
          width="80"
        />
        <el-table-column
          :label="$t('labelText.policyLabel')"
          prop="label"
          align="center"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <router-link :to="{name: 'DetailEditPolicy', params: {id: row.id}}">
                <span>{{ row.label }}</span>
              </router-link>
            </el-link>
          </template>
        </el-table-column>
          <el-table-column
            :label="$t('labelText.policyGroupDescription')"
            prop="description"
            align="center"
          />
          <el-table-column
            :label="$t('text.enable')"
            align="center"
            width="100"
          >
            <template slot-scope="{row}">
              <el-checkbox  :checked="row.isCheck" @change="toggleRowSelection(row.id,row.label,row.isCheck, $event)"></el-checkbox>
            </template>

          </el-table-column>

      </el-table>

      <pagination
        v-show="listPolicy.length > 0"
        :total="listPolicy.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
      <div class="button-update">
        <el-button  type="primary" @click="confirmUpdate">{{ $t('text.update') }} </el-button>
      </div>

      <confirm-dialog
        :dialogVisible.sync="confirmdialogVisible"
        :confirmData="confirmData"
        :title="$t('text.modifyScreenModalConfirmTitle')"
        :isMultipleSection="true"
        :keyColumnWidth="40"
        :valueColumnWidth="60"
        @ok="handleUpdate"
        @cancel="handleCancel"
      />

    </el-form>
    </el-card>
  </div>

</template>

<script lang="ts">

import { IPolicyGroupListItemData, IPolicyGroup, IPolicyListItemData } from '@/api/types'
import { getPolicyPolicyGroup, getDetailPolicyGroup, updatePolicyGroup, updatePolicyPolicyGroup, getListPolicy } from '@/api/policy-groups'
import { Component, Vue, Watch } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import ConfirmDialog, {
  ConfirmDialogData
} from '@/components/ConfirmDialog/index.vue'
import { mapKeys, isEqual, camelCase } from 'lodash'
import { ValidationError, ValidationType } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { ElForm } from 'element-ui/types/form'
import Pagination from '@/components/Pagination/index.vue'
import { camelizeKeys } from '@/utils/parse'
@Component({
  name: 'DetailEditPolicyGroup',
  components: {
    JsonEditor,
    Pagination,
    ConfirmDialog
  }
})

export default class extends Vue {
  private listPolicy : IPolicyListItemData[] = [];
  private listPolicyPolicyGroup : IPolicyGroupListItemData[] = [];
  private policyGroupId = 0;
  public confirmdialogVisible = false;
  confirmData: ConfirmDialogData[] = [];
  isFormSubmitting = false;
  checkboxListIDAdd: number[] = [];
  checkboxListIDDelete: number[] = [];
  checkboxListLabelAdd: string[] = [];
  checkboxListLabelDelete: string[] = [];

  private checkItem = false;
  sectionDataEditPolicyGroup: any = [];
  sectionDataAddDeletePolicyGroup: any = [];
  private pass = null;
  statusHandleUpdate = false;

  policyGroupData: IPolicyGroup = {
    label: '',
    description: '',
    config: {},
    created: '',
    modified: ''
  };

  policyGroupDataEdit: IPolicyGroup = {
    label: '',
    description: '',
    config: {},
    created: '',
    modified: ''
  };

  private isLoading = true;
  private listQuery = {
    page: 1,
    limit: 10
  };

  @Watch('policyGroupData')
  onPolicyGroupDataChange() {
    this.policyGroupDataEdit = { ...this.policyGroupData }
  }

  @Watch('policyGroupId')
  private onPolicyGroupIdChange() {
    this.detailPolicyGroup()
  }

  private dataError: any = {
    label: '',
    description: '',
    config: ''
  };

  rules = {
    label: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.policyGroupLabel')
        ),
        trigger: 'blur'
      }
    ]
  };

  created() {
    this.policyGroupId = parseInt(this.$route.params.id)
    this.detailPolicyGroup()
    this.getListPolicyPolicyGroup()
    this.fetchData()
  }

  resetValidationMessage() {
    this.dataError = {
      label: null,
      description: null,
      config: null
    }
  }

  async detailPolicyGroup() {
    try {
      const { data } = await getDetailPolicyGroup(this.policyGroupId)
      this.policyGroupData = mapKeys(data, (v, k) => camelCase(k)) as IPolicyGroup
    } catch (err) {}
  }

  async getListPolicyPolicyGroup() {
    try {
      await getPolicyPolicyGroup(this.policyGroupId, this.policyGroupId).then(response => {
        this.listPolicyPolicyGroup = response.data
      })
    } catch {

    }
  }

  async fetchData() {
    try {
      this.checkboxListLabelDelete = []
      this.checkboxListLabelAdd = []
      this.checkboxListIDDelete = []
      this.checkboxListIDAdd = []
      this.sectionDataEditPolicyGroup = []
      this.sectionDataAddDeletePolicyGroup = []

      this.isLoading = true
      const { data } = await getListPolicy(this.listQuery)
      const policys : IPolicyListItemData[] = camelizeKeys(data)
      this.listPolicy = policys

      for (const item in this.listPolicy) {
        const checkItem = this.listPolicyPolicyGroup.find(x => x.id === this.listPolicy[item].id)
        if (checkItem) {
          this.listPolicy[item].isCheck = true
        } else {
          this.listPolicy[item].isCheck = false
        }
      }

      this.isLoading = false
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.listPolicy.slice(start, end)
  }

  checkEqualList(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) return false
    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }
    return true
  }

  toggleRowSelection(id: number, label: string, isCheck:boolean, checked: boolean) {
    if (isCheck) {
      if (checked) {
        if (this.checkboxListIDDelete.includes(id)) {
          this.checkboxListIDDelete = this.checkboxListIDDelete.filter(function(item) {
            return item !== id
          })
          this.checkboxListLabelDelete = this.checkboxListLabelDelete.filter(function(item) {
            return item !== label
          })
        } else {
          this.checkboxListIDAdd.push(id)
          this.checkboxListLabelAdd.push(label)
        }
      } else {
        if (this.checkboxListIDAdd.includes(id)) {
          this.checkboxListIDAdd = this.checkboxListIDAdd.filter(function(item) {
            return item !== id
          })
          this.checkboxListLabelAdd = this.checkboxListLabelAdd.filter(function(item) {
            return item !== label
          })
          this.listPolicy[(id - 1)].isCheck = false
        } else {
          this.checkboxListIDDelete.push(id)
          this.checkboxListLabelDelete.push(label)
          this.listPolicy[(id - 1)].isCheck = false
        }
      }
    } else {
      if (checked) {
        if (this.checkboxListIDDelete.includes(id)) {
          this.checkboxListIDDelete = this.checkboxListIDDelete.filter(function(item) {
            return item !== id
          })
          this.checkboxListLabelDelete = this.checkboxListLabelDelete.filter(function(item) {
            return item !== label
          })
          this.listPolicy[(id - 1)].isCheck = true
        } else {
          this.checkboxListIDAdd.push(id)
          this.checkboxListLabelAdd.push(label)
          this.listPolicy[(id - 1)].isCheck = true
        }
      } else {
        if (this.checkboxListIDAdd.includes(id)) {
          this.checkboxListIDAdd = this.checkboxListIDAdd.filter(function(item) {
            return item !== id
          })
          this.checkboxListLabelAdd = this.checkboxListLabelAdd.filter(function(item) {
            return item !== label
          })
        } else {
          this.checkboxListIDDelete.push(id)
          this.checkboxListLabelDelete.push(label)
        }
      }
    }
    if (this.checkEqualList(this.checkboxListIDDelete, this.checkboxListIDAdd)) {
      this.checkboxListLabelDelete = []
      this.checkboxListLabelAdd = []
      this.checkboxListIDDelete = []
      this.checkboxListIDAdd = []
    }
  }

  confirmUpdate() {
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (!isEqual(this.policyGroupData, this.policyGroupDataEdit)) {
          if (!isEqual(this.policyGroupData.label.trim(), this.policyGroupDataEdit.label.trim())) {
            if (this.sectionDataEditPolicyGroup.some((item:any) => item.value === this.policyGroupData.label)) { this.pass = null } else {
              this.sectionDataEditPolicyGroup.push({
                key: this.$t('labelText.policyGroupLabel'),
                value: this.policyGroupData.label
              })
            }
          }
          // check description change
          if (!isEqual(this.policyGroupData.description, this.policyGroupDataEdit.description)) {
            if (this.sectionDataEditPolicyGroup.some((item:any) => item.value === this.policyGroupData.description)) { this.pass = null } else {
              this.sectionDataEditPolicyGroup.push({
                key: this.$t('labelText.policyGroupDescription'),
                value: this.policyGroupData.description
              })
            }
          }
          // check memo change
          if (!isEqual(this.policyGroupData.config, this.policyGroupDataEdit.config)) {
            if (this.sectionDataEditPolicyGroup.some((item:any) => item.value === JSON.stringify(this.policyGroupData.config, undefined, 4))) { this.pass = null } else {
              this.sectionDataEditPolicyGroup.push({
                key: this.$t('labelText.memo'),
                value: JSON.stringify(this.policyGroupData.config, undefined, 4),
                type: 'json'
              })
            }
          }
        }

        if (this.checkboxListIDAdd.length !== 0) {
          const addList = this.checkboxListLabelAdd.map((e, i) => `${this.checkboxListIDAdd[i]}.${e}`)
          for (const items in addList) {
            if (this.sectionDataAddDeletePolicyGroup.some((item:any) => item.key === addList[items])) { continue } else {
              this.sectionDataAddDeletePolicyGroup.push({
                key: addList[items],
                value: this.$t('text.add')
              })
            }
          }
        }
        if (this.checkboxListIDDelete.length !== 0) {
          const deleteList = this.checkboxListLabelDelete.map((e, i) => `${this.checkboxListIDDelete[i]}.${e}`)
          for (const items in deleteList) {
            if (this.sectionDataAddDeletePolicyGroup.some((item: any) => item.key === deleteList[items])) { continue } else {
              this.sectionDataAddDeletePolicyGroup.push({
                key: deleteList[items],
                value: this.$t('text.delete')
              })
            }
          }
        }

        this.confirmData = [
          {
            sectionTitle: this.$tc('text.policyGroupInfo'),
            sectionData: this.sectionDataEditPolicyGroup
          },
          {
            sectionTitle: this.$tc('text.policyGroupPolicyAdd'),
            sectionData: this.sectionDataAddDeletePolicyGroup
          }
        ]
        this.confirmdialogVisible = true
      } else {
        this.statusHandleUpdate = true
        return false
      }
    })
  }

  handleCancel() {
    this.sectionDataEditPolicyGroup = []
    this.sectionDataAddDeletePolicyGroup = []
  }

  async handleUpdate() {
    if (!(this.sectionDataAddDeletePolicyGroup?.length) && !this.sectionDataEditPolicyGroup.length) {
      return
    }
    this.isFormSubmitting = true
    try {
      this.resetValidationMessage()
      await updatePolicyGroup(this.policyGroupId, {
        label: this.policyGroupData.label.trim(),
        description: this.policyGroupData.description,
        config: this.policyGroupData.config
      })
      this.isFormSubmitting = false
      // call api update policy of policy group
      await updatePolicyPolicyGroup(this.policyGroupId, {
        policy_id: this.checkboxListIDAdd,
        delete_id: this.checkboxListIDDelete
      })

      // show pop up success message
      this.$alert(this.$t('message.roleModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })

      // reload data
      await this.getListPolicyPolicyGroup()
      await this.fetchData()
      this.policyGroupData = { ...this.policyGroupData }
    } catch (err) {
      this.isFormSubmitting = false

      // check if error 422
      if (err instanceof ValidationError) {
        const labelError = err?.data?.find(item => item.value === 'label')
        if (labelError && labelError.type.length) {
          this.dataError.label = getValidationMessage(
            labelError.type[0],
            this.$t('labelText.policyGroupLabel')
          ) as string
        }
        const descriptionError = err?.data?.find(
          item => item.value === 'description'
        )
        if (descriptionError && descriptionError.type.length) {
          this.dataError.description = getValidationMessage(
            descriptionError?.type[0],
            this.$t('labelText.policyGroupDescription')
          ) as string
        }
        const configError = err?.data?.find(item => item.value === 'config')
        if (configError && configError.type.length) {
          this.dataError.config = getValidationMessage(
            configError?.type[0],
            this.$t('labelText.policyGroupConfig')
          ) as string
        }
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.width-full {
  width: 100%;
}
.json-editor {
  padding: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.policy-group-info{
  margin : 0px 0px 20px 0px;
}
.title-table{
  margin : 50px 0px 20px 0px;
}
</style>
