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
      <el-col :span="18" v-if="data.type === 'array' && data.value && data.key === 'keywords'" style="padding: 0 10px;">
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
      <el-col :span="18" v-else-if="data.value && data.key === 'answer'" style="padding: 0 10px;">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Show all text" name="1">
            {{ data.value }}
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="24" v-else-if="data.type === 'array' && data.value && data.key === 'scenario'" style="padding: 20px 40px;">
        <div class="scenario" v-html="handleScenario(data.value, 0)"></div>
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

interface ConfirmData {
  key: string
  label: string
  value: string
  type?: string
}

interface ConfirmDataSection {
  sectionTitle: string
  sectionData: ConfirmData[]
}

export type ConfirmDialogData = ConfirmData | ConfirmDataSection

@Component({
  name: 'ConfirmDialogDirect',
  components: {}
})
export default class extends Vue {
  // confirmdata
  @Prop({ default: () => null, required: true }) private confirmData!: ConfirmDialogData[];
  // flag multiple section
  //   @Prop({ default: () => false }) public isMultipleSection!: boolean;
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

  // get html scenario tree
  handleScenario(dataConditions: any, widthDiv: number) {
    let html = ''
    widthDiv += 15
    for (let i = 0; i < dataConditions.length; i++) {
      if (dataConditions[i].status_handle) {
        html += "<div class='scenario-tag' style='padding-left: " +
          widthDiv +
          "px; min-height: 25px; margin-bottom: 5px'>" +
          "<div style='width: 100%; border: 2px solid #ff4949; padding: 3px 5px; line-height: 23px; border-radius: 3px;'>" +
          dataConditions[i].label +
          '</div></div>'
      } else {
        html += "<div class='scenario-tag' style='padding-left: " +
          widthDiv +
          "px; min-height: 25px; margin-bottom: 5px'>" +
          "<div style='width: 100%; border: 1px solid #999; padding: 3px 5px; line-height: 23px; border-radius: 3px;'>" +
          dataConditions[i].label +
          '</div></div>'
      }
      if (dataConditions[i].conditions) {
        html += this.handleScenario(dataConditions[i].conditions, widthDiv)
      } else if (dataConditions[i].condition_group) {
        const newArray = Array(dataConditions[i].condition_group)
        html += this.handleScenario(newArray, widthDiv)
      } else {
        continue
      }
    }
    return html
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
