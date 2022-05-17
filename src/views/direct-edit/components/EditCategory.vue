<template>
  <div
    class="edit_category_container"
  >
    <select-product-el
      :data="listProduct"
      @getCategoryQuestion="getCategoryQuestion"
    />
    <el-row :gutter="12">
      <el-col :span="12" class="box_list_category">
        <list-category
          :listCategories="listCategories"
          @detailCategory="handleDetailCategory"
          v-loading="isLoading"
        />
      </el-col>
      <el-col :span="12" class="box_detail_category">
        <detail-category
          :categorySeleted='categorySeleted'
          :productId='productId'
          @reloadListCategory='getCategoryQuestion'
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import SelectProductEl from './EditCategory/SelectProductEl.vue'
import ListCategory from './EditCategory/ListCategory.vue'
import DetailCategory from './EditCategory/DetailCategory.vue'
import { getProduct, getCategoryQuestion } from '@/api/production'
import { IProductListItemData } from '@/api/types'
import { camelizeKeys } from '@/utils/parse'

@Component({
  name: 'EditCategory',
  components: {
    SelectProductEl,
    ListCategory,
    DetailCategory
  }
})

export default class EditCategory extends Vue {
  listQuery = {}
  listProduct: IProductListItemData[] = []
  productId = 0
  categorySeleted = {
    id: 0,
    type: ''
  }

  private isLoading = false
  listCategories = []

  created() {
    this.getProducts()
  }

  async getProducts() {
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

  handleDetailCategory(infoCategory: any) {
    this.categorySeleted = {
      id: infoCategory.id,
      type: infoCategory.type
    }
  }

  async getCategoryQuestion(idProduct: number) {
    this.isLoading = true
    try {
      const { data } = await getCategoryQuestion(idProduct)
      this.listCategories = data
      this.productId = idProduct
    } catch (error) {}
    this.isLoading = false
  }
}
</script>

<style>
.edit_category_container {
  width: 100%;
  height: calc(100vh - 200px);
  margin-top: 20px;
}

.box-card{
  width: 100%;
  height: calc(100vh - 200px);
  overflow: auto;
}

.card_item_title{
  text-align: center;
  color: #008CFF;
}

@media screen and (max-width:1024px) {
  .box-card{
    height: auto;
  }
  .box_list_category {
    width: 100%;
    margin-bottom: 10px;
    height: auto;
  }
  .box_detail_category {
    width: 100%;
    height: auto;
  }
}
</style>
