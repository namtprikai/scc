<template>
  <div
    :class="[{'is-active': isActive}]"
    @click="toggleClick"
  >
    <svg-icon
      name="hamburger"
      width="20"
      height="20"
    />
    <p class="version">V0.1</p>

  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'Hamburger'
})
export default class extends Vue {
  @Prop({ default: false }) private isActive!: boolean

  private toggleClick() {
    this.$emit('toggle-click')
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
}
.version{
  font-size: 10px;
}

</style>
