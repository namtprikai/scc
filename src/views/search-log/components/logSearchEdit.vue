<template>
  <div class="log-search-edit">
    <el-row class="log-search-edit_form">
      <el-col :span="24">
        <el-form label-position="left" :model="formLogSearchEdit">
          <el-form-item :label="$t('labelText.logSearchTaskStatus')">
            <el-select v-model="formLogSearchEdit.taskStatus">
              <el-option
                v-for="status in listTaskStatus"
                :key="status.value"
                :label="$t('text.' + status.label)"
                :value="status.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchAssignee')">
            <el-select v-model="formLogSearchEdit.assignee">
              <el-option
                :key = 0
                :label="$t('text.logSearchEmpty')"
                :value = 0>
              </el-option>
              <el-option
                v-for="item in listAssignee"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchCorrespondenceType')">
            <el-select v-model="formLogSearchEdit.correspondenceType">
              <el-option
                v-for="status in listCorrespondenceType"
                :key="status.value"
                :label="$t('text.' + status.label)"
                :value="status.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchCorrespondenceContent')">
            <el-input
              type="textarea"
              :autosize="{minRows: 2, maxRows: 4}"
              v-model="formLogSearchEdit.correspondenceContent">
            </el-input>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchComment')">
            <el-input
              type="textarea"
              :autosize="{minRows: 2, maxRows: 4}"
              v-model="formLogSearchEdit.comment">
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="box_button_search">
        <el-button type="primary" size="medium">{{$t('text.update')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'LogSearchEdit'
})
export default class LogSearchEdit extends Vue {
  formLogSearchEdit = {
    taskStatus: 0,
    assignee: 0,
    correspondenceType: 0,
    correspondenceContent: '',
    comment: ''
  }

  listTaskStatus = [
    { value: 0, label: 'logSearchEmpty' },
    { value: 1, label: 'logSearchTaskstartRequest' },
    { value: 2, label: 'logSearchTaskrequest' },
    { value: 3, label: 'logSearchTaskprogress' },
    { value: 4, label: 'logSearchTaskwaitingForCheck' },
    { value: 5, label: 'logSearchTaskremand' },
    { value: 6, label: 'logSearchTaskdone' }
  ]

  listAssignee: any = [
    { value: 1, label: 'Tran Phuong Nam' },
    { value: 2, label: 'Nguyen Duc A' }
  ]

  listCorrespondenceType: any = [
    { value: 0, label: 'logSearchEmpty' },
    { value: 1, label: 'logSearchCorrespondencefix' },
    { value: 2, label: 'logSearchCorrespondenceadd' },
    { value: 3, label: 'logSearchCorrespondencekeyword' }
  ]
}
</script>
<style lang="scss" scoped>
.log-search-edit {
  width: 100%;
  border: 1px solid;
  background-color: #F3F3F3;
  padding: 20px 10px;
  .box_button_search {
    display: flex;
    justify-content: center;
  }
}

.el-form-item {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  margin-bottom: 10px;
  ::v-deep &__label {
    width: 300px;
  }
  ::v-deep &__content {
    width: calc(100% - 300px);
  }
}

.el-select {
  &--medium {
    width: 100%;
  }
}
@media only screen and (max-width: 768px) {
  .el-form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    ::v-deep &__content {
      width: 100%;
    }
  }
}
</style>
