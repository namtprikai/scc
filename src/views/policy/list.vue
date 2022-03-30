<template>
  <div class="container policy-list-container">
    <el-table
      v-loading="isLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      class="policy-table"
    >
      <el-table-column width="100" align="center" :label="$t('labelText.id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300"
        align="center"
        :label="$t('labelText.policyLabel')"
      >
        <template slot-scope="{row}">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="200"
        align="center"
        :label="$t('labelText.policyDescription')"
      >
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="100"
        align="center"
        :label="$t('labelText.policyIsActive')"
        prop="isActive"
      >
        <template slot-scope="{row}">
          <el-checkbox disabled v-model="row.isActive" />
        </template>
      </el-table-column>

      <el-table-column
        width="200"
        align="center"
        :label="$t('labelText.action')"
      >
        <template slot-scope="{row}">
          <router-link :to="{name: 'DetailEditPolicy', params: {id: row.id}}">
            <el-button
              class="policy-table__button"
              type="primary"
              size="small"
              icon="el-icon-view"
            >
              {{ $t("text.detail") }}
            </el-button>
          </router-link>
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
import { getPolicies } from '@/api/policies'
import Pagination from '@/components/Pagination/index.vue'
import { mapKeys, camelCase } from 'lodash'

@Component({
  name: 'PolicyList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  public policies: IPolicyItem[] = [];
  private isLoading = true;
  private listQuery = {
    page: 1,
    limit: 10
  };

  created() {
    this.fetchData()
  }

  private async fetchData() {
    try {
      this.isLoading = true

      const { data } = await getPolicies()
      data.forEach((element: any) => {
        this.policies.push(
          mapKeys(element, (v, k) => camelCase(k)) as IPolicyItem
        )
      })

      this.isLoading = false
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.policies.slice(start, end)
  }
}
</script>

<style lang="scss" scoped>
.policy-list-container {
  .policy-table {
    width: 100%;
    margin-top: 15px;

    &__button {
      margin: 5px;
    }
  }
}
</style>
