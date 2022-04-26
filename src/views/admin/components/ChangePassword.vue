<template>
  <div class="page-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.passwordModify") }}</span>
      </div>
      <el-form
        class="form-sm"
        ref="changePassForm"
        :rules="changPasswordRules"
        :model="changePassForm"
      >
        <el-form-item
          :error="changePassError.currentPassword"
          prop="currentPassword"
        >
          <el-input
            v-model="changePassForm.currentPassword"
            tabindex="1"
            type="password"
            :placeholder="$t('labelText.currentPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item :error="changePassError.newPassword" prop="newPassword">
          <el-input
            v-model="changePassForm.newPassword"
            tabindex="2"
            type="password"
            :placeholder="$t('labelText.newPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :error="changePassError.confirmPassword"
          prop="confirmPassword"
        >
          <el-input
            v-model="changePassForm.confirmPassword"
            type="password"
            tabindex="2"
            :placeholder="$t('labelText.confirmPassword')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" tabindex="5" @click="handleSubmit">{{
            $t("text.passwordModify")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError, ValidationType } from '@/utils/request'
import { changePasswordAdmin } from '@/api/admins'
import { ElForm } from 'element-ui/types/form'

interface IChangePasswordAdminItem {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface IChangePasswordAdminError {
  currentPassword: string | null
  newPassword: string | null
  confirmPassword: string | null
}

@Component({
  name: 'ChangePasswordAdmin',
  components: {
    JsonEditor
  }
})
export default class extends Vue {
  @Prop({ default: () => null }) private adminId!: number;

  private isSubmitForm = false;

  public changePassForm: IChangePasswordAdminItem = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  public changePassError: IChangePasswordAdminError = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  private validateConfirmPassword = (rule: any, value: string, callback: Function) => {
    if (this.changePassForm.newPassword !== this.changePassForm.confirmPassword) {
      callback(new Error(getValidationMessage(
        ValidationType.Confirmed,
        this.$t('labelText.confirmPassword')
      ) as string))
    } else {
      callback()
    }
  };

  private changPasswordRules = {
    currentPassword: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.currentPassword')
        ),
        trigger: 'blur'
      }
    ],
    newPassword: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.newPassword')
        ),
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.confirmPassword')
        ),
        trigger: 'blur'
      },
      { validator: this.validateConfirmPassword, trigger: 'blur' }
    ]
  };

  // reset validate message error
  private resetMessageValidate() {
    this.changePassError = {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null
    }
  }

  async handleSubmit() {
    (this.$refs.changePassForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.resetMessageValidate()
        const model: any = {
          password: this.changePassForm.currentPassword,
          new_password: this.changePassForm.newPassword
        }
        try {
          const { data } = await changePasswordAdmin(this.adminId, model)
          if (data) {
            // show modal create successfully
            this.$alert(this.$t('message.passwordResetSuccess') as string, '', {
              confirmButtonText: this.$t('text.ok') as string,
              type: 'success',
              center: true,
              callback: () => {
                this.changePassForm.currentPassword = ''
                this.changePassForm.newPassword = ''
                this.changePassForm.confirmPassword = ''
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
                  case 'password':
                    this.changePassError.currentPassword = getValidationMessage(
                      err.type[0],
                      this.$t('labelText.currentPassword')
                    ) as string
                    break
                  case 'new_password':
                    this.changePassError.newPassword = getValidationMessage(
                      err.type[0],
                      this.$t('labelText.newPassword')
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
    })
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  margin-bottom: 32px;
  .item-config {
    ::v-deep .el-form-item__label {
      float: none;
    }
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
  .width-full {
    width: 100%;
  }
  .mb-24 {
    margin-bottom: 24px;
  }
}
</style>
