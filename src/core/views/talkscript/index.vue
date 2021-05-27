<template>
	<div>
		<b-row>
			<b-col lg="4" class="pb-2">
				<b-button v-on:click="save"><b-spinner small v-if="isSave"></b-spinner>保存</b-button>
			</b-col>
		</b-row>
		<edit-wrap />
		<b-row>
			<b-col lg="4" class="pb-2">
				<b-button class="addButton" @click="addRoot()" variant="outline-secondary">新規追加</b-button>
			</b-col>
		</b-row>
		<sl-vue-tree v-model="ScriptTreeData" @nodeclick="select" @nodecontextmenu="showContextMenu" ref="slVueTree">
			<template slot="title" slot-scope="{ node }">
				<span class="item-icon">
					<i class="fa fa-file" v-if="node.isLeaf"></i>
					<i class="fa fa-folder" v-if="!node.isLeaf"></i>
				</span>
				{{ node.data.text }}
			</template>
			<template slot="sidebar" slot-scope="{ node }">
				<b-button class="addButton" v-if="!node.isLeaf" @click="addChild(node)" variant="outline-secondary">+</b-button>
			</template>
		</sl-vue-tree>
		<div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
			<div @click="removeNode">Remove</div>
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
