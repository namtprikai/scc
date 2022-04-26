<template>
  <div class="container user-list-container">
    <el-row type="flex" justify="end">
      <router-link :to="{name: 'CreateUser'}">
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
      class="user-table"
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
        :label="$t('labelText.userName')"
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
          <span v-else>{{ row.isEnabled ? $t('text.userIsEnabledYes') : $t('text.userIsEnabledNo')}}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="130"
        align="center"
        :label="$t('labelText.isMailauthCompleted')"
      >
        <template slot-scope="{row}">
          <span>{{ row.isMailauthCompleted ?  $t('text.userIsMailauthCompletedYes') : $t('text.userIsMailauthCompletedNo')}}</span>
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
              type="warning"
              size="small"
              icon="el-icon-unlock"
              @click="confirmUnlock(row)"
            >
              {{ $t("text.unlock") }}
            </el-button>
          <span v-else>{{ row.isLock ? $t('text.userIsLockYes') : $t('text.userIsLockNo') }}</span>
        </template>
      </el-table-column>
       <el-table-column
        min-width="130"
        align="center"
        :label="$t('labelText.userIsAuto')"
      >
        <template slot-scope="{row}">
          <span>{{ row.isAuto ?  $t('text.userIsAutoYes') : $t('text.userIsAutoNo')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        :label="$t('labelText.action')"
      >
        <template slot-scope="{row}">
          <router-link :to="{name: 'DetailEditUser', params: {id: row.id}}">
            <el-button
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
      v-show="users.length > 0"
      :total="users.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getListUser, unlockUser, enabledUser, disabledUser } from '@/api/users'
import { getProduct } from '@/api/production'
import { camelizeKeys } from '@/utils/parse'
import { hasPolicy } from '@/utils/common'
import { IProductListItemData, IUserListItemData } from '@/api/types'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError } from '@/utils/request'

import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'UserList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private users: IUserListItemData[] = []
  private products: IProductListItemData[] = []
  private isLoading = true
  private hasPolicyEnabled = false
  private hasPolicyDisabled = false
  private hasPolicyUnlocked = false
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
    this.hasPolicyEnabled = hasPolicy('enable-user', 'post')
    this.hasPolicyDisabled = hasPolicy('disable-user', 'post')
    this.hasPolicyUnlocked = hasPolicy('lock-user', 'post')
    this.hasPolicyGetProducts = hasPolicy('get-list-create-product', 'get')
  }

  private async fetchData() {
    try {
      this.isLoading = true
      const { data } = await getListUser()
      const users: IUserListItemData[] = camelizeKeys(data) as IUserListItemData[]
      if (this.hasPolicyGetProducts) {
        const products = await getProduct({})
        this.products = camelizeKeys(products.data)
      }
      users.forEach(user => {
        // convert isEnable to boolean type
        user.isEnabled = !!user.isEnabled
        // get product Name of user
        if (user.productId.length > 0) {
          user.productName = this.products.filter(x => user.productId.includes(x.id)).map(x => x.name)
        } else {
          user.productName = []
        }
      })
      this.users = users
      this.isLoading = false
      return true
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.users.slice(start, end)
  }

  // confirm unlock user
  private async confirmUnlock(item: IUserListItemData) {
    try {
      await unlockUser(item.id)
      this.fetchData()
    } catch {}
  }

  // confirm enable/disable user
  private async confirmEnabledOrDisabled(item: IUserListItemData) {
    let isUpdateSuccess = false
    this.$confirm(item.isEnabled ? this.$tc('helpText.userEnableAsk') : this.$tc('helpText.userDisableAsk'), {
      confirmButtonText: this.$tc('text.ok'),
      cancelButtonText: this.$tc('text.cancel'),
      type: 'warning'
    }).then(async() => {
      try {
        item.isEnabled ? await enabledUser(item.id) : await disabledUser(item.id)
        isUpdateSuccess = true
      } catch (err) {
        // handle error 422
        if (err instanceof ValidationError) {
          const validationError = err as ValidationError
          if (validationError.data?.length) {
            validationError.data.forEach((err) => {
              // get message error
              switch (err.value) {
                case 'user_id':
                  this.$message({
                    message: getValidationMessage(err.type[0]) as string,
                    type: 'error',
                    duration: 2000
                  })
                  break
              }
            })
          }
        }
      }
    }).catch(() => {
      isUpdateSuccess = false
    })
      .finally(async() => {
        // reload data udate success
        if (isUpdateSuccess) this.fetchData()
        // reset data
        else item.isEnabled = !item.isEnabled
      })
  }
}
</script>

<style lang="scss" scoped>
.user-list-container {
  .user-table {
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
