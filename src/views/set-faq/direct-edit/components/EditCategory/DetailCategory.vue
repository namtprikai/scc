<template>
  <el-card
    class="box-card box_detail_category"
    :shadow="'never'"
    >
    <div slot="header" class="clearfix card_item_title">
      <span>{{$t('text.directEditDetail')}}</span>
    </div>
    <el-form label-position="top" :model="dataCategoryNew" status-icon ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item :label="$t('labelText.directEditCategoryLabel')" prop="pass">
        <el-input type="text" v-model="dataCategoryNew.label" autocomplete="off" :size="'medium'"></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.directEditCategoryText')" prop="checkPass">
        <el-input type="text" v-model="dataCategoryNew.text" autocomplete="off" :size="'medium'"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.config')"
        :error="updateCategoryError.config"
        class="item-config"
      >
        <div class="json-editor">
          <json-editor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="dataCategoryNew.config"
            v-model="dataCategoryNew.config"
            tabindex="4"
          ></json-editor>
        </div>
      </el-form-item>
      <el-button type="primary" class="btn_save_edit" @click="submitForm(categorySeleted.id)" :disabled="disabled" :size="'medium'">{{$t('text.save')}}</el-button>
    </el-form>
    <confirm-dialog
      :confirmData="confirmData"
      :dialogVisible="dialogVisible"
      :title="title"
      @ok="handleAccept"
      @cancel="handleCancel"
    />
  </el-card>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialogDirect.vue'
import { Prop, Watch } from 'vue-property-decorator'
import { getDetailCategory, lockCategory } from '@/api/categories'
import { ICategoryDetailData } from '@/api/types'
import { mapKeys, snakeCase, camelCase, isEqual } from 'lodash'
import { ValidationType, ValidationError, APIErrorCode, APIError } from '@/utils/request'

@Component({
  name: 'ListCategory',
  components: {
    JsonEditor,
    ConfirmDialog
  }
})

export default class ListCategory extends Vue {
  @Prop({ default: () => null }) private categorySeleted!: any
  disabled = true
  confirmData: any = []
  dialogVisible = false
  title = this.$t('text.modifyScreenModalConfirmTitle')
  public dataCategoryNew: ICategoryDetailData = {
    id: 0,
    label: '',
    text: '',
    config: {},
    created: null,
    modified: null
  }

  public updateCategoryError: any = {
    config: null
  }

  public dataCategoryOld: ICategoryDetailData = {
    id: 0,
    label: '',
    text: '',
    config: {},
    created: null,
    modified: null
  }

  @Watch('categorySeleted')
  onCategorySelectedChanged() {
    if (this.categorySeleted.type === 'categories') this.handleGetDetailCategories()
    else this.handleGetDetailQuestions()
  }

  async handleGetDetailCategories() {
    try {
      const { data } = await getDetailCategory(this.categorySeleted.id)

      /* Get all key of object data and change this to camelCase */
      this.dataCategoryNew = mapKeys(data, (v, k) =>
        camelCase(k)
      ) as ICategoryDetailData

      /* If data.config == null then set data.config = {} */
      if (data.config === null) this.dataCategoryNew.config = {}

      this.dataCategoryOld = Object.assign({}, this.dataCategoryNew)
      this.lockCategory(this.categorySeleted.id)
    } catch (error) {
      console.log(error)
    }
  }

  handleGetDetailQuestions() {
    console.log('question')
  }

  async lockCategory(idCategory: number) {
    try {
      await lockCategory(idCategory)
      this.disabled = false
    } catch (error) {
      if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
        this.$message({
          message: this.$tc(error.errorCode),
          type: 'error',
          duration: 5000
        })
      }
    }
  }

  submitForm(idCategory: number) {
    this.confirmData = []
    if (this.dataCategoryNew.label !== this.dataCategoryOld.label) {
      const objLabel = {
        key: 'label',
        label: 'Label',
        value: this.dataCategoryNew.label
      }
      this.confirmData.push(objLabel)
    }

    if (this.dataCategoryNew.text !== this.dataCategoryOld.text) {
      const objText = {
        key: 'text',
        label: 'Text',
        value: this.dataCategoryNew.text
      }
      this.confirmData.push(objText)
    }

    if (JSON.stringify(this.dataCategoryNew.config) !== JSON.stringify(this.dataCategoryOld.config)) {
      const objConfig = {
        key: 'config',
        label: 'Config',
        value: this.dataCategoryNew.config
      }
      this.confirmData.push(objConfig)
    }
    this.dialogVisible = true
  }

  handleAccept() {
    this.dialogVisible = false
  }

  handleCancel() {
    this.dialogVisible = false
  }
}
</script>

<style lang="scss">
.btn_save_edit{
  width: 100%;
  font-weight: bold;
}
.el-form-item {
  &__label {
    text-align: left;
  }
}
</style>
