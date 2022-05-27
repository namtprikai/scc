<template>
  <div class="container log-search">
    <el-row>
      <el-col :span="24">
        <log-search-period />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <log-search-edit />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <log-search-detail />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import LogSearchPeriod from './components/logSearchPeriod.vue'
import LogSearchEdit from './components/logSearchEdit.vue'
import LogSearchDetail from './components/logSearchDetail.vue'

@Component({
  name: 'LogSearch',
  components: {
    LogSearchPeriod,
    LogSearchEdit,
    LogSearchDetail
  }
})
export default class LogSearch extends Vue {

}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
