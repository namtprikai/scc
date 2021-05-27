<template>
	<div class="void_divider">
		<div class="center" v-bind:style="centerStyle">
			<slot name="center"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Computed } from 'vuex';
import { eventHub } from '@/init/eventHub';
import { polyfill } from 'mobile-drag-drop';

// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';

// options are optional ;)
polyfill({
	// use this to make use of the scroll behaviour
	dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
// @ts-ignore
@Component
export default class Vertical extends Vue {
	private refName = `void${Math.floor(Math.random() * 1000)}`;
	centerStyle: Object = { width: '100%' };
}
</script>
<style lang="scss"></style>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

$barWidth: 2px;
.relative {
	position: relative;
	width: 100%;
	height: 100%;
}
.divider {
	align-self: stretch;
	background-color: $Light;
	&__handle {
		align-items: center;
		z-index: 99;
		position: absolute;
		// right: 0;
		left: -2px;
		margin: auto;
		bottom: 0px;
		top: 0px;
		width: $barWidth + 4;
		height: 130px;
		padding-top: 20px;
		border: 1px darken($Light, 20%) solid;
		background-color: $Light;
		box-shadow: 1px 1px 1px $Light;
		border-radius: 2px;
		&__dot {
			background: darken($Light, 30%);
			height: 1px;
			width: 50%;
			display: block;
			margin: auto;
			margin-top: 20px;
		}
	}
	cursor: col-resize;
	width: $barWidth;
	&__allow {
		z-index: 99;
		width: 50px;
		height: 100px;
		background-color: rgba(0, 0, 0, 0.4);
		position: absolute;
		right: 0;
		left: 0;
		margin: auto;
		bottom: 0px;
		top: 0px;
		&--top {
			bottom: 20px;
		}
		&--bottom {
			top: 20px;
			bottom: auto;
		}
		&--right {
			background-color: transparent;
			right: 20px;
			left: auto;
			&::before {
				overflow: hidden;
				text-indent: -9999px;
				content: '.';
				position: absolute;
				width: 100px;
				border-color: #d9534f;
				border-style: solid;
				bottom: 0px;
				right: 0px;
				height: 0px;
				border-width: 50px;
				border-bottom-color: transparent;
				border-left-color: transparent;
				border-top-color: transparent;
				// border-right-color: transparent;
				border-left-width: 50px;
				border-right-width: 50px;
			}
		}
		&--left {
			left: 20px;
			right: auto;
			background-color: transparent;
			&::before {
				overflow: hidden;
				text-indent: -9999px;
				content: '.';
				position: absolute;
				width: 100px;
				border-color: #d9534f;
				border-style: solid;
				bottom: 0px;
				left: 0px;
				height: 0px;
				border-width: 50px;
				border-bottom-color: transparent;
				// border-left-color: transparent;
				border-top-color: transparent;
				border-right-color: transparent;
				border-left-width: 50px;
			}
		}
	}
}

.void_divider {
	margin: 0;
	display: block;
	position: relative;
	.left,
	.center {
		// overflow: scroll;
		// width: 100%;
	}
}
</style>
