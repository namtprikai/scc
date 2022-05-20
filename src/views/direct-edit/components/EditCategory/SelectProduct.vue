<template>
  <div class="select_product">
    <el-select
      v-model="valueSelected"
      style="width:90%"
      default-first-option
      @change="changeProduct"
    >
      <el-option
        v-for="item in data"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-button type="primary">{{$t('text.directEditDeploy')}}</el-button>
  </div>
</template>

<script lang='ts'>
import Component from 'vue-class-component'
import Vue from 'vue'
import { IProductListItemData } from '@/api/types'
import { Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'SelectProduct'
})

export default class SelectProduct extends Vue {
  @Prop({ default: () => null }) private data!:any
  valueSelected = 1
  @Watch('data')
  onDataChanged() {
    this.valueSelected = this.data[0].id
    this.changeProduct()
  }

  changeProduct() {
    this.$emit('getCategoryQuestion', this.valueSelected)
  }
}
</script>

<style lang="scss" scoped>
.select_product {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
