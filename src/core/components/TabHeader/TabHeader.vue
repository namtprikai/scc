<template>
	<div class="TabHeader" :class="{ 'TabHeader--pin': isPin }">
		<div class="TabHeader__control">
			<svg-icon class="TabHeader__icon" name="basic_pin2" @click="togglePin()" :class="{ active: isPin }" :style="{ transform: 'rotate(' + rotate + 'deg)' }" />
		</div>
		<div class="TabHeader__contents">
			<slot />
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import { Type } from '@/components/Charts';
import { TabHeader } from '@/components/TabHeader';
// @ts-ignore
@Component({ name: 'BCardAccordion' })
export default class BCardAccordion extends Vue {
	private isShow = true;
	private get rotate(): number {
		return this.isPin ? 45 : 90;
	}

	private isPin = true;
	private togglePin() {
		this.isPin = !this.isPin;
	}

	created() {
		// this.isShow = this.visible;
	}
}
</script>
<style lang="scss" type="scss" scoped>
@import '~@consoletype/styles/_variables.scss';
$TabHeaderHeitht: 44px;
// .TabHeaderWrap {
// 	position: relative;
// 	background: #f00;
// 	height: $TabHeaderHeitht;
// 	&--pin {
// 		// position: sticky;
// 		// top: 0px;
// 		// right: 0px;
// 		// left: 0px;
// 		// margin: auto;
// 	}
// }
.TabHeader {
	// position: relative;
	height: $TabHeaderHeitht;
	background: $White;
	line-height: $TabHeaderHeitht;
	overflow: hidden;
	text-align: right;
	padding: 0px;
	box-shadow: 0px 1px 1px $Light;
	&__contents {
		padding: 0px 40px 0px 20px;
	}
	&--pin {
		position: sticky;
		top: 0px;
		right: 0px;
		left: 0px;
		margin: auto;
		z-index: 1000;
	}
	&__icon {
		position: absolute;
		margin: auto;
		right: 8px;
		top: 2em;
		bottom: 0px;
		font-size: 24px;
	}
	&__control {
		position: relative;
		width: 100%;
		height: 0px;
	}
}
</style>
