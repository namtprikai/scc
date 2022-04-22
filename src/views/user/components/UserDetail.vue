<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.userDetail") }}</span>
      </div>
      <el-form
        class="form-product"
        ref="updateForm"
        label-position="top"
        :model="userDataEdit"
        autocomplete="on"
        :rules="dataRules"
      >
        <el-form-item>
          <el-button
            type="primary"
            tabindex="8"
            :icon="
              userDataEdit.isEnabled
                ? 'el-icon-circle-close'
                : 'el-icon-circle-check'
            "
            @click="confirmEnabledOrDisabled(userDataEdit)"
            :disabled="
              !(
                (hasPolicyDisabled && userDataEdit.isEnabled) ||
                (hasPolicyEnabled && !userDataEdit.isEnabled)
              )
            "
            >{{
              userDataEdit.isEnabled ? $t("text.disable") : $t("text.enable")
            }}</el-button
          >
          <el-button
            type="warning"
            tabindex="8"
            icon="el-icon-unlock"
            @click="confirmUnlock(userId)"
            :disabled="!(hasPolicyUnlocked && userDataEdit.isLock)"
            >{{ $t("text.unlock") }}</el-button
          >
        </el-form-item>
        <el-form-item :label="$t('labelText.id')">
          <el-input v-model="userId" tabindex="1" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('labelText.created')">
          <el-date-picker
            class="width-full"
            type="date"
            v-model="userDataEdit.created"
            tabindex="2"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('labelText.modified')">
          <el-date-picker
            class="width-full"
            type="date"
            v-model="userDataEdit.modified"
            tabindex="3"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.userName')"
          :error="dataError.name"
          prop="name"
        >
          <el-input
            v-model="userDataEdit.name"
            @blur="userDataEdit.name = userDataEdit.name.trim()"
            tabindex="4"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('labelText.userEmail')"
          :error="dataError.email"
          prop="email"
        >
          <el-input
            v-model="userDataEdit.email"
            @blur="userDataEdit.email = userDataEdit.email.trim()"
            tabindex="4"
            autofocus
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            :label="$t('labelText.isMailauthCompleted')"
            v-model="userDataEdit.isMailauthCompleted"
            name="type"
            disabled
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            :label="$t('labelText.userIsAuto')"
            v-model="userDataEdit.isAuto"
            name="type"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('labelText.config')" :error="dataError.config">
          <div class="json-editor">
            <json-editor
              :objData="userDataEdit.config"
              v-model="userDataEdit.config"
              tabindex="7"
            ></json-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            tabindex="8"
            @click.native.prevent="confirmUserData"
            >{{ $t("text.update") }}</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmData"
      :title="$t('text.modifyScreenModalConfirmTitle')"
      @ok="handelUpdateUser"
    />
  </div>
</template>

<script lang="ts">
import { IUser } from '@/api/types'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import {
  detailUser,
  updateUser,
  unlockUser,
  enabledUser,
  disabledUser
} from '@/api/users'
import { mapKeys, isEqual, camelCase } from 'lodash'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError, ValidationType } from '@/utils/request'
import { ElForm } from 'element-ui/types/form'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { hasPolicy } from '@/utils/common'
import { UserErrorValue } from '../user-error-value'
@Component({
  name: 'UserDetail',
  components: {
    ConfirmDialog,
    JsonEditor
  }
})
export default class extends Vue {
  userData: IUser = {
    id: 0,
    name: '',
    email: '',
    config: {},
    isMailauthCompleted: false,
    isAuto: false,
    isEnabled: false,
    isLock: false,
    created: null,
    modified: null
  };

  userDataEdit: IUser = {
    id: 0,
    name: '',
    email: '',
    config: {},
    isMailauthCompleted: false,
    isAuto: false,
    isEnabled: false,
    isLock: false,
    created: null,
    modified: null
  };

  isFormSubmitting = false;
  confirmData: any = null;
  public confirmdialogVisible = false;
  public hasPolicyEnabled = false;
  public hasPolicyDisabled = false;
  public hasPolicyUnlocked = false;

  @Watch('userData')
  onUserDataChange() {
    this.userDataEdit = { ...this.userData }
  }

  @Watch('userId')
  onUserIdChange() {
    this.getdetailUser()
  }

  // Login rules
  public dataRules = {
    name: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.userName')
        ),
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.userEmail')
        ),
        trigger: 'blur'
      }
    ]
  };

  private dataError: any = {
    name: null,
    email: null,
    config: null
  };

  // reset validate message error
  public resetMessageValidate() {
    this.dataError = {
      name: null,
      email: null,
      config: null
    }
  }

  @Prop({ default: () => null }) private userId!: number;

  created() {
    this.getdetailUser()
    this.hasPolicyEnabled = hasPolicy('enable-user', 'post')
    this.hasPolicyDisabled = hasPolicy('disable-user', 'post')
    this.hasPolicyUnlocked = hasPolicy('lock-user', 'post')
  }

  // get user detail
  async getdetailUser() {
    try {
      const { data } = await detailUser(this.userId)
      this.userData = mapKeys(data, (v, k) => camelCase(k)) as IUser
      this.userData.config =
        this.userData.config == null ? {} : this.userData.config
      this.userData.isEnabled = !!this.userData.isEnabled
      this.userData.isLock = !!this.userData.isLock
      this.userData.isAuto = !!this.userData.isAuto
      this.userData.isMailauthCompleted = !!this.userData.isMailauthCompleted
    } catch (err) {}
  }

  // confirm data
  confirmUserData() {
    (this.$refs.updateForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = []
        if (!isEqual(this.userData, this.userDataEdit)) {
          // check name change
          if (!isEqual(this.userData.name, this.userDataEdit.name)) {
            this.confirmData.push({
              key: this.$t('labelText.userName'),
              value: this.userDataEdit.name
            })
          }
          // check email change
          if (!isEqual(this.userData.email, this.userDataEdit.email)) {
            this.confirmData.push({
              key: this.$t('labelText.userEmail'),
              value: this.userDataEdit.email
            })
          }
          // check config change
          if (!isEqual(this.userData.config, this.userDataEdit.config)) {
            this.confirmData.push({
              key: this.$t('labelText.config'),
              value: JSON.stringify(this.userDataEdit.config, undefined, 4),
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

  // submit update user
  async handelUpdateUser() {
    if (!this.confirmData?.length) {
      return
    }
    this.isFormSubmitting = true
    try {
      this.resetMessageValidate()
      await updateUser(this.userId, {
        name: this.userDataEdit.name.trim(),
        email: this.userDataEdit.email.trim(),
        config: this.userDataEdit.config
      })
      this.isFormSubmitting = false
      // show pop up success message
      this.$alert(this.$t('message.userModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      // set user origin data is user new data
      this.userData = { ...this.userDataEdit }
    } catch (err) {
      this.isFormSubmitting = false
      // check if error 422
      if (err instanceof ValidationError) {
        if (err.data?.length) {
          err.data.forEach((err) => {
            // get message error
            switch (err.value) {
              case UserErrorValue.Name:
                this.dataError.name = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.userName')
                ) as string
                break
              case UserErrorValue.Email:
                this.dataError.email = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.userEmail')
                ) as string
                break
              case UserErrorValue.Config:
                this.dataError.config = getValidationMessage(
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

  public async confirmUnlock(userId: number) {
    try {
      await unlockUser(userId)
      this.getdetailUser()
    } catch {}
  }

  public async confirmEnabledOrDisabled(item: IUser) {
    this.$confirm(
      !item.isEnabled
        ? this.$tc('helpText.userEnableAsk')
        : this.$tc('helpText.userDisableAsk'),
      {
        confirmButtonText: this.$tc('text.ok'),
        cancelButtonText: this.$tc('text.cancel'),
        type: 'warning'
      }
    )
      .then(async() => {
        try {
          !item.isEnabled
            ? await enabledUser(this.userId)
            : await disabledUser(this.userId)
          this.getdetailUser()
        } catch (err) {
          if (err instanceof ValidationError) {
            const validationError = err as ValidationError
            if (validationError.data?.length) {
              validationError.data.forEach((err) => {
                // get message error
                switch (err.value) {
                  case 'user_id':
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
}
</script>
<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
.form-sm {
  width: 50%;
  @media only screen and (max-width: 991px) {
    width: 100%;
  }
}
.json-editor {
  padding: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
