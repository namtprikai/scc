<template>
  <el-dialog
    :title="modalTitle"
    :visible.sync="visible"
    :before-close="handleClose"
    width="30%">
    {{data}}
    <el-form label-position="top" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item :label="selectLabel" prop="pass">
        <el-select
          v-model="data.products"
          multiple
          filterable
          allow-create
          default-first-option
          class="select-products"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-checkbox v-model="checked">{{ $t('text.directEditApplyChildCategoriesQuestion') }}</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose">{{$t('text.cancel')}}</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">{{$t('text.save')}}</el-button>
    </span>
    {{data.products}}
  </el-dialog>
</template>

<script lang='ts'>
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'

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
  value = []
  checked = false

  handleClose() {
    this.$emit('updateVisible', { status: false, type: 'add' })
  }
}
</script>

<style>
.select-products {
  width: 100%;
}
</style>
