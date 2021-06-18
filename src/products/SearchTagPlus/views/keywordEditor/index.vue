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
			<b-row class="ml-0 mb-2 mx-auto mt-3 text-center">
				<pagination
					class="mx-auto"
					v-model="page"
					:records="inv.length"

					:per-page="perPage"
				/>
			</b-row>

			<b-list-group v-if="inv">
				<b-list-group-item
					v-for="(inverted, index) in inv.slice(From,To)"
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
			<b-row class="ml-0 mb-2 mx-auto mt-3 text-center">
				<pagination
					class="mx-auto"
					v-model="page"
					:records="inv.length"

					:per-page="perPage"
				/>
			</b-row>

			<div class="backWrap d-flex justify-content-center mb-3" v-if="is_load">
				<b-spinner class="m-auto" variant="primary" label="Spinning"></b-spinner>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { apiUrl, scriptUrl, CLIENT_ID, packageUrl } from './../../utils/configration';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { UpdateServer } from '@/api/updateServer';
import { eventHub } from '@/init/eventHub';
import { Ajax, Wait } from '@/utils/parts';
import { KeywordEditorButtons } from '../../config';
import Pagination from "vue-pagination-2";

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
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
		number(n: number) {
			return n.toFixed(2);
			// return Math.floor(n * 100) * 0.01;
		},
	},
	components: { Pagination },

})
export default class KeywordEditorComp extends Vue {
	private ajax = new Ajax();
	private step = 0.05;
	private inv: any = [];
	private is_load = false;
	private isTestSave = false;
	private isSave = false;
	@Prop({ default: '' })
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
		return this.$router.currentRoute.meta.title;
	}
	public page: any = 1;
	public perPage = 100;
	get From() {
		return this.perPage * (this.page - 1);
	}
	get To() {
		return this.perPage * (this.page);
	}

	private async init() {
		// if (tabname === "KeywordEditor" && this.inverted_index == null) {
		this.is_load = true;
		this.inverted_index = await this.fetchInvertedIndex();
		this.fetchInverted_indexView();
		this.is_load = false;
		// }
	}

	private async created() {
		this.init();
		// eventHub.$on("tabclick", this.init);
	}

	private destroyed() {
		// eventHub.$off("tabclick", this.init);
	}

	private async getKeyword() {
		this.is_load = true;
		this.inverted_index = await this.fetchInvertedIndex();
		this.fetchInverted_indexView();
		this.is_load = false;
	}

	async syncProdKeyword() {
		this.isSave = true;
		UpdateServer.deployPackageFromTest();
		await this.fetchInverted_indexView();
		await Wait(10000);
		eventHub.$emit('keywordUpdate');
		this.$modal.show('dialog', {
			title: '正常に更新されました',
			text: '',
			buttons: [
				{
					title: 'OK',
				},
			],
		});
		this.isSave = false;
	}

	async syncAllKeyword() {
		this.isSave = true;
		const inverted_indexArray = this.inv.map((o: InvertedObj) => {
			o.manual_weight = o.weight - o.original_weight;
			return o;
		});
		this.inverted_index = {};
		inverted_indexArray.forEach((o: any) => {
			if (this.inverted_index) {
				this.inverted_index[o.key] = o;
			}
		});
		await this.ajax.http({
			baseURL: `${scriptUrl}`,
			url: `update_inverted_index?time=${new Date().getTime()}`,
			method: 'PUT',
			data: {
				product_id: parseInt(CLIENT_ID),
				inverted_index: this.inverted_index,
			},
		});
		await Wait(500);
		await UpdateServer.deployInvertedIndex({ env: 'prod' });
		// await Wait(5000);
		// await UpdateServer.deployPackageFromTest();
		await this.fetchInverted_indexView();
		await Wait(10000);
		eventHub.$emit('keywordUpdate');
		this.$modal.show('dialog', {
			title: '正常に更新されました',
			text: '',
			buttons: [
				{
					title: 'OK',
				},
			],
		});
		this.isSave = false;
	}

	private syncKeyword(isTest = false) {
		this.isTestSave = true;
		// https://nlp.ai-x-supporter.com/api/update_inverted_index/api/update_inverted_index/
		// data:{
		// 		"product_id":parseInt(serviceConfiguration.product[0]),
		const inverted_indexArray = this.inv.map((o: InvertedObj) => {
			o.manual_weight = o.weight - o.original_weight;
			return o;
		});
		this.inverted_index = {};
		inverted_indexArray.forEach((o: any) => {
			if (this.inverted_index) {
				this.inverted_index[o.key] = o;
			}
		});
		this.ajax
			.http({
				baseURL: `${scriptUrl}`,
				url: `update_inverted_index?time=${new Date().getTime()}`,
				method: 'PUT',
				data: {
					product_id: parseInt(CLIENT_ID),
					inverted_index: this.inverted_index,
				},
			})
			.then(
				async res => {
					await UpdateServer.deployInvertedIndex();
					// await UpdateServer.update({
					// 	env: isTest ? "test" : "prod",
					// 	time: new Date().getTime(),
					// });
					await this.fetchInverted_indexView();
					this.$modal.show('dialog', {
						title: '正常に更新されました',
						text: '',
						buttons: [
							{
								title: 'OK',
							},
						],
					});
					await Wait(10000);
					eventHub.$emit('keywordUpdate');
					this.isTestSave = false;
				},
				res => {
					this.$modal.show('dialog', {
						title: '更新が失敗しました',
						text: '',
						buttons: [
							{
								title: 'OK',
							},
						],
					});
					this.isTestSave = false;
				},
			);
	}

	// private fetchInvertedIndex(): Promise<any> {
	// 	return new Promise((r: any) => {
	// 		this.ajax
	// 			.http({
	// 				baseURL: `${packageUrl}`,
	// 				url: `${CLIENT_ID}/bot_package_test.json?${new Date().getTime()}`,
	// 				method: "GET"
	// 			})
	// 			.then((res: any) => {
	// 				r(res.inverted_index);
	// 			});
	// 	});
	// }
	private fetchInvertedIndex(): Promise<any> {
		return new Promise((r: any) => {
			this.ajax
				.http({
					baseURL: `${scriptUrl}`,
					url: `inverted_index_data/?product_id=${CLIENT_ID}&time=${new Date().getTime()}`,
					method: 'GET',
				})
				.then((res: any) => {
					r(res);
				});
		});
	}

	private fetchInverted_indexView() {
		if (!this.inverted_index) {
			return;
		}
		this.inv = Object.keys(this.inverted_index)
			.map((o: any) => {
				if (!this.inverted_index) {
					return;
				}
				const obj: any = {
					key: o,
					manual_weight: this.inverted_index[o].manual_weight,
					original_weight: this.inverted_index[o].original_weight,
					weight: (() => {
						return this.inverted_index[o].original_weight + this.inverted_index[o].manual_weight;
					})(),
				};
				return obj;
			})
			.sort((a: any, b: any) => {
				if (a.weight > b.weight) {
					return -1;
				}
				if (a.weight < b.weight) {
					return 1;
				}
				return 0;
			});
	}
}
</script>
<style type="sass"></style>
<style type="sass" scoped>
.text-center {
	text-align: center;
}
</style>
