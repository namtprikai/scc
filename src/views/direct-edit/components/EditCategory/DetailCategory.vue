<template>
  <div>
    <el-form
      label-position="top"
      :model="categorySeleted.type === 'categories' ? dataCategoryNew : dataQuestionNew"
      :v-loading="isLoading"
      status-icon
      ref="dataCategoryNew"
      label-width="120px"
      class="demo-ruleForm"
      :rules="updateRules"
    >
      <el-form-item
        :label="$t('labelText.directEditCategoryLabel')"
        prop="label"
        :error="updateCategoryError.label"
      >
        <el-input v-if="categorySeleted.type === 'categories'" type="text" v-model="dataCategoryNew.label" autocomplete="off" :size="'medium'"></el-input>
        <el-input v-else type="text" v-model="dataQuestionNew.label" autocomplete="off" :size="'medium'"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.directEditCategoryText')"
        prop="text"
        :error="updateCategoryError.text"
      >
        <el-input v-if="categorySeleted.type === 'categories'" type="text" v-model="dataCategoryNew.text" autocomplete="off" :size="'medium'"></el-input>
        <el-input v-else type="text" v-model="dataQuestionNew.text" autocomplete="off" :size="'medium'"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.config')"
        class="item-config"
        :error="updateCategoryError.config"
      >
        <div v-if="categorySeleted.type === 'categories'" class="json-editor">
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
        <div v-else class="json-editor">
          <json-editor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="dataQuestionNew.config"
            v-model="dataQuestionNew.config"
            tabindex="4"
          ></json-editor>
        </div>
      </el-form-item>
      <el-button type="primary" class="btn_save_edit" @click.native.prevent="submitForm" :disabled="disabled" :size="'medium'">{{$t('text.save')}}</el-button>
    </el-form>
    <confirm-dialog-direct
      :confirmData="confirmData"
      :dialogVisible.sync="dialogVisible"
      :title="title"
      @ok="handleAccept"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import ConfirmDialogDirect from '@/components/ConfirmDialog/ConfirmDialogDirect.vue'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { CategoryErrorValue } from '@/views/direct-edit/category-error-value'
import { getValidationMessage } from '@/utils/validate'
import { Form as ElForm } from 'element-ui'
import { Prop, Watch } from 'vue-property-decorator'
import { createCategory, getDetailCategory, lockCategory, editCategory } from '@/api/categories'
import { getDetailQuestion } from '@/api/questions'
import { ICategoryDetailData, IQuestionDetailData } from '@/api/types'
import { mapKeys, snakeCase, camelCase, isEqual } from 'lodash'
import { ValidationType, ValidationError, APIErrorCode, APIError } from '@/utils/request'

@Component({
  name: 'ListCategory',
  components: {
    JsonEditor,
    ConfirmDialog,
    ConfirmDialogDirect
  }
})

export default class ListCategory extends Vue {
  @Prop({ default: () => null }) private categorySeleted!: any
  @Prop({ default: () => null }) private productId!: any
  disabled = true
  confirmData: any = []
  dialogVisible = false
  title = this.$t('text.modifyScreenModalConfirmTitle')
  isLoading = false
  dataSelected = null

  public dataCategoryNew: ICategoryDetailData = {
    id: 0,
    parentId: null,
    label: '',
    text: '',
    config: {},
    addChildCategory: false,
    productId: 0,
    created: null,
    modified: null
  }

  public dataQuestionNew: IQuestionDetailData = {
    id: 0,
    label: '',
    text: '',
    isPublic: 0,
    config: {},
    created: null,
    modified: null
  }

  public updateCategoryError: any = {
    label: null,
    text: null,
    config: null
  }

  public dataCategoryOld: ICategoryDetailData = {
    id: 0,
    parentId: null,
    label: '',
    text: '',
    config: {},
    addChildCategory: false,
    productId: 0,
    created: null,
    modified: null
  }

  public dataQuestionOld: IQuestionDetailData = {
    id: 0,
    label: '',
    text: '',
    isPublic: 0,
    config: {},
    created: null,
    modified: null
  }

  public editCategoryError: any = {
    label: '',
    text: '',
    config: ''
  }

  @Watch('categorySeleted')
  onCategorySelectedChanged() {
    if (this.categorySeleted.type === 'categories') this.handleGetDetailCategories()
    else this.handleGetDetailQuestions()
  }

  // reset validate message error
  public resetMessageValidate() {
    this.editCategoryError = {
      label: null,
      text: null,
      config: null
    }
  }

  // createProduct rules
  public updateRules = {
    label: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.directEditCategoryLabel')
        ),
        trigger: 'blur'
      }
    ],
    text: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.directEditCategoryText')
        ),
        trigger: 'blur'
      }
    ]
  };

  async handleGetDetailCategories() {
    this.isLoading = true
    try {
      if (this.categorySeleted.addChildCategory === true) {
        this.dataCategoryNew = mapKeys(this.categorySeleted, (v, k) =>
          camelCase(k)
        ) as ICategoryDetailData

        this.dataCategoryOld = Object.assign({}, this.dataCategoryNew)
      } else {
        const { data } = await getDetailCategory(this.categorySeleted.id)
        /* Get all key of object data and change this to camelCase */
        this.dataCategoryNew = mapKeys(data, (v, k) =>
          camelCase(k)
        ) as ICategoryDetailData

        /* If data.config == null then set data.config = {} */
        if (data.config === null) this.dataCategoryNew.config = {}

        this.dataCategoryOld = Object.assign({}, this.dataCategoryNew)
        this.lockCategory(this.categorySeleted.id)
      }
    } catch (error) {}
    this.isLoading = false
  }

  async handleGetDetailQuestions() {
    this.isLoading = true
    try {
      /* Waiting GetFullDetailQuestion API
      const { data } = await getFullDetailQuestion(this.categorySeleted.id) */
      const { data } = await getDetailQuestion(this.categorySeleted.id)
      if (data.config) data.config = {}
      /* Get all key of object data and change this to camelCase */
      this.dataQuestionNew = mapKeys(data, (v, k) =>
        camelCase(k)
      ) as IQuestionDetailData

      /* If data.config == null then set data.config = {} */
      if (data.config === null) this.dataQuestionNew.config = {}

      this.dataQuestionOld = Object.assign({}, this.dataQuestionNew)
      this.lockCategory(this.categorySeleted.id)
    } catch (error) {}
    this.isLoading = false
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

  submitForm() {
    (this.$refs.dataCategoryNew as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = []
        const arrStatusChanged = []
        // check label change
        if (!isEqual(this.dataCategoryNew.label, this.dataCategoryOld.label)) {
          const objLabel = {
            key: 'label',
            label: this.$t('labelText.directEditCategoryLabel'),
            value: this.dataCategoryNew.label
          }
          arrStatusChanged[0] = true
          this.confirmData.push(objLabel)
        } else {
          arrStatusChanged[0] = false
        }

        if (!isEqual(this.dataCategoryNew.text, this.dataCategoryOld.text)) {
          const objText = {
            key: 'text',
            label: this.$t('labelText.directEditCategoryText'),
            value: this.dataCategoryNew.text
          }
          arrStatusChanged[1] = true
          this.confirmData.push(objText)
        } else {
          arrStatusChanged[1] = false
        }

        if (!isEqual(this.dataCategoryNew.config, this.dataCategoryOld.config)) {
          const objConfig = {
            key: 'config',
            label: this.$t('labelText.config'),
            value: JSON.stringify(this.dataCategoryNew.config)
          }
          arrStatusChanged[2] = true
          this.confirmData.push(objConfig)
        } else {
          arrStatusChanged[2] = false
        }

        if (arrStatusChanged[0] === false && arrStatusChanged[1] === false && arrStatusChanged[2] === false) {
          const objMessage = {
            key: 'message',
            label: 'Message',
            value: this.$t('helpText.screenItemNothingChanged')
          }
          this.confirmData.push(objMessage)
        }
        this.dialogVisible = true
      } else {
        return false
      }
    })
  }

  handleAccept() {
    (this.$refs.dataCategoryNew as ElForm).validate(async(valid: boolean) => {
      this.dialogVisible = false
      this.isLoading = true
      if (valid) {
        this.resetMessageValidate()
        let dataPost = {}
        if (this.dataCategoryNew.addChildCategory === true) {
          dataPost = {
            label:
              this.dataCategoryNew.label.trim() === ''
                ? null
                : this.dataCategoryNew.label.trim(),
            text:
              this.dataCategoryNew.text.trim() === ''
                ? null
                : this.dataCategoryNew.text.trim(),
            productId: [this.dataCategoryNew.productId],
            parentId: this.dataCategoryNew.parentId
          }
        } else {
          dataPost = {
            label:
              this.dataCategoryNew.label.trim() === ''
                ? null
                : this.dataCategoryNew.label.trim(),
            text:
              this.dataCategoryNew.text.trim() === ''
                ? null
                : this.dataCategoryNew.text.trim(),
            config: this.dataCategoryNew.config,
            parentId: this.dataCategoryNew.parentId
          }
        }
        try {
          if (this.dataCategoryNew.addChildCategory === true) {
            await createCategory(
              mapKeys(dataPost, (v, k) => snakeCase(k))
            )
          } else {
            await editCategory(
              this.categorySeleted.id,
              mapKeys(dataPost, (v, k) => snakeCase(k))
            )
          }
          this.dataCategoryOld = Object.assign({}, this.dataCategoryNew)
          // show modal create successfully
          this.$alert(this.$t('message.categoryModifySuccess') as string, '', {
            confirmButtonText: this.$t('text.ok') as string,
            type: 'success',
            center: true
          })
        } catch (err) {
          // check if error 422
          if (err instanceof ValidationError) {
            const validationError = err as ValidationError
            if (validationError.data?.length) {
              validationError.data.forEach((err) => {
                // get message error
                switch (err.value) {
                  case CategoryErrorValue.Label:
                    this.updateCategoryError.label = getValidationMessage(
                      err.type[0],
                      this.$t('validError.required', { _field_: this.$t('labelText.directEditCategoryLabel') })
                    )
                    break
                  case CategoryErrorValue.Text:
                    this.updateCategoryError.text =
                      getValidationMessage(
                        err.type[0],
                        this.$t('validError.required', { _field_: this.$t('labelText.directEditCategoryText') })
                      )
                    break
                  case CategoryErrorValue.Config:
                    this.updateCategoryError.config =
                      getValidationMessage(
                        err.type[0],
                        this.$t('labelText.config')
                      )
                    break
                  default:
                    break
                }
              })
            }
          }
        }
      } else {
        return false
      }
      this.isLoading = false
      this.$emit('reloadListCategory', this.productId)
    })
  }

  handleCancel() {
    this.dialogVisible = false
  }
}
</script>

<style lang="scss" scoped>
.card_item_title{
  text-align: center;
  color: #0F93FF;
}
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
