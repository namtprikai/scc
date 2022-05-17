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
import { Prop } from 'vue-property-decorator'
import { getCategoryQuestion } from '@/api/production'
import { number } from 'echarts'

@Component({
  name: 'SelectProductEl'
})

export default class SelectProductEl extends Vue {
  @Prop({ default: () => null }) private data!:any
  valueSelected = 1

  async changeProduct() {
    try {
      const { data } = await getCategoryQuestion(this.valueSelected)
      this.$emit('getCategoryQuestion', data)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style>
.select_product {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
