<template>
  <el-dialog
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    lock-scroll
    width="80%"
  >
  <div class="container media-page">
    <el-row type="flex" justify="end">
      <el-button
        class="btn btn--add"
        type="primary"
        icon="el-icon-notebook-2"
        @click="addNew"
        >{{ $t("text.mediaAddNew") }}
      </el-button>
      <el-button class="btn btn--add" @click="handleReload" type="primary" icon="el-icon-refresh">{{
        $t("text.mediaReload")
      }}</el-button>
      <el-button class="btn btn--add" type="primary" icon="el-icon-delete" @click="confirmDelete" :disabled="!deleteIds.length > 0">{{
        $t("text.deleteMultiple")
      }} <span v-if="deleteIds.length > 0">({{deleteIds.length}})</span> </el-button>
    </el-row>
    <el-collapse-transition>
      <el-row v-if="isAddNew">
        <el-form ref="form" class="form">
          <div class="form__content">
            <div class="file-name"><span v-show="!isUpload" >{{$t("labelText.mediaFileName") }}</span></div>
            <el-upload
                action=""
                class="upload-demo"
                :before-remove="handleRemoveFile"
                :on-change="handleChooseFile"
                :file-list="fileList"
                :limit="2"
                ref="upload"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" class="form__upload">{{$t("helpText.mediaSelect") }}</el-button>
              </el-upload>
          </div>
        <el-button class="form__submit" size="small" :disabled="!this.isUpload" :loading="isSubmiting" type="success" @click="handleUpload">{{$t("text.mediaUpload") }}</el-button>
        </el-form>
      </el-row>
    </el-collapse-transition>
    <el-row type="flex">
      <div class="searc-input">
        <el-input :placeholder="$t('text.mediaSearchBar')" v-model="keyword" @input.native="handleFilterMedia">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </el-row>
    <el-row :gutter="20">
      <el-form ref="form" v-loading="isLoading">
        <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in paginationData" :key="index" class="mr-10">
          <media
            :mediaItem="item"
            :handleDelete="handleDelete"
            :confirmDataUpload="confirmDataUpload"
            :hadleCheck="hadleCheck"
            :isInsert="true"
            />
        </el-col>
      </el-form>
    </el-row>
    <pagination
      v-show="mediaList.length > 0"
      :total="mediaList.length"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
    />
    <confirm-popup
      :dialogVisible.sync="confirmpopupVisible"
      :confirmData="confirmData"
      :title="$t('helpText.mediaDeleteOnce')"
      @ok="handleDeleteAll"
    />
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmDataUpload"
      :title="$t('helpText.mediaUploadAsk')"
      @ok="submitUpload"
      keyColumnWidth="40"
      @cancel="handleCancel"
    />
  </div>
</el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { IMediaListItemData } from '@/api/types/media'
import { getMedia, deleteMedia, deleteMediaAll, createMedia } from '@/api/media'
import { camelizeKeys } from '@/utils/parse'
import { formatBytes } from '@/utils/common'
import Media from './media.vue'
import ConfirmPopup from './confirmPopup.vue'
import ImagePreview from './imagePreview.vue'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { isAudio, isVideo } from '@/utils/validate'
import audioImage from '@/assets/images/default_audio.jpg'
import videoImage from '@/assets/images/default_video.png'

@Component({
  name: 'PopupMediaList',
  components: {
    Media,
    Pagination,
    ConfirmPopup,
    ConfirmDialog,
    ImagePreview
  }
})
export default class extends Vue {
  confirmData: any = [];
  private confirmDataUpload: any = null;
  private medias: IMediaListItemData[] = [];
  private mediaList: IMediaListItemData[] = [];
  private isLoading = true;
  private isAddNew = false;
  private deleteIds:number[] = [];
  private total = 0;
  public confirmpopupVisible = false;
  public confirmdialogVisible = false;
  public confirmPreviewVisible = false;
  public isSubmiting = false;
  private fileMedia: any = null;
  private previewItem = {}
  private fileList = []

  private isUpload = false;
  private keyword = '';
  private listQuery = {
    page: 1,
    limit: 10
  }

  @Prop({ default: () => false }) public dialogVisible!: boolean;

  created() {
    this.fetchData()
  }

  get visible() {
    return this.dialogVisible
  }

  set visible(value) {
    this.$emit('update:dialogVisible', false)
  }

  get paginationData() {
    return this.mediaList.slice(
      (this.listQuery.page - 1) * this.listQuery.limit,
      this.listQuery.page * this.listQuery.limit
    )
  }

  private handleChooseFile(file: object) {
    const formUpload: any = this.$refs.upload
    this.fileList = formUpload.uploadFiles
    if (this.fileList.length === 2) this.fileList.splice(0, 1)
    this.isUpload = true
    this.fileMedia = file
  }

  private handleRemoveFile() {
    this.isUpload = false
  }

  private handleFilterMedia() {
    this.isLoading = true
    if (this.keyword) {
      const strRegEx = '[^,]*' + this.keyword + '[,$]*'
      const filterMedia = this.medias.filter(media => media.fileName.toLowerCase().match(strRegEx))
      this.mediaList = filterMedia
    } else {
      this.mediaList = this.medias
    }
    this.isLoading = false
  }

  private async fetchData() {
    this.isLoading = true
    try {
      await getMedia(this.listQuery).then(response => {
        const adminData: IMediaListItemData[] = camelizeKeys(response.data)
        this.medias = adminData
        this.mediaList = this.medias
      })
    } catch {
    }
    this.isLoading = false
  }

  private async submitUpload() {
    try {
      const formData = new FormData()
      formData.append('upload_file', this.fileMedia.raw)
      const data = await createMedia(formData)
      this.isSubmiting = false

      if (data) {
        this.$alert(this.$t('message.mediaListUploadSuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            this.fileList = []
            this.fileMedia = null
            this.isAddNew = false
            this.isUpload = false
            this.fetchData()
          }
        })
      }
    } catch {
      this.isSubmiting = false
    }
  }

  private addNew() {
    this.isAddNew = !this.isAddNew
  }

  private hadleCheck(event: boolean, id: number) {
    if (event) {
      this.deleteIds.push(id)
    } else {
      this.deleteIds = this.deleteIds.filter(item => item !== id)
    }
  }

  private async handleDelete(row : number, id : number) {
    try {
      const { data } = await deleteMedia(id)
      if (!(Object.keys(data).length > 0)) {
        this.$alert(this.$t('message.mediaListDeleteSuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            const index = this.mediaList.findIndex(function(item) {
              return item.id === id
            })
            this.mediaList.splice(index, 1)
            this.fetchData()
          }
        })
      }
    } catch (e) {
    }
  }

  private confirmDelete() {
    const deleteData = this.mediaList.filter(item => this.deleteIds.includes(item.id))
    this.confirmData = []
    deleteData.forEach((item: any) => {
      this.confirmData.push(item.fileName)
    })
    this.confirmpopupVisible = true
  }

  private async handleDeleteAll() {
    try {
      await deleteMediaAll({ media_id: this.deleteIds })
      this.$alert(this.$t('Message.mediaListDeleteOnceSuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true,
        callback: () => {
          this.deleteIds.forEach((id: any) => {
            const index = this.mediaList.findIndex(function(item) {
              return item.id === id
            })
            this.mediaList.splice(index, 1)
          })
          this.deleteIds = []
          this.fetchData()
        }
      })
    } catch (e) {
    }
  }

  private handleUpload() {
    this.confirmDataUpload = []
    this.confirmDataUpload.push(
      {
        key: this.$tc('labelText.mediaFileName'),
        value: this.fileMedia.name
      },
      {
        key: this.$tc('labelText.mediaFileSize'),
        value: formatBytes(this.fileMedia.size)
      }
    )
    this.isSubmiting = true
    this.confirmdialogVisible = true
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

  private handleReload() {
    this.listQuery = {
      page: 1,
      limit: 10
    }
    this.mediaList = this.medias
    this.deleteIds = []
  }

  private handlePreview(filePath: string, fileName: string) {
    this.confirmPreviewVisible = true
    this.previewItem = { filePath: filePath, fileName: fileName }
  }

  private handleCancel() {
    this.isSubmiting = false
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
  }

  .card__item--right{
    text-align: right;
  }
  .card__item--truncate{
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
  }
  .thumbnail{
    img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      cursor: pointer;
    }
  }
  .searc-input {
    margin-bottom: 20px;
    width: 100%;
  }

  .form{
    text-align: center;
     border: solid 1px #ddd;
     margin-bottom: 20px;
    border-radius: 3px;
    .form__content {
      text-align: center;
      padding: 30px;
      .file-name {
        color: #1f2d3d;
        font-size: 12px;
        margin-bottom: 15px;
        height: 14px;
      }
    }
    .form__submit {
      margin: 20px auto;
    }
  }
  ::v-deep .el-upload-list{
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  :v-deep .el-dialog{
    height: 90vh;
    overflow-y: scroll;
}
}

</style>
