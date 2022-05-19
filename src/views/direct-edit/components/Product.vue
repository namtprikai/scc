<template>
  <div class="product">
    <el-select
      v-model="product"
      placeholder="Select"
      class="select-product"
      @change="getListCategoriesQuestion"
    >
      <el-option
        v-for="item in products"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>

    <el-button type="primary" class="btn-deploy">Deploy</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IProductItemData } from '@/api/types/product'

@Component({
  name: 'Layout'
})
export default class extends Vue {
  private product = null;

  @Prop({ default: [] }) private products!: IProductItemData;
  @Prop({ default: () => null }) private getListCategoriesQuestion!: () => null;
}
</script>

<style lang="scss" scoped>
.product {
  display: flex;
  .select-product {
    margin-bottom: 30px;
    flex: 1;
    font-size: 14px;
    font-weight: 700;
    color: #1f2d3d;
  }
}

.btn-deploy {
  height: 36px;
  margin-left: 15px;
}
</style>
