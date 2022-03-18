<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="manager"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Manager'
})
export default class extends Vue {}
</script>
