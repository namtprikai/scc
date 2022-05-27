<template>
  <div>
    <el-form
      v-show="!!questionForm"
      :model="questionForm"
      :rules="createRules"
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
        :label="$t('labelText.directEditPublic')"
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
        <div class="keywork">
          <p class="lable">
            {{ $t("labelText.directEditKeyword") }}
          </p>
          <div class="group">
            <tags-input
              v-for="(tags, index) in questionForm.keywords"
              :key="JSON.stringify(tags) + index"
              :values="tags"
              :index="index"
              @removeKeyword="removeKeyword"
              @updateKeyword="updateKeyword"
            ></tags-input>

            <div class="flex">
              <el-button type="primary" class="btn-delete" @click="addKeyword">{{
                $t("labelText.directEditAddGroup")
              }}</el-button>
            </div>
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
      <el-button type="primary" class="btn-deploy" @click="onOpenDialog">{{$t('text.save')}}</el-button>
    </div>

    <confirm-dialog-direct
      :title="$t('text.createScreenModalConfirmTitle')"
      :dialogVisible.sync="openDialog"
      :confirmData="confirmData"
      @ok="confirmCreateQuestion"
      @cancel="cancelCreateQuestion"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Tinymce from '@/components/Tinymce/index.vue'
import JsonEditor from '@/components/JsonEditorContent/JsonEditor.vue'
import TagsInput from '@/components/TagsInput/index.vue'
import { IDetailQuestion } from '@/api/types/question'
import { createQuestionAnswer, lockQuestion } from '@/api/questions'
import ConfirmDialogDirect from '@/components/ConfirmDialog/ConfirmDialogDirect.vue'
import { TranslateResult } from 'vue-i18n'
import { getValidationMessage } from '@/utils/validate'
import { ValidationType, APIErrorCode, APIError } from '@/utils/request'
// import { mapKeys, snakeCase, camelCase, isEqual } from 'lodash'

interface ConfirmData {
  key: keyof IDetailQuestion | 'public'
  label: TranslateResult
  value?: any
}

interface DataSelect {
  id: number
  type: string
}

@Component({
  name: 'FormQuestion',
  components: {
    JsonEditor,
    Tinymce,
    TagsInput,
    ConfirmDialogDirect
  }
})
export default class extends Vue {
  @Prop({ default: null }) private dataSelect!: DataSelect;
  @Prop({ default: () => null }) private categorySeleted!: any
  @Prop({ default: () => null }) private productId!: any

  questionForm: IDetailQuestion = {
    id: 0,
    title: '',
    label: '',
    isPublic: true,
    config: {},
    keywords: [],
    answer: {
      id: 0,
      text: '',
      config: {}
    }
  };

  dataQuestionOld: IDetailQuestion = {
    id: 0,
    title: '',
    label: '',
    isPublic: true,
    config: {},
    keywords: [],
    answer: {
      id: 0,
      text: '',
      config: {}
    }
  };

  isAnswer = '1';
  openDialog = false;
  isLoading = false;
  disabled = true;

  confirmData: ConfirmData[] = [
    {
      key: 'title',
      label: this.$t('labelText.questionTitle')
    },
    {
      key: 'label',
      label: this.$t('labelText.directEditPublic')
    },
    {
      key: 'public',
      label: this.$t('labelText.directEditPublic')
    },
    {
      key: 'keywords',
      label: this.$t('labelText.directEditKeyword')
    },
    {
      key: 'answer',
      label: this.$t('labelText.directEditAnswer')
    }
  ]

  private createRules = {
    title: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.directEditQuestionTitle')
        ),
        trigger: 'blur'
      }
    ],
    label: [
      {
        required: true,
        message: getValidationMessage(
          ValidationType.Empty,
          this.$t('labelText.userEmail')
        ),
        trigger: 'blur'
      }
    ]
  };

  @Watch('dataSelect')
  onChangeQuestion() {
    // this.questionForm = this.detailQuestion
    this.handleGetDetailQuestions()
  }

  async handleGetDetailQuestions() {
    this.isLoading = true
    try {
      /* Waiting GetFullDetailQuestion API
      const { data } = await getFullDetailQuestion(this.detailQuestion.id)
      if (data.config) data.config = {}
      //Get all key of object data and change this to camelCase
      this.questionForm = mapKeys(data, (v, k) =>
        camelCase(k)
      ) as IDetailQuestion

      // If data.config == null then set data.config = {}
      if (data.config === null) this.questionForm.config = {}
    */

      this.questionForm = {
        id: 0,
        title: 'Question demo',
        label: 'Question demo',
        isPublic: true,
        config: {},
        keywords: [],
        answer: {
          id: 0,
          text: '',
          config: {}
        }
      }
      this.dataQuestionOld = Object.assign({}, this.questionForm)
      this.lockQuestion(this.categorySeleted.id)
    } catch (error) {}
    this.isLoading = false
  }

  async lockQuestion(id: number) {
    try {
      await lockQuestion(id)
      this.disabled = false
    } catch (error) {
      if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
        this.$message({
          message: this.$tc(error.errorCode),
          type: 'error',
          duration: 5000
        })
      }
    }
  }

  addKeyword() {
    this.questionForm.keywords.push([])
  }

  removeKeyword(index: number) {
    this.questionForm.keywords.splice(index, 1)
  }

  updateKeyword({ index, tags }: { index: number, tags: string[] }) {
    this.questionForm.keywords[index] = tags
  }

  onOpenDialog() {
    this.confirmData[0].value = this.questionForm.title
    this.confirmData[1].value = this.questionForm.label
    this.confirmData[2].value = this.questionForm.isPublic
    this.confirmData[3].value = this.questionForm.keywords
    this.confirmData[4].value = this.questionForm.answer
    this.openDialog = true
  }

  formatKeywords() {
    let { keywords } = this.questionForm
    keywords = keywords.filter(keyword => keyword.length > 0)
    this.questionForm.keywords = keywords
  }

  cancelCreateQuestion() {
    this.openDialog = false
  }

  confirmCreateQuestion() {
    this.openDialog = false
    this.formatKeywords()
    this.onSave()
  }

  onSave() {
    try {
      if (this.dataSelect && this.isAnswer === '1') {
        const dataPost = {
          product_id: this.productId,
          category_id: this.categorySeleted.id,
          question: {
            text: this.questionForm.title,
            label: this.questionForm.label,
            is_public: this.questionForm.isPublic,
            config: this.questionForm.config
          },
          keywords: this.questionForm.keywords,
          answer: this.questionForm.answer
        }
        // TODO: create question
        createQuestionAnswer(dataPost)
      }
    } catch (error) {
      if (error instanceof APIError && error.errorCode === APIErrorCode.Unauthorized) {
        this.$message({
          message: this.$tc(error.errorCode),
          type: 'error',
          duration: 5000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: flex-end;
}

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
        justify-content: flex-end;
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
      flex-direction: column;
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
