<template>
  <div style="padding:15px" class="direct">
    <product
      :products="products"
      :getListCategoriesQuestion="getListCategoriesQuestion"
    />
    <div class="direct-body">
      <category
        :idProduct="idProduct"
        :categoriesQuestions="categoriesQuestions"
        :getDetailQuestion="getDetailQuestion"
      ></category>
      <detail :detailQuestion="detailQuestion"></detail>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import _ from 'lodash'
import Category from './components/Category.vue'
import Product from './components/Product.vue'
import Detail from './components/Detail.vue'
import { getProduct } from '@/api/production'
import { getCategoryQuestions } from '@/api/categories'
// import { getDetailQuestions } from "@/api/question";
import { ICategoriesQuestion } from '@/api/types/category'
import { IDetailQuestion } from '@/api/types/question'
import { question } from './data'

@Component({
  name: 'DirectEdit',
  components: {
    Category,
    Detail,
    Product
  }
})
export default class extends Vue {
  private idProduct: number | undefined = undefined;
  private products = [];
  private categoriesQuestions: ICategoriesQuestion | null = null;
  private detailQuestion: IDetailQuestion | null = null;

  created() {
    this.getListProducts()
  }

  async getListProducts() {
    try {
      const productsResponse = await getProduct({})
      this.products = productsResponse.data
    } catch (_) {
      this.products = []
    }
  }

  async getListCategoriesQuestion(idProduct: number) {
    try {
      this.idProduct = idProduct
      const categoriesQuestionResponse = await getCategoryQuestions(idProduct)
      this.categoriesQuestions = categoriesQuestionResponse.data
    } catch (_) {
      this.categoriesQuestions = null
    }
  }

  getDetailQuestion(idQuetion: number) {
    try {
      // const detailQuestionResponse = await getDetailQuestions(idQuetion);
      this.detailQuestion = question
      // this.detailQuestion = detailQuestionResponse.data;
    } catch (_) {
      this.detailQuestion = null
    }
  }
}
</script>

<style lang="scss" scoped>
.direct {
  $margin: 20px;
  $height: 36px;
  $blue: #409eff;

  .direct-body {
    display: flex;
    justify-content: space-between;
    min-height: calc(100vh - 152px);
  }
}
</style>
