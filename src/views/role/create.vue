<template>
  <div class="sm-container">
    <el-form
      ref="createRoleForm"
      :model="createRoleForm"
      name="createRoleForm"
      class="login-form"
      autocomplete="on"
      label-position="left"
      :rules="labelRules"
    >
      <el-tooltip
        placement="right"
        manual
      >
        <el-form-item
        :error="createRoleError.label"
        :label="this.$t('labelText.roleLabel')"
        prop="label"
        >
          <span slot="label">{{ $t('labelText.roleLabel') }}</span>
          <el-input ref="label" v-model="createRoleForm.label" tabindex="1" autofocus></el-input>
        </el-form-item>
      </el-tooltip>
      <el-form-item>
        <el-checkbox v-model="createRoleForm.isLogin">{{ $t('labelText.roleIsLogin') }}</el-checkbox>
      </el-form-item>
      <el-button
        type="primary"
        @click="dialogVisible = false"
        @click.native.prevent="handleValiateForm"
      >
        {{ $t('text.submit') }}
      </el-button>
    </el-form>
    <div>
        <el-dialog
          :visible="this.dialogVisibleSuccess"
          width="30%"
          >
          <span>{{$t('message.roleCreateSuccess')}} </span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="redirectList">{{$t('text.ok')}}</el-button>
          </span>
        </el-dialog>

        <confirm-dialog
          :dialogVisible.sync="dialogVisible"
          :confirmData="confirmData"
          :title="$t('text.createScreenModalConfirmTitle')"
          @ok="handleCreateRole"
          keyColumnWidth="80"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { ValidationType, ValidationError, APIErrorCode, APIError } from '@/utils/request'
import { getValidationMessage } from '@/utils/validate'
import { RoleModule } from '@/store/modules/role'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'

@Component({
  name: 'RoleCreate',
  components: {
    ConfirmDialog
  }
})

export default class extends Vue {
  private isSubmitting = false;
  private dialogVisible = false;
  private dialogVisibleSuccess = false;
  private confirmData: any = null;

  private createRoleForm = {
    label: '',
    isLogin: true
  };

  private createRoleError:any = {
    label: ''
  }

  private labelRules = {
    label: [
      {
        required: true,
        message: getValidationMessage(ValidationType.Empty, this.$t('labelText.roleLabel')),
        trigger: 'blur'
      }
    ]
  };

  private handleValiateForm() {
    (this.$refs.createRoleForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        const isLoginText = this.createRoleForm.isLogin ? this.$t('text.roleIsLoginYes') : this.$t('text.roleIsLoginNo')
        this.confirmData = []
        this.confirmData.push({
          key: this.$t('labelText.roleLabel'),
          value: this.createRoleForm.label
        })
        this.confirmData.push({
          key: this.$t('labelText.roleIsLogin'),
          value: isLoginText
        })

        this.dialogVisible = true
      } else {
        return false
      }
    })
  }

  private handleCreateRole() {
    (this.$refs.createRoleForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.isSubmitting = true
        try {
          await RoleModule.Create(this.createRoleForm)
          this.dialogVisible = false
          this.dialogVisibleSuccess = true
        } catch (error) {
          this.isSubmitting = false
          this.dialogVisible = false
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
              const lableError = validationError.data.find(
                x => x.value === 'label'
              )
              // get message error
              if (lableError && lableError?.type?.length) {
                this.createRoleError.label = getValidationMessage(
                  lableError.type[0],
                  this.$t('labelText.roleLabel')
                )
              }
            }
          }
        }
      } else {
        return false
      }
    })
  }

  private redirectList() {
    this.$router
      .push({
        path: '/roles'
      })
  }

  private handleClose() {
    this.dialogVisible = false
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: block;
  text-align: center;
}
.el-dialog__header{
  text-align: center;
}

.modal--submit{
  .modal__item {
    display: block;
    margin-top: 10px;

    span.label{
      width: 100px;
      display: inline-block;
      text-align: right;
    }

    span {
      padding: 0 5px;
    }
  }
}

::v-deep .el-dialog__title {
    text-align: center;
    display: block;
}
</style>
