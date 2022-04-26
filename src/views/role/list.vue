<template>
  <div class="container role-list-container">
    <el-row type="flex" justify="end">
      <router-link :to="{name: 'CreateRole'}">
        <el-button type="primary" icon="el-icon-plus">{{ $t('text.addNew') }}</el-button>
      </router-link>
    </el-row>
    <el-table
      v-loading="isLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      class="role-table"
    >
      <el-table-column width="100" align="center" :label="$t('labelText.id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200" align="center" :label="$t('labelText.roleLabel')">
        <template slot-scope="{row}">
            <span>{{ row.label }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" :label="$t('labelText.action')">
        <template slot-scope="{row}">
          <router-link :to="{name: 'DetailEditRole', params: {id: row.id}}">
              <el-button class="role-table__button" type="primary" size="small" icon="el-icon-view">
                  {{ $t('text.detail') }}
              </el-button>
          </router-link>
          <el-button class="role-table__button" type="danger" size="small" icon="el-icon-delete" @click="confirmDelete(row)">
            {{ $t('text.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="roles.length > 0"
      :total="roles.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IRoleListItemData } from '@/api/types'
import { getRoles, deleteRole } from '@/api/roles'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'RoleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private roles: IRoleListItemData[] = [];
  private isLoading = true;
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.fetchData()
  }

  private async fetchData() {
    try {
      this.isLoading = true

      const { data } = await getRoles()
      this.roles = data

      this.isLoading = false
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.roles.slice(start, end)
  }

  private confirmDelete(item: IRoleListItemData) {
    this.$confirm(this.$tc('helpText.roleDelete'), {
      confirmButtonText: this.$tc('text.ok'),
      cancelButtonText: this.$tc('text.cancel'),
      type: 'warning'
    }).then(async() => {
      try {
        await deleteRole(item.id)
        this.roles = this.roles.filter(role => role.id !== item.id)
      } catch { }
    })
  }
}
</script>

<style lang="scss" scoped>
.role-list-container {
  .role-table {
    width: 100%;
    margin-top: 15px;

    &__button {
      margin: 5px;
    }
  }
}
</style>
