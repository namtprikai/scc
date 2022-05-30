<template>
  <div id="wrapper_period">
    <el-row class="period_form">
      <el-col :span="24">
        <el-form ref="form" :model="logSearchPeriod">
          <h4 class="group_title">{{$t('text.logSearchPeriod')}}</h4>
          <el-form-item>
            <el-date-picker
              v-model="logSearchPeriod.startDate"
              type="datetime"
              placeholder="Start date">
            </el-date-picker>
            <span class="space_input">~</span>
            <el-date-picker
              v-model="logSearchPeriod.endDate"
              type="datetime"
              placeholder="End date">
            </el-date-picker>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchCreatedHour')+':'">
            <el-input placeholder="Start" v-model="logSearchPeriod.startCreateHour" class="input_created_hour"></el-input>
            <span class="space_input">~</span>
            <el-input placeholder="End" v-model="logSearchPeriod.endCreateHour" class="input_created_hour"></el-input>
          </el-form-item>

          <el-form-item :label="$t('labelText.logSearchCreateWeekday')+':'" label-position="top">
            <el-checkbox-group v-model="logSearchPeriod.weekDayChecked">
              <el-checkbox v-for="day, index in logSearchPeriod.arrWeekDay" :label="$t('labelText.' + day)" :key="index" v-model="logSearchPeriod.weekDayChecked">{{$t('labelText.' + day)}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <h4 class="group_title">{{$t('text.logSearchStatus')}}</h4>
          <el-form-item label-position="top">
            <el-checkbox-group v-model="logSearchPeriod.weekDayChecked">
              <el-checkbox v-for="status, index in logSearchPeriod.arrStatus" :label="$t('labelText.' + status)" :key="index" v-model="logSearchPeriod.statusChecked">{{$t('labelText.' + status)}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div class="wrapper_question_application">
            <div class="box-question">
              <h4 class="group_title">{{$t('text.logSearchQuestion')}}</h4>
              <el-select
                v-model="logSearchPeriod.questionSelected"
                multiple
                filterable
                default-first-option
                class="selectbox"
              >
                <el-option
                  v-for="item in logSearchPeriod.listQuestion"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="box-application">
              <h4 class="group_title">{{$t('text.logSearchApplication')}}</h4>
              <el-select
                v-model="logSearchPeriod.appSelected"
                multiple
                filterable
                default-first-option
                class="selectbox"
              >
                <el-option
                  v-for="item in logSearchPeriod.listApplication"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form>
      </el-col>
      <el-col :span="24" class="box_button_search">
        <el-button type="primary" size="medium">{{$t('text.logSearchButtonSearch')}}</el-button>
      </el-col>
    </el-row>
  </div>

</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'LogSearchPeriod'
})
export default class LogSearchPeriod extends Vue {
  logSearchPeriod: any = {
    startDate: '',
    endDate: '',
    startCreateHour: '',
    endCreateHour: '',

    arrWeekDay: [
      'logSearchCreateMonday',
      'logSearchCreateTuesday',
      'logSearchCreateWednesday',
      'logSearchCreateThursday',
      'logSearchCreateFriday',
      'logSearchCreateSaturday',
      'logSearchCreateSunday'
    ],
    weekDayChecked: [],

    arrStatus: [
      'logSearchOpen',
      'logSearchSearchFailed',
      'logSearchSearchNoScript',
      'logSearchAnswering',
      'logSearchAnswered'
    ],
    statusChecked: '',

    listQuestion: [
      {
        value: 1,
        label: 'Hello Wolrd?'
      }, {
        value: 2,
        label: 'Question 2'
      }, {
        value: 3,
        label: 'Question 3'
      }
    ],
    questionSelected: [2],

    listApplication: [
      {
        value: 1,
        label: 'Application 1'
      }, {
        value: 2,
        label: 'Application 2'
      }, {
        value: 3,
        label: 'Application 3'
      }
    ],
    appSelected: [2]
  }
}
</script>
<style lang="scss" scoped>

.period_form {
  border: 1px solid;
  padding: 10px;
  .space_input {
    font-weight: bold;
    font-size: 20px;
    margin: 0px 10px 0px 10px;
  }
  .wrapper_question_application {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .box-question {
      width: 45%;
    }
    .box-application {
      width: 45%;
    }
    .selectbox {
      width: 80%;
    }
  }
  .box_button_search {
    display: flex;
    height: 50px;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
  }
}
.group_title {
  margin: 0 0 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid;
}
.input_created_hour {
  width: 100px;
}

@media only screen and (max-width: 768px){
  .period_form {
    .wrapper_question_application {
      flex-direction: column;
      .box-question {
        width: 100%;
        margin-bottom: 20px;
      }
      .box-application {
        width: 100%;
      }
      .selectbox {
        width: 100%;
      }
    }
  }
  .el-form-item {
    &__label {
      display: block;
    }
  }
}
</style>
