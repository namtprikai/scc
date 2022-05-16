<template lang="">
  <el-dialog
    :title="title"
    :visible.sync="visible"
    class="confirmed-dialog"
    center
    top="0"
  >
    <el-row v-for="data in confirmData" :key="data.key" style="margin-bottom: 20px">
      <el-col :span="6" style="text-align: right; padding: 0 10px;">{{ data.label }}:</el-col>
      <el-col :span="18" v-if="Array.isArray(data.value) && data.key === 'keywords'" style="padding: 0 10px;">
        <div v-for="(keywords, indexKeywords) in data.value" :key="indexKeywords" class="tag-group keyword-group">
            <el-tag
                v-for="(keyword, indexKeyword) in keywords"
                :key="indexKeyword"
                type="primary"
                class="keyword"
                size="small"
                effect="dark">
                {{ keyword }}
            </el-tag>
        </div>
      </el-col>
      <el-col :span="18" v-else-if="data.key === 'answer'" style="padding: 0 10px;">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Show all text" name="1">
            {{ data.value }}
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24" v-else-if="typeof(data.value) === 'object' && data.key === 'scenario'" style="padding: 20px 40px;">
        <tree :treeData="data.value"></tree>
      </el-col>
      <el-col :span="18" v-else-if="data.key === 'is_public' && typeof(data.value) === 'boolean'">
        {{ data.value ? $t("text.directEditPublicYes") : $t("text.directEditPublicNo") }}
      </el-col>
      <el-col :span="18" v-else style="padding: 0 10px;">
        {{ data.value }}
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer flex-center">
      <el-button @click="cancel">{{ $t("text.cancel") }}</el-button>
      <el-button type="primary" @click="ok">{{ $t("text.ok") }}</el-button>
    </span>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Tree from '@/components/Condition/Tree.vue'

interface ConfirmData {
  key: string
  label: string
  value: string
}

interface ConfirmDataSection {
  sectionTitle: string
  sectionData: ConfirmData[]
}

export type ConfirmDialogData = ConfirmData | ConfirmDataSection

@Component({
  name: 'ConfirmDialogDirect',
  components: {
    Tree
  }
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true }) private confirmData!: ConfirmDialogData[];
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

  .scenario {
    padding: 20px 40px;
    max-height: 500px;
    overflow: auto;
    border: 1px solid #e6ebf5;
    margin-top: 20px;
    border-radius: 5px;
  }
  ::v-deep .el-dialog {
    top: 50%;
    transform: translateY(-50%);
    width: 40%;
    @media (max-width: 767px) {
      width: 100%;
    }
  }
  .keyword-group {
      border-bottom: 1px solid #e6ebf5;
      padding: 5px 0;
      .keyword {
          margin: 5px;
      }
  }
}
</style>
