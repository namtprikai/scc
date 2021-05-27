<template>
	<div>
		<h2>類義語一覧</h2>
		<b-button v-on:click="pushSynonim">保存</b-button>
		<p v-if="synonym.length == 0">対義語がありません</p>
		<b-form-group label="類義語検索" description="キーワードを入力すると類義語が絞り込まれます。">
			<b-form-input type="text" v-model="presearchText" />
		</b-form-group>
		<!-- <b-list-group> -->
		<transition-group name="list" tag="ul">
			<li v-for="(item, index) in synonymFilter(synonym)" :key="item.key" class="synonymList__list">
				<b-list-group-item>
					<b-input type="text" v-model="item.key" />
					<input-tag v-model="item.syn" />
					<b-button v-on:click="deleateItem(index)" disabled>削除</b-button>
				</b-list-group-item>
			</li>
		</transition-group>
		<b-list-group-item class="text-center list-complete-item" button v-on:click="addItem()">+</b-list-group-item>
		<!-- </b-list-group> -->
		<b-button v-on:click="pushSynonim">保存</b-button>
		<div class="backWrap d-flex justify-content-center mb-3" v-if="isSynonymload">
			<b-spinner class="m-auto" variant="primary" label="Spinning"></b-spinner>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { apiUrl, scriptUrl, PRODUCT_ID } from './../../utils/configration';
import { UpdateServer } from '@/api/updateServer';
import { Ajax, RequeuestWokersService } from '@/utils/parts';
import InputTag from '@/components/InputTag/index.vue';
// @ts-ignore
@Component({
	filters: {},
	components: { InputTag },
})
export default class Synonym extends Vue {
	private isSynonymload = true;
	private pureSynonym: any = {};
	private oldsynonym: Array<any> = [];
	private synonym: Array<any> = [];
	private ajax = new Ajax();
	private presearchText = '';
	private searchText = '';
	private requeuestWokersService = new RequeuestWokersService(new Ajax());
	private created() {
		console.log('created');
		this.fetchSynonim().then(() => {
			this.isSynonymload = false;
		});
	}

	private changeSearchTextId: any = null;
	@Watch('presearchText')
	public changeSearchText() {
		if (this.changeSearchTextId !== null) {
			clearTimeout(this.changeSearchTextId);
		}
		this.changeSearchTextId = setTimeout(() => {
			this.searchText = this.presearchText;
		}, 3000);
	}

	public synonymFilter(synonymList: Array<string>) {
		return synonymList.filter((s: any) => `${s.key}`.indexOf(this.searchText) != -1);
	}

	public async fetchSynonim() {
		const { synonym, error } = await this.getSynonim();
		if (error) {
			return { error: true, key: null, cans: null };
		} else {
			this.pureSynonym = synonym;
			this.oldsynonym = this.makeTable(synonym);
			this.synonym = this.makeTable(synonym);
		}
	}

	private makeTable(synonym: any) {
		const table: any = {};
		for (const key in synonym) {
			if (!table.hasOwnProperty(synonym[key])) {
				table[synonym[key]] = [];
			}
			table[synonym[key]].push(key);
		}
		return Object.keys(table).map((key: any) => {
			return { key, syn: [...new Set(table[key])].filter(o => o !== key) };
		});
	}

	private deleateItem(index: any) {
		this.synonym.splice(index, 1);
	}

	private makeSynonym(table: any) {
		const synonym: any = {};
		for (let i = 0; i < table.length; i++) {
			for (let j = 0; j < table.syn.length; j++) {
				synonym[table[i].syn[j]] = table[i].key;
			}
		}
		return synonym;
	}

	private addItem() {
		if (this.synonym === undefined) {
			this.synonym = [];
		}
		this.synonym.push({ key: '', syn: [] });
	}

	private getKeyAndCans(
		key: string,
		cans: Array<string> = [],
	): {
			key: string | null;
			cans: Array<string> | null;
			error: boolean | null;
		} {
		const valueList = cans;
		valueList.push(key);

		let keyValue = null;
		Object.keys(this.pureSynonym).forEach((_key: string, i: number) => {
			const value = this.pureSynonym[_key];
			if (valueList.indexOf(value) !== -1) {
				keyValue = value;
			}
		});
		if (keyValue == null) {
			keyValue = key;
		}
		if (keyValue !== null) {
			return { key: keyValue, cans: valueList, error: false };
		}
		return { key: '', cans: valueList, error: true };
	}

	private getSynonim() {
		return new Promise<any>((resolve: any, reject: any) => {
			this.ajax
				.http({
					baseURL: `${scriptUrl}`,
					url: `get_script/?path=${PRODUCT_ID}/synonym_dict.json`,
					method: 'GET',
				})
				.then(
					res => {
						resolve({ synonym: res, error: false });
					},
					res => {
						resolve({ synonym: res, error: true });
					},
				);
		});
	}

	public async pushSynonim() {
		this.isSynonymload = true;
		const synonymList: any = this.synonym.filter((sy: any) => {
			for (let i = 0; i < this.oldsynonym.length; i++) {
				if (JSON.stringify(sy) === JSON.stringify(this.oldsynonym[i])) {
					return false;
				}
			}
			return true;
		});
		// synonymList = [].concat(synonymList);
		synonymList.forEach((syn: any) => {
			const synonims = [].concat(syn.syn);
			const { key, cans, error } = this.getKeyAndCans(syn.key, synonims);
			if (!error) {
				this.requeuestWokersService.setQueue(
					{
						baseURL: `${scriptUrl}`,
						url: 'update_synonym',
						method: 'PUT',
						data: {
							product_id: PRODUCT_ID,
							word: key,
							synonyms: cans,
						},
					},
					() => {},
				);
			}
		});
		// const data = await this.requeuestWokersService.start();
		// console.log(data);
		await this.requeuestWokersService.start();
		// this.updateServer('');
		await UpdateServer.update();
		await this.fetchSynonim();
		this.isSynonymload = false;
		// return data;
	}
}
</script>

<style lang="scss">
// .flip-complete-enter-active,
// .flip-complete-leave-active,
// .flip-complete-move {
// 	transition: transform 1s;
// }
.list-complete-item {
	transition: all 1s;
	display: list-item !important;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
	opacity: 0;
	transform: translateX(1300px);
}
.list-complete-enter-to {
	opacity: 1;
	transform: translateX(0) scaleY(1);
}
.list-complete-leave-active {
	position: absolute;
}

.list-enter-active,
.list-leave-active,
.list-move {
	transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
	transition-property: opacity, transform;
}

.list-enter {
	opacity: 0;
	transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
	opacity: 1;
	transform: translateX(0) scaleY(1);
}

.list-leave-active {
	position: absolute;
}

.list-leave-to {
	opacity: 0;
	// transform: scaleY(0);
	transform: translateX(1300px);
	transform-origin: center top;
}
.synonymList__list {
	padding: 0;
	margin: 0;
	list-style-type: none;
}
</style>
