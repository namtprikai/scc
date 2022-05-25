<template lang="">
  <el-dialog
    :title="$t('text.mediaInsert')"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
  >
    <el-row class="block-col-2">
        <el-col :span="24" class="insert-content">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <el-button type="primary">
                        {{ $t('text.mediaInsert') }}
                    </el-button>
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown-menu-content">
                    <el-dropdown-item>
                        <el-upload
                            action=""
                            class="upload-demo"
                            :on-change="(file) => {
 handleChangeFile(file, 'image')
}"
                            :show-file-list="false"
                            :auto-upload="false">
                                {{ $t('text.mediaInsertImage') }}
                        </el-upload>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-upload
                            action=""
                            class="upload-demo"
                            :on-change="(file) => {
 handleChangeFile(file, 'video')
}"
                            :show-file-list="false"
                            :auto-upload="false">
                                {{ $t('text.mediaInsertVideo') }}
                        </el-upload>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-upload
                            action=""
                            class="upload-demo"
                            :on-change="(file) => {
 handleChangeFile(file, 'audio')
}"
                            :show-file-list="false"
                            :auto-upload="false">
                                {{ $t('text.mediaInsertSound') }}
                        </el-upload>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-upload
                            action=""
                            class="upload-demo"
                            :on-change="(file) => {
 handleChangeFile(file, 'file')
}"
                            :show-file-list="false"
                            :auto-upload="false">
                                {{ $t('text.mediaInsertFile') }}
                        </el-upload>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { isImage, isAudio, isVideo } from '@/utils/validate'

@Component({
  name: 'UploadFileDiaLog',
  components: {}
})
export default class extends Vue {
    @Prop({ default: () => false }) public dialogVisible!: boolean;

    get visible() {
      return this.dialogVisible
    }

    set visible(value) {
      this.$emit('update:dialogVisible', false)
    }

    handleChangeFile(file: any, type: string) {
      if (this.checkFileUpload(file, type)) {
        this.visible = false
        this.$emit('handleInsertMedia', file)
      }
    }

    checkFileUpload(file: any, type: string) {
      let typeFile = true
      if (type === 'image') {
        typeFile = isImage(file.name)
      } else if (type === 'video') {
        typeFile = isVideo(file.name)
      } else if (type === 'audio') {
        typeFile = isAudio(file.name)
      } else {
        return true
      }
      return typeFile
    }
}
</script>
<style lang="scss" scoped>
    .insert-content {
        display: flex;
        justify-content: center;
        padding-bottom: 50px;
    }
</style>
