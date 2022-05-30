<template>
  <el-dialog
    class="dialog_delete"
    :visible.sync="visible"
    :before-close="handleClose"
  >
    <p>{{$t('text.directEditDeleteCategoryConfirm')}}</p>
    <el-checkbox v-model="checked"><span style="white-space: break-spaces">{{ $t('text.directEditDeleteCategoryAllProduct') }}</span></el-checkbox>

    <!-- If checked == true then show verify input -->
    <div class="verify-delete" v-if="checked">
      <p>{{$t('text.directEditDeleteCategoryAllProductVerify', {_keyWorld_: "削除"})}}</p>
      <el-input placeholder="削除" v-model="input"></el-input>
      <el-alert v-if="error" type="error" :closable="false">{{$t('validError.mismatch')}}</el-alert>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="handleClose">{{$t('text.cancel')}}</el-button>
      <el-button type="danger" @click.stop="handleDelete">{{$t('text.delete')}}</el-button>
    </span>
  </el-dialog>
</template>

<script lang='ts'>
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component({
  name: 'ModalCategoryDelete'
})

export default class ModalCategoryDelete extends Vue {
  // Data
  @Prop({ default: () => null, required: true }) private data!: any;

  // Display/hidden modal
  @Prop({ default: () => false }) private visible!: boolean;

  // Display/hidden error
  @Prop({ default: () => false }) private error!: boolean;

  // Product id
  @Prop({ default: () => false }) private productId!: number;

  checked = false
  input = ''

  handleClose() {
    this.checked = false
    this.input = ''
    this.$emit('updateVisible', { status: false, type: 'del' })
  }

  handleDelete() {
    const confirmDelete = {
      id: this.data.id,
      checked: this.checked,
      input: this.input,
      type: this.data.type,
      productId: this.productId
    }
    this.$emit('delete', confirmDelete)
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
    width: 30%;
  }
@media screen and (max-width:1024px) {
  .el-dialog {
    width: 80%;
  }
}
</style>
