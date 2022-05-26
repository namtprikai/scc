<template>
   <div class="container direct-edit">
      <div
    class="edit_category_container"
  >
    <select-product
      :data="listProduct"
      @getCategoryQuestion="getCategoryQuestion"
    />
    <el-row :gutter="24">
      <el-col :span="10" class="box_list_category">
        <list-category
          :listCategories="listCategories"
          :listProduct="listProduct"
          :productId='productId'
          @detailCategory="handleDetailCategory"
          @reloadListCategory='getCategoryQuestion'
          v-loading="isLoading"
        />
      </el-col>
      <el-col :span="14" class="box_detail_category">
        <el-card
          class="box-card box_detail_category"
          :shadow="'never'"
          >
          <div slot="header" class="clearfix card_item_title">
            <span>{{$t('text.directEditDetail')}}</span>
          </div>
          <detail-category
            v-show="itemType === 'categories'"
            :categorySeleted='categorySeleted'
            :productId='productId'
            @reloadListCategory='getCategoryQuestion'
          />
          <detail-question
            v-show="itemType === 'questions'"
            :detailQuestion='questionSelected'
            :productId="productId"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SelectProduct from './components/EditCategory/SelectProduct.vue'
import ListCategory from './components/EditCategory/ListCategory.vue'
import DetailCategory from './components/EditCategory/DetailCategory.vue'
import DetailQuestion from './components/EditCategory/DetailQuestion.vue'
import { getProduct, getCategoryQuestion } from '@/api/production'
import { IProductListItemData } from '@/api/types'
import { camelizeKeys } from '@/utils/parse'

@Component({
  name: 'DirectEdit',
  components: {
    SelectProduct,
    ListCategory,
    DetailCategory,
    DetailQuestion
  }
})
export default class DirectEdit extends Vue {
  listQuery = {}
  listProduct: IProductListItemData[] = []
  productId = 0
  itemType = 'category'
  categorySeleted = {
    id: 0,
    type: ''
  }

  questionSelected = {
    id: 0,
    type: ''
  }

  productDefault = [{
    id: 0,
    name: String(this.$t('validError.exists')),
    created: '',
    modified: ''
  }]

  private isLoading = false
  listCategories = []

  created() {
    this.getProducts()
  }

  async getProducts() {
    this.isLoading = true
    try {
      const { data } = await getProduct(this.listQuery)
      /* IF data not empty then get data to show in select product
        Else using default data
      */
      if (data.length > 0) {
        const products : IProductListItemData[] = camelizeKeys(data) as IProductListItemData[]
        this.listProduct = products
      } else this.listProduct = this.productDefault
    } catch {}
    this.isLoading = false
  }

  handleDetailCategory(infoCategory: any) {
    if (infoCategory.type === 'categories') {
      this.itemType = 'categories'
      if (infoCategory.addChildCategory === false) {
        this.categorySeleted = {
          id: infoCategory.id,
          type: infoCategory.type
        }
      } else {
        this.categorySeleted = infoCategory
      }
    } else {
      this.itemType = 'questions'
      if (infoCategory.addNewQuestion === false) {
        this.questionSelected = {
          id: infoCategory.id,
          type: infoCategory.type
        }
      } else {
        this.questionSelected = infoCategory
      }
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

<style lang="scss" scoped>
.edit_category_container {
  width: 100%;
  margin-top: 20px;
}

.box-card{
  width: 100%;
}
.form_detail {
  width: 100%;
  height: calc(100vh - 300px);
  overflow: auto;
}
.box_list_category {
  position: relative;
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
