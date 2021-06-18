<template>
	<div class="tab-body">
		<b-alert show variant="info" v-if="discription">
			<span class="text-discription __Info" v-html="$sanitize(discription)"></span>
		</b-alert>
		<!-- <b-button v-on:click="getKeyword">更新</b-button> -->
		<!-- <b-list-group v-if="inv">
			<b-list-group-item class="text-center" v-for="(inverted,index) in inv" v-bind:key="index">
				<span class="demonstration h4">{{inverted.key}}</span>
				<el-slider
					:step="0.05"
					v-model="inverted.weight"
					:min="0"
					:max="10"
					disabled
					:show-input-controls="false"
				></el-slider>
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

		<b-list-group-item
			v-for="(inverted, index) in inv.slice(From,To)"
			v-bind:key="index"
			class="text-center"
		>
			<h3 class="h2">{{ inverted.key }}</h3>
			<div variant="light">{{ inverted.weight | number }}</div>
			<b-collapse :id="'collapse-p-' + index" visible>
				<el-slider
					:step="0.05"
					v-model="inverted.weight"
					:min="0"
					:max="10"
					disabled
					:show-input-controls="false"
				></el-slider>
			</b-collapse>
		</b-list-group-item>
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
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { apiUrl, scriptUrl, CLIENT_ID, packageUrl } from './../../utils/configration';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { Ajax } from '@/utils/parts';
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
export default class KeywordShowComp extends Vue {
	private ajax = new Ajax();
	private step = 0.05;
	private inv: any = [];
	private is_load = false;
	@Prop({ default: '' })
	private discription?: string;

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
		this.getKeyword();
	}

	private async created() {
		this.init();
		eventHub.$on('keywordUpdate', this.getKeyword);
	}

	private destroyed() {
		eventHub.$off('keywordUpdate', this.getKeyword);
	}

	private async getKeyword() {
		this.is_load = true;
		this.inverted_index = await this.fetchInvertedIndex(new Date().getTime());
		this.fetchInverted_indexView();
		this.is_load = false;
	}

	private syncKeyword() {
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
				url: `update_inverted_index?${new Date().getTime()}`,
				method: 'PUT',
				data: {
					product_id: parseInt(CLIENT_ID, 10),
					inverted_index: this.inverted_index,
				},
			})
			.then(
				res => {
					this.fetchInverted_indexView();
					this.$forceUpdate();
					this.$modal.show('dialog', {
						title: '正常に更新されました',
						text: '',
						buttons: [
							{
								title: 'OK',
							},
						],
					});
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
				},
			);
	}

	private fetchInvertedIndex(time: number): Promise<any> {
		return new Promise((r: any) => {
      console.log(packageUrl);
			this.ajax
				.http({
					baseURL: `${packageUrl}`,
					url: `${CLIENT_ID}/tag_package.json?${time}`,
					method: 'GET',
				})
				.then((res: any) => {
					r(res.inverted_index);
				})
        .catch((res: any) => {
					r([]);
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
<style type="sass" scoped></style>
