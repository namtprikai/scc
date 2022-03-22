<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    width="30%"
  >
    <el-table :show-header="false"
    :empty-text="$t('helpText.screenItemNothingChanged')"
     :data="confirmData" style="width: 100%">
      <el-table-column
        :minWidth="keyColumnWidth"
        class-name="text-right"
        prop="key"
      >
        <template slot-scope="{row}">
          <span>{{ row.key }}:</span>
        </template>
      </el-table-column>
      <el-table-column :minWidth="valueColumnWidth" prop="value">
        <template slot-scope="{row}">
        <div :class="{'json-format': row.type === 'json'}">{{row.value}}</div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
      <el-button type="primary"  @click="ok">{{
        $t("text.ok")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'ConfirmDialog',
  components: {}
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null }) private confirmData!: any;
  // flag show/hide dialog
  @Prop({ default: () => false }) public dialogVisible!: boolean;
  // dialog title
  @Prop({ default: () => null }) private title!: string;
  // custome with key column
  @Prop({ default: () => 25 }) private keyColumnWidth!: number;
  // custome with value column
  @Prop({ default: () => 75 }) private valueColumnWidth!: number;

  get visible() {
    return this.dialogVisible
  }

  set visible(value) {
    this.$emit('update:dialogVisible', false)
  }

  // click button
  ok() {
    this.visible = false
    this.$emit('ok')
  }

  // click button cancel
  cancel() {
    this.visible = false
    this.$emit('cancel')
  }
}
</script>
<style lang="scss" scoped>
.confirmed-dialog {
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ::v-deep td {
    border-bottom: 0px;
  }
  ::v-deep .el-table {
    &:before {
      height: 0px;
    }
    .cell{
        overflow: auto;
    }
  }
  ::v-deep .text-right {
    text-align: right !important;
  }
  .json-format{
      white-space: pre;
  }
}
</style>
