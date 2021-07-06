<template>
	<!-- <div class="dashboard-container">
		<div class="dashboard-text">name:{{ name }}</div>
		<div class="dashboard-text">
			role:asdf
			<span>{{ role }}</span>
		</div>
	</div>-->
	<div class="dashboard-editor-container">
		<div class="clearfix">
			<pan-thumb
				:image="avatar"
				style="float: left"
				:class="{
					'role--1': role == 1,
					'role--2': role == 2,
					'role--3': role == 3,
					'role--4': role == 4,
					role: true,
				}"
				:style="roleStyle(role)"
				:width="'60px'"
				:height="'60px'"
			>
				<span class="roleLevel">{{ role }}</span>
			</pan-thumb>
			<div class="info-container">
				<span class="display_name">{{ name }}さん、おかえりなさい！</span>
			</div>
		</div>
		<div class="dashboard-contents">
			<div
				:style="{ backgroundImage: 'url(' + emptyGif + ')' }"
				class="dashboard-contents__background"
			></div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { mapGetters } from "vuex";
import DashboardParent from "@/views/dashboard/index";
import PanThumb from "@/components/PanThumb/index.vue";
// @ts-ignore
@Component({
	components: {
		Dashboard,
		PanThumb,
	},
})
export default class Dashboard extends DashboardParent {
	// private emptyGif = Math.random()*2<1?"https://media.giphy.com/media/Iq3mBrYBzcOTS/giphy.gif":"https://media.giphy.com/media/2wN5OlLBhBzc4/giphy.gif";
}
</script>

<style lang="scss" scoped>
// .pan-item {
//   width: 60px !important;
//   height: 60px !important;
// }
.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
.emptyGif {
	display: block;
	width: 45%;
	margin: 0 auto;
}
.dashboard-contents {
	position: relative;
	&__background {
		position: absolute;
		z-index: 0;
		background-size: cover;
		background-position: center center;
		background-repeat: no-repeat;
		border-radius: 50%;
		width: 600px;
		height: 600px;
		display: block;
		opacity: 0.4;
		margin: auto;
		top: 50px;
		right: 0px;
		left: 0px;
		// bottom: 0px;
	}
}
.roleLevel {
	position: absolute;
	right: 0px;
	margin: auto;
	left: 0px;
	top: 10px;
	display: block;
	width: 30px;
	line-height: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.6);
}
.role {
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
	// &--1 {
	// 	background-image: url("img/1.gif");
	// }
	// &--2 {
	// 	background-image: url("img/2.gif");
	// }
	// &--3 {
	// 	background-image: url("img/3.gif");
	// }
	// &--4 {
	// 	background-image: url("img/4.gif");
	// }
}
.dashboard-editor-container {
	// background-color: #e3e3e3;
	min-height: 100vh;
	padding: 50px 60px 0px;
	.pan-info-roles {
		font-size: 12px;
		font-weight: 700;
		color: #333;
		display: block;
	}
	.info-container {
		position: relative;
		margin-left: 66px;
		height: 60px;
		line-height: 60px;
		.display_name {
			font-size: 18px;
			line-height: 48px;
			color: #212121;
			position: absolute;
			top: 6px;
		}
	}
}
</style>
