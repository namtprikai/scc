<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="menu 3"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Menu3'
})
export default class extends Vue {}
</script>
