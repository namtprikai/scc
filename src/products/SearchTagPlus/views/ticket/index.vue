<template>
	<div>
		<h2>チケット</h2>
		<b-container>
			<b-row>
				<b-col lg="6">
					<el-date-picker picker-options="{lang:'ja'}" v-model="startdate" type="date" placeholder="Pick a date" style="width: 100%" />
				</b-col>
				<b-col lg="6">
					<el-date-picker v-model="enddate" type="date" placeholder="Pick a date" style="width: 100%" />
				</b-col>
			</b-row>
			<hr />
			<b-row>
				<b-col>
					<b-form-group label="ステータス" class="lead">
						<b-form-checkbox v-for="searchStatus in searchStatuses" v-model="selectedStatuses" v-bind:key="searchStatus.value" v-bind:value="searchStatus.value" inline>{{
							searchStatus.text
						}}</b-form-checkbox>
					</b-form-group>
					<b-button v-on:click="selectAllStatus" class="mr-2">全て</b-button>
					<b-button v-on:click="unselectAllStatus">解除</b-button>
				</b-col>
			</b-row>
			<!-- <b-row>
				<b-col>
					<b-form-group label="BOT or 有人">
						<b-form-checkbox
							v-for="searchMode in searchModes"
							v-model="selectedModes"
							v-bind:key="searchMode.value"
							v-bind:value="searchMode.value"
							inline
						>{{ searchMode.text }}</b-form-checkbox>
					</b-form-group>
					<b-button v-on:click="selectAllModes" class="mr-2">全て</b-button>
					<b-button v-on:click="unselectAllModes">解除</b-button>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-form-group label="担当者">
						<b-form-checkbox-group
							id="searchUsers"
							v-model="selectedUsers"
							v-bind:options="searchUsers"
							inline
						></b-form-checkbox-group>
					</b-form-group>
					<b-button v-on:click="selectAllUsers" class="mr-2">全て</b-button>
					<b-button v-on:click="unselectAllUsers">解除</b-button>
				</b-col>
			</b-row> -->
			<hr />
			<b-row>
				<b-col lg="6" class="pb-2 mt-20" style="margin-top: 20px">
					<b-button v-on:click="search()" variant="primary" class="mr-2"><b-spinner small v-if="listLoading"></b-spinner>検索</b-button>
					<b-button v-on:click="csv()">CSVダウンロード</b-button>
				</b-col>
			</b-row>
		</b-container>
		<el-table v-if="Ticket.length > 0" v-loading="listLoading" :data="Ticket" element-loading-text="Loading" border fit highlight-current-row>
			<el-table-column v-for="value in Object.keys(ticketLabels)" align="center" v-bind:key="value" v-bind:label="ticketLabels[value]">
				<template slot-scope="scope">{{ scope.row[value] }}</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TicketCompParent from '@/views/ticket';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({})
export default class TicketComp extends TicketCompParent {
	protected searchStatuses = [
		{ value: 'open', text: '離脱' },
		// { value: "escalated", text: "直通" },
		{ value: 'answered', text: '回答済み' },
		{ value: 'scriptNotFound', text: '未収録' },
		{ value: 'searchFailed', text: '検索失敗' },
		{ value: 're-search', text: '再検索' },
		// { value: "unsupported", text: "未対応" },
		{ value: 'quit', text: '未完了' },
	];
}
</script>
<style type="sass">
.sl-vue-tree-title {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
<style type="sass" scoped>
@import '~sl-vue-tree/dist/sl-vue-tree-minimal.css';
/* .sl-vue-tree-node {
	margin-left: 20px;
	padding-left: 20px;
}
.sl-vue-tree {
	margin-left: 20px;
	padding-left: 20px;
} */
.addButton {
	right: 0px;
	display: block;
	float: right;
}
.sl-vue-tree-title {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.contextmenu {
	position: fixed;
	background-color: white;
	color: black;
	border-radius: 2px;
	cursor: pointer;
}
.contextmenu > div {
	padding: 10px;
}
.contextmenu > div:hover {
	background-color: rgba(100, 100, 255, 0.5);
}
.last-event {
	color: white;
	background-color: rgba(100, 100, 255, 0.5);
	padding: 10px;
	border-radius: 2px;
}
.tree-container {
	flex-grow: 1;
}
.sl-vue-tree.sl-vue-tree-root {
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: auto;
	/* height: 300px; */
}
.json-preview {
	flex-grow: 1;
	margin-left: 10px;
	background-color: #13242d;
	border: 1px solid black;
	padding: 10px;
}
.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
