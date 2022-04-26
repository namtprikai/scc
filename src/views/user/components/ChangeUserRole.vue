<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.userRoleModify") }}</span>
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
          :label="$t('labelText.roleLabel')"
          prop="label"
          align="center"
          min-width="200"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <router-link
                :to="{name: 'DetailEditRole', params: {id: row.id}}"
              >
                <span>{{ row.label }}</span>
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
        v-show="roles.length > 0"
        :total="roles.length"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
      <el-row :class="roles.length > 0 ? '' : 'mt-32'">
        <el-button
          type="primary"
          @click.native.prevent="confirmDataModal"
          v-if="roles.length > 0"
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
import { IRoleListItemData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getRoles } from '@/api/roles'
import { getUserRoles, updateUserRoles } from '@/api/users'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

export interface IRoleItemData {
  id: number
  label: string
  created: Date | null
  modified: Date | null
  isCheck: boolean
}

@Component({
  name: 'UpdateUserRole',
  components: {
    Pagination,
    ConfirmDialog
  }
})
export default class extends Vue {
  confirmData: any = null;
  public confirmdialogVisible = false;
  isLoading = false;
  roles: Array<IRoleItemData> = [];
  userRoles: Array<IRoleListItemData> = [];
  userRolesOld: Array<IRoleListItemData> = [];
  userRolesAdd: Array<IRoleListItemData> = [];
  userRolesDelete: Array<IRoleListItemData> = [];

  @Prop({ default: () => null }) private userId!: number;

  created() {
    this.getListUserRoles()
  }

  private listQuery = {
    page: 1,
    limit: 10
  };

  get paginationData() {
    return this.roles.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  async getListRoles() {
    try {
      // get list roles
      const rolessResponse = await getRoles()
      const items: Array<IRoleItemData> = []
      rolessResponse.data.forEach((item: any) => {
        const roleDetail: IRoleItemData = item
        roleDetail.isCheck = this.userRoles.some((x) => item.id === x.id)
        items.push(roleDetail)
      })
      this.roles = items
    } catch (err) {}
  }

  async getListUserRoles() {
    this.isLoading = true
    try {
      const { data } = await getUserRoles(this.userId)
      this.userRoles = data
      this.userRolesOld = [...this.userRoles]
    } catch (err) {}
    this.getListRoles()
    this.isLoading = false
  }

  toggleRowSelection(row: IRoleListItemData, checked: boolean) {
    if (checked) {
      this.userRoles.push(row)
    } else {
      this.userRoles = this.userRoles.filter((item) => item.id !== row.id)
    }
  }

  // confirm data
  confirmDataModal() {
    this.confirmData = []
    this.userRolesAdd = this.userRoles.filter(
      (x) => !this.userRolesOld.some((item) => item.id === x.id)
    )
    this.userRolesDelete = this.userRolesOld.filter(
      (x) => !this.userRoles.some((item) => item.id === x.id)
    )
    if (this.userRolesAdd.length !== 0) {
      this.userRolesAdd.forEach((item: any) => {
        this.confirmData.push({
          key: `${item.id}.${item.label}`,
          value: this.$tc('text.userRoleEnableYes')
        })
      })
    }
    if (this.userRolesDelete.length !== 0) {
      this.userRolesDelete.forEach((item: any) => {
        this.confirmData.push({
          key: `${item.id}.${item.label}`,
          value: this.$tc('text.userRoleEnableNo')
        })
      })
    }
    this.confirmdialogVisible = true
  }

  // submit update user role
  async handelUpdateUser() {
    if (!this.userRolesAdd.length && !this.userRolesDelete.length) {
      return
    }
    try {
      await updateUserRoles(this.userId, {
        role_id: this.userRolesAdd.map((x) => x.id),
        delete_id: this.userRolesDelete.map((x) => x.id)
      })
      // show pop up success message
      this.$alert(this.$t('message.userRoleModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      // set user origin data is user new data
      this.userRolesAdd = []
      this.userRolesDelete = []
      this.getListUserRoles()
    } catch (err) {}
  }
}
</script>
