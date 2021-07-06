<template>
	<div class="navbar">
		<hamburger
			:toggle-click="toggleSideBar"
			:is-active="sidebar.opened"
			class="hamburger-container"
		/>
		<!-- <breadcrumb/> -->
		<router-link class="inlineBlock" to="/">
			<div class="logo header__logo"></div>
		</router-link>
		<div class="version">{{ version }}</div>
		<div class="oshirase">
			<div class="relative">
				<div class="oshirase__inner">
					<span class="oshirase__text text-discription">{{ Oshirase }}</span>
					<!-- <span class="oshirase__text oshirase__text--2">{{Oshirase}}</span> -->
					<div class="oshirase--link text-discription">
						<span v-html="$sanitize(Link)"></span>
					</div>
				</div>
			</div>
		</div>

		<div class="controlButtons">
			<div class="relative">
				<div class="controlButtons__inner">
					<b-button
						size="sm"
						class="controlButtons__item"
						@click="devPage"
						v-if="isDevPage()"
						>テストページ</b-button
					>
					<b-button
						size="sm"
						variant="primary"
						class="controlButtons__item"
						@click="prodPage"
						>本番ページ</b-button
					>
					<b-button size="sm" class="controlButtons__item" @click="logout"
						>ログアウト</b-button
					>
				</div>
			</div>
		</div>
		<!-- <el-dropdown class="avatar-container" trigger="click">
			<div class="avatar-wrapper">
				<div class="user-avatar" :style="{ backgroundImage:'url('+avatar+')' }"></div>
				<i class="el-icon-caret-bottom" />
			</div>

			<el-dropdown-menu slot="dropdown" class="user-dropdown">
				<router-link class="inlineBlock" to="/">
					<el-dropdown-item>アカウント設定</el-dropdown-item>
				</router-link>
				<el-dropdown-item divided>
					<span style="display:block;" @click="logout">ログアウト</span>
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>-->
	</div>
</template>

<script lang="ts">
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";

import { CLIENT_ID } from "../../../utils/configration";
import { Ajax } from "@/utils/parts";
import { url } from "inspector";
import axios from "axios";
import { eventHub } from "@/init/eventHub";
import { WindowTestPageUrl, WindowPageUrl } from "../../../config";
// @ts-ignore
@Component({
	components: {
		Breadcrumb,
		Hamburger,
	},
})
export default class Navbar extends Vue {
	ajax: Ajax = new Ajax();
	get sidebar() {
		return AppModule.sidebar;
	}

	get avatar() {
		return `https://file.ai-x-supporter.com/${CLIENT_ID}/${UserModule.id}.gif`;
	}

	oshirase = "";
	link = "";
	get Oshirase() {
		return this.oshirase;
	}

	get Link() {
		return this.link;
	}

	updateOshiraseId: any = null;
	async created() {
		this.updateOshiraseId = setInterval(() => {
			this.updateOshirase();
		}, 1000 * 60 * 15);
		this.updateOshirase();
		eventHub.$on("updateoshirase", this.setOshirase);
	}

	public prodPage() {
		window.open(`${WindowPageUrl}`, "_blank");
	}

	public isDevPage(): boolean {
		return WindowTestPageUrl !== "";
	}

	public devPage() {
		window.open(`${WindowTestPageUrl}`, "_blank");
	}

	setOshirase({ text, link }: any) {
		this.oshirase = text || "";
		this.link = link || "";
	}

	destroy() {
		if (this.updateOshiraseId != null) {
			clearInterval(this.updateOshiraseId);
		}
		eventHub.$off("updateoshirase", this.setOshirase);
	}

	async updateOshirase() {
		try {
			const { data } = await axios.get(
				`https://file.ai-x-supporter.com/${CLIENT_ID}/oshirase.json`,
				{
					params: {
						h: Date.now(),
					},
				}
			);
			console.log(data);
			this.oshirase = data.text || "";
			this.link = data.link || "";
			// this.$forceUpdate();
		} catch (e) {}
	}

	private toggleSideBar() {
		AppModule.ToggleSideBar(false);
	}

	get logo() {
		return `@/assets/logo_chat.png`;
	}

	private async logout() {
		UserModule.LogOut().then(() => {
			setTimeout(() => {
				location.reload(); // To prevent bugs from vue-router
			}, 1000);
		});
	}
}
</script>

<style lang="scss" scoped>
@import "@consoletype/styles/_variables.scss";
$navHeight: 50px;
.relative {
	position: relative;
	width: 100%;
	height: 100%;
}
.controlButtons {
	margin: auto;
	height: $navHeight;
	width: 100%;

	overflow: hidden;
	position: absolute;
	top: 0px;
	left: 0px;
	line-height: 1.5;
	text-align: right;
	&__inner {
		display: inline-flex;
		justify-content: flex-end;
		height: $navHeight;
		padding-left: 20px;
		background-color: $White;
	}
	// margin-top:-18px;
	&__item {
		margin: auto 6px;
	}
}
.version {
	position: absolute;
	bottom: -20px;
	left: 3px;
	font-size: 6px;
	color: $Dark;
}
.oshirase {
	margin: auto;
	height: 50px;
	overflow: hidden;
	position: absolute;
	top: 0px;
	left: 0px;
	height: 50px;
	width: 100%;
	max-width: 1000px;
	// width: 600px;
	// left: 250px;
	&__inner {
		margin-left: 200px;
		margin-right: -100px;
		position: relative;
		overflow: hidden;
	}
	&__text {
		display: inline-block;
		// padding-left: 100%;
		width: calc(100% - 400px);
		white-space: nowrap;
		line-height: 1em;
		animation: scrollAnime2 17s linear infinite;
		&--2 {
			padding-left: 0%;
			animation: scrollAnime2 17s linear infinite;
		}
	}
	&--link {
		position: absolute;
		animation: none;
		top: 15px;
		width: 600px;
		left: 20px;
		z-index: 3;
	}
}
@keyframes scrollAnime {
	0% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(-120%);
	}
}
@keyframes scrollAnime2 {
	0% {
		transform: translateX(120%);
	}
	100% {
		transform: translateX(-120%);
	}
}
.logo {
	width: 160px;
	height: 40px;
	// background-color: red;
	position: absolute;
	z-index: 999;
	top: 8px;
	left: 60px;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(~assets/logo_chat.png);
}
.navbar {
	height: 50px;
	line-height: 50px;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
	position: relative;
	.hamburger-container {
		// line-height: 58px;
		// height: 50px;
		// float: left;
		padding: 0 10px;
		z-index: 999;
	}

	.screenfull {
		position: absolute;
		right: 90px;
		top: 16px;
		color: red;
	}

	.avatar-container {
		height: 50px;
		display: inline-block;
		position: absolute;
		right: 35px;

		.avatar-wrapper {
			cursor: pointer;
			margin-top: 5px;
			position: relative;
			line-height: initial;

			.user-avatar {
				width: 40px;
				height: 40px;
				border-radius: 10px;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center center;
			}

			.el-icon-caret-bottom {
				position: absolute;
				right: -20px;
				top: 25px;
				font-size: 12px;
			}
		}
	}
}
</style>
