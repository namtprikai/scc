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
			<pan-thumb :image="avatar" style="float: left">
				Your roles:
				<span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
			</pan-thumb>
			<github-corner style="position: absolute; top: 0px; border: 0; right: 0" />
			<div class="info-container">
				<span class="display_name">{{ name }}さんこんにちは</span>
			</div>
		</div>
		<div class="dashboard-contents">
			<img :src="emptyGif" class="dashboard-contents__background" />
		</div>
	</div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped>
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
		z-index: -1;
		border-radius: 50%;
		width: 100%;
		height: auto;
		display: block;
		opacity: 0.4;
		margin: auto;
		top: 0px;
		right: 0px;
		left: 0px;
		bottom: 0px;
	}
}
.dashboard-editor-container {
	background-color: #e3e3e3;
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
		margin-left: 190px;
		height: 150px;
		line-height: 200px;
		.display_name {
			font-size: 48px;
			line-height: 48px;
			color: #212121;
			position: absolute;

			top: 25px;
		}
	}
}
</style>
