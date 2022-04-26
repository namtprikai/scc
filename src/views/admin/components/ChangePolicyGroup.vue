<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.adminPolicyGroupModify") }}</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="paginationData"
        border
        fit
        max-height="600"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('labelText.id')"
          prop="id"
          align="center"
          width="80"
        />
        <el-table-column
          :label="$t('labelText.policyGroupName')"
          prop="label"
          align="center"
        >
        <template slot-scope="{row}">
            <el-link
              type="primary"
              :underline="false"
              @click="toDetailEditPolicyGroup(row.id)"
              >{{ row.label }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('text.enable')"
          prop="isCheck"
          align="center"
        >
          <template slot-scope="{row}">
            <el-checkbox
              v-model="row.isCheck"
              name="type"
              @change="updateDeletePolicyGroup(row, $event)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="policyGroups.length > 0"
        :total="policyGroups.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
      <el-button v-if="policyGroups.length > 0" type="primary" @click="showModal">
        {{$t("text.update")}}
      </el-button>
      <confirm-dialog
        :title="$t('text.modifyScreenModalConfirmTitle')"
        :dialogVisible.sync="dialogFormVisible"
        :keyColumnWidth="50"
        :valueColumnWidth="50"
        :confirmData="confirmData"
        @ok="handleSubmit"
      >
      </confirm-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IListChangePolicyGroupAdminItem, IUpdatePolicyGroupAdmin } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getListPolicyGroup } from '@/api/policy-groups'
import { changePolicyGroupAdmin, getListPolicyGroupAdmin } from '@/api/admins'
import { PolicyMethod, PolicyUriName } from '@/utils/constant'
import { ValidationError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { hasPolicy } from '@/utils/common'
import { camelizeKeys, snakeKeys } from '@/utils/parse'

@Component({
  name: 'ListCategoryRole',
  components: {
    Pagination,
    ConfirmDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private adminId!: number;
  listLoading = false;
  policyGroups: Array<IListChangePolicyGroupAdminItem> = [];
  policyGroupsChange: Array<IListChangePolicyGroupAdminItem> = [];
  originAddPolicyGroups: Array<number> = [];
  confirmData: any = [];
  dialogFormVisible = false;
  updatePolicyGroupAdmin: IUpdatePolicyGroupAdmin = {
    policyGroupId: [],
    deleteId: []
  };

  created() {
    this.getDataPolicyGroup()
  }

  private listQuery = {
    page: 1,
    limit: 10
  };

  get paginationData() {
    return this.policyGroups.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  async getDataPolicyGroup() {
    try {
      this.updatePolicyGroupAdmin = {
        policyGroupId: [],
        deleteId: []
      }
      this.originAddPolicyGroups = []
      if (hasPolicy(PolicyUriName.GetListCreatePolicyGroup, PolicyMethod.Get)) {
        const { data } = await getListPolicyGroup()
        const policyGroupAdminLogin: IListChangePolicyGroupAdminItem[] = camelizeKeys(
          data
        )
        if (hasPolicy(PolicyUriName.GetListUpdatePolicyGroupAdmin, PolicyMethod.Get)) {
          const products = await getListPolicyGroupAdmin(this.adminId)
          this.policyGroupsChange = camelizeKeys(products.data)
        }
        policyGroupAdminLogin.forEach(item => {
          item.isCheck = this.policyGroupsChange.some(
            x => item.id === x.id
          )
          if (item.isCheck) {
            this.originAddPolicyGroups.push(item.id)
          }
        })
        this.policyGroups = policyGroupAdminLogin
      }
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
  }

  // route to detail edit product
  toDetailEditPolicyGroup(id: string) {
    this.$router.push({ name: 'DetailEditPolicyGroup', params: { id } })
  }

  updateDeletePolicyGroup(item: IListChangePolicyGroupAdminItem, checked: boolean) {
    if (checked) {
      if (!this.originAddPolicyGroups.some(x => x === item.id)) {
        this.updatePolicyGroupAdmin.policyGroupId.push(item.id)
      }
      this.updatePolicyGroupAdmin.deleteId = this.updatePolicyGroupAdmin.deleteId.filter(
        x => x !== item.id
      )
    } else {
      if (this.originAddPolicyGroups.some(x => x === item.id)) {
        this.updatePolicyGroupAdmin.deleteId.push(item.id)
      }
      this.updatePolicyGroupAdmin.policyGroupId = this.updatePolicyGroupAdmin.policyGroupId.filter(
        x => x !== item.id
      )
    }
  }

  private async showModal() {
    this.confirmData = []
    this.policyGroups.forEach(item => {
      if (this.updatePolicyGroupAdmin.policyGroupId.some(x => x === item.id)) {
        this.confirmData.push({
          key: item.id + '.' + item.label,
          value: this.$t('text.adminPolicyGroupIsEnabledYes')
        })
      }
      if (this.updatePolicyGroupAdmin.deleteId.some(x => x === item.id)) {
        this.confirmData.push({
          key: item.id + '.' + item.label,
          value: this.$t('text.adminPolicyGroupIsEnabledNo')
        })
      }
    })
    this.dialogFormVisible = true
  }

  async handleSubmit() {
    const model: any = snakeKeys(this.updatePolicyGroupAdmin)
    try {
      const { data } = await changePolicyGroupAdmin(this.adminId, model)
      if (data) {
        // show modal create successfully
        this.$alert(this.$t('message.adminPolicyGroupModifySuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            this.getDataPolicyGroup()
          }
        })
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationError = err as ValidationError
        if (validationError.data?.length) {
          validationError.data.forEach(err => {
            // get message error
            switch (err.value) {
              case 'policy_group_id':
                this.$message({
                  message: getValidationMessage(err.type[0]) as string,
                  type: 'error',
                  duration: 2000
                })
                break
              case 'delete_id':
                this.$message({
                  message: getValidationMessage(err.type[0]) as string,
                  type: 'error',
                  duration: 2000
                })
                break
              default:
                break
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  margin-bottom: 32px;
  .mt-24{
    margin-top: 24px;
  }
}
</style>
