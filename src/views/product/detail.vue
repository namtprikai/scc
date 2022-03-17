<template>
  <div class="sm-container">
    <el-card class="box-card">
    <el-form
      class="form-product"
      ref="updateForm"
      label-position="top"
      :rules="createRules"
      :model="updateForm"
    >
      <el-form-item :label="$t('labelText.id')">
        <!-- <span slot="label">{{ $t("labelText.id") }}</span> -->
        <el-input v-model="updateForm.id" tabindex="1" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.created')">
        <el-date-picker
          class="width-full"
          type="date"
          v-model="updateForm.created"
          tabindex="2"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('labelText.modified')">
        <el-date-picker
          class="width-full"
          type="date"
          v-model="updateForm.modified"
          tabindex="3"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.productName')"
        :error="createProductError.productName"
        prop="name"
      >
        <el-input
          v-model="updateForm.name"
          tabindex="4"
          autofocus
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.maxFailureCountUser')"
        :error="createProductError.maxFailureCountUser"
      >
        <el-input
          type="number"
          v-model.number="updateForm.maxFailureCountUser"
          tabindex="5"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.maxFailureTimeUser')" :error="createProductError.maxFailureTimeUser">
        <el-input
          type="number"
          v-model.number="updateForm.maxFailureTimeUser"
          tabindex="6"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.memo')" :error="createProductError.config">
        <div class="json-editor">
          <json-editor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="updateForm.config"
            v-model="updateForm.config"
            tabindex="7"
          ></json-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" tabindex="8">{{
          $t("text.update")
        }}</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JsonEditor from 'vue-json-edit/src/JsonEditor.vue'
import { Form as ElForm } from 'element-ui'
import { getDetailProduct, updateProduct } from '@/api/production'
import { ValidationError, ValidationType } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { ProductErrorValue } from './product-error-value'
import { IProductDetailData } from '@/api/types'
import { mapKeys, snakeCase, camelCase } from 'lodash'

@Component({
  name: 'DetailProduct',
  components: {
    JsonEditor
  }
})

export default class extends Vue {
  public labelPosition = 'right';
  public createProductError: any = {
    productName: null,
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: null
  };

  public updateForm: IProductDetailData = {
    id: 0,
    created: '',
    modified: '',
    name: '',
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: {}
  };

  public productDataOld: IProductDetailData = {
    id: 0,
    created: '',
    modified: '',
    name: '',
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: {}
  };

  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(parseInt(id))
  }

  private async fetchData(id: number) {
    const { data } = await getDetailProduct(id)
    this.updateForm = mapKeys(data, (v, k) => camelCase(k)) as IProductDetailData
    this.updateForm.id = this.productDataOld.id = id
    this.productDataOld = Object.assign({}, this.updateForm)
  }

  // createProduct rules
  public createRules = {
    productName: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.productName')
        ),
        trigger: 'blur'
      }
    ]
  };

  // reset validate message error
  public resetMessageValidate() {
    this.createProductError = {
      productName: null,
      maxFailureCountUser: null,
      maxFailureTimeUser: null,
      config: null
    }
  }

  public submit() {
    (this.$refs.updateForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.resetMessageValidate()
        const name =
          this.updateForm.name.trim() === null
            ? ''
            : this.updateForm.name
              .trim()
            // eslint-disable-next-line prefer-regex-literals
              .replace(new RegExp('<', 'g'), '&lt;')
            // eslint-disable-next-line prefer-regex-literals
              .replace(new RegExp('>', 'g'), '&gt;')
        this.$confirm(
          `
            ${JSON.stringify(this.updateForm) === JSON.stringify(this.productDataOld)
            ? `${this.$t('helpText.screenItemNothingChanged')}`
            : ''}
            <table class="message">
                ${this.updateForm.name !== this.productDataOld.name
                ? `<tr>
                    <td class="td-left">${this.$t('labelText.productName')}</td>
                    <td class="td-center">:</td>
                    <td class="td-right">
                      <div class="max-size-height overflow-scroll">${name}</div>
                    </td>
                  </tr>
                  `
                  : ''}
                ${this.updateForm.maxFailureCountUser !== this.productDataOld.maxFailureCountUser
                  ? `<tr>
                      <td class="td-left">${this.$t('labelText.maxFailureCountUser')}</td>
                      <td class="td-center">:</td>
                      <td class="td-right">${this.updateForm.maxFailureCountUser}</td>
                  </tr>
                  `
                  : ''}
                ${this.updateForm.maxFailureTimeUser !== this.productDataOld.maxFailureTimeUser
                  ? `<tr>
                      <td class="td-left">${this.$t('labelText.maxFailureTimeUser')}</td>
                      <td class="td-center">:</td>
                      <td class="td-right">${this.updateForm.maxFailureTimeUser}</td>
                  </tr>
                  `
                  : ''}
                ${JSON.stringify(this.updateForm.config) !== JSON.stringify(this.productDataOld.config)
                  ? `<tr>
                      <td class="td-left">${this.$t('labelText.memo')}</td>
                      <td class="td-center">:</td>
                      <td class="td-right"><pre class="max-size-height max-size-width margin-none"><xmp>${JSON.stringify(this.updateForm.config, undefined, 4)}</xmp></pre></td>
                  </tr>
                  `
                  : ''}
            </table>
          `,
          this.$t('text.modifyScreenModalConfirmTitle') as string,
          {
            confirmButtonText: this.$t('text.ok') as string,
            cancelButtonText: this.$t('text.cancel') as string,
            type: 'info',
            dangerouslyUseHTMLString: true,
            center: true,
            customClass: 'popup-custom'
          }
        )
          .then(async() => {
            try {
              const dataPost = {
                name:
                  this.updateForm.name.trim() === ''
                    ? null
                    : this.updateForm.name.trim(),
                config: this.updateForm.config,
                maxFailureCountUser:
                  this.updateForm.maxFailureCountUser?.toString() === ''
                    ? null
                    : this.updateForm.maxFailureCountUser,
                maxFailureTimeUser:
                  this.updateForm.maxFailureTimeUser?.toString() === ''
                    ? null
                    : this.updateForm.maxFailureTimeUser
              }
              try {
                const { data } = await updateProduct(this.updateForm.id, mapKeys(dataPost, (v, k) => snakeCase(k)))
                if (data) {
                  this.productDataOld = Object.assign({}, this.updateForm)
                  // show modal create successfully
                  this.$alert(
                    this.$t('message.productModifySuccess') as string,
                    '',
                    {
                      confirmButtonText: this.$t('text.ok') as string,
                      type: 'success',
                      center: true
                    }
                  )
                }
              } catch (err) {
                // check if error 422
                if (err instanceof ValidationError) {
                  const validationError = err as ValidationError
                  if (validationError.data?.length) {
                    validationError.data.forEach(err => {
                      // get message error
                      switch (err.value) {
                        case ProductErrorValue.Name:
                          this.createProductError.productName = getValidationMessage(
                            err.type[0],
                            this.$t('labelText.productName')
                          )
                          break
                        case ProductErrorValue.MaxFailureCountUser:
                          this.createProductError.maxFailureCountUser = getValidationMessage(
                            err.type[0],
                            this.$t('labelText.maxFailureCountUser')
                          )
                          break
                        case ProductErrorValue.MaxFailureTimeUser:
                          this.createProductError.maxFailureTimeUser = getValidationMessage(
                            err.type[0],
                            this.$t('labelText.maxFailureTimeUser')
                          )
                          break
                        case ProductErrorValue.Config:
                          this.createProductError.config = getValidationMessage(
                            err.type[0],
                            this.$t('labelText.memo')
                          )
                          break
                        default:
                          break
                      }
                    })
                  }
                }
              }
            } catch (err) {
              this.$message({
                message: err as string,
                type: 'error',
                duration: 5 * 1000
              })
            }
            // eslint-disable-next-line @typescript-eslint/no-empty-function
          })
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .catch(() => {})
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>

.json-editor {
  padding: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

::v-deep .el-form-item__label {
  line-height: 20px !important;
}

.width-full {
  width: 100%;
}

</style>
