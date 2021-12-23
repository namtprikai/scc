<template>
	<div>
		<h2>類義語</h2>
		<p>{{ synonymvalue }}</p>
		<p v-if="cans.length <= 0">対義語がありません</p>
		<b-list-group>
			<b-list-group-item v-for="item in cans" :key="item.id">
				<b-form-checkbox v-model="item.flag">
					<b-input type="text" v-model="item.text" />
				</b-form-checkbox>
			</b-list-group-item>
			<b-list-group-item class="text-center" button v-on:click="addCandidate('')"
				>+</b-list-group-item
			>
		</b-list-group>
		<b-button v-on:click="async">保存</b-button>
		<div class="backWrap d-flex justify-content-center mb-3" v-if="is_canload">
			<b-spinner class="m-auto" variant="primary" label="Spinning"></b-spinner>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { apiUrl, scriptUrl, CLIENT_ID } from "@consoletype/utils/configration";
// @ts-ignore
@Component
export default class Synonym extends Vue {
	@Prop()
	private synonymvalue: any;

	private cans: Array<any> = [];
	private is_canload = false;
	private is_synonymload = false;
	private readonly = false;
	private is_cans = false;
	private created() {
		console.log("created");
		this.getCandidate();
	}

	private mounted() {
		console.log("mounted");
	}

	addText = "";
	addCandidate(text = "") {
		try {
			if (this.cans == null || !this.cans[0].is) {
				this.cans = [];
			}
		} catch (e) {
			this.cans = [];
		}
		this.cans.push({
			text: text,
			is: true,
			flag: true,
			word: this.synonymvalue,
		});
		setTimeout(() => {
			this.addText = "";
		}, 100);
	}

	removeCandidate(text: string) {
		try {
			if (this.cans == null || !this.cans[0].is) {
				this.cans = [];
			}
		} catch (e) {
			this.cans = [];
		}
		this.cans = this.cans.filter((o) => o.text != text);
		// this.updateCandidate(data,this.cans.map(o=>o.text));
	}

	getSynonim() {
		return new Promise<any>((resolve: any, reject: any) => {
				Promise.resolve()
				.then(
					(res) => {
						resolve({ synonym: res, error: false });
					},
					(res) => {
						resolve({ synonym: res, error: true });
					}
				);
		});
	}

	@Watch("synonymvalue")
	getCandidate() {
		console.log("getCandidate");
		const text = this.synonymvalue;
		if (!text) {
			return;
		}
		this.is_synonymload = true;
		this.is_cans = false;
		this.cans = [];
		// AjaxService.getInstance()
		// 	.http({
		// 		baseURL: `${scriptUrl}`,
		// 		url: "get_synonym/",
		// 		method: "GET",
		// 		params: {
		// 			q: text,
		// 			product_id: CLIENT_ID,
		// 		},
		// 	})
		// 	.then(
		// 		(res: any) => {
		// 			if (typeof res === "string") {
		// 				this.cans = [{ text: res, is: false }];
		// 			} else {
		// 				this.cans = res.map((el: any) => {
		// 					return { text: el, is: true, flag: true, word: text };
		// 				});
		// 			}
		// 			setTimeout(() => {
		// 				this.is_synonymload = false;
		// 			}, 100);
		// 		},
		// 		(res) => {
		// 			setTimeout(() => {
		// 				this.is_synonymload = false;
		// 			});
		// 		}
		// 	);
	}

	async() {
		// console.log(data);
		this.updateCandidate(
			this.synonymvalue,
			this.cans.filter((o) => o.flag).map((o) => o.text)
		);
	}

	async getKeyAndCans(
		key: string,
		cans: Array<string> = []
	): Promise<{
		key: string | null;
		cans: Array<string> | null;
		error: boolean | null;
	}> {
		const valueList:Array<string> = cans||[];
		valueList.push(key);
		const { synonym, error } = await this.getSynonim();
		if (error) {
			return { error: true, key: null, cans: null };
		}
		let keyValue:any = null;
		Object.keys(synonym).forEach((_key: string, i: number) => {
			const value = synonym[_key];
			if (valueList.indexOf(value) !== -1) {
				keyValue = value;
			}
		});
		if (keyValue == null) {
			keyValue = key;
		}
		return { key: keyValue, cans: valueList, error: false };
	}

	async updateCandidate(text: string, candidates: Array<string>) {
		const { key, cans, error } = await this.getKeyAndCans(text, candidates);
		console.info(key);
		console.info(cans);
		this.is_canload = true;
		if (!error) {
			// AjaxService.getInstance()
			// 	.http({
			// 		baseURL: `${scriptUrl}`,
			// 		url: "update_synonym/",
			// 		method: "PUT",
			// 		data: {
			// 			product_id: CLIENT_ID,
			// 			word: key,
			// 			synonyms: cans,
			// 		},
			// 	})
			// 	.then(
			// 		async () => {
			//
			// 			await this.getCandidate();
			// 			this.is_canload = false;
			// 		},
			// 		() => {
			// 			this.is_canload = false;
			// 		}
			// 	);
		} else {
			// エラー通知処理
		}
	}
}
</script>

<style lang="sass" scoped></style>
