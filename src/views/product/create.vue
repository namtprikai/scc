<template>
  <div class="sm-container">
    <el-card class="box-card">
      <el-form
        class="form-product"
        ref="createForm"
        label-position="top"
        :rules="createRules"
        :model="createForm"
      >
        <el-form-item
          :label="$t('labelText.productName')"
          :error="createProductError.productName"
          prop="name"
        >
          <el-input
            v-model="createForm.name"
            @blur="createForm.name = createForm.name.trim()"
            tabindex="1"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.maxFailureCountUser')"
          :error="createProductError.maxFailureCountUser"
        >
          <el-input
            type="number"
            v-model.number="createForm.maxFailureCountUser"
            tabindex="2"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.maxFailureTimeUser')"
          :error="createProductError.maxFailureTimeUser"
        >
          <el-input
            type="number"
            v-model.number="createForm.maxFailureTimeUser"
            tabindex="3"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.memo')"
          :error="createProductError.config"
        >
          <div class="json-editor">
            <json-editor
              :objData="createForm.config"
              v-model="createForm.config"
              tabindex="4"
            ></json-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click.native.prevent="confirmProductData"
            tabindex="5"
            >{{ $t("text.submit") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmData"
      :title="$t('text.createScreenModalConfirmTitle')"
      @ok="handleSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEdiitorContent/JsonEditor.vue'
import { Form as ElForm } from 'element-ui'
import { createProduct } from '@/api/production'
import { ValidationError, ValidationType } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { ProductErrorValue } from './product-error-value'
import { mapKeys, snakeCase } from 'lodash'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

@Component({
  name: 'CreateProduct',
  components: {
    JsonEditor,
    ConfirmDialog
  }
})
export default class extends Vue {
  confirmData: any = null;
  public confirmdialogVisible = false;
  public createProductError: any = {
    productName: null,
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: null
  };

  public createForm = {
    name: '',
    maxFailureCountUser: null,
    maxFailureTimeUser: null,
    config: {}
  };

  // createProduct rules
  public createRules = {
    name: [
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

  public confirmProductData() {
    (this.$refs.createForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = [
          {
            key: this.$t('labelText.productName'),
            value: this.createForm.name
          },
          {
            key: this.$t('labelText.maxFailureCountUser'),
            value: this.createForm.maxFailureCountUser
          },
          {
            key: this.$t('labelText.maxFailureTimeUser'),
            value: this.createForm.maxFailureTimeUser
          },
          {
            key: this.$t('labelText.memo'),
            value: JSON.stringify(this.createForm.config, undefined, 4),
            type: 'json'
          }
        ]
        this.confirmdialogVisible = true
      } else {
        return false
      }
    })
  }

  public handleSubmit() {
    (this.$refs.createForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.resetMessageValidate()
        const dataPost = {
          name:
            this.createForm.name.trim() === ''
              ? null
              : this.createForm.name.trim(),
          config: this.createForm.config,
          maxFailureCountUser:
            this.createForm.maxFailureCountUser === ''
              ? null
              : this.createForm.maxFailureCountUser,
          maxFailureTimeUser:
            this.createForm.maxFailureTimeUser === ''
              ? null
              : this.createForm.maxFailureTimeUser
        }
        try {
          const { data } = await createProduct(
            mapKeys(dataPost, (v, k) => snakeCase(k))
          )
          if (data) {
            this.$alert(this.$t('message.productCreateSuccess') as string, '', {
              confirmButtonText: this.$t('text.ok') as string,
              type: 'success',
              center: true,
              callback: () => {
                // redirect to products list
                this.$router
                  .push({
                    name: 'ListProduct'
                  })
                  .catch((err) => {
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
                    this.createProductError.productName = getValidationMessage(
                      err.type[0],
                      this.$t('labelText.productName')
                    )
                    break
                  case ProductErrorValue.MaxFailureCountUser:
                    this.createProductError.maxFailureCountUser =
                      getValidationMessage(
                        err.type[0],
                        this.$t('labelText.maxFailureCountUser')
                      )
                    break
                  case ProductErrorValue.MaxFailureTimeUser:
                    this.createProductError.maxFailureTimeUser =
                      getValidationMessage(
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
</style>
