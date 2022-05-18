<template lang="">
  <el-dialog
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    top="0"
    :title="itemMedia.fileName"
  >
    <div class="thumbnail">
      <img :src="itemMedia.filePath" class="image">
    </div>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ImagePreview'
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true }) private itemMedia!: object;
  // flag show/hide dialog
  @Prop({ default: () => false }) public dialogVisible!: boolean;

  get visible() {
    return this.dialogVisible
  }

  set visible(value) {
    this.$emit('update:dialogVisible', false)
  }

  // click button
  ok() {
    this.visible = false
    this.$emit('ok')
  }
}
</script>
<style lang="scss" scoped>
.confirmed-dialog {
  ::v-deep .el-dialog__body {
    max-height: 70vh;
    overflow: auto;
  }

  .section-title {
    font-size: 16px;
    margin: 10px 0;
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100%;
    max-height: 250px;
    margin: auto;
  }
  ::v-deep .text-right {
    text-align: right !important;
  }
  .json-format {
    white-space: pre;
  }
  ::v-deep .el-dialog {
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
    @media (max-width: 767px) {
      width: 100%;
    }
  }
}
</style>
