<template>
	<div
		class="horizontal_divider"
		name="horizontal"
		:ref="refName"
		@touchstart="onTouchstartWrap"
	>
		<div class="top" v-bind:style="topStyle">
			<slot name="top"></slot>
		</div>
		<div
			ref="divider"
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
					<div class="divider__allow divider__allow--top" @touchend="up"></div>
					<div class="divider__allow divider__allow--bottom" @touchend="down"></div>
				</div>
			</div>
			<div
				v-if="isGhoast"
				class="divider__ghoast"
				:style="{ top: ghoastY + 'px' }"
			></div>
		</div>
		<div class="bottom" v-bind:style="bottomStyle">
			<slot name="bottom"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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
export default class Horizontal extends Vue {
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
		return `${this.$router?.currentRoute?.path || ""}_${slotName}_h_y`;
	}

	private dividerHeight = 3;
	private refName = `horizontal${Math.floor(Math.random() * 1000)}`;
	private topStyle: Object = {};
	private bottomStyle: Object = {};
	private offsetY = 0;
	// topHeight = "auto";
	// bottomHeight = "100";
	private coeffX = 0;
	private coeffY = 0;
	private y: any;
	private x: any;
	private isTouch = false;
	private touthTime = 0;
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

	onTouchend(e: Event) {
		this.touthTime = new Date().getTime();
		e.stopPropagation();
	}

	onTouchstartWrap() {
		this.isTouch = false;
	}

	down() {
		const now = new Date().getTime();
		if (now - this.touthTime < 300) {
			this.onDrag({ y: this.y + 10, x: this.x }, -100);
		}
	}

	up() {
		const now = new Date().getTime();
		if (now - this.touthTime < 300) {
			this.onDrag({ y: this.y - 10, x: this.x }, -100);
		}
	}

	private mounted() {
		// ドラッグ時のアイコンを非表示にするためのダミーエレメントを作成
		const invisible = new Image();
		invisible.src =
			"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
		this.$refs.invisible = invisible;
		const horizontal: any = this.$refs[this.refName];
		const height = horizontal.clientHeight;
		let parcentage = 50;
		const strageParcentage = localStorage.getItem(this.getDividerKey());
		if (strageParcentage) {
			parcentage = parseInt(strageParcentage, 10);
		}
		this.$emit("top-height", `${height * (parcentage / 100) - this.offsetY}`);
		this.$emit(
			"bottom-height",
			`${height * ((100 - parcentage) / 100) - this.offsetY - 50}`
		);
		eventHub.$on("resize", this.resize);
		this.y = height * (parcentage / 100) + this.offsetY - this.dividerHeight;
		this.x = 0;
		this.topStyle = {
			height: `${this.y - this.offsetY - this.dividerHeight}px`,
		};
		this.bottomStyle = {
			height: `calc(100% - ${this.y - this.offsetY}px)`,
		};
	}

	save() {
		const horizontal: any = this.$refs[this.refName];
		const height = horizontal.clientHeight;
		// this.y = height *(parcentage/100) - this.offsetY - 10;
		// const parcentage =
		// 	((this.y + this.offsetY + this.dividerHeight) / height) * 100;
		const parcentage = ((this.y - this.offsetY) / height) * 100;
		localStorage.setItem(this.getDividerKey(), String(parcentage));
	}

	private resize(e: { width: any; height: any }) {
		const horizontal: any = this.$refs[this.refName];

		const height = horizontal.clientHeight;
		// this.$emit("top-height", `${height / 2 - this.offsetY}`);
		this.$emit("bottom-height", `${height - this.y - this.offsetY}`);
	}

	beforeDestroy() {
		// this.save();
	}

	private destroyed() {
		eventHub.$off("resize", this.resize);
	}

	private onDragStart(e: DragEvent) {
		// ドラッグ時のアイコンを非表示にする
		const invisible = this.$refs.invisible as HTMLElement;
		e.dataTransfer && e.dataTransfer.setDragImage(invisible, 0, 0);
		this.isGhoast = true;
		const element = e.target as HTMLElement;
		this.offsetY = element.getBoundingClientRect().top - element.offsetTop;
	}

	isFasttimeMove = false;
	onTouchmove(e: DragEvent | any) {
		e.x = e.touches[0].pageX;
		e.y = e.touches[0].pageY;
		if (this.isFasttimeMove) {
			this.coeffY = this.y - e.y;
			this.isFasttimeMove = false;
		}
		e.y = this.coeffY + e.y;
		this.onDrag(e, -100);
		this.save();
	}

	private onDragEnd(e: DragEvent, coeff = 0) {
		// drag 終了時、異常な値が現れるのでその際は処理を中断
		if (e.x <= 0) {
			return;
		}
		// this.dragId = setTimeout(() => {
		this.topStyle = {
			height: `${e.y - this.offsetY - this.dividerHeight}px`,
		};
		this.bottomStyle = {
			height: `calc(100% - ${e.y - this.offsetY}px)`,
		};
		this.y = e.y;
		this.x = e.x;
		const horizontal: any = this.$refs[this.refName];
		const height = horizontal.clientHeight;
		this.$emit("bottom-height", `${height - e.y - this.offsetY + 80 + coeff}`);
		this.save();
		this.isGhoast = false;
	}

	private dragId: any = null;
	private onDrag(e: DragEvent | any, coeff = 0) {
		// drag 終了時、異常な値が現れるのでその際は処理を中断
		if (e.y <= 0) return;
		this.ghoastY = e.y;
		if (this.dragId !== null) {
			clearTimeout(this.dragId);
		}
		// this.topStyle = {
		// 	height: `${e.y - this.offsetY - this.dividerHeight}px`,
		// };
		// this.bottomStyle = {
		// 	height: `calc(100% - ${e.y - this.offsetY}px)`,
		// };
		this.dragId = setTimeout(() => {
			this.y = e.y;
			this.x = e.x;
			// this.topHeight = `${e.y - this.offsetY}`;
			// this.bottomHeight = `calc(100% - ${e.y - this.offsetY})`;
			this.$emit("top-height", `${e.y - this.offsetY - 20}`);
			const horizontal: any = this.$refs[this.refName];
			const height = horizontal.clientHeight;
			this.$emit("bottom-height", `${height - e.y - this.offsetY + 80 + coeff}`);
			// console.log(this.topHeight);
			// this.save();
		}, 300);
	}
}
</script>

<style lang="scss" scoped>
@import "@/styles/_variables.scss";
$barHeight: 3px;
.relative {
	position: relative;
	width: 100%;
	height: 100%;
}
.divider {
	align-self: stretch;
	background-color: $Light;
	&__ghoast {
		width: 100%;
		position: fixed;
		height: $barHeight;
		left: 0px;
		background-color: $Dark;
		z-index: 9999;
	}
	&__handle {
		display: flex;
		align-items: center;
		z-index: 99;
		position: absolute;
		right: 0;
		left: 0;
		top: -2px;
		margin: auto;
		bottom: 0px;
		top: 0px;
		height: $barHeight + 4;
		width: 130px;
		padding-left: 20px;
		padding-right: 20px;
		border: 1px darken($Light, 20%) solid;
		background-color: $Light;
		box-shadow: 1px 1px 1px $Light;
		border-radius: 2px;
		&__dot {
			line-height: 5px;
			background: darken($Light, 30%);
			width: 1px;
			height: 50%;
			display: inline-block;
			margin: auto;
		}
	}
	cursor: row-resize;
	height: $barHeight;
	width: 100%;
	position: absolute;
	&__allow {
		z-index: 99;
		width: 100px;
		height: 50px;
		background-color: rgba(0, 0, 0, 0.4);
		position: absolute;
		right: 0;
		left: 0;
		margin: auto;
		bottom: 20px;
		&--top {
			bottom: 20px;
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
				right: 0px;
				top: auto;
				height: 0px;
				border-width: 50px;
				// border-bottom-color: transparent;
				border-left-color: transparent;
				border-top-color: transparent;
				border-right-color: transparent;
				border-bottom-width: 50px;
				// border-right-width: 50px;
			}
		}
		&--bottom {
			top: 20px;
			bottom: auto;
			background-color: transparent;
			&::before {
				content: ".";
				overflow: hidden;
				text-indent: -9999px;
				position: absolute;
				width: 100px;
				border-color: #d9534f;
				border-style: solid;
				top: 0px;
				bottom: auto;
				right: 0px;
				height: 0px;
				border-width: 50px;
				border-bottom-color: transparent;
				border-left-color: transparent;
				// border-top-color: transparent;
				border-right-color: transparent;
				border-top-width: 50px;
				// border-right-width: 50px;
			}
		}
	}
}

.horizontal_divider {
	position: relative;
	margin: 0;
	height: 100%;
	width: 100%;

	.top,
	.bottom {
		overflow: hidden; //scroll;
		height: 50%;
	}
	.bottom {
		margin-top: $barHeight;
	}
}
</style>
