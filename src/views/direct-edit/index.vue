<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="direct edit"
    />
    <EditCategory/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EditCategory from './components/EditCategory.vue'

@Component({
  name: 'Direct Edit',
  components: {
    EditCategory
  }
})
export default class extends Vue {}
</script>
