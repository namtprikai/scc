<template lang="">
  <el-dropdown trigger="click">
      <span class="el-dropdown-link">
          <el-button size="small" class="insert-btn">
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
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { isImage, isAudio, isVideo } from '@/utils/validate'

@Component({
  name: 'InsertMedia',
  components: {}
})
export default class extends Vue {
    @Prop({ default: () => false }) public dialogVisible!: boolean;

    handleChangeFile(file: any, type: string) {
      if (this.checkFileUpload(file, type)) {
        this.$emit('handleInsertMedia', file)
      }
    }

    checkFileUpload(file: any, type: string) {
      let typeFile = true
      if (type === 'image') {
        typeFile = isImage(file.name)
        if (!typeFile) {
          return
        }
      } else if (type === 'video') {
        typeFile = isVideo(file.name)

        if (!typeFile) {
          return
        }
      } else if (type === 'audio') {
        typeFile = isAudio(file.name)

        if (!typeFile) {
          return
        }
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

    .insert-btn {
      margin-right: 10px;
    }
</style>
