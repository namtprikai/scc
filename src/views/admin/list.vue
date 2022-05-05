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
          <el-select :class="row.id" v-if="hasPolicyEnabled || hasPolicyDisabled"  v-model="row.isEnabled" @change="confirmEnabledOrDisabled(row)">
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
import { getListAdmin, unlockAdmin, enabledAdmin, disabledAdmin } from '@/api/admins'
import { getProduct } from '@/api/production'
import { camelizeKeys } from '@/utils/parse'
import { hasPolicy } from '@/utils/common'
import { IAdminListItemData, IProductListItemData } from '@/api/types'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError } from '@/utils/request'
import { PolicyUriName, PolicyMethod } from '@/utils/constant'
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
      value: true,
      label: this.$t('text.enable').toString()
    },
    {
      value: false,
      label: this.$t('text.disable').toString()
    }
  ]

  private listQuery = {
    page: 1,
    limit: 10
  };

  created() {
    this.fetchData()
    this.hasPolicyEnabled = hasPolicy(PolicyUriName.EnableAdmin, PolicyMethod.Post)
    this.hasPolicyDisabled = hasPolicy(PolicyUriName.DisableAdmin, PolicyMethod.Post)
    this.hasPolicyUnlocked = hasPolicy(PolicyUriName.UnlockAdmin, PolicyMethod.Post)
    this.hasPolicyGetProducts = hasPolicy(PolicyUriName.GetListCreateProduct, PolicyMethod.Get)
  }

  private async fetchData() {
    try {
      this.isLoading = true
      const { data } = await getListAdmin()
      const admins: IAdminListItemData[] = camelizeKeys(data)
      if (this.hasPolicyGetProducts) {
        const products = await getProduct({})
        this.products = camelizeKeys(products.data)
      }
      admins.forEach(admin => {
        admin.isEnabled = !!admin.isEnabled
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

  private async confirmUnlock(item: IAdminListItemData) {
    try {
      await unlockAdmin(item.id)
      this.fetchData()
    } catch {}
  }

  private async confirmEnabledOrDisabled(item: IAdminListItemData) {
    this.$confirm(!item.isEnabled ? this.$tc('helpText.adminDisableAsk') : this.$tc('helpText.adminEnableAsk'), {
      confirmButtonText: this.$tc('text.ok'),
      cancelButtonText: this.$tc('text.cancel'),
      type: 'warning'
    }).then(async() => {
      try {
        !item.isEnabled ? await disabledAdmin(item.id) : await enabledAdmin(item.id)
        this.fetchData()
      } catch (err) {
        item.isEnabled = !item.isEnabled
        if (err instanceof ValidationError) {
          const validationError = err as ValidationError
          if (validationError.data?.length) {
            validationError.data.forEach((err) => {
              // get message error
              switch (err.value) {
                case 'admin_id':
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
    }).catch(() => {
      item.isEnabled = !item.isEnabled
    })
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
