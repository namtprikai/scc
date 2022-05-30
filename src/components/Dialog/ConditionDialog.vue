<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
  >
    <el-form
      class="form-product"
      ref="createForm"
      label-position="top"
      :rules="editRules"
      :model="conditionEdit"
    >
      <el-form-item
        :label="$t('text.directEditConditionGroupLabel')"
        prop="text"
      >
        <el-input
          v-model="conditionEdit.text"
          tabindex="1"
          autofocus
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('text.directEditConditionGroupMemo')"
        prop="config"
      >
        <div class="json-editor">
          <json-editor
            :objData="conditionEdit.config"
            v-model="conditionEdit.config"
            tabindex="7"
          />
        </div>
      </el-form-item>
      <el-form-item class="group-button">
          <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
          <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import { getValidationMessage } from '@/utils/validate'
import { ValidationType } from '@/utils/request'

@Component({
  name: 'ConditionDialog',
  components: {
    JsonEditor
  }
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null }) private conditionEdit!: any;
  // flag show/hide dialog
  @Prop({ default: () => false }) public dialogVisible!: boolean;
  // dialog title
  @Prop({ default: () => null }) private title!: string;

  @Watch('conditionEdit')

  private editRules = {
    text: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('text.directEditConditionGroupLabel')
        ),
        trigger: 'blur'
      }
    ]
  }

  get visible() {
    return this.dialogVisible
  }

  set visible(value) {
    this.$emit('update:dialogVisible', false)
  }

  // click button
  ok() {
    if (this.conditionEdit.text) {
      this.visible = false
      this.$emit('ok', this.conditionEdit)
    }
  }

  // click button cancel
  cancel() {
    this.visible = false
    this.$emit('cancel')
  }
}
</script>
<style lang="scss" scoped>
  .json-editor {
    padding: 10px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .input-label {
    margin: 10px 0 !important;
  }
  .group-button {
    display: flex;
    justify-content: center;
  }
</style>
