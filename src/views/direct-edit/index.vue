<template>
  <div style="padding:30px;">
    <el-alert
      :closable="false"
      title="direct edit"
    />
    <edit-category/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EditCategory from './components/EditCategory.vue'

@Component({
  name: 'DirectEdit',
  components: {
    EditCategory
  }
})
export default class extends Vue {}
</script>
