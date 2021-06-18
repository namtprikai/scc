<template>
	<div id="app">
		<router-view />
		<modals-container />
		<v-dialog />
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

// @ts-ignore
@Component
export default class App extends Vue {}
</script>
<style lang="scss">
.modal-backdrop {
	z-index: 5 !important;
}
</style>
