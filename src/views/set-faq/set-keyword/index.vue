<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="set keyword"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Set Keyword'
})
export default class extends Vue {}
</script>
