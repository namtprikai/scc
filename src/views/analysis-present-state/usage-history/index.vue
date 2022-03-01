<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="usage history"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Usage History'
})
export default class extends Vue {}
</script>
