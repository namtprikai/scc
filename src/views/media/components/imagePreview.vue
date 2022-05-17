<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    top="0"
  >
    <div>{{itemMedia.fileName}}</div>
    <div class="thumbnail">
      <img :src="urlImage(itemMedia.filePath)" class="image">
    </div>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IMediaListItemData } from '@/api/types/media'
import { isAudio, isVideo } from '@/utils/validate'
import audioImage from '@/assets/images/default_audio.jpg'
import videoImage from '@/assets/images/default_video.png'

@Component({
  name: 'ImagePreview',
  components: {}
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true }) private itemMedia!: IMediaListItemData;
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

  private urlImage(item: any) {
    let url:any = ''
    switch (true) {
      case isAudio(item.fileName):
        url = audioImage
        break
      case isVideo(item.fileName):
        url = videoImage
        break
      default:
        url = item.filePath
        break
    }
    return url
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
  ::v-deep td {
    border-bottom: 0px;
  }
  ::v-deep .el-table {
    &:before {
      height: 0px;
    }
    .cell {
      overflow: auto;
      div {
        max-height: 100px;
      }
    }
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
