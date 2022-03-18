<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="direct edit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Direct Edit'
})
export default class extends Vue {}
</script>
