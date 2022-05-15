<template lang="">
  <el-dialog
    :title="$t('text.directEditAddMedia')"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    top="0"
  >
    <el-upload
      action=""
      class="upload-demo"
      :on-change="handleChange"
      :file-list="filesMedia"
      ref="upload"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary" class="form__upload">{{$t("helpText.mediaSelect") }} ></el-button>
    </el-upload>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
      <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'UploadFileDiaLog',
  components: {}
})
export default class extends Vue {
  //   @Prop({ default: () => false }) public isMultipleSection!: boolean;
  // flag show/hide dialog
  @Prop({ default: () => false }) public dialogVisible!: boolean;
  // list file media
  @Prop({ default: () => null }) public filesMedia!: any;

  get visible() {
    return this.dialogVisible
  }

  set visible(value) {
    this.$emit('update:dialogVisible', false)
  }

  // get files() {
  //   return this.filesMedia
  // }

  // set files(value) {
  //   this.$emit('update:filesMedia', this.filesMedia)
  // }

  // click button
  ok() {
    // this.$emit('update:filesMedia', this.filesMedia)
    this.visible = false
    // this.files = this.filesMedia
    this.$emit('ok')
  }

  // click button cancel
  cancel() {
    this.visible = false
    this.$emit('cancel')
  }

  handleChange(file: any, filesMedia: any) {
    this.filesMedia = filesMedia.slice(-3)
  }
}
</script>
<style lang="scss" scoped>
.confirmed-dialog {
  ::v-deep .el-dialog__body {
    max-height: 70vh;
    overflow: auto;
  }

  .scenario {
    padding: 20px 40px;
    max-height: 500px;
    overflow: auto;
    border: 1px solid #e6ebf5;
    margin-top: 20px;
    border-radius: 5px;
  }
  ::v-deep .el-dialog {
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
    @media (max-width: 767px) {
      width: 100%;
    }
  }
  .keyword-group {
      border-bottom: 1px solid #e6ebf5;
      padding: 5px 0;
      .keyword {
          margin: 5px;
      }
  }
}
</style>
