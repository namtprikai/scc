<template>
	<div
		class="vertical_divider"
		name="vertical"
		:ref="refName"
		@touchstart="onTouchstartWrap"
		@touch="touch"
	>
		<div class="left" v-bind:style="leftStyle">
			<slot name="left"></slot>
		</div>
		<div
			class="divider"
			draggable="true"
			@touchmove="onTouchmove"
			@dragstart="onDragStart"
			@touchstart="onTouchstart"
			@touchend="onTouchend"
			@drag="onDrag"
			@dragend="onDragEnd"
		>
			<div class="relative">
				<div class="divider__handle">
					<span class="divider__handle__dot"></span>
					<span class="divider__handle__dot"></span>
					<span class="divider__handle__dot"></span>
				</div>
				<div v-if="isTouch">
					<div class="divider__allow divider__allow--right" @touchend="right"></div>
					<div class="divider__allow divider__allow--left" @touchend="left"></div>
				</div>
			</div>
			<div
				v-if="isGhoast"
				class="divider__ghoast"
				:style="{ left: ghoastX + 'px' }"
			></div>
		</div>
		<div class="right" v-bind:style="rightStyle">
			<slot name="right"></slot>
		</div>
		<div v-if="isGhoast" class="ghoastWrap"></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import { Computed } from "vuex";
import { eventHub } from "@/init/eventHub";
import { polyfill } from "mobile-drag-drop";

// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";

// options are optional ;)
polyfill({
	// use this to make use of the scroll behaviour
	dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
// @ts-ignore
@Component
export default class Vertical extends Vue {
	private dividerWidth = 3;
	private getDividerKey(): string {
		let slotName = "";
		for (const [key, items] of Object.entries(this.$slots)) {
			if (items) {
				for (const item of items) {
					if (item.children) {
						for (const child of item.children) {
							slotName += child?.componentInstance?.$attrs["data-name"] || "";
						}
					}
				}
			}
		}
		return `${this.$router?.currentRoute?.path || ""}_${slotName}_h_x`;
	}

	private refName = `vertical${Math.floor(Math.random() * 1000)}`;
	leftStyle: Object = {};
	rightStyle: Object = {};
	offsetX = 0;
	private y: any;
	private x: any;
	coeffX = 0;
	coeffY = 0;
	touthTime = 0;
	isFasttimeMove = false;
	isTouch = false;
	isGhoast = false;
	ghoastX = 0;
	ghoastY = 0;
	onTouchstart(e: Event) {
		this.touthTime = new Date().getTime();
		this.isTouch = true;
		this.isFasttimeMove = true;
		this.coeffX = 0;
		this.coeffY = 0;
		e.stopPropagation();
	}

	onTouchstartWrap() {
		this.isTouch = false;
	}

	onTouchend(e: Event) {
		this.touthTime = new Date().getTime();
		e.stopPropagation();
	}

	left() {
		const now = new Date().getTime();
		if (now - this.touthTime < 1000) {
			this.onDrag({ y: this.y, x: this.x + 10 });
		}
	}

	right() {
		const now = new Date().getTime();
		if (now - this.touthTime < 1000) {
			this.onDrag({ y: this.y, x: this.x - 10 });
		}
	}

	private destroyed() {
		eventHub.$off("resize", this.resize);
	}

	onTouchmove(e: DragEvent | any) {
		e.x = e.touches[0].pageX;
		e.y = e.touches[0].pageY;
		if (this.isFasttimeMove) {
			this.coeffX = this.x - e.x;
			this.isFasttimeMove = false;
		}
		e.x = this.coeffX + e.x;
		this.onDrag(e);
		e.stopPropagation();
		this.save();
	}

	touch(e: Event) {
		e.stopPropagation();
	}

	private mounted() {
		// ドラッグ時のアイコンを非表示にするためのダミーエレメントを作成
		const invisible = new Image();
		invisible.src =
			"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
		this.$refs.invisible = invisible;
		const vertical: any = this.$refs[this.refName]; // this.$refs.vertical;
		const height = vertical.clientHeight;
		let parcentage = 50;
		const strageParcentage = localStorage.getItem(this.getDividerKey());
		if (strageParcentage) {
			parcentage = parseInt(strageParcentage, 10);
		}
		this.$emit("height", `${height}`);
		eventHub.$on("resize", this.resize);
		this.y = 0;
		this.x = vertical.clientWidth * (parcentage / 100) + this.offsetX - 10;
		this.leftStyle = {
			width: `${this.x - this.offsetX}px`,
		};
		this.rightStyle = {
			width: `calc(100% - ${this.x - this.offsetX}px)`,
		};
	}

	// beforeDestroy() {
	//   this.save();
	// }
	private save() {
		const vertical: any = this.$refs[this.refName];
		const width = vertical.clientWidth;
		// this.y = height *(parcentage/100) - this.offsetY - 10;
		const parcentage = ((this.x - this.offsetX) / width) * 100;
		localStorage.setItem(this.getDividerKey(), String(parcentage));
	}

	private resizeId: any = null;
	private resize(e: { width: any; height: any }) {
		if (this.resizeId !== null) {
			clearTimeout(this.resizeId);
		}
		this.resizeId = setTimeout(() => {
			const vertical: any = this.$refs[this.refName];
			const height = vertical.clientHeight;
			// this.$emit("top-height", `${height / 2 - this.offsetY}`);
			this.$emit("height", `${height}`);
		}, 300);
	}

	private onDragStart(e: DragEvent) {
		this.ghoastX = e.x;
		this.isGhoast = true;
		// ドラッグ時のアイコンを非表示にする
		const invisible = this.$refs.invisible as HTMLElement;
		e.dataTransfer && e.dataTransfer.setDragImage(invisible, 0, 0);

		const element = e.target as HTMLElement;
		this.offsetX = element.getBoundingClientRect().left - element.offsetLeft;
	}

	private onDragEnd(e: DragEvent) {
		// drag 終了時、異常な値が現れるのでその際は処理を中断
		if (e.x <= 0) return;
		// this.dragId = setTimeout(() => {
		this.leftStyle = {
			width: `${e.x - this.offsetX}px`,
		};
		this.rightStyle = {
			width: `calc(100% - ${e.x - this.offsetX}px)`,
		};
		this.y = e.y;
		this.x = e.x;
		this.save();
		this.isGhoast = false;
	}

	private dragId: any = null;
	private onDrag(e: DragEvent | any) {
		// drag 終了時、異常な値が現れるのでその際は処理を中断
		if (e.x <= 0) return;
		this.ghoastX = e.x;
		if (this.dragId !== null) {
			clearTimeout(this.dragId);
		}
		this.dragId = setTimeout(() => {
			// this.leftStyle = {
			// 	width: `${e.x - this.offsetX}px`,
			// };
			// this.rightStyle = {
			// 	width: `calc(100% - ${e.x - this.offsetX}px)`,
			// };
			this.y = e.y;
			this.x = e.x;
			// this.save();
		}, 300);
	}
}
</script>
<style lang="scss"></style>

<style lang="scss" scoped>
@import "@/styles/_variables.scss";

$barWidth: 2px;
.ghoastWrap {
	position: fixed;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.2);
	opacity: 0.5;
}
.relative {
	position: relative;
	width: 100%;
	height: 100%;
}
.divider {
	align-self: stretch;
	background-color: $Light;
	&__ghoast {
		width: $barWidth;
		position: fixed;
		height: 100vh;
		top: 0px;
		background-color: $Dark;
		z-index: 9999;
	}
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
				content: ".";
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
				content: ".";
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

.vertical_divider {
	margin: 0;
	display: flex;
	height: 100%;

	.left,
	.right {
		// overflow: scroll;
		// width: 50%;
	}
}
</style>
