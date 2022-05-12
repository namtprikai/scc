<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-delete-dialog"
    top="0"
  >
    <template>
      <div class="confirm-data">
        <div class="item" v-for="(item, index) in confirmData" :key="index">{{ item }}</div>
      </div>
      <div class="confirm-delete">
        <div class="title">{{ $t("text.keywordModalContent") }}</div>
        <el-input v-model="confirmText" />
      </div>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
      <el-button :disabled="!checkMatchText" type="primary" @click="ok">{{
        $t("text.ok")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface DeleteItem {
  label: string
}

@Component({
  name: 'KeyWordConfirmDelete',
  components: {}
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true })
  private confirmData!: DeleteItem[];

  // flag show/hide dialog
  @Prop({ default: () => false }) public dialogVisible!: boolean;
  // dialog title
  @Prop({ default: () => null }) private title!: string;
  private confirmText = '';

  private get checkMatchText() {
    return this.confirmText === this.$t('text.delete')
  }

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
.confirmed-delete-dialog {
  ::v-deep .el-dialog__body {
    max-height: 70vh;
    overflow: auto;
    padding: 0px 20px;
  }
  .confirm-data {
    padding:0px  20px 20px 20px;
    max-height: 40vh;
    overflow: auto;
    .item{
        padding: 5px 0px;
    }
  }
  .confirm-delete {
    border-top: 1px solid #dcdfe6;
    padding-top: 20px;
    .title {
      margin-bottom: 20px;
    }
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-dialog {
    top: 50%;
    transform: translateY(-50%);
    width: 30%;
    @media (max-width: 767px) {
      width: 100%;
    }
  }
}
</style>
