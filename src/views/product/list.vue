<template>
  <div class="container">
    <el-row v-if = "ishideButton"  type="flex" justify="end">
      <router-link :to="{name: 'CreateProduct'}">
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
      <el-table-column align="center" :label="$t('labelText.productName')">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" :label="$t('labelText.action')" width=200%>
        <template slot-scope="{row}">
          <router-link :to="{name: 'EditProduct', params: {id: row.id}}">
            <el-button class="btn btn--action" type="primary" size="mini" icon="el-icon-view">
              {{ $t('text.detail') }}
            </el-button>
          </router-link>
          <el-button v-if = "ishideButton" class="btn btn--action" size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(row,row.id)">
            {{ $t('text.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="this.listProduct.length>0" :total="this.listProduct.length" :page.sync="listQuery.page" :limit.sync="listQuery.limit" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IProductListItemData } from '@/api/types'
import { getProduct, deleteProduct } from '@/api/production'
import { hasPolicy } from '@/utils/common'
import { PolicyMethod, PolicyUriName } from '@/utils/constant'
import { camelizeKeys } from '@/utils/parse'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ListProduct',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private listProduct : IProductListItemData[] = [];
  private isLoading = true;
  private dlt = false ;
  private listQuery = {
    page: 1,
    limit: 10
  };

  private ishideButton = false;

  created() {
    this.fetchData()
    this.ishideButton = hasPolicy(PolicyUriName.GetListCreateProduct, PolicyMethod.Post)
  }

  async fetchData() {
    try {
      this.isLoading = true
      const { data } = await getProduct(this.listQuery)
      const products : IProductListItemData[] = camelizeKeys(data) as IProductListItemData[]
      this.listProduct = products
      this.isLoading = false
    } catch {
      this.isLoading = false
    }
  }

  private get list() {
    if (this.dlt === true && this.listProduct.length % this.listQuery.limit === 0) {
      this.listQuery.page = this.listQuery.page - 1
      this.dlt = false
    }
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    const end = start + this.listQuery.limit
    return this.listProduct.slice(start, end)
  }

  private handleDelete(row : number, id : number) {
    this.$confirm(this.$tc('helpText.productDelete'),
      {
        confirmButtonText: this.$tc('text.ok'),
        cancelButtonText: this.$tc('text.cancel'),
        type: 'warning'
      })
      .then(async() => {
        try {
          await deleteProduct(id)
          this.$message({
            message: this.$tc('message.productDeleteSuccess'),
            type: 'success',
            duration: 2000
          })
          const index = this.list.findIndex(function(item) {
            return item.id === id
          })
          this.list.splice(index, 1)
          this.dlt = true
          this.fetchData()
        } catch {
        }
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
</style>
