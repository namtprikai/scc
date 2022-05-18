<template>
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
                :limit="1"
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
      <el-form ref="form">
        <el-col :span="6" v-for="(item, index) in mediaList" :key="index" class="mr-10">
          <el-card>
            <div class="thumbnail">
              <img :src="urlImage(item)" class="image" @click="handlePreview(urlImage(item), item.fileName)">
            </div>
            <el-checkbox @change="hadleCheck($event, item.id)"></el-checkbox>
            <div class="card__content" style="padding: 14px;">
              <div class="card__item card__item--truncate">{{item.fileName}}</div>
              <div class="card__item card__item--right">{{item.created}}</div>
            </div>
            <div class="card__bottom">
              <el-button
                size="small"
                icon="el-icon-document-copy"
                v-clipboard:copy="item.filePath"
              >
                {{ $t("text.mediaUrlCopy") }}
              </el-button>
              <el-button
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(item, item.id)"
              >
                {{ $t("text.delete") }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-form>
    </el-row>
    <pagination
      v-show="media.length > 0"
      :total="media.length"
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
    <image-preview
      :dialogVisible.sync="confirmPreviewVisible"
      :itemMedia="previewItem"
      keyColumnWidth="40"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { IMediaListItemData } from '@/api/types/media'
import { getMedia, deleteMedia, deleteMediaAll, createMedia } from '@/api/media'
import { camelizeKeys } from '@/utils/parse'
import { formatBytes } from '@/utils/common'
import ConfirmPopup from './components/confirmPopup.vue'
import ImagePreview from './components/imagePreview.vue'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { isAudio, isVideo } from '@/utils/validate'
import audioImage from '@/assets/images/default_audio.jpg'
import videoImage from '@/assets/images/default_video.png'

@Component({
  name: 'ListMedia',
  components: {
    Pagination,
    ConfirmPopup,
    ConfirmDialog,
    ImagePreview
  }
})
export default class extends Vue {
  confirmData: any = [];
  private confirmDataUpload: any = null;
  private media: IMediaListItemData[] = [];
  private mediaList: IMediaListItemData[] = [];
  private isLoading = true;
  private isAddNew = false;
  private deleteIds:number[] = [];
  private total = 0;
  public confirmpopupVisible = false;
  public confirmdialogVisible = false;
  public confirmPreviewVisible = false;
  public isSubmiting = false;
  private fileMedia: any;
  private previewItem = {}

  private dlt = false ;
  private isUpload = false;
  private keyword = '';
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.fetchData()
  }

  private handleChooseFile(file: object) {
    this.isUpload = !this.isUpload
    this.fileMedia = file
  }

  private handleRemoveFile() {
    this.isUpload = false
  }

  private handleFilterMedia() {
    if (this.keyword) {
      const strRegEx = '[^,]*' + this.keyword + '[,$]*'
      const filterMedia = this.media.filter(media => media.fileName.match(strRegEx))
      this.mediaList = filterMedia
    } else {
      this.mediaList = this.media
    }
  }

  private async fetchData() {
    try {
      this.isLoading = true
      await getMedia(this.listQuery).then(response => {
        const adminData: IMediaListItemData[] = camelizeKeys(response.data)
        this.media = adminData
        this.mediaList = this.media
        this.total = this.mediaList.length
        if (this.dlt === true && this.total % this.listQuery.limit === 0) {
          this.listQuery.page = this.listQuery.page - 1
          this.dlt = false
        }
        const start = (this.listQuery.page - 1) * this.listQuery.limit
        const end = start + this.listQuery.limit
        this.mediaList = this.mediaList.slice(start, end)
      })
      this.isLoading = false
    } catch {
    }
  }

  private async submitUpload() {
    try {
      const formData = new FormData()
      formData.append('upload_file', this.fileMedia.raw)
      const data = await createMedia(formData)
      this.isSubmiting = false
      if (data) {
        this.isAddNew = false
        this.fetchData()
        this.$router
          .push({
            name: 'ListMedia'
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
      const index = this.deleteIds.indexOf(id)
      this.deleteIds.splice(index)
    }
  }

  private handleDelete(row : number, id : number) {
    this.$confirm(this.$tc('helpText.mediaDelete'),
      {
        confirmButtonText: this.$tc('text.ok'),
        cancelButtonText: this.$tc('text.cancel'),
        type: 'warning'
      })
      .then(async() => {
        try {
          await deleteMedia(id)
          const index = this.mediaList.findIndex(function(item) {
            return item.id === id
          })
          this.mediaList.splice(index, 1)
          this.dlt = true
          this.fetchData()
        } catch (e) {
        }
      })
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
      this.deleteIds.forEach((id: any) => {
        const index = this.mediaList.findIndex(function(item) {
          return item.id === id
        })
        this.mediaList.splice(index, 1)
      })
      this.dlt = true
      this.deleteIds = []
      this.fetchData()
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
    window.location.reload()
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
    .form__content {
      border: solid 1px #ddd;
      text-align: center;
      padding: 30px;
      border-radius: 3px;
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
}

</style>
