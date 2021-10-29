<template>
	<div>
		<div class="blockWrap" @click="close()">
			<div class="relCon">
				<div class="blockWrap__inner" @click.stop>
					<div class="relCon">
						<div class="UploadModal__close" @click="close()">
							<b-icon icon="x"></b-icon>
						</div>
						<div class="UploadModal__contents">
							<slot></slot>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
// import { apiUrl, scriptUrl, CLIENT_ID } from "@consoletype/utils/configration";
//
// import { EditModule } from "@/store/modules/edit";
// import { clearTimeout, setTimeout, clearInterval, setInterval } from "timers";
import { eventHub } from "@/init/eventHub";
// @ts-ignore
@Component
export default class UploadModal extends Vue {
	close() {
		eventHub.$emit("BoxModalClose");
	}
}
</script>

<style lang="scss" type="scss" scoped>
@import "@/styles/_variables.scss";
$imageHeight: 280px;
$modalTopMargin: 20px;
.relCon {
	position: relative;
	width: 100%;
	height: 100%;
}
.block-center {
	margin: auto;
}
.blockWrap {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	margin: auto;
	width: 680px;
	height: 100%;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	&__inner {
		background-color: #fff;
		position: absolute;
		top: 100px;
		left: 0px;
		right: 0px;
		// bottom: 0px;
		margin: auto;
		text-align: center;
		// width:100px;
		// height:30px;
		width: 680px;

		min-height: 300px;
		font-weight: bold;
		padding: 12px;
		border-radius: 12px;
	}
}
.UploadModal {
	&__image {
		width: 100%;
		height: $imageHeight;
		// background-image: url("./img/back.jpg");
		// background-size: contain;
		// background-position: center center;
		&__item {
			// 			position: absolute;
			// top: 0px;
			// left: 0px;
			// right: 0px;
			// bottom: 0px;
			// margin: auto;
			// width: 600px;
			// height: 230px;
		}
	}
	&__contents {
		overflow: auto;
		min-height: $imageHeight;
		max-height: calc(
			100vh - #{$modalTopMargin + $imageHeight + $headerHeight + 50px}
		);
	}
	&__interface {
		min-height: 200px;
	}
	&__discription {
	}
	&__close {
		position: absolute;
		top: -40px;
		right: 0px;
		width: 30px;
		height: 30px;
		// background:blue;
		cursor: pointer;
		font-size: 30px;
	}
	&__cover {
		position: absolute;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		margin: auto;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		&__item {
			width: 100px;
			height: 80px;
			line-height: 80px;
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			margin: auto;
			background-color: rgba(0, 0, 0, 1);
			color: #fff;
		}
	}
}
$listHeight: 40px;
.UploadModal- {
	&List__item {
		list-style-type: none;
		height: $listHeight;
		line-height: $listHeight;
		text-align: left;
		&--active {
			background: red;
		}
	}
}
</style>
