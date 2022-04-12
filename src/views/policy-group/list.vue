<template>
  <div class="app-container md-container">
    <el-row type="flex" justify="start">
      <router-link :to="{name: 'Policies'}">
        <el-button class="btn btn--add" type="primary" icon="el-icon-notebook-2">{{ $t('text.gotoScreenPolicyList') }}</el-button>
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
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPolicyGroupListItemData } from '@/api/types/policy_group'
import { getPolicyGroup } from '@/api/policy_group'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ListPolicyGroup',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private list : IPolicyGroupListItemData[] = [];
  private isLoading = true;
  private total = 0;
  private dlt = false ;
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
      await getPolicyGroup(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length
        if (this.dlt === true && this.total % this.listQuery.limit === 0) {
          this.listQuery.page = this.listQuery.page - 1
          this.dlt = false
        }
        const start = (this.listQuery.page - 1) * this.listQuery.limit
        const end = start + this.listQuery.limit
        this.list = this.list.slice(start, end)
      })
      this.isLoading = false
    } catch {
    }
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
</style>
