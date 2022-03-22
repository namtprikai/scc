<template>
  <div class="page-container ">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $t("text.roleDetail") }}</span>
      </div>
      <el-form
        ref="form"
        class="form-sm"
        label-position="top"
        :model="roleDataEdit"
        autocomplete="on"
        :rules="dataRules"
      >
        <el-form-item
          :error="dataError.label"
          :label="this.$t('labelText.roleLabel')"
          prop="label"
        >
          <el-input
            v-model="roleDataEdit.label"
            :name="$t('labelText.roleLabel')"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            :label="$t('labelText.roleIsLogin')"
            v-model="roleDataEdit.isLogin"
            name="type"
          />
        </el-form-item>
        <el-form-item :label="this.$t('labelText.created')">
          <el-date-picker
            class="w-100"
            type="date"
            disabled
            v-model="roleData.created"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="this.$t('labelText.modified')">
          <el-date-picker
            class="w-100"
            type="date"
            disabled
            v-model="roleData.modified"
          ></el-date-picker>
        </el-form-item>
        <el-button
          :loading="isFormSubmitting"
          type="primary"
          @click.native.prevent="confirmRoleData"
        >
          {{ $t("text.update") }}
        </el-button>
      </el-form>
    </el-card>
    <confirm-dialog
      :dialogVisible.sync="confirmdialogVisible"
      :confirmData="confirmData"
      :title="$t('text.modifyScreenModalConfirmTitle')"
      @ok="handelUpdateRole"
    />
  </div>
</template>

<script lang="ts">
import { IRole } from '@/api/types'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { detailRole, updateRole } from '@/api/roles'
import { mapKeys, isEqual, camelCase } from 'lodash'
import { getValidationMessage } from '@/utils/validate'
import { ValidationError, ValidationType } from '@/utils/request'
import { ElForm } from 'element-ui/types/form'
import ConfirmDialog from '@/components/ConfirmDialog/index.vue'
@Component({
  name: 'RoleDetail',
  components: {
    ConfirmDialog
  }
})
export default class extends Vue {
  roleData: IRole = {
    label: '',
    isLogin: false,
    created: null,
    modified: null
  };

  roleDataEdit: IRole = {
    label: '',
    isLogin: false,
    created: null,
    modified: null
  };

  isFormSubmitting = false;
  confirmData: any = null;
  public confirmdialogVisible = false;

  @Watch('roleData')
  onRoleDataChange() {
    this.roleDataEdit = { ...this.roleData }
  }

  @Watch('roleId')
  private onRoleIdChange() {
    this.getdetailRole()
  }

  // Login rules
  private dataRules = {
    label: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.roleLabel')
        ),
        trigger: 'blur'
      }
    ]
  };

  private dataError: any = {
    label: null
  };

  @Prop({ default: () => null }) private roleId!: number;

  created() {
    this.getdetailRole()
  }

  // get role detail
  async getdetailRole() {
    try {
      const { data } = await detailRole(this.roleId)
      this.roleData = mapKeys(data, (v, k) => camelCase(k)) as IRole
    } catch (err) {}
  }

  // confirm data
  confirmRoleData() {
    (this.$refs.form as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.confirmData = []
        if (!isEqual(this.roleData, this.roleDataEdit)) {
          // check label change
          if (!isEqual(this.roleData.label.trim(), this.roleDataEdit.label.trim())) {
            this.confirmData.push({
              key: this.$t('labelText.roleLabel'),
              value: this.roleDataEdit.label
            })
          }
          // check is login change
          if (!isEqual(this.roleData.isLogin, this.roleDataEdit.isLogin)) {
            this.confirmData.push({
              key: this.$t('labelText.roleIsLogin'),
              value: this.roleDataEdit.isLogin
                ? this.$t('text.roleIsLoginYes')
                : this.$t('text.roleIsLoginNo')
            })
          }
        }
        this.confirmdialogVisible = true
      } else {
        return false
      }
    })
  }

  // submit update role
  async handelUpdateRole() {
    if (!this.confirmData?.length) {
      return
    }
    this.isFormSubmitting = true
    try {
      await updateRole(this.roleId, {
        label: this.roleDataEdit.label.trim(),
        is_login: this.roleDataEdit.isLogin
      })
      this.isFormSubmitting = false
      // show pop up success message
      this.$alert(this.$t('message.roleModifySuccess') as string, '', {
        confirmButtonText: this.$t('text.ok') as string,
        type: 'success',
        center: true
      })
      // set role origin data is role new data
      this.roleData = { ...this.roleDataEdit }
    } catch (err) {
      this.isFormSubmitting = false
      // check if error 422
      if (err instanceof ValidationError) {
        if (err.data?.length) {
          const errors = err.data.find(
            x => x.value === 'label'
          )
          // get message error
          if (errors && errors?.type?.length) {
            this.dataError.label = getValidationMessage(
              errors.type[0],
              this.$t('labelText.roleLabel')
            )
          }
        }
      }
    }
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
</style>
