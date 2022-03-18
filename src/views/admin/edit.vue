<template>
  <div>
    id::: {{id}}
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'EditAdmin'
})
export default class extends Vue {
  get id() {
    return this.$route.params.adminId
  }
}
</script>

<style lang="scss" scoped>

</style>
