<template>
	<div>
<CategoryComp />
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
