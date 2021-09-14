<template>
	<div>
		<TabHeader>
			<span v-for="(type, i) in KeywordEditorButtons" :key="i">
				<b-button
					size="sm"
					@click="syncKeyword(true)"
					class="mr-2"
					v-if="type == 'test'"
				>
					<b-spinner small v-if="isTestSave"></b-spinner>テスト環境に反映
				</b-button>
				<b-button
					size="sm"
					@click="syncProdKeyword()"
					variant="primary"
					v-if="type == 'test'"
				>
					<b-spinner small v-if="isSave"></b-spinner>本番環境に反映
				</b-button>
				<b-button size="sm" v-on:click="syncAllKeyword()" v-if="type == 'all'">
					<b-spinner small v-if="isSave"></b-spinner>本番環境に反映
				</b-button>
			</span>
		</TabHeader>
		<div class="tab-body">
			<!-- <div class="mb-2 text-discription" v-html="$sanitize(discription)"></div> -->
			<b-alert show variant="info" v-if="discription">
				<b-icon
					icon="info-circle"
					font-scale="1"
					v-b-popover.hover.right="
						'キーワードの重みを調整すると、AIがレコメンドするQ&Aを調整できます。キーワードの重みが大きいと、そのキーワードがユーザーの入力と一致したときに、そのキーワードが付いているQ&Aを優先的にレコメンドします。詳しくは担当者からお送りするマニュアルをご覧ください。'
					"
				></b-icon>
				<span
					class="text-discription __Info"
					v-html="$sanitize(discription)"
				></span>
			</b-alert>
			<!-- <b-button v-on:click="getKeyword">更新</b-button> -->

			<!-- <div class="section" v-for="(inverted,index) in inv" v-bind:key="index">
				<BCardAccordion :title="inverted.key" class :visible="false">
<template slot="header"><div class="h3" :style="{fontSize:((inverted.weight+10)/(10*2)*20)+'px'}">{{inverted.key}}<b-badge>{{inverted.weight | number}}</b-badge></div></template>
					<template slot="body">
						<el-slider :step="0.05" v-model="inverted.weight" :min="0" :max="10"></el-slider>
						<span class="text-center">{{inverted.weight | number}}</span>
					</template>
				</BCardAccordion>
			</div>-->
			<!-- <b-list-group v-if="inv">
				<b-list-group-item class="text-center" v-for="(inverted,index) in inv" v-bind:key="index" >
					<span class="demonstration h4">{{inverted.key}}</span>
					<el-slider :step="0.05" v-model="inverted.weight" :min="0" :max="10"></el-slider>
					<span>{{inverted.weight | number}}</span>
				</b-list-group-item>
			</b-list-group>-->
			<b-list-group v-if="inv">
				<b-list-group-item
					v-for="(inverted, index) in inv"
					v-bind:key="index"
					class="text-center"
				>
					<h3 class="h2">{{ inverted.key }}</h3>
					<div variant="light">{{ inverted.weight | number }}</div>
					<b-collapse :id="'collapse-' + index" visible>
						<el-slider
							:step="0.05"
							v-model="inverted.weight"
							:min="0"
							:max="10"
						></el-slider>
					</b-collapse>
				</b-list-group-item>
			</b-list-group>
			<b-row class="ml-0 mb-2 mx-auto mt-3"> </b-row>
			<div class="backWrap d-flex justify-content-center mb-3" v-if="is_load">
				<b-spinner class="m-auto" variant="primary" label="Spinning"></b-spinner>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from "uuid";
import {
	apiUrl,
	scriptUrl,
	CLIENT_ID,
	packageUrl,
} from "./../../utils/configration";
import { Component, Vue, Prop } from "vue-property-decorator";

import { eventHub } from "@/init/eventHub";
import { Ajax, Wait } from "@/utils/parts";
import { KeywordEditorButtons } from "../../config";
interface InvertedObj {
	key: string;
	manual_weight: number;
	original_weight: number;
	scripts: Array<any>;
	size: number;
	weight: number;
}
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: "success",
				draft: "gray",
				deleted: "danger",
			};
			return statusMap[status];
		},
		number(n: number) {
			return n.toFixed(2);
			// return Math.floor(n * 100) * 0.01;
		},
	},
})
export default class TagsComp extends Vue {
	private ajax = new Ajax();
	private step = 0.05;
	private inv: any = [];
	private is_load = false;
	private isTestSave = false;
	private isSave = false;
	@Prop({ default: "" })
	private discription?: string;

	private KeywordEditorButtons = KeywordEditorButtons;
	private inverted_index: {
		[key: string]: {
			weight: number;
			original_weight: number;
			manual_weight: number;
		};
	} | null = null;

	get Title() {
		return this.$router.currentRoute.meta?.title || "";
	}

	private async init() {
		// if (tabname === "KeywordEditor" && this.inverted_index == null) {
		this.is_load = true;

		this.is_load = false;
		// }
	}
}
</script>
<style type="sass"></style>
<style type="sass" scoped>
.text-center {
	text-align: center;
}
</style>
