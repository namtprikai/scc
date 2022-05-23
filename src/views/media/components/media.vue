<template>
  <div>
    <el-card>
      <div class="thumbnail">
        <img :src="urlImage(mediaItem)" class="image" @click="handlePreview(handleUrl(mediaItem.id), mediaItem.fileName)">
      </div>
      <el-checkbox @change="hadleCheck($event, mediaItem.id)"></el-checkbox>
      <div class="card__content" style="padding: 14px;">
        <div class="card__item card__item--truncate">{{mediaItem.fileName}}</div>
        <div class="card__item card__item--right">{{formatDate(mediaItem.created)}}</div>
      </div>
      <div class="card__bottom">
        <el-button v-if="!isInsert"
          size="small"
          icon="el-icon-document-copy"
          @click="handleClipboard(handleUrl(mediaItem.id), $event)"
        >
          {{ $t("text.mediaUrlCopy") }}
        </el-button>
        <insert-media v-if="isInsert" />
        <el-button
          size="small"
          icon="el-icon-delete"
          @click="handleMediaDelete"
        >
          {{ $t("text.delete") }}
        </el-button>
      </div>
    </el-card>
    <image-preview
      :dialogVisible.sync="confirmPreviewVisible"
      :itemMedia="previewItem"
      keyColumnWidth="40"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { IMediaListItemData } from '@/api/types/media'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import ImagePreview from './imagePreview.vue'
import { isAudio, isVideo, isImage } from '@/utils/validate'
import { handleClipboard } from '@/utils/clipboard'
import audioImage from '@/assets/images/default_audio.jpg'
import videoImage from '@/assets/images/default_video.png'
import InsertMedia from './insertMedia.vue'

@Component({
  name: 'Media',
  components: {
    Pagination,
    ConfirmDialog,
    ImagePreview,
    InsertMedia
  }
})
export default class extends Vue {
  @Prop({ default: () => null, required: true }) private mediaItem!: IMediaListItemData;
  @Prop({ required: true }) private handleDelete!: Function
  @Prop({ required: true }) private confirmDataUpload!: Function
  @Prop({ required: true }) private hadleCheck!: Function
  @Prop({ default: () => false }) public isInsert!: boolean;

  confirmData: any = [];
  public confirmpopupVisible = false;
  public confirmdialogVisible = false;
  public confirmPreviewVisible = false;
  public isSubmiting = false;
  private previewItem = {}
  public baseUrl:any = '';
  private isChecked = false
  private handleClipboard = handleClipboard

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
        url = `${process.env.VUE_APP_BASE_API}/media/${item.id}/url`
        break
    }
    return url
  }

  private handleUrl(id: number) {
    return `${process.env.VUE_APP_BASE_API}media/${id}/url`
  }

  private handlePreview(filePath: string, fileName: string) {
    if (isImage(fileName)) {
      this.confirmPreviewVisible = true
      this.previewItem = { filePath: filePath, fileName: fileName }
    } else {
      window.location.href = filePath
    }
  }

  private handleCancel() {
    this.isSubmiting = false
  }

  private handleMediaDelete() {
    this.$confirm(this.$tc('helpText.mediaDelete'),
      {
        confirmButtonText: this.$tc('text.ok'),
        cancelButtonText: this.$tc('text.cancel'),
        type: 'warning'
      })
      .then(async() => {
        try {
          await this.handleDelete(this.mediaItem, this.mediaItem.id)
        } catch (e) {
        }
      })
  }

  private formatDate(dateTime: string) {
    const m = new Date(dateTime)
    return m.getFullYear() + '-' + (m.getMonth() + 1) + '-' + m.getDate()
  }
}
</script >

<style lang="scss" scoped>
.media-page {
  ::v-deep .el-card__body {
    position: relative;
    .el-checkbox {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .btn--action {
    margin: 5px;
  }
  .btn--add {
    margin-bottom: 15px;
    margin-left: 15px;
  }
  .mr-10 {
    margin: 10px 0;
  }

  .card__bottom {
    text-align: center;
    .el-button{
      margin-bottom: 5px;
      cursor: pointer;
    }
  }

  .card__item--right{
    text-align: right;
  }
  .card__item--truncate{
    width: calc(100% - 10px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
  }
  .thumbnail{
    text-align: center;
    img {
      max-width: 100%;
      height: 140px;
      object-fit: cover;
      cursor: pointer;
    }
  }
}

</style>
