<template>
  <div>
    <el-table
      v-loading="isLoading"
      :data="paginatedData"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        :label="$t('labelText.id')"
        prop="id"
        align="center"
        width="100"
      />
      <el-table-column
        :label="$t('labelText.policyLabel')"
        prop="label"
        align="center"
        min-width="200"
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
        :label="$t('labelText.policyDescription')"
        prop="description"
        align="center"
        min-width="200"
      />
      <el-table-column
        :label="$t('text.add')"
        align="center"
        width="100"
      >
        <template slot-scope="{row}">
          <el-checkbox
            :checked="isRowSelected(row.id)"
            @change="toggleRowSelection(row, $event)"
          ></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="policies.length > 0"
      :total="policies.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPolicyItem } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { mapKeys, camelCase } from 'lodash'
import { getPolicies } from '@/api/policies'
@Component({
  name: 'PolicySelection',
  components: {
    Pagination
  }
})
export default class extends Vue {
  isLoading = false;
  policies: IPolicyItem[] = []
  selectedPolicies: IPolicyItem[] = []
  listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.getPolicyList()
  }

  get paginatedData() {
    return this.policies.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  async getPolicyList() {
    try {
      this.isLoading = true
      const { data } = await getPolicies()
      this.policies = data.map(
        (item: any) => mapKeys(item, (v, k) => camelCase(k)) as IPolicyItem
      )

      this.isLoading = false
    } catch (err) {
      this.isLoading = false
    }
  }

  isRowSelected(id: number) {
    return this.selectedPolicies.some(item => item.id === id)
  }

  toggleRowSelection(row: IPolicyItem, checked: boolean) {
    if (checked) {
      this.selectedPolicies.push(row)
    } else {
      this.selectedPolicies = this.selectedPolicies.filter(
        item => item.id !== row.id
      )
    }
    this.$emit('input', this.selectedPolicies)
  }
}
</script>
