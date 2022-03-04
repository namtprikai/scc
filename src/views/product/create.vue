<template>
  <div class="create-product-container">
    <el-form
      class="form-product"
      ref="createForm"
      :rules="createRules"
      :label-position="isMobile() ? 'top' : 'right'"
      label-width="20%"
      :model="createForm"
    >
      <el-form-item label="temp" :error="createProductError.productName" prop="productName">
        <span slot="label">{{ $t('labelText.productName') }}</span>
        <el-input v-model="createForm.productName" tabindex="1" autofocus></el-input>
      </el-form-item>
      <el-form-item label="temp" :error="createProductError.maxFailureCountUser">
        <span slot="label">{{ $t('labelText.maxFailureCountUser') }}</span>
        <el-input type="number" v-model.number="createForm.maxFailureCountUser" tabindex="2"></el-input>
      </el-form-item>
      <el-form-item label="temp" :error="createProductError.maxFailureTimeUser">
        <span slot="label">{{ $t('labelText.maxFailureTimeUser') }}</span>
        <el-input type="number" v-model.number="createForm.maxFailureTimeUser" tabindex="3"></el-input>
      </el-form-item>
      <el-form-item label="temp" :error="createProductError.config">
        <span slot="label">{{ $t('labelText.memo') }}</span>
        <div class="json-editor">
          <JsonEditor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="createForm.config"
            v-model="createForm.config"
            tabindex="4"
          ></JsonEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
          tabindex="5"
        >{{ $t('text.submit') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'vue-property-decorator'
import JsonEditor from 'vue-json-edit/src/JsonEditor.vue'
import { Form as ElForm } from 'element-ui'
import { createProduct } from '@/api/production'
import { ValidationError, ValidationType } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { ProductErrorValue } from './product-error-value'

@Component({
  name: 'CreateProduct',
  components: {
    JsonEditor
  }
})

export default class extends Vue {
  public labelPosition = 'right'
  public createProductError: any = {
    productName: null,
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: null
  }

  public createForm = {
    productName: '',
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: {}
  }

  // check screen display is mobile to responsive
  public isMobile() {
    if (screen.width < 768) {
      return true
    } else {
      return false
    }
  }

  // createProduct rules
  private createRules = {
    productName: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.productName')),
        trigger: 'blur'
      }
    ]
  }

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
    (this.$refs.createForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.resetMessageValidate()
        // eslint-disable-next-line prefer-regex-literals
        const name = this.createForm.productName.trim() === null ? '' : this.createForm.productName.trim().replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;')
        this.$confirm(
          `
            <table class="message">
                <tr>
                    <td class="td-left">${this.$t('labelText.productName')}</td>
                    <td class="td-center">:</td>
                    <td class="td-right">
                      <div class="max-size-height overflow-scroll">${name}</div>
                    </td>
                </tr>
                <tr>
                    <td class="td-left">${this.$t('labelText.maxFailureCountUser')}</td>
                    <td class="td-center">:</td>
                    <td class="td-right">${this.createForm.maxFailureCountUser === null ? '' : this.createForm.maxFailureCountUser}</td>
                </tr>
                <tr>
                    <td class="td-left">${this.$t('labelText.maxFailureTimeUser')}</td>
                    <td class="td-center">:</td>
                    <td class="td-right">${this.createForm.maxFailureTimeUser === null ? '' : this.createForm.maxFailureTimeUser}</td>
                </tr>
                <tr>
                    <td class="td-left">${this.$t('labelText.memo')}</td>
                    <td class="td-center">:</td>
                    <td class="td-right"><pre class="max-size-height max-size-width margin-none"><xmp>${JSON.stringify(this.createForm.config, undefined, 4)}</xmp></pre></td>
                </tr>
            </table>
          `,
          this.$t('text.createScreenModalConfirmTitle') as string, {
            confirmButtonText: this.$t('text.ok') as string,
            cancelButtonText: this.$t('text.cancel') as string,
            type: 'info',
            dangerouslyUseHTMLString: true,
            center: true,
            customClass: 'popup-custom'
          }
        ).then(async() => {
          try {
            const dataPost = {
              name: this.createForm.productName.trim() === '' ? null : this.createForm.productName.trim(),
              config: this.createForm.config,
              max_failure_count_user: this.createForm.maxFailureCountUser === '' ? null : this.createForm.maxFailureCountUser,
              max_failure_time_user: this.createForm.maxFailureTimeUser === '' ? null : this.createForm.maxFailureTimeUser
            }
            try {
              const { data } = await createProduct(dataPost)
              if (data) {
                // show modal create successfully
                this.$alert(this.$t('message.productCreateSuccess') as string, '', {
                  confirmButtonText: this.$t('text.ok') as string,
                  type: 'success',
                  center: true,
                  callback: () => {
                    // redirect to products list
                    this.$router.push({
                      // TODO: T.B.D This code will add next sprint
                      path: '#'
                    }).catch(err => {
                      this.$message({
                        message: err as string,
                        type: 'error',
                        duration: 5 * 1000
                      })
                    })
                  }
                })
              }
            } catch (err) {
              // check if error 422
              if (err instanceof ValidationError) {
                const validationError = err as ValidationError
                if (validationError.data?.length) {
                  validationError.data.forEach((err) => {
                    // get message error
                    switch (err.value) {
                      case ProductErrorValue.Name:
                        this.createProductError.productName = getValidationMessage(err.type[0], this.$t('labelText.productName'))
                        break
                      case ProductErrorValue.MaxFailureCountUser:
                        this.createProductError.maxFailureCountUser = getValidationMessage(err.type[0], this.$t('labelText.maxFailureCountUser'))
                        break
                      case ProductErrorValue.MaxFailureTimeUser:
                        this.createProductError.maxFailureTimeUser = getValidationMessage(err.type[0], this.$t('labelText.maxFailureTimeUser'))
                        break
                      case ProductErrorValue.Config:
                        this.createProductError.config = getValidationMessage(err.type[0], this.$t('labelText.memo'))
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
        }).catch(() => {})
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.create-product-container {
  padding: 15px;

  .json-editor {
    padding: 10px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  ::v-deep .el-form-item__label {
    line-height: 20px !important;
  }

  .form-product{
    width: 70%;
    margin: 5% auto;
    @media only screen and (max-width: 767px) {
      width: 100%;
    }
  }
}
</style>
