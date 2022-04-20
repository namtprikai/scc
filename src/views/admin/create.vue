<template>
  <div class="create-admin-container sm-container">
    <el-form
      class="form-create-admin"
      ref="createForm"
      :rules="createRules"
      :model="createForm"
    >
      <el-form-item
        :label="$t('labelText.loginName')"
        :error="createAdminError.loginName"
        prop="loginName"
      >
        <el-input
          v-model="createForm.loginName"
          tabindex="1"
          autofocus
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.email')"
        :error="createAdminError.email"
        prop="email"
      >
        <el-input v-model="createForm.email" tabindex="2"></el-input>
      </el-form-item>
      <el-form-item v-if="showCheckbox" class="item-master">
        <el-checkbox
          :label="$t('labelText.isMasterAdmin')"
          v-model="createForm.isMaster"
          name="type"
          tabindex="3"
        />
      </el-form-item>
      <el-form-item
        :label="$t('labelText.config')"
        :error="createAdminError.config"
        class="item-config"
      >
        <div class="json-editor">
          <json-editor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="createForm.config"
            v-model="createForm.config"
            tabindex="4"
          ></json-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" tabindex="5" @click="showModal">{{
          $t("text.submit")
        }}</el-button>
      </el-form-item>
    </el-form>
    <confirm-dialog
      :title="$t('text.createScreenModalConfirmTitle')"
      :dialogVisible.sync="dialogFormVisible"
      :confirmData="confirmData"
      @ok="handleSubmit"
    >
    </confirm-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEdiitorContent/JsonEditor.vue'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError, ValidationType } from '@/utils/request'
import { isMasterAdmin } from '@/utils/common'
import { createAdmin } from '@/api/admins'
import { ICreateAdminRequest } from '@/api/types/request'
import { ElForm } from 'element-ui/types/form'
import { CreateEditAdminErrorValue } from './type'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

interface ICreateAdminItem {
  loginName: string
  email: string
  isMaster: boolean
  config: object
}

interface ICreateAdminError {
  loginName: string | null
  email: string | null
  isMaster: string | null
  config: string | null
}

@Component({
  name: 'CreateAdmin',
  components: {
    JsonEditor,
    ConfirmDialog
  }
})
export default class extends Vue {
  private showCheckbox = false;
  private dialogFormVisible = false;
  private isSubmitForm = false;
  private confirmData: any = [];

  public createForm: ICreateAdminItem = {
    loginName: '',
    email: '',
    isMaster: false,
    config: {}
  };

  public createAdminError: ICreateAdminError = {
    loginName: '',
    email: '',
    isMaster: '',
    config: ''
  };

  private createRules = {
    loginName: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.loginName')
        ),
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.email')
        ),
        trigger: 'blur'
      }
    ]
  };

  // reset validate message error
  public resetMessageValidate() {
    this.createAdminError = {
      loginName: null,
      email: null,
      isMaster: null,
      config: null
    }
  }

  async created() {
    this.showCheckbox = isMasterAdmin()
  }

  private async showModal() {
    (this.$refs.createForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.showCheckbox) {
          this.confirmData = [
            {
              key: this.$t('labelText.loginName'),
              value: this.createForm.loginName
            },
            { key: this.$t('labelText.email'), value: this.createForm.email },
            {
              key: this.$t('labelText.isMasterAdmin'),
              value: this.createForm.isMaster
                ? this.$t('text.adminIsMasterYes')
                : this.$t('text.adminIsMasterNo')
            },
            {
              key: this.$t('labelText.config'),
              value: JSON.stringify(this.createForm.config, null, 4),
              type: 'json'
            }
          ]
        } else {
          this.confirmData = [
            {
              key: this.$t('labelText.loginName'),
              value: this.createForm.loginName
            },
            { key: this.$t('labelText.email'), value: this.createForm.email },
            {
              key: this.$t('labelText.config'),
              value: JSON.stringify(this.createForm.config, null, 4),
              type: 'json'
            }
          ]
        }
        this.dialogFormVisible = true
      }
    })
  }

  async handleSubmit() {
    this.resetMessageValidate()
    const model: ICreateAdminRequest = {
      name: this.createForm.loginName.trim(),
      email: this.createForm.email.trim(),
      is_master: this.createForm.isMaster,
      config: this.createForm.config
    }
    try {
      const { data } = await createAdmin(model)
      if (data) {
        // show modal create successfully
        this.$alert(this.$t('message.adminCreateSuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            // redirect to edit admin
            this.$router
              .push({
                name: 'EditAdmin',
                params: { adminId: data.id.toString() }
              })
              .catch(err => {
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
      if (err instanceof ValidationError) {
        const validationError = err as ValidationError
        if (validationError.data?.length) {
          validationError.data.forEach(err => {
            // get message error
            switch (err.value) {
              case CreateEditAdminErrorValue.LoginName:
                this.createAdminError.loginName = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.loginName')
                ) as string
                break
              case CreateEditAdminErrorValue.Email:
                this.createAdminError.email = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.email')
                ) as string
                break
              case CreateEditAdminErrorValue.IsMaster:
                this.createAdminError.isMaster = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.isMaster')
                ) as string
                break
              case CreateEditAdminErrorValue.Config:
                this.createAdminError.config = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.config')
                ) as string
                break
              default:
                break
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.create-admin-container {
  .item-master {
    margin-bottom: 12px;
  }
  .json-editor {
    padding: 10px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    ::v-deep .pure-button {
      height: 32px;
    }
  }
  .item-config {
    ::v-deep .el-form-item__label {
      float: none;
    }
  }
}
</style>
