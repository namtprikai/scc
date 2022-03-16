<template>
  <div class="login-container">
    <el-form
      ref="changePasswordForm"
      :model="changePasswordForm"
      :rules="changPasswordRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item
        prop="password"
        :error="changePasswordError.password" >
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="changePasswordForm.password"
            :type="passwordType"
            :placeholder="$t('labelText.newPassword')"
            name="password"
            tabindex="2"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleChangePassword"
          />
        </el-form-item>
      </el-tooltip>
      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="confirmPassword">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="confirmPassword"
            v-model="changePasswordForm.confirmPassword"
            :type="passwordType"
            :placeholder="$t('labelText.confirmPassword')"
            name="confirmPassword"
            tabindex="2"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleChangePassword"
          />
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleChangePassword"
      >
        {{ $t('text.passwordReset') }}
      </el-button>
    </el-form>
    <div>
        <el-dialog
          :visible="this.dialogVisible"
          width="30%"
          >
          <span>{{$t('message.passwordResetSuccess')}} </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="this.redirectLogin">OK</el-button>
          </span>
        </el-dialog>
    </div>
  </div>

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { AdminModule } from '@/store/modules/admin'
import { ValidationType, ValidationError, APIErrorCode, APIError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { removeAcToken, removeRfToken } from '@/utils/cookies'

@Component({
  name: 'ChangPassword'
})
export default class extends Vue {
  private changePasswordForm = {
    password: '',
    confirmPassword: ''
  }

  private validateConfirmPassword = (rule: any, value: string, callback: Function) => {
    if (this.changePasswordForm.password !== value) {
      callback(new Error('確認パスワードが一致しません'))
    } else {
      callback()
    }
  }

  private changPasswordRules = {
    password: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.newPassword')),
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.confirmPassword')),
        trigger: 'blur'
      },
      { validator: this.validateConfirmPassword, trigger: 'blur' }
    ]
  };

  changePasswordError: any = {
    password: ''
  };

  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private capsTooltip = false
  private isChangeFormSubmitting = false;
  private redirect?: string
  private otherQuery: Dictionary<string> = {};
  private hashParams: any = this.$route.params;
  private dialogVisible = false;

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.changePasswordForm.password === '') {
      (this.$refs.password as Input).focus()
    } else if (this.changePasswordForm.confirmPassword === '') {
      (this.$refs.confirmPassword as Input).focus()
    }
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e
    this.capsTooltip = key !== null && key.length === 1 && (key >= 'A' && key <= 'Z')
  }

  private redirectLogin() {
    removeAcToken()
    removeRfToken()
    this.$router
      .push({
        path: '/login'
      })
  }

  private handleChangePassword() {
    (this.$refs.changePasswordForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.isChangeFormSubmitting = true
        try {
          const { password } = this.changePasswordForm
          const hash = this.hashParams.hash
          await AdminModule.ChangePassword({ password: password, hash: hash })
          this.dialogVisible = true
        } catch (error) {
          this.isChangeFormSubmitting = false
          if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
            this.$message({
              message: this.$tc('message.loginError'),
              type: 'error',
              duration: 5000
            })
          }
          if (error instanceof ValidationError) {
            const validationError = error as ValidationError
            if (validationError.data?.length) {
              const passwordError = validationError.data.find(
                x => x.value === 'password'
              )
              // get message error
              if (passwordError && passwordError?.type?.length) {
                this.changePasswordError.password = getValidationMessage(passwordError.type[0], this.$t('labelText.newPassword'))
              }
            }
          }
        }
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input { color: $loginCursorColor; }
    input::first-line { color: $lightGray; }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  ::v-deep .el-dialog__body,
  ::v-deep .el-dialog__footer{
    text-align: center;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
