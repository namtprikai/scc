<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.userRoleModify") }}</span>
      </div>
      <el-table
        v-loading="listLoading"
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
              <router-link :to="{name: 'EditRole', params: {id: row.id}}">
                <span>{{ row.label }}</span>
              </router-link>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column :label="$t('text.enable')" align="center" width="100">
          <template slot-scope="{row}">
            <el-checkbox
              :checked="isRowSelected(row.id)"
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
          :disabled="roles.length === 0"
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

@Component({
  name: 'UpdateUserRole',
  components: {
    Pagination,
    ConfirmDialog
  }
})
export default class extends Vue {
  isFormSubmitting = false;
  confirmData: any = null;
  public confirmdialogVisible = false;
  listLoading = false;
  roles: Array<IRoleListItemData> = [];
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
      this.listLoading = true

      // get list roles
      const { data } = await getRoles()
      this.roles = data
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
  }

  async getListUserRoles() {
    try {
      this.listLoading = true
      const { data } = await getUserRoles(this.userId)
      this.userRoles = data
      this.userRolesOld = [...this.userRoles]
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
    }
    this.getListRoles()
  }

  isRowSelected(id: number) {
    return this.userRoles.some((item) => item.id === id)
  }

  toggleRowSelection(row: IRoleListItemData, checked: boolean) {
    if (checked) {
      this.userRoles.push(row)
    } else {
      this.userRoles = this.userRoles.filter((item) => item.id !== row.id)
    }
    this.$emit('input', this.userRoles)
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
    this.isFormSubmitting = true
    try {
      await updateUserRoles(this.userId, {
        role_id: this.userRolesAdd.map((x) => x.id),
        delete_id: this.userRolesDelete.map((x) => x.id)
      })
      this.isFormSubmitting = false
      // show pop up success message
      this.$alert(this.$t('message.userRoleModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      // set user origin data is user new data
      this.userRolesOld = [...this.userRoles]
      this.userRolesAdd = []
      this.userRolesDelete = []
    } catch (err) {
      this.isFormSubmitting = false
    }
  }
}
</script>
