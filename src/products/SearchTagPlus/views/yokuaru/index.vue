<template>
	<div>
		<TabHeader>
			<b-button size="sm" class="ml-2" v-on:click="updateScript()"
				><b-spinner small v-if="isSave"></b-spinner>反映</b-button
			>
		</TabHeader>
		<div class="tab-body">
      <b-alert show variant="info" v-if="discription">

				<span class="text-discription __Info" v-html="$sanitize(discription)"></span>
			</b-alert>
			<h4 class="yokuarushitsumon__subtitle">選択したQ&A</h4>
			<div
				ng-if="selected.id"
				class="demo-card-wide mdl-card mdl-shadow--2d"
				style="
					width: 90%;
					margin: auto;
					box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
						0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
				"
			>
				<div class="mdl-card__title">
					<h4 class="mdl-card__title-text">{{ selected.text }}</h4>
				</div>
			</div>

			<div class="yokuarushitsumon__buttonWrap">
				<b-button
					v-on:click="addScript()"
					class="mdl-button mdl-js-button mdl-button--raised"
					>選択したタイトルをよくある質問に追加</b-button
				>
			</div>
			<!-- <edit-wrap/> -->
			<draggable
				:list="talkScriptList"
				class="list-group"
				ghost-class="ghost"
				@start="dragging = true"
				@end="dragging = false"
			>
				<div
					class="list-group-item"
					v-for="element in talkScriptList"
					:key="element.id"
				>
					{{ element.text }}
					<button @click="removeScript(element.id)">-</button>
				</div>
			</draggable>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import axios from 'axios';
import { getList } from '@/api/table';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID, s3, subsystemUrl } from './../../utils/configration';
import { UpdateServer } from '@/api/updateServer';
import draggable from 'vuedraggable';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {},
	components: { draggable },
})
export default class Yokuaru extends Vue {
  @Prop({ default: '' })
	private discription?: string;
	private ajax: Ajax = new Ajax();
	private cans: Array<any> = [];
	private isCanload = false;
	private isSynonymload = false;
	private readonly = false;
	private talkScriptList: Array<any> = [];
	private selected: any = {};
	private currentScript: any = {};
	private isPull = false;
	public created() {
		this.pullScript();
		eventHub.$on('setScript', this.setCurrentScript);
	}

	private destroyed() {
		eventHub.$off('setCurrentMessage', this.setCurrentScript);
	}

	public setCurrentScript(data: any) {
		this.selected = data.data;
	}

	public pullScript() {
		axios({
			baseURL: `${s3}/${PRODUCT_ID}`,
			url: 'yokuaru.json',
			method: 'GET',
		}).then(
			(res: any) => {
				this.talkScriptList = res.data;
				this.isPull = true;
			},

			res => {
				this.isPull = true;
			},
		);
	}

	public addScript() {
		if (this.selected && 'id' in this.selected && this.talkScriptList.filter(o => o.id === this.selected.id).length === 0) {
			this.talkScriptList.push(this.selected);
		}
	}

	public removeScript(id: string) {
		this.talkScriptList = this.talkScriptList.filter((o: any) => String(o.id) !== String(id));
	}

	protected loadFileAsBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				if (!blob) {
					throw new Error('file undefined.');
				}

				const reader: any = new FileReader();
				reader.onloadend = () => {
					const base64Str = reader.result.split(',')[1];
					resolve(base64Str);
				};
				reader.readAsDataURL(blob);
			} catch (err) {
				reject(err);
			}
		});
	}
  public isSave:boolean = false;
	public async updateScript() {
    this.isSave=true;
		// const jsonList=btoa(unescape(encodeURIComponent(JSON.stringify(this.talkScriptList))));
		const object = { key: 'data', n: 10 };
		const json = JSON.stringify(this.talkScriptList);
		const blob = new Blob([json], { type: 'application/json' });
		const reader: any = new FileReader();
		const base64Str = await this.loadFileAsBase64(blob);
		this.ajax
			.http({
				baseURL: `${subsystemUrl}/product/${PRODUCT_ID}`,
				url: 'upload',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: {
					data: base64Str,
					fileName: '/yokuaru.json',
				},
			})
			.then(
				(res: any) => {
          		this.$bvToast.toast("正常にアップロードしました", {
			// title: `挿入されました`,
			toaster: "b-toaster-top-center",
			solid: true,
			appendToast: true,
		});
				},
				// tslint:disable-next-line:no-empty
				res => {},
      )
      .finally(()=>{
        this.isSave=false;
      });
	}
}
</script>
<style type="sass" lang="scss"></style>
<style type="sass" lang="scss" scoped></style>
