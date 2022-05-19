<template>
  <div>
    <el-form
      v-show="!!questionForm"
      :model="questionForm"
      :rules="rules"
      ref="questionForm"
      label-width="120px"
      class="questionForm box-padding"
    >
      <el-form-item :label="$t('labelText.directEditPublic')" prop="name">
        <el-switch v-model="questionForm.isPublic" />
      </el-form-item>
      <el-form-item
        :label="$t('labelText.directEditQuestionTitle')"
        prop="name"
      >
        <el-input v-model="questionForm.title"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.directEditQuestionLabel')"
        prop="name"
      >
        <el-input v-model="questionForm.label"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('labelText.userConfig')"
        class="item-config"
      >
        <div class="json-editor">
          <json-editor
            :options="{
              confirmText: $t('text.ok'),
              cancelText: $t('text.cancel')
            }"
            :objData="questionForm.config"
            v-model="questionForm.config"
            tabindex="4"
          ></json-editor>
        </div>
      </el-form-item>

      <div class="detail">
        <div class="keywork box-padding">
          <p class="lable">
            {{ $t("labelText.directEditKeywork") }}
          </p>
          <div class="group">
            <draggable-select
              v-if="questionForm.keyworks"
              class="input-tags rounded-4 border-input"
              v-model="questionForm.keyworks[0]"
            ></draggable-select>
            <el-button type="primary" class="btn-delete">{{
              $t("text.delete")
            }}</el-button>
          </div>
        </div>

        <div class="box-padding">
          <div class="radio">
            <el-radio v-model="isAnswer" label="1">
              {{ $t("labelText.directEditAnswer") }}
            </el-radio>
            <el-radio v-model="isAnswer" label="2">
              {{ $t("labelText.directEditScenario") }}
            </el-radio>
          </div>

          <tinymce
            ref="editor"
            v-model="questionForm.answer.text"
            :height="400"
          />
        </div>

        <div class="box-padding config">
          <span class="lable">{{ $t("labelText.userConfig") }}</span>
          <div class="json-editor">
            <json-editor
              :options="{
                confirmText: $t('text.ok'),
                cancelText: $t('text.cancel')
              }"
              :objData="questionForm.answer.config"
              v-model="questionForm.answer.config"
              tabindex="4"
            />
          </div>
        </div>
      </div>
    </el-form>
    <div class="bottom">
      <el-button type="primary" class="btn-deploy">{{$t('text.save')}}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Tinymce from '@/components/Tinymce/index.vue'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import DraggableSelect from '@/components/DraggableSelect/index.vue'
import { IDetailQuestion } from '@/api/types/question'

@Component({
  name: 'Form Quetion',
  components: {
    JsonEditor,
    Tinymce,
    DraggableSelect
  }
})
export default class extends Vue {
  questionForm: IDetailQuestion | null = null;

  @Watch('detailQuestion')
  onChangeQuestion() {
    this.questionForm = this.detailQuestion
  }

  @Prop({ default: null }) private detailQuestion!: IDetailQuestion;
}
</script>

<style lang="scss" scoped>
.questionForm {
  min-height: calc(100vh - 152px);
}

.detail {
  .top {
    .item-margin {
      div {
        display: flex;
        height: 56px;
      }
    }
    .left {
      div {
        justify-content: end;
      }
    }
    .right {
      .center {
        display: flex;
      }
    }
  }
  .keywork {
    .group {
      display: flex;
      .input-tags {
        flex: 1;
      }
      .btn-delete {
        margin-left: 15px;
        height: 36px;
      }
    }
  }
  .radio {
    margin-bottom: 15px;
  }
  .config {
    display: flex;
    span {
      padding-right: 15px;
    }
  }
}
.box-padding {
  padding: 10px;
}
.rounded-4 {
  border-radius: 4px;
}
.border-input {
  border: 1px solid rgb(220, 223, 230);
}
.json-editor {
  flex: 1;
  padding: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  ::v-deep .pure-button {
    height: 32px;
  }
}
.lable {
  font-size: 14px;
  color: #1f2d3d;
  font-weight: bold;
}
.bottom {
  padding: 15px;
  display: flex;
  justify-content: center;
}
</style>
