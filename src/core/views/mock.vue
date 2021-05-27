<template>
	<div class="mock">Mock View</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// @ts-ignore
@Component
export default class Mock extends Vue {}
</script>

<style lang="scss" scoped>
.mock {
	align-items: center;
	background-color: #adfadf;
	display: flex;
	height: 100%;
	justify-content: center;
	padding: 1em;
	width: 100%;
}
</style>
