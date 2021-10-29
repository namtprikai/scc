<template>
	<div class="navbar">
		<hamburger
			:toggle-click="toggleSideBar"
			:is-active="sidebar.opened"
			class="hamburger-container"
		/>
		<!-- <breadcrumb/> -->
		<router-link class="inlineBlock" to="/">
			<div class="logo"></div>
		</router-link>
		<div class="oshirase">
			<span class="oshirase__text">{{ Oshirase }}</span>
			<!-- <span class="oshirase__text oshirase__text--2">{{Oshirase}}</span> -->
		</div>
		<div class="oshirase--link">
			<span v-html="$sanitize(Link)"></span>
		</div>
		<el-dropdown class="avatar-container" trigger="click">
			<div class="avatar-wrapper">
				<!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar"> -->
				<div
					class="user-avatar"
					:style="{ backgroundImage: 'url(' + avatar + ')' }"
				></div>
				<div class="version">{{ version }}</div>
				<i class="el-icon-caret-bottom" />
			</div>
			<el-dropdown-menu slot="dropdown" class="user-dropdown">
				<router-link class="inlineBlock" to="/">
					<el-dropdown-item>アカウント設定</el-dropdown-item>
				</router-link>
				<el-dropdown-item divided>
					<span style="display: block" @click="logout">ログアウト</span>
				</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script lang="ts">
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { url } from "inspector";
import axios from "axios";
import { eventHub } from "@/init/eventHub";

// @ts-ignore
@Component({
	components: {
		Breadcrumb,
		Hamburger,
	},
})
export default class Navbar extends Vue {
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
.version {
	position: absolute;
	bottom: 0px;
	opacity: 0.4;
	left: -24px;
	font-size: 10px;
}
.oshirase {
	margin: auto;
	height: 50px;
	overflow: hidden;
	position: absolute;
	top: -2px;
	width: 600px;
	left: 250px;
	&__text {
		display: inline-block;
		padding-left: 100%;
		white-space: nowrap;
		line-height: 1em;
		animation: scrollAnime 17s linear infinite;
		&--2 {
			padding-left: 0%;
			animation: scrollAnime 17s linear infinite;
		}
	}
	&--link {
		position: absolute;
		animation: none;
		top: 18px;
		width: 600px;
		left: 250px;
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

	.hamburger-container {
		// line-height: 58px;
		// height: 50px;
		float: left;
		padding: 0 10px;
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
