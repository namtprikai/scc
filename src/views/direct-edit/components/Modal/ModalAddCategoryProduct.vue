<template>
  <el-dialog
    :title="modalTitle"
    :visible.sync="visible"
    :before-close="handleClose"
    width="30%">
    <el-form label-position="top" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item :label="selectLabel" prop="pass">
        <el-select
          v-model="productAdded"
          multiple
          filterable
          default-first-option
          class="select-products"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-checkbox v-model="checked">{{ $t('text.directEditApplyChildCategoriesQuestion') }}</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose">{{$t('text.cancel')}}</el-button>
      <el-button type="primary" @click="save">{{$t('text.save')}}</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop, Watch } from 'vue-property-decorator'
import { addCategoryProduct } from '@/api/categories'
import { mapKeys, snakeCase, camelCase, isEqual } from 'lodash'
interface listProduct {
  value: string
  label: string
}

@Component({
  name: 'ModalAddCategoryProduct'
})

export default class ModalAddCategoryProduct extends Vue {
  // Title modal
  @Prop({ default: () => null }) private modalTitle!: string;
  // Display/hidden modal
  @Prop({ default: () => false }) private visible!: boolean;
  // Title Select Label
  @Prop({ default: () => null }) private selectLabel!: string;
  // List product show in option
  @Prop({ default: () => null }) private options!: Array<listProduct>;
  // Data
  @Prop({ default: () => null, required: true }) private data!: any;
  // id product selected
  @Prop({ default: () => null }) private productId!: number;
  productAdded = []
  checked = false

  @Watch('data')
  onDataChanged() {
    this.productAdded = this.data.products
  }

  handleClose() {
    this.$emit('updateVisible', { status: false, type: 'add' })
  }

  async save() {
    try {
      const dataPost = {
        source_product_id: this.productId,
        product_id: this.productAdded,
        including_childrens: this.checked
      }

      /* Call API addCategoryProduct */
      /* const { data } = await addCategoryProduct(
            this.data.id,
            mapKeys(dataPost, (v, k) => snakeCase(k))
          ) */

      // show modal create successfully
      this.$alert(this.$t('message.directEditAddCategoryToProductsSuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      this.$emit('updateVisible', { status: false, type: 'add' })
    } catch (error) {

    }
  }
}
</script>

<style>
.select-products {
  width: 100%;
}
</style>
