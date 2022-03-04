<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="form login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t("text.appName") }}
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('labelText.username')"
          :name="$t('labelText.username')"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('labelText.password')"
          name="password"
          tabindex="2"
          @keyup.enter.native="login"
        />
        <span class="show-pwd" @click="showPassword">
          <svg-icon
            :name="passwordType === 'password' ? 'eye-off' : 'eye-on'"
          />
        </span>
      </el-form-item>
      <el-button
        :loading="isLoginFormSubmitting"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="login"
      >
        {{ $t("text.login") }}
      </el-button>
      <div>
        <el-link
          @click.native.prevent="toggleForgotPasswordForm"
          :underline="false"
          class="forgot-password-link"
          type="primary"
          >{{ $t("helpText.forgotPassword") }}</el-link
        >
      </div>
    </el-form>
    <el-form
      v-if="isShowForgotPasswordForm"
      ref="resetPasswordForm"
      :model="resetPasswordForm"
      :rules="resetPasswordRules"
      class="form reset-password-form"
      label-position="left"
    >
      <el-form-item
        :error="resetPasswordError.email"
        prop="email"
      >
        <el-input
          ref="email"
          v-model="resetPasswordForm.email"
          :placeholder="$t('helpText.inputAccountEmail')"
          name="email"
          type="text"
          tabindex="3"
        />
      </el-form-item>
      <el-button
        :loading="isForgetFormSubmitting"
        @click.native.prevent="resetPassword"
      >
        {{ $t("text.resetPasswordRequest") }}
      </el-button>
    </el-form>
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
@Component({
  name: 'Login'
})
export default class extends Vue {
  private passwordType = 'password';
  private isShowForgotPasswordForm = false;
  private isLoginFormSubmitting = false;
  private isForgetFormSubmitting = false;
  private redirect?: string;
  private otherQuery: Dictionary<string> = {};

  private loginForm = {
    username: '',
    password: ''
  };

  private resetPasswordForm = {
    email: ''
  };

  resetPasswordError: any = {
    email: ''
  };

  // Login rules
  private loginRules = {
    username: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.username')),
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.password')),
        trigger: 'blur'
      }
    ]
  };

  private resetPasswordRules = {
    email: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.email')),
        trigger: 'blur'
      }
    ]
  };

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  private showPassword() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
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

  private toggleForgotPasswordForm() {
    this.resetPasswordForm.email = ''
    this.resetPasswordError.email = ''
    this.isShowForgotPasswordForm = !this.isShowForgotPasswordForm
    if (this.isShowForgotPasswordForm) {
      this.$nextTick(() => {
        (this.$refs.email as Input).focus()
      })
    }
  }

  private login() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.isLoginFormSubmitting = true
        try {
          await AdminModule.Login(this.loginForm)
          this.$router
            .push({
              path: this.redirect || '/',
              query: this.otherQuery
            })
        } catch (error) {
          this.isLoginFormSubmitting = false
          if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
            this.$message({
              message: this.$tc('message.loginError'),
              type: 'error',
              duration: 5000
            })
          }
        }
      } else {
        return false
      }
    })
  }

  private resetPassword() {
    (this.$refs.resetPasswordForm as ElForm).validate(async(valid: boolean) => {
      this.resetPasswordError.email = ''
      if (valid) {
        this.isForgetFormSubmitting = true
        try {
          await AdminModule.ResetPassword(this.resetPasswordForm)
          this.$message({
            message: this.$tc('message.pleaseCheckEmail'),
            type: 'success',
            duration: 5000
          })
          // reset reset password form
          this.isForgetFormSubmitting = false
          this.isShowForgotPasswordForm = false
          this.resetPasswordForm.email = ''
        } catch (err) {
          this.isForgetFormSubmitting = false
          // check if error 422
          if (err instanceof ValidationError) {
            const validationError = err as ValidationError
            if (validationError.data?.length) {
              const emailError = validationError.data.find(
                x => x.value === 'email'
              )
              // get message error
              if (emailError && emailError?.type?.length) {
                this.resetPasswordError.email = getValidationMessage(emailError.type[0], this.$t('labelText.email'))
              }
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

<style lang="scss">
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

  .reset-password-form {
    .el-form-item {
      background: #fff;
      .el-input {
        width: 100%;
      }
      input {
        color: #454545;
        caret-color: #454545;
        padding: 12px 15px;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $loginBg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;
  .form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  .login-form {
    padding: 160px 35px 0;
  }
  .reset-password-form {
    padding: 0px 35px 0;
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
  .forgot-password-link {
    margin-bottom: 20px;
  }
}
</style>
