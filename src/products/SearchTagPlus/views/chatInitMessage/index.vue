<template>
	<div>
		<div class="mb-2" v-html="$sanitize(discription)"></div>
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

		<!-- <edit-wrap/> -->
		<draggable :list="messageList" class="list-group" ghost-class="ghost" handle=".handle">
			<div class="list-group-item" v-for="(element, i) in messageList" :key="element.id">
				<b-form-group label="メッセージ">
					<i class="fa fa-align-justify handle"></i>
					<b-form-input name="title" class="form-control" type="text" v-model="element.text" />
					<b-form-checkbox v-model="element.isEscalated" @change="messageEscalatedChange($event, i)">有人メッセージ</b-form-checkbox>
				</b-form-group>
				<button @click="removeScript(i)">-</button>
			</div>
		</draggable>
		<div class="yokuarushitsumon__buttonWrap mt-2">
			<b-button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" v-on:click="addMessage()">追加</b-button>
		</div>
		<div class="yokuarushitsumon__buttonWrap mt-2">
			<b-button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent questionUpdateBtn" v-on:click="updateMessage()">更新</b-button>
		</div>
		<wrap-sppiner v-if="isLoad" />
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import axios from 'axios';
import { getList } from '@/api/table';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { Ajax } from '@/utils/parts';
import { CLIENT_ID, s3, subsystemUrl } from './../../utils/configration';
import { UpdateServer } from '@/api/updateServer';
import draggable from 'vuedraggable';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
import InputTag from '@/components/InputTag/index.vue';
// @ts-ignore
@Component({
	filters: {},
	components: { draggable },
})
export default class Yokuaru extends Vue {
	private ajax: Ajax = new Ajax();
	private cans: Array<any> = [];
	private isCanload = false;
	private isSynonymload = false;
	private readonly = false;
	private messageList: Array<{ text: string; isEscalated: boolean }> = [];
	private selected: any = {};
	private currentScript: any = {};
	private isPull = false;
	private isLoad = false;
	@Prop({ default: '' })
	private discription?: string;

	doThis(event: any) {
		console.log(event);
		return '';
	}

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

	messageEscalatedChange(a: any, index: number) {
		if (a) {
			for (let i = 0; i < this.messageList.length; i++) {
				if (index == i) {
					continue;
				}
				this.messageList[i].isEscalated = false;
			}
		}
	}

	public pullScript() {
		axios({
			baseURL: `${s3}/${CLIENT_ID}`,
			url: `category.json?version=${new Date().getTime()}`,
			method: 'GET',
		}).then(
			(res: any) => {
				this.messageList = [];
				console.log(res);
				for (const key in res.data) {
					if (key == 'escalated') {
						this.messageList.push({ text: res.data[key], isEscalated: true });
					} else {
						this.messageList.push({ text: res.data[key], isEscalated: false });
					}
				}
				this.isPull = true;
			},

			res => {
				this.isPull = true;
			},
		);
	}

	public addMessage() {
		this.messageList.push({ text: '', isEscalated: false });
	}

	public removeScript(index: number) {
		this.messageList = this.messageList.filter((o: any, i: number) => i != index);
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

	public async updateMessage() {
		this.isLoad = true;
		// const jsonList=btoa(unescape(encodeURIComponent(JSON.stringify(this.talkScriptList))));
		const object = { key: 'data', n: 10 };
		const data: any = {};
		let count = 1;
		for (const item of this.messageList) {
			const text = item.text;
			if (item.isEscalated) {
				data.escalated = text;
			} else {
				data[`menu${('0' + count++).slice(-2)}`] = text;
			}
		}
		const json = JSON.stringify(data);
		const blob = new Blob([json], { type: 'application/json' });
		const reader: any = new FileReader();
		const base64Str = await this.loadFileAsBase64(blob);
		this.ajax
			.http({
				baseURL: `${subsystemUrl}/product/${CLIENT_ID}`,
				url: 'upload',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				data: {
					data: base64Str,
					fileName: '/category.json',
				},
			})
			.then(
				(res: any) => {
					this.isLoad = false;
					this.$modal.show('アップロードしました');
					this.$modal.show('dialog', {
						title: 'アップロードしました',
						text: '',
						buttons: [
							{
								title: 'はい',
								handler: () => {
									this.$modal.hide('dialog');
								},
							},
						],
					});
				},
				// tslint:disable-next-line:no-empty
				res => {
					this.isLoad = false;
				},
			);
	}
}
</script>
<style type="sass" lang="scss"></style>
<style type="sass" lang="scss" scoped></style>
