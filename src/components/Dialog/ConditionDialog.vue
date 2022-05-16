<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
  >
    <el-row :gutter="24">
      <el-col :span="24" class="input-label">
        <span>{{ $t('text.directEditConditionGroupLabel') }}</span>
      </el-col>
      <el-col :span="24">
        <el-input placeholder="Please input" v-model="conditionEdit.text"></el-input>
      </el-col>
      <el-col :span="24" class="input-label">
        <span>{{ $t('text.directEditConditionGroupMemo') }}</span>
      </el-col>
      <el-col :span="24">
        <div class="json-editor">
          <json-editor
            :objData="conditionEdit.config"
            v-model="conditionEdit.config"
            tabindex="7"
          />
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
      <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'

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

  get visible() {
    return this.dialogVisible
  }

  set visible(value) {
    this.$emit('update:dialogVisible', false)
  }

  // click button
  ok() {
    this.visible = false
    this.$emit('ok', this.conditionEdit)
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
</style>
