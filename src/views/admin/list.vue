<template>
  <div class="container admin-list-container">
    <el-row type="flex" justify="end">
      <router-link :to="{name: 'CreateAdmin'}">
        <el-button type="primary" icon="el-icon-plus">{{
          $t("text.addNew")
        }}</el-button>
      </router-link>
    </el-row>
    <el-table
      v-loading="isLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      class="admin-table"
    >
      <el-table-column width="80" align="center" :label="$t('labelText.id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300"
        align="center"
        :label="$t('labelText.email')"
      >
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

    <el-table-column
        min-width="200"
        align="center"
        :label="$t('labelText.loginName')"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="200"
        align="center"
        :label="$t('labelText.product')"
      >
        <template slot-scope="{row}">
          <span class="word-break">{{ row.productName.join(', ')}}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="150"
        align="center"
        :label="$t('labelText.isEnabled')"
      >
        <template slot-scope="{row}">
          <el-select :class="row.id" v-if="hasPolicyEnabled || hasPolicyDisabled"  v-model="row.isEnabledStr" @change="confirmEnabledOrDisabled(row)">
            <el-option
              v-for="item in optionEnables"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <span v-else>{{ row.isEnabled ? $t('text.adminIsEnabledYes') : $t('text.adminIsEnabledNo')}}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="130"
        align="center"
        :label="$t('labelText.isMailauthCompleted')"
      >
        <template slot-scope="{row}">
          <span>{{ row.isMailauthCompleted ?  $t('text.adminIsMailauthCompletedNo') : $t('text.adminIsMailauthCompletedYes')}}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="130"
        align="center"
        :label="$t('labelText.isLock')"
      >
        <template slot-scope="{row}">
          <el-button
              v-if="hasPolicyUnlocked && row.isLock"
              class="admin-table__button"
              type="warning"
              size="small"
              icon="el-icon-unlock"
              @click="confirmUnlock(row)"
            >
              {{ $t("text.unlock") }}
            </el-button>
          <span v-else>{{ row.isLock ? $t('text.adminIsLockYes') : $t('text.adminIsLockNo') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150"
        align="center"
        :label="$t('labelText.action')"
      >
        <template slot-scope="{row}">
          <router-link :to="{name: 'EditAdmin', params: {adminId: row.id}}">
            <el-button
              class="admin-table__button"
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
      v-show="admins.length > 0"
      :total="admins.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getListAdmin } from '@/api/admins'
import { getProduct } from '@/api/production'
import { parseToCamelCase } from '@/utils/parse'
import { hasPolicy } from '@/utils/common'
import { IAdminListItemData, IProductListItemData } from '@/api/types'

import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'AdminList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private admins: IAdminListItemData[] = []
  private products: IProductListItemData[] = []
  private isLoading = true
  private hasPolicyEnabled = false
  private hasPolicyDisabled = false
  private hasPolicyUnlocked = false
  private hasPolicyCreatedAdmin = false
  private hasPolicyGetProducts = false
  private optionEnables =[
    {
      value: this.$t('text.enable').toString(),
      label: this.$t('text.enable').toString()
    },
    {
      value: this.$t('text.disable').toString(),
      label: this.$t('text.disable').toString()
    }
  ]

  private listQuery = {
    page: 1,
    limit: 10
  };

  created() {
    this.fetchData()
    this.hasPolicyEnabled = hasPolicy('enable-admin', 'post')
    this.hasPolicyDisabled = hasPolicy('disable-admin', 'post')
    this.hasPolicyUnlocked = hasPolicy('unlock-admin', 'post')
    this.hasPolicyGetProducts = hasPolicy('get-list-create-product', 'get')
  }

  private async fetchData() {
    try {
      this.isLoading = true
      const { data } = await getListAdmin()
      const admins: IAdminListItemData[] = parseToCamelCase(data)
      if (this.hasPolicyGetProducts) {
        const products = await getProduct({})
        this.products = parseToCamelCase(products.data)
      }
      admins.forEach(admin => {
        admin.isEnabledStr = admin.isEnabled ? this.$t('text.enable').toString() : this.$t('text.disable').toString()
        if (admin.productId.length > 0) {
          admin.productName = this.products.filter(x => admin.productId.includes(x.id)).map(x => x.name)
        } else {
          admin.productName = []
        }
      })
      this.admins = admins
      this.isLoading = false
      return true
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.admins.slice(start, end)
  }

  private confirmUnlock(item: IAdminListItemData) {
    alert(item.id)
  }

  private confirmEnabledOrDisabled(item: IAdminListItemData) {
    console.log(item.isEnabledStr)
  }
}
</script>

<style lang="scss" scoped>
.admin-list-container {
  .admin-table {
    width: 100%;
    margin-top: 15px;

    &__button {
      margin: 5px;
    }
  }
  .word-break{
    word-break: break-word;
  }
}
</style>
