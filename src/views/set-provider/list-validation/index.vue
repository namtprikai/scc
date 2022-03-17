<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="list_validation"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'List Validation'
})
export default class extends Vue {}
</script>
