<template>
  <el-dialog
    :title="modalTitle"
    :visible.sync="visible"
    :before-close="handleClose"
    width="30%">
    <el-form
      label-position="top"
      status-icon ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label="selectLabel"
        prop="pass"
      >
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
      <el-form-item prop="checkPass" v-if="data.type === 'categories'">
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
import { addQuestionProduct } from '@/api/questions'
import { mapKeys, snakeCase } from 'lodash'
import { APIErrorCode, APIError } from '@/utils/request'
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
      if (this.data.type === 'question') {
        const dataPost = {
          source_product_id: this.data.products[0],
          product_id: this.productAdded
        }

        /* Call API addCategoryProduct */
        await addQuestionProduct(
          this.data.id,
          mapKeys(dataPost, (v, k) => snakeCase(k))
        )
      } else {
        const dataPost = {
          source_product_id: this.data.products[0],
          product_id: this.productAdded,
          including_childrens: this.checked
        }

        /* Call API addQuestionProduct */
        await addCategoryProduct(
          this.data.id,
          mapKeys(dataPost, (v, k) => snakeCase(k))
        )
      }

      /* Show modal message create/edit success */
      this.$alert(this.$t('message.directEditAddCategoryToProductsSuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      this.$emit('updateVisible', { status: false, type: 'add' })
    } catch (error) {
      if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
        this.$message({
          message: this.$tc('message.serverConnectError'),
          type: 'error',
          duration: 5000
        })
      }
    }
  }
}
</script>

<style>
.select-products {
  width: 100%;
}
</style>
