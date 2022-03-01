<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="edit csv"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Edit CSV'
})
export default class extends Vue {}
</script>
