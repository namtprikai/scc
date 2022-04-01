<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="list admin"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'ListAdmin'
})
export default class extends Vue {}
</script>
