<template>
  <div class="create-user-container container">
    <el-form ref="createForm" :rules="createRules" :model="userData">
      <el-form-item
        :label="$t('labelText.userName')"
        :error="createUserError.name"
        prop="name"
      >
        <el-input v-model="userData.name" tabindex="1" autofocus></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.userEmail')"
        :error="createUserError.email"
        prop="email"
      >
        <el-input v-model="userData.email" tabindex="2"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.userConfig')"
        :error="createUserError.config"
        class="item-config"
      >
        <div class="json-editor">
          <json-editor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="userData.config"
            v-model="userData.config"
            tabindex="4"
          ></json-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="isFormSubmitting"
          type="primary"
          tabindex="5"
          @click="showConfirmModal"
          >{{ $t("text.submit") }}</el-button
        >
      </el-form-item>
    </el-form>
    <confirm-dialog
      :title="$t('text.createScreenModalConfirmTitle')"
      :dialogVisible.sync="dialogFormVisible"
      :confirmData="confirmData"
      :keyColumnWidth="40"
      :valueColumnWidth="60"
      @ok="handleSubmit"
    >
    </confirm-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError, ValidationType } from '@/utils/request'
import { createUser } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
import { IUserCreate } from '@/api/types'

// error data
interface ICreateUserError {
  name: string | null
  email: string | null
  config: string | null
}
// key validation error
export enum CreateUserErrorValue {
  Name = 'name',
  Email = 'email',
  Config = 'config'
}

@Component({
  name: 'CreateUser',
  components: {
    JsonEditor,
    ConfirmDialog
  }
})
export default class extends Vue {
  private dialogFormVisible = false;
  private confirmData: any = [];
  private isFormSubmitting = false;
  public userData: IUserCreate = {
    name: '',
    email: '',
    config: {}
  };

  public createUserError: ICreateUserError = {
    name: '',
    email: '',
    config: ''
  };

  // validation rules
  private createRules = {
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

  // reset validate message error
  public resetMessageValidate() {
    this.createUserError = {
      name: null,
      email: null,
      config: null
    }
  }

  // show confirm modal
  private async showConfirmModal() {
    (this.$refs.createForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = [
          { key: this.$t('labelText.userName'), value: this.userData.name },
          { key: this.$t('labelText.userEmail'), value: this.userData.email },
          {
            key: this.$t('labelText.userConfig'),
            value: JSON.stringify(this.userData.config, null, 4),
            type: 'json'
          }
        ]
        this.dialogFormVisible = true
      }
    })
  }

  // submit add user
  async handleSubmit() {
    this.resetMessageValidate()
    try {
      this.isFormSubmitting = true
      const { data } = await createUser({ ...this.userData, name: this.userData.name.trim(), email: this.userData.email.trim() })
      if (data) {
        this.isFormSubmitting = false
        // show modal create successfully
        this.$alert(this.$t('message.userCreateSuccess') as string, '', {
          confirmButtonText: this.$t('text.ok') as string,
          type: 'success',
          center: true,
          callback: () => {
            // redirect to edit admin
            this.$router
              .push({
                name: 'DetailEditUser',
                params: { userId: data.id.toString() }
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
      this.isFormSubmitting = false
      //   check validation
      if (err instanceof ValidationError) {
        const validationError = err as ValidationError
        if (validationError.data?.length) {
          validationError.data.forEach(err => {
            // get message error
            switch (err.value) {
              case CreateUserErrorValue.Name:
                this.createUserError.name = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.userName')
                ) as string
                break
              case CreateUserErrorValue.Email:
                this.createUserError.email = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.userEmail')
                ) as string
                break
              case CreateUserErrorValue.Config:
                this.createUserError.config = getValidationMessage(
                  err.type[0],
                  this.$t('labelText.userConfig')
                ) as string
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
.create-user-container {
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
