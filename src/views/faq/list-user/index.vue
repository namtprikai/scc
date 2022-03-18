<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="list user"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'List User'
})
export default class extends Vue {}
</script>
