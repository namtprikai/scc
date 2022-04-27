<template>
  <div class="container">
    <el-row type="flex" justify="start">
      <router-link :to="{name: 'Policies'}">
        <el-button class="btn btn--add" type="primary" icon="el-icon-notebook-2">{{ $t('text.gotoScreenPolicyList') }}</el-button>
      </router-link>
      <router-link :to="{name: 'CreatePolicyGroup'}" class="align-right">
        <el-button class="btn btn--add" type="primary" icon="el-icon-plus">{{ $t('text.addNew') }}</el-button>
      </router-link>
    </el-row>
    <el-table
      v-loading="isLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" :label="$t('labelText.id')" width=50% >
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('labelText.policyGroupLabel')">
        <template slot-scope="scope">
          {{ scope.row.label }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" :label="$t('labelText.action')" width=200%>
        <template slot-scope="{row}">
          <router-link :to="{name: 'DetailEditPolicyGroup', params: {id: row.id}}">
            <el-button class="btn btn--action" type="primary" size="mini" icon="el-icon-view">
              {{ $t('text.detail') }}
            </el-button>
          </router-link>
          <el-button class="role-table__button" type="danger" size="small" icon="el-icon-delete" @click="confirmDelete(row)">
            {{ $t('text.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="this.listPolicyGroup.length>0" :total="this.listPolicyGroup.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPolicyGroupListItemData } from '@/api/types/policy_group'
import { getPolicyGroup, deletePolicyGroup } from '@/api/policy-groups'
import Pagination from '@/components/Pagination/index.vue'
import { camelizeKeys } from '@/utils/parse'
@Component({
  name: 'ListPolicyGroup',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private listPolicyGroup : IPolicyGroupListItemData[] = [];
  private isLoading = true;
  private listQuery = {
    page: 1,
    limit: 10
  };

  created() {
    this.fetchData()
  }

  async fetchData() {
    try {
      this.isLoading = true
      const { data } = await getPolicyGroup(this.listQuery)
      const policyGroup : IPolicyGroupListItemData[] = camelizeKeys(data) as IPolicyGroupListItemData[]
      this.listPolicyGroup = policyGroup
      this.isLoading = false
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.listPolicyGroup.slice(start, end)
  }

  private confirmDelete(item: IPolicyGroupListItemData) {
    this.$confirm(this.$tc('helpText.policyGroupDelete'), {
      confirmButtonText: this.$tc('text.ok'),
      cancelButtonText: this.$tc('text.cancel'),
      type: 'warning'
    }).then(async() => {
      try {
        await deletePolicyGroup(item.id)
        this.fetchData()
      } catch { }
    })
  }
}
</script >

<style lang="scss" scoped>
.btn--action {
  margin: 5px;
}
.btn--add{
  margin-bottom: 15px;
}

.align-right {
  margin-left: auto;
}
</style>
