<template lang="">
  <el-dialog
   :title="title"
   :visible.sync="confirmdialogVisible"
   :before-close="closeModal"
   class="confirmed-dialog">
      <el-table :show-header="false" :data="confirmData" style="width: 100%">
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
                <pre v-if="row.type === 'json'">
                    <div>{{row.value}}</div>
                </pre>
                <span v-else>{{ row.value }}</span>
            </template>
        </el-table-column>
        </el-table>
      <span slot="footer" class="dialog-footer flex-center">
        <el-button @click="closeModal()">{{ $t("text.cancel") }}</el-button>
        <el-button type="primary" @click="submit()">{{$t("text.ok")}}</el-button>
      </span>
    </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'ConfirmAdmin',
  components: {}
})
export default class extends Vue {
  @Prop({ default: () => null }) private confirmData!: any;
  @Prop({ default: () => false }) private confirmdialogVisible!: boolean;
  @Prop({ default: () => null }) private title!: string;
  @Prop({ default: () => 25 }) private keyColumnWidth!: string;
  @Prop({ default: () => 75 }) private valueColumnWidth!: string;

  get visible() {
    return this.confirmdialogVisible
  }

  set visible(value) {
    this.$emit('update:confirmdialogVisible', value)
  }

  closeModal() {
    this.visible = false
  }

  submit() {
    this.closeModal()
    this.$emit('ok')
  }
}
</script>
<style lang="scss" scoped>
.confirmed-dialog {
  ::v-deep .el-dialog__header{
      text-align: center;
  }
  ::v-deep .el-dialog__body{
      padding: 0 20px;
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
  }
  ::v-deep .text-right {
    text-align: right !important;
  }
}
</style>
