<template>
	<section class="app-main">
		<transition name="fade-transform" mode="out-in">
			<!-- or name="fade" -->
			<!-- <router-view :key="key"></router-view> -->
			<router-view />
		</transition>
	</section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ResizeHandlerMixin from "@/views/layout/mixin/ResizeHandler";
// @ts-ignore
@Component
export default class AppMain extends Vue {
	resizeId: number | null = null;
}
</script>
<style type="sass">
/* @import "~/node_modules/bootstrap/scss/bootstrap";
@import "~/node_modules/bootstrap-vue/src/index.scss"; */
</style>
<style type="sass" scoped>
/* .app-main {
	overflow: auto;
} */
</style>
