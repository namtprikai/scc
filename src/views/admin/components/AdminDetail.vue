<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.adminDetail") }}</span>
      </div>
      <div class="form-sm mb-24">
        <el-button
          type="primary"
          tabindex="1"
          @click="confirmEnabledOrDisabled(updateForm.isEnabled)"
          :disabled="
            !(
              (hasPolicyDisabled && updateForm.isEnabled) ||
              (hasPolicyEnabled && !updateForm.isEnabled)
            )
          "
          :icon="
            updateForm.isEnabled
              ? 'el-icon-circle-close'
              : 'el-icon-circle-check'
          "
          >{{
            updateForm.isEnabled ? $t("text.disable") : $t("text.enable")
          }}</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-unlock"
          @click="confirmUnlock()"
          :disabled="isDisableUnlockBtn"
          tabindex="2"
        >
          {{ $t("text.unlock") }}
        </el-button>
      </div>
      <el-form
        class="form-sm"
        ref="updateForm"
        :rules="updateRules"
        :model="updateForm"
        label-position="top"
      >
        <el-form-item :label="$t('labelText.id')">
          <el-input v-model="updateForm.id" tabindex="3" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('labelText.created')">
            <el-date-picker
              class="width-date"
              type="date"
              v-model="updateForm.created"
              tabindex="4"
              disabled
            ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('labelText.modified')">
            <el-date-picker
              class="width-date"
              type="date"
              v-model="updateForm.modified"
              tabindex="5"
              disabled
            ></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.loginName')"
          :error="updateAdminError.loginName"
          prop="name"
        >
          <el-input v-model="updateForm.name" tabindex="6"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.email')"
          :error="updateAdminError.email"
          prop="email"
        >
          <el-input v-model="updateForm.email" tabindex="7"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            :label="$t('labelText.isMailauthCompleted')"
            v-model="updateForm.isMailauthCompleted"
            name="type"
            tabindex="8"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="isMaster">
          <el-checkbox
            :label="$t('labelText.isMasterAdmin')"
            v-model="updateForm.isMaster"
            name="type"
            tabindex="9"
            class="item-master"
          />
        </el-form-item>
        <el-form-item
          :label="$t('labelText.config')"
          :error="updateAdminError.config"
          class="item-config"
        >
          <div class="json-editor">
            <json-editor
              :options="{
                confirmText: $t('text.ok'),
                cancelText: $t('text.cancel')
              }"
              :objData="updateForm.config"
              v-model="updateForm.config"
              tabindex="10"
            ></json-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" tabindex="11" @click="showModal">{{
            $t("text.modify")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <confirm-dialog
      :title="$t('text.modifyScreenModalConfirmTitle')"
      :dialogVisible.sync="dialogFormVisible"
      :confirmData="confirmData"
      @ok="handleSubmit"
    >
    </confirm-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError, ValidationType } from '@/utils/request'
import { isMasterAdmin, hasPolicy, isLoggedInAdmin } from '@/utils/common'
import {
  disabledAdmin,
  enabledAdmin,
  getDetailAdmin,
  unlockAdmin,
  editAdmin
} from '@/api/admins'
import { ElForm } from 'element-ui/types/form'
import { CreateEditAdminErrorValue } from '../type'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { camelizeKeys, snakeKeys } from '@/utils/parse'
import { isEqual } from 'lodash'
import { AdminModule } from '@/store/modules/admin'

interface IUpdateAdminItem {
  id: string
  created: string
  modified: string
  name: string
  email: string
  isMailauthCompleted: boolean
  isMaster: boolean
  isEnabled: boolean
  isLock: boolean
  config: object
}

interface IUpdateAdminError {
  loginName: string | null
  email: string | null
  isMaster: string | null
  config: string | null
}

@Component({
  name: 'AdminDetail',
  components: {
    JsonEditor,
    ConfirmDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private adminId!: number;
  private isMaster = false;
  private dialogFormVisible = false;
  private isSubmitForm = false;
  private confirmData: any = [];
  private hasPolicyEnabled = false;
  private hasPolicyDisabled = false;
  private hasPolicyUnlocked = false;
  private hasPolicyCreatedAdmin = false;
  private hasPolicyGetProducts = false;
  private isDisableUnlockBtn = false;
  private isEditEmail = false;

  private updateForm: IUpdateAdminItem = {
    id: '',
    created: '',
    modified: '',
    name: '',
    email: '',
    isMailauthCompleted: false,
    isMaster: false,
    isEnabled: false,
    isLock: false,
    config: {}
  };

  private adminDataOld: IUpdateAdminItem = {
    id: '',
    created: '',
    modified: '',
    name: '',
    email: '',
    isMailauthCompleted: false,
    isMaster: false,
    isEnabled: false,
    isLock: false,
    config: {}
  };

  private updateAdminError: IUpdateAdminError = {
    loginName: '',
    email: '',
    isMaster: '',
    config: ''
  };

  private updateRules = {
    name: [
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

  created() {
    this.isMaster = isMasterAdmin()
    this.hasPolicyEnabled = hasPolicy('enable-admin', 'post')
    this.hasPolicyDisabled = hasPolicy('disable-admin', 'post')
    this.hasPolicyUnlocked = hasPolicy('unlock-admin', 'post')
    this.hasPolicyGetProducts = hasPolicy('get-list-create-product', 'get')
    this.getAdminInfo(this.adminId)
  }

  private async getAdminInfo(id: number) {
    try {
      const { data } = await getDetailAdmin(id)
      const admin = camelizeKeys(data)
      admin.isMailauthCompleted = admin.isMailauthCompleted === 1
      admin.isMaster = admin.isMaster === 1
      admin.isEnabled = admin.isEnabled === 1
      admin.isLock = admin.isLock === 1
      this.updateForm = admin
      this.adminDataOld = Object.assign({}, this.updateForm)
      this.isDisableUnlockBtn =
        !this.hasPolicyUnlocked || !this.updateForm.isLock
    } catch (err) {}
  }

  // reset validate message error
  public resetMessageValidate() {
    this.updateAdminError = {
      loginName: null,
      email: null,
      isMaster: null,
      config: null
    }
  }

  private async confirmUnlock() {
    try {
      await unlockAdmin(this.adminId)
      this.getAdminInfo(this.adminId)
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationError = err as ValidationError
        if (validationError.data?.length) {
          validationError.data.forEach(err => {
            // get message error
            switch (err.value) {
              case 'admin_id':
                this.$message({
                  message: getValidationMessage(err.type[0]) as string,
                  type: 'error',
                  duration: 2000
                })
                break
              default:
                break
            }
          })
        }
      }
    }
  }

  private async confirmEnabledOrDisabled(isEnabled: boolean) {
    this.$confirm(
      !isEnabled
        ? this.$tc('helpText.adminEnableAsk')
        : this.$tc('helpText.adminDisableAsk'),
      {
        confirmButtonText: this.$tc('text.ok'),
        cancelButtonText: this.$tc('text.cancel'),
        type: 'warning'
      }
    )
      .then(async() => {
        try {
          !isEnabled
            ? await enabledAdmin(this.adminId)
            : await disabledAdmin(this.adminId)
          this.getAdminInfo(this.adminId)
        } catch (err) {
          if (err instanceof ValidationError) {
            const validationError = err as ValidationError
            if (validationError.data?.length) {
              validationError.data.forEach(err => {
                // get message error
                switch (err.value) {
                  case 'admin_id':
                    this.$message({
                      message: getValidationMessage(err.type[0]) as string,
                      type: 'error',
                      duration: 2000
                    })
                    break
                  default:
                    break
                }
              })
            }
          }
        }
      })
      .catch(() => {
        //
      })
  }

  private async showModal() {
    (this.$refs.updateForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.isEditEmail = false
        this.confirmData = []
        if (!isEqual(this.updateForm, this.adminDataOld)) {
          // check name change
          if (!isEqual(this.updateForm.name, this.adminDataOld.name)) {
            this.confirmData.push({
              key: this.$t('labelText.loginName'),
              value: this.updateForm.name
            })
          }
          // check email change
          if (!isEqual(this.updateForm.email, this.adminDataOld.email)) {
            this.confirmData.push({
              key: this.$t('labelText.email'),
              value: this.updateForm.email
            })
            this.isEditEmail = true
          }
          // check change isMaster change
          if (!isEqual(this.updateForm.isMaster, this.adminDataOld.isMaster)) {
            this.confirmData.push({
              key: this.$t('labelText.isMasterAdmin'),
              value: this.updateForm.isMaster
                ? this.$t('text.adminIsMasterYes')
                : this.$t('text.adminIsMasterNo')
            })
          }
          // check config change
          if (!isEqual(this.updateForm.config, this.adminDataOld.config)) {
            this.confirmData.push({
              key: this.$t('labelText.config'),
              value: JSON.stringify(this.updateForm.config, undefined, 4),
              type: 'json'
            })
          }
        }
        this.dialogFormVisible = true
      }
    })
  }

  async handleSubmit() {
    this.resetMessageValidate()
    const model: any = snakeKeys(this.updateForm)
    try {
      const { data } = await editAdmin(this.adminId, model)
      if (data) {
        // show modal create successfully
        this.$alert(this.$t('message.adminModifySuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            // logout if edit  own email
            if (this.isEditEmail && isLoggedInAdmin(this.adminId)) {
              AdminModule.LogOut()
              this.$router.push('/login')
            } else {
              this.getAdminInfo(data.id)
            }
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
                this.updateAdminError.loginName = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.loginName')
                ) as string
                break
              case CreateEditAdminErrorValue.Email:
                this.updateAdminError.email = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.email')
                ) as string
                break
              case CreateEditAdminErrorValue.IsMaster:
                this.updateAdminError.isMaster = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.isMaster')
                ) as string
                break
              case CreateEditAdminErrorValue.Config:
                this.updateAdminError.config = getValidationMessage(
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
.page-container {
  margin-bottom: 32px;
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
  ::v-deep .el-form-item .el-form-item__label {
    font-weight: 600;
  }
  .form-sm {
    width: 100%;
    @media only screen and (max-width: 991px) {
      width: 100%;
    }
  }
  .mr-20 {
    margin-right: 20px;
  }
  .width-date {
    width: 30%;
    @media only screen and (max-width: 991px) {
      width: 100%;
    }
  }
  .mb-24 {
    margin-bottom: 24px;
  }
}
</style>
