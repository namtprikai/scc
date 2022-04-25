<template>
  <div class="container edit-validation-container">
    <el-card class="box-card" v-loading="isLoading">
      <el-form
        ref="form"
        label-position="top"
        :model="validationForm"
        autocomplete="on"
      >
        <el-form-item :label="this.$t('labelText.id')" prop="id">
          <el-input v-model="validationForm.id" type="text" disabled />
        </el-form-item>
        <el-form-item :label="this.$t('labelText.created')" prop="created">
          <el-date-picker
            v-model="validationForm.created"
            class="w-100"
            type="date"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="this.$t('labelText.modified')" prop="modified">
          <el-date-picker
            v-model="validationForm.modified"
            class="w-100"
            type="date"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="this.$t('labelText.validationTableName')"
          prop="tableName"
        >
          <el-input v-model="validationForm.tableName" type="text" disabled />
        </el-form-item>
        <el-form-item
          :label="this.$t('labelText.validationColumnName')"
          prop="columnName"
        >
          <el-input v-model="validationForm.columnName" type="text" disabled />
        </el-form-item>
        <el-form-item :label="this.$t('labelText.validationType')" prop="type">
          <el-input v-model="validationForm.type" type="text" disabled />
        </el-form-item>
        <el-form-item
          :label="this.$t('labelText.validationPattern')"
          :error="formError.pattern"
          prop="pattern"
        >
          <el-input
            v-model="validationForm.pattern"
            @blur="
              validationForm.pattern = normalizeEmptyString(
                validationForm.pattern
              )
            "
            type="text"
            tabindex="1"
            autofocus
          />
        </el-form-item>
        <el-form-item
          :label="this.$t('labelText.validationSystemMaximum')"
          prop="systemMaximum"
        >
          <el-input
            v-model="validationForm.systemMaximum"
            type="number"
            disabled
          />
        </el-form-item>
        <el-form-item
          :label="this.$t('labelText.validationMin')"
          :error="formError.min"
          prop="min"
        >
          <el-input
            v-model.number="validationForm.min"
            type="number"
            min="0"
            tabindex="2"
          />
        </el-form-item>
        <el-form-item
          :label="this.$t('labelText.validationMax')"
          :error="formError.max"
          prop="max"
        >
          <el-input
            v-model.number="validationForm.max"
            type="number"
            min="0"
            :max="validationSystemMax"
            tabindex="3"
          />
        </el-form-item>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click.native.prevent="confirmSubmit"
          tabindex="4"
        >
          {{ $t("text.update") }}
        </el-button>
      </el-form>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmDialogVisible"
      :confirmData="confirmData"
      :title="$t('text.modifyScreenModalConfirmTitle')"
      @ok="updateValidation"
    />
  </div>
</template>

<script lang="ts">
import { IValidationDetail } from '@/api/types'
import { detailValidation, updateValidation } from '@/api/validations'
import ConfirmDialog, {
  ConfirmDialogData
} from '@/components/ConfirmDialog/index.vue'
import { ValidationError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { ElForm } from 'element-ui/types/form'
import { camelCase, isEqual, mapKeys } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'

interface ValidationFormError {
  pattern: string | null
  max: string | null
  min: string | null
}

@Component({
  name: 'DetailEditValidation',
  components: {
    ConfirmDialog
  }
})
export default class extends Vue {
  validationId!: number;

  validation: IValidationDetail = {} as IValidationDetail;
  validationForm: IValidationDetail = {} as IValidationDetail;
  validationSystemMax: number | null = null;

  isLoading = false;
  isSubmitting = false;
  confirmDialogVisible = false;
  confirmData: ConfirmDialogData[] = [];

  formError: ValidationFormError = {
    pattern: null,
    max: null,
    min: null
  };

  async created() {
    this.validationId = parseInt(this.$route.params.id)
    this.getValidationDetail(this.validationId)
  }

  async getValidationDetail(id: number) {
    try {
      this.isLoading = true

      const { data } = await detailValidation(id)
      this.validation = mapKeys(data, (v, k) =>
        camelCase(k)
      ) as IValidationDetail
      this.validationForm = { ...this.validation }

      if (this.validationForm.systemMaximum) {
        this.validationSystemMax = this.validationForm.systemMaximum
      }

      this.isLoading = false
    } catch {
      this.isLoading = false
    }
  }

  normalizeEmptyString(value: string | null | undefined) {
    value = value?.trim() ?? null
    if (value === '') {
      value = null
    }
    return value
  }

  clearFormError() {
    this.formError = {
      pattern: null,
      max: null,
      min: null
    }
  }

  confirmSubmit() {
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = []
        if (!isEqual(this.validation, this.validationForm)) {
          if (
            this.normalizeEmptyString(this.validation.pattern) !==
            this.normalizeEmptyString(this.validationForm.pattern)
          ) {
            this.confirmData.push({
              key: this.$tc('labelText.validationPattern'),
              value: this.validationForm.pattern ?? ''
            })
          }

          if (this.validation.min !== this.validationForm.min) {
            this.confirmData.push({
              key: this.$tc('labelText.validationMin'),
              value: this.validationForm.min + ''
            })
          }
          if (this.validation.max !== this.validationForm.max) {
            this.confirmData.push({
              key: this.$tc('labelText.validationMax'),
              value: this.validationForm.max + ''
            })
          }
        }
        this.confirmDialogVisible = true
      } else {
        return false
      }
    })
  }

  async updateValidation() {
    if (this.isSubmitting || !this.confirmData?.length) {
      return
    }

    try {
      this.isSubmitting = true

      this.clearFormError()

      await updateValidation(this.validationId, {
        pattern: this.validationForm.pattern,
        max: this.validationForm.max ? +this.validationForm.max : null,
        min: this.validationForm.min ? +this.validationForm.min : null
      })

      await this.getValidationDetail(this.validationId)

      this.isSubmitting = false

      this.$alert(this.$tc('message.validationModifySuccess'), {
        confirmButtonText: this.$tc('text.ok'),
        type: 'success',
        center: true
      })
    } catch (error) {
      this.isSubmitting = false

      if (error instanceof ValidationError) {
        const patternError = error.data?.find(item => item.value === 'pattern')
        if (patternError && patternError.type?.length) {
          this.formError.pattern = getValidationMessage(
            patternError.type[0],
            this.$t('labelText.validationPattern')
          ) as string
        }

        const minError = error.data?.find(item => item.value === 'min')
        if (minError && minError?.type.length) {
          this.formError.min = getValidationMessage(
            minError.type[0],
            this.$t('labelText.validationMin')
          ) as string
        }

        const maxError = error.data?.find(item => item.value === 'max')
        if (maxError && maxError?.type.length) {
          this.formError.max = getValidationMessage(
            maxError.type[0],
            this.$t('labelText.validationMax')
          ) as string
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-validation-container {
  .w-100 {
    width: 100%;
  }
}
</style>
