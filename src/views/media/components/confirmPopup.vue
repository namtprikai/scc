<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    top="0"
  >
    <template>
      <div v-for="(item, index) in confirmData" v-bind:key="index">
        <div class="section-title">{{ item }}</div>
      </div>
    </template>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
      <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface ConfirmData {
  key: string
  value: string
  type?: string
}

// interface ConfirmDataSection {
//   sectionTitle: string
//   sectionData: ConfirmData[]
// }

export type ConfirmDialogData = ConfirmData[]

@Component({
  name: 'ConfirmPopup',
  components: {}
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true }) private confirmData!: ConfirmDialogData;
  // flag show/hide dialog
  @Prop({ default: () => false }) public dialogVisible!: boolean;
  // dialog title
  @Prop({ default: () => null }) private title!: string;

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
  ::v-deep .el-dialog__body {
    max-height: 70vh;
    overflow: auto;
  }

  .section-title {
    font-size: 16px;
    margin: 10px 0;
  }
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
    .cell {
      overflow: auto;
      div {
        max-height: 100px;
      }
    }
  }
  ::v-deep .text-right {
    text-align: right !important;
  }
  .json-format {
    white-space: pre;
  }
  ::v-deep .el-dialog {
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
    @media (max-width: 767px) {
      width: 100%;
    }
  }
}
</style>
