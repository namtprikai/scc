<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      Main Layout
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AdminModule } from '@/store/modules/admin'

@Component({
  name: 'Dashboard'
})
export default class extends Vue {
  get name() {
    return AdminModule.name
  }

  get roles() {
    return AdminModule.roles
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
