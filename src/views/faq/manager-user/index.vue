<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="manager user"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Manager User'
})
export default class extends Vue {}
</script>
