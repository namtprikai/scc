<template>
  <div class="log-search-edit">
    <el-row class="log-search-detail">
      <el-col :span="24">
        <el-form label-position="left" :model="formLogSearchEdit">
          <el-form-item :label="$t('text.logSearchApplication')">
            <a href="#">Hello World</a>
          </el-form-item>

          <el-form-item :label="$t('text.logSearchQuestion')">
            <a href="#">Hello World</a>
          </el-form-item>

          <el-form-item :label="$t('text.logSearchCreatedTime')">
            <span>23/5/2022</span>
          </el-form-item>

          <el-form-item :label="$t('text.logSearchEndTime')">
            <span>23/5/2022</span>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchAssignee') + ': Tran Phuong Nam'">
            <div class="item-log-search-assignee">
              <el-tag>Tag 1</el-tag>
              <el-tag>Tag 1</el-tag>
              <el-tag>Tag 1</el-tag>
              <el-tag>Tag 1</el-tag>
              <el-tag>Tag 1</el-tag>
              <el-tag>Tag 1</el-tag>
            </div>
          </el-form-item>

          <el-form-item :label="$t('text.logSearchTaskCompletedDate')">
            <p>23/5/2022 10:00:00</p>
          </el-form-item>
        </el-form>
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
.el-select {
  &--medium {
    width: 100%;
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

.item-log-search-assignee {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  .el-tag {
    width: 200px;
    margin-bottom: 10px;
  }
}

@media only screen and (max-width: 768px) {
  .el-form-item {
    flex-direction: column;
    align-content: flex-start;
    align-items: flex-start;
    ::v-deep &__content {
      width: 100%;
    }
  }
}

</style>
