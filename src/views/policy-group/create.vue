<template>
  <div class="container">
    <el-card class="box-card">
      <el-form ref="form" label-position="top" :rules="rules" :model="form">
        <div class="box-card__title">{{ $t("text.policyGroupInfo") }}</div>
        <el-form-item
          :label="$t('labelText.policyGroupLabel')"
          :error="formError.label"
          prop="label"
        >
          <el-input
            v-model="form.label"
            @blur="form.label = form.label.trim()"
            tabindex="1"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.policyGroupDescription')"
          :error="formError.description"
          prop="description"
        >
          <el-input
            v-model="form.description"
            @blur="form.description = form.description.trim()"
            tabindex="2"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.policyGroupConfig')"
          :error="formError.config"
        >
          <div class="json-editor">
            <json-editor
              :objData="form.config"
              v-model="form.config"
              tabindex="3"
            ></json-editor>
          </div>
        </el-form-item>

        <div class="box-card__title">{{ $t("text.policyGroupPolicyAdd") }}</div>
        <policy-selection v-model="selectedPolicies" />
        <el-form-item>
          <el-button
            type="primary"
            @click.native.prevent="confirmSubmit"
            tabindex="4"
            v-loading.fullscreen.lock="isSubmitting"
            >{{ $t("text.submit") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmDialogVisible"
      :confirmData="confirmData"
      :title="$t('text.createScreenModalConfirmTitle')"
      :isMultipleSection="true"
      :keyColumnWidth="40"
      :valueColumnWidth="60"
      @ok="handleSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { Form as ElForm } from 'element-ui'
import { ValidationError, ValidationType } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import PolicySelection from './components/PolicySelection.vue'
import ConfirmDialog, { ConfirmDialogData } from '@/components/ConfirmDialog/index.vue'
import { ICreatePolicy, IPolicyItem } from '@/api/types'
import {
  createPolicyGroup,
  updatePolicyOfPolicyGroup
} from '@/api/policy-groups'

interface IPolicyFormError {
  label: string | null
  description: string | null
  config: string | null
}

@Component({
  name: 'CreatePolicyGroup',
  components: {
    PolicySelection,
    JsonEditor,
    ConfirmDialog
  }
})
export default class extends Vue {
  confirmData: ConfirmDialogData[] = [];
  confirmDialogVisible = false;
  selectedPolicies: IPolicyItem[] = [];
  isSubmitting = false;

  formError: IPolicyFormError = {
    label: null,
    description: null,
    config: null
  };

  form: ICreatePolicy = {
    label: '',
    description: '',
    config: {}
  };

  rules = {
    label: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.policyGroupLabel')
        ),
        trigger: 'blur'
      }
    ]
  };

  confirmSubmit() {
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = [
          {
            sectionTitle: this.$tc('text.policyGroupInfo'),
            sectionData: [
              {
                key: this.$tc('labelText.policyGroupLabel'),
                value: this.form.label
              },
              {
                key: this.$tc('labelText.policyGroupDescription'),
                value: this.form.description ?? ''
              },
              {
                key: this.$tc('labelText.policyGroupConfig'),
                value: JSON.stringify(this.form.config, undefined, 4),
                type: 'json'
              }
            ]
          },
          {
            sectionTitle: this.$tc('text.policyGroupPolicyAdd'),
            sectionData: this.selectedPolicies
              .sort((a, b) => a.id - b.id)
              .map(item => ({
                key: `${item.id}.${item.label}`,
                value: this.$tc('text.policyGroupPolicyAddYes')
              }))
          }
        ]
        this.confirmDialogVisible = true
      } else {
        return false
      }
    })
  }

  resetValidationMessage() {
    this.formError = {
      label: null,
      description: null,
      config: null
    }
  }

  async handleSubmit() {
    try {
      this.isSubmitting = true

      this.resetValidationMessage()

      const { data } = await createPolicyGroup(this.form)
      if (data.id) {
        if (this.selectedPolicies.length) {
          await updatePolicyOfPolicyGroup(data.id, {
            policy_id: this.selectedPolicies.map(item => item.id),
            delete_id: []
          })
        }

        this.$alert(this.$tc('message.policyGroupCreateSuccess'), '', {
          confirmButtonText: this.$tc('text.ok'),
          type: 'success',
          center: true,
          callback: () => {
            this.$router.push({
              name: 'ListPolicyGroup'
            })
          }
        })
      }

      this.isSubmitting = false
    } catch (error) {
      this.isSubmitting = false

      if (error instanceof ValidationError) {
        const labelError = error?.data?.find(item => item.value === 'label')
        if (labelError && labelError.type.length) {
          this.formError.label = getValidationMessage(
            labelError.type[0],
            this.$t('labelText.policyGroupLabel')
          ) as string
        }

        const descriptionError = error?.data?.find(
          item => item.value === 'description'
        )
        if (descriptionError && descriptionError.type.length) {
          this.formError.description = getValidationMessage(
            descriptionError?.type[0],
            this.$t('labelText.policyGroupDescription')
          ) as string
        }

        const configError = error?.data?.find(item => item.value === 'config')
        if (configError && configError.type.length) {
          this.formError.config = getValidationMessage(
            configError?.type[0],
            this.$t('labelText.policyGroupConfig')
          ) as string
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card__title {
  padding-top: 10px;
  padding-bottom: 20px;
}
.json-editor {
  padding: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
