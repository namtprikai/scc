<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    top="0"
  >
    <template v-if="isMultipleSection">
      <div v-for="(item, index) in confirmData" v-bind:key="index">
        <div class="section-title">{{ item.sectionTitle }}</div>
        <el-table
          :show-header="false"
          :empty-text="$t('helpText.screenItemNothingChanged')"
          :data="item.sectionData"
          style="width: 100%"
        >
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
              <div :class="{'json-format': row.type === 'json'}">
                {{ row.value }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-else>
      <el-table
        :show-header="false"
        :empty-text="$t('helpText.screenItemNothingChanged')"
        :data="confirmData"
        style="width: 100%"
      >
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
            <div :class="{'json-format': row.type === 'json'}">
              {{ row.value }}
            </div>
          </template>
        </el-table-column>
      </el-table>
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

interface ConfirmDataSection {
  sectionTitle: string
  sectionData: ConfirmData[]
}

export type ConfirmDialogData = ConfirmData | ConfirmDataSection

@Component({
  name: 'ConfirmDialog',
  components: {}
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true }) private confirmData!: ConfirmDialogData[];
  // flag multiple section
  @Prop({ default: () => false }) public isMultipleSection!: boolean;
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
