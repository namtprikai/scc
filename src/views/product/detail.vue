<template>
  <div class="container">
    <el-card class="box-card">
      <el-form
        class="form-product"
        ref="updateForm"
        label-position="top"
        :rules="updateRules"
        :model="updateForm"
      >
        <el-form-item :label="$t('labelText.id')">
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
            @blur="updateForm.name = updateForm.name.trim()"
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
        <el-form-item
          :label="$t('labelText.maxFailureTimeUser')"
          :error="createProductError.maxFailureTimeUser"
        >
          <el-input
            type="number"
            v-model.number="updateForm.maxFailureTimeUser"
            tabindex="6"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.memo')"
          :error="createProductError.config"
        >
          <div class="json-editor">
            <json-editor
              :objData="updateForm.config"
              v-model="updateForm.config"
              tabindex="7"
            ></json-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            tabindex="8"
            @click.native.prevent="confirmProductData"
            >{{ $t("text.update") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmData"
      :title="$t('text.modifyScreenModalConfirmTitle')"
      @ok="handleSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { Form as ElForm } from 'element-ui'
import { getDetailProduct, updateProduct } from '@/api/production'
import { ValidationError, ValidationType } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { ProductErrorValue } from './product-error-value'
import { IProductDetailData } from '@/api/types'
import { mapKeys, snakeCase, camelCase, isEqual } from 'lodash'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

@Component({
  name: 'DetailProduct',
  components: {
    JsonEditor,
    ConfirmDialog
  }
})
export default class extends Vue {
  confirmData: any = null;
  public confirmdialogVisible = false;
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
    this.updateForm.id = parseInt(id)
    this.fetchData(this.updateForm.id)
  }

  private async fetchData(id: number) {
    const { data } = await getDetailProduct(id)
    this.updateForm = mapKeys(data, (v, k) =>
      camelCase(k)
    ) as IProductDetailData
    this.updateForm.id = this.productDataOld.id = id
    this.productDataOld = Object.assign({}, this.updateForm)
  }

  // createProduct rules
  public updateRules = {
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
    (this.$refs.updateForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = []
        if (!isEqual(this.updateForm, this.productDataOld)) {
          // check name change
          if (!isEqual(this.updateForm.name, this.productDataOld.name)) {
            this.confirmData.push({
              key: this.$t('labelText.productName'),
              value: this.updateForm.name
            })
          }

          // check max failure count user change
          if (
            !isEqual(
              this.updateForm.maxFailureCountUser,
              this.productDataOld.maxFailureCountUser
            )
          ) {
            this.confirmData.push({
              key: this.$t('labelText.maxFailureCountUser'),
              value: this.updateForm.maxFailureCountUser
            })
          }

          // check max failure time user change
          if (
            !isEqual(
              this.updateForm.maxFailureTimeUser,
              this.productDataOld.maxFailureTimeUser
            )
          ) {
            this.confirmData.push({
              key: this.$t('labelText.maxFailureTimeUser'),
              value: this.updateForm.maxFailureTimeUser
            })
          }

          // check config change
          if (!isEqual(this.updateForm.config, this.productDataOld.config)) {
            this.confirmData.push({
              key: this.$t('labelText.memo'),
              value: JSON.stringify(this.updateForm.config, undefined, 4),
              type: 'json'
            })
          }
        }
        this.confirmdialogVisible = true
      } else {
        return false
      }
    })
  }

  public handleSubmit() {
    (this.$refs.updateForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.resetMessageValidate()
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
          const { data } = await updateProduct(
            this.updateForm.id,
            mapKeys(dataPost, (v, k) => snakeCase(k))
          )
          if (data) {
            this.productDataOld = Object.assign({}, this.updateForm)
            // show modal create successfully
            this.$alert(this.$t('message.productModifySuccess') as string, '', {
              confirmButtonText: this.$t('text.ok') as string,
              type: 'success',
              center: true
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

.width-full {
  width: 100%;
}
</style>
