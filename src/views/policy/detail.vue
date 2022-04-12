<template>
  <div class="sm-container">
    <el-card class="box-card">
    <el-form
      class="form-policy"
      ref="updateForm"
      label-position="top"
      :model="policyData"
    >
      <el-form-item :label="$t('labelText.id')">
        <el-input v-model="policyData.id" tabindex="1" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.created')">
        <el-date-picker
          class="width-full"
          type="date"
          v-model="policyData.created"
          tabindex="2"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('labelText.modified')">
        <el-date-picker
          class="width-full"
          type="date"
          v-model="policyData.modified"
          tabindex="3"
          disabled
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.policyLabel')"
        :error="policyEditError.label"
      >
        <el-input
          v-model="policyData.label"
          @blur="policyData.label = policyData.label.trim()"
          tabindex="4"
          autofocus
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.policyDescription')"
        :error="policyEditError.description"
      >
        <el-input
          v-model="policyData.description"
          @blur="policyData.description = policyData.description.trim()"
          tabindex="5"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.policyMethod')">
        <el-input
          v-model.number="policyData.method"
          tabindex="6"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('labelText.policyUri')">
        <el-input
          v-model.number="policyData.uri"
          tabindex="7"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          :label="$t('labelText.policyIsActive')"
          v-model="policyData.isActive"
          name="type"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" tabindex="8"
        @click.native.prevent="confirmPolicyData">{{
          $t("text.update")
        }}</el-button>
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
import { Form as ElForm } from 'element-ui'
import { detailPolicy, updatePolicy } from '@/api/policies'
import { ValidationError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { PolicyErrorValue } from './policy-error-value'
import { IPolicyItem } from '@/api/types'
import { mapKeys, snakeCase, camelCase, isEqual } from 'lodash'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

@Component({
  name: 'DetailEditPolicy',
  components: {
    ConfirmDialog
  }
})

export default class extends Vue {
  confirmData: any = null;
  public confirmdialogVisible = false;
  public labelPosition = 'right';
  public policyEditError: any = {
    label: null,
    description: null,
    isActive: null
  };

  public policyData: IPolicyItem = {
    id: 0,
    label: '',
    description: null,
    method: '',
    uri: '',
    isActive: false,
    created: '',
    modified: ''
  };

  public policyDataOld: IPolicyItem = {
    id: 0,
    label: '',
    description: null,
    method: '',
    uri: '',
    isActive: false,
    created: '',
    modified: ''
  };

  created() {
    const id = this.$route.params && this.$route.params.id
    this.policyData.id = parseInt(id)
    this.fetchData(this.policyData.id)
  }

  private async fetchData(id: number) {
    const { data } = await detailPolicy(id)
    this.policyData = mapKeys(data, (v, k) => camelCase(k)) as IPolicyItem
    this.policyDataOld = Object.assign({}, this.policyData)
  }

  // reset validate message error
  public resetMessageValidate() {
    this.policyEditError = {
      label: null,
      description: null,
      isActive: null
    }
  }

  public confirmPolicyData() {
    (this.$refs.updateForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = []
        if (!isEqual(this.policyData, this.policyDataOld)) {
          // check label change
          if (!isEqual(this.policyData.label, this.policyDataOld.label)) {
            this.confirmData.push({
              key: this.$t('labelText.policyLabel'),
              value: this.policyData.label
            })
          }

          // check description change
          if (!isEqual(this.policyData.description, this.policyDataOld.description)) {
            this.confirmData.push({
              key: this.$t('labelText.policyDescription'),
              value: this.policyData.description
            })
          }

          // check isActive change
          if (!isEqual(this.policyData.isActive, this.policyDataOld.isActive)) {
            this.confirmData.push({
              key: this.$t('labelText.policyIsActive'),
              value: this.policyData.isActive
                ? this.$t('text.policyIsActiveYes')
                : this.$t('text.policyIsActiveNo')
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
          label:
            this.policyData.label.trim() === ''
              ? null
              : this.policyData.label.trim(),
          description:
            this.policyData.description?.trim() === ''
              ? null
              : this.policyData.description,
          isActive: this.policyData.isActive
        }
        try {
          const { data } = await updatePolicy(this.policyData.id, mapKeys(dataPost, (v, k) => snakeCase(k)))
          if (data) {
            this.policyDataOld = Object.assign({}, this.policyData)
            // show modal create successfully
            this.$alert(
              this.$t('message.policyModifySuccess') as string,
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
                  case PolicyErrorValue.Label:
                    this.policyEditError.label = getValidationMessage(
                      err.type[0],
                      this.$t('labelText.policyLabel')
                    )
                    break
                  case PolicyErrorValue.Description:
                    this.policyEditError.description = getValidationMessage(
                      err.type[0],
                      this.$t('labelText.policyDescription')
                    )
                    break
                  case PolicyErrorValue.IsActive:
                    this.policyEditError.isActive = getValidationMessage(
                      err.type[0],
                      this.$t('labelText.policyIsActive')
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
