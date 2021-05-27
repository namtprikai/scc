<template>
	<div>
		<TabHeader v-if="tabtype === 'dev'">
			<EditEnd />
			<b-button size="sm" class="ml-2" v-on:click="save()" variant="primary" v-if="tabtype === 'dev'" :disabled="isLoad">反映ステップへ進む</b-button>
		</TabHeader>
		<div class="tab-body">
			<b-alert show variant="info" v-if="discription">
				<span class="text-discription __Info" v-html="$sanitize(discription)"></span>
			</b-alert>
			<div v-for="(jpMap, index) in JpMapGroupList" :key="index">
				<BCardAccordion :title="jpMap.label" class="bot-message-config_editor_group section" :visible="tabtype !== 'dev'">
					<template slot="body">
						<!-- <b-form-group :label="m.label" v-for="(m, i) in messageGroup[key].messages" :key="i">

							<b-form-textarea
								class="bot-message-config_editor_item__textarea"
								v-model="m.message"
								:label="m.label"
								rows="3"
								max-rows="5"
								:disabled="isDisabledFromRole(messageGroup[key].role)"
							/>
						</b-form-group>-->
						<div v-for="(value, key, j) in jpMap.jpMapper" :key="j">
							<div v-if="value.type == 'boolean'" class>
								<b-form-checkbox :id="'checkbox-' + j" v-model="data[key]" :name="'checkbox-' + j" value="true" :disabled="IsDisable" unchecked-value="false">{{ key }}</b-form-checkbox>
							</div>
							<div v-if="value.type == 'textarea'" class>
								<b-form-group :label="value.text">
									<b-form-textarea :disabled="IsDisable" class="form-control" type="text" v-model="data[key]" />
								</b-form-group>
							</div>
							<div v-if="value.type == 'object'" class>
								<b-form-group :label="value.text + ' (' + (value['keyMapper'][oKey] || oKey) + ')'" v-for="(oValue, oKey, j) in data[key]" :key="j">
									<div>
										<b-form-textarea class="form-control" :disabled="IsDisable" type="text" v-model="data[key][oKey]" />
									</div>
								</b-form-group>
							</div>
							<!-- <div v-if="value.type=='enquete'" class="listItem">
				<b-form-group :label="key">
					{{data[key]["BOT"]}}
					<div v-for="(eItem,j) in data[key]['BOT']" :key="j">
						<div>質問</div>
						<b-form-input
							class="form-control"
							type="text"
							v-model="data[key]['BOT'][j]['question']['name']"
						/>
						<b-form-input
							class="form-control"
							type="text"
							v-model="data[key]['BOT'][j]['question']['text']"
						/>
						<div>アンサー</div>
						<b-input-group v-for="(ans,k) in data[key]['BOT'][j]['answers']" :key="k">
							<b-form-input
								class="form-control"
								type="text"
								v-model="data[key]['BOT'][j]['answers'][k]['text']"
							/>

							<b-form-input
								class="form-control"
								type="number"
								v-model="data[key]['BOT'][j]['answers'][k]['value']"
							/>
							<b-input-group-append>
								<b-button
									v-on:click="removeBotAnser(data[key]['BOT'][j]['answers'],k)"
									variant="outline-success"
								>削除</b-button>
							</b-input-group-append>
						</b-input-group>
						<b-button v-on:click="addBotAnser(data[key]['BOT'][j]['answers'])">追加</b-button>
					</div>
				</b-form-group>
							</div>-->
							<div v-if="value.type == 'stringArray'" class>
								<b-form-group :label="key">
									<b-input-group v-for="(item, j) in data[key]" :key="j">
										<b-form-input class="form-control" type="text" v-model="data[key][j]" />
										<b-input-group-append>
											<b-button v-on:click="removeArray(data[key], j)" variant="outline-success">削除</b-button>
										</b-input-group-append>
									</b-input-group>
									<b-button v-on:click="addArray(data[key])">追加</b-button>
								</b-form-group>
							</div>
						</div>
					</template>
				</BCardAccordion>
			</div>
		</div>
		<edit-wrap
			v-if="tabtype == 'dev'"
			:messages="['編集を開始すると、他のユーザーは編集できなくなります。 編集が終了したら「編集終了」をクリックして終了してください。']"
			:editingmessage="''"
			:callback-checks="callbackChecks"
			:isEndbutton="false"
		/>
		<wrap-sppiner v-if="isLoad" />
	</div>
</template>

<script lang="ts">
import WrapSppiner from '@/components/WrapSinner/index.vue';
import { v4 } from 'uuid';
import axios from 'axios';
import { getList } from '@/api/table';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID, s3, subsystemUrl } from './../../utils/configration';
import { UpdateServer } from '@/api/updateServer';
import draggable from 'vuedraggable';
import EditWrap from '@/components/EditWrap/csv.vue';
import EditEnd from '@/components/EditWrap/end.vue';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
import InputTag from '@/components/InputTag/index.vue';
import { UserModule } from '@/store/modules/user';
import { CallbackChecks } from '@/components/EditWrap/csv.i';
const jpMapGroupList = [
	{
		label: '初期表示の文言',
		jpMapper: {
			CHAT_WINDOW_TITLE: {
				type: 'textarea',
				text: 'ヘッダータイトル',
			},
			BOT_NAME: {
				type: 'textarea',
				text: 'ボットネーム',
			},
			INIT_MESSAGE: {
				type: 'textarea',
				text: '初期メッセージ',
			},
			DEFAULT_INPUT_MESSAGE: {
				type: 'textarea',
				text: '検索窓の初期メッセージ',
			},
		},
	},
	{
		label: '検索中の文言',
		jpMapper: {
			INFO_MESSAGE_PARENT: {
				type: 'textarea',
				text: '親カテゴリの案内文',
			},
			INFO_MESSAGE_CHILD: {
				type: 'textarea',
				text: '子カテゴリの案内文',
			},
			SCRIPT_NOT_FOUND_MESSAGE: {
				type: 'textarea',
				text: '未収録時メッセージ',
			},
			OTHER_CHOICE_MESSAGE: {
				type: 'textarea',
				text: '検索失敗時メッセージ',
			},
		},
	},
	{
		label: 'フィードバックの文言',
		jpMapper: {
			ASK_FEEDBACK_MESSAGE: {
				type: 'textarea',
				text: '回答終了後メッセージ',
			},
			ASK_FEEDBACK_CHOICES: {
				type: 'object',
				text: 'フィードバックボタン',
				keyMapper: {
					complete: '解決ボタン',
					unsolved: '未解決ボタン',
				},
			},
			FEEDBACK_DONE_MESSAGE: {
				type: 'textarea',
				text: '解決時メッセージ',
			},
			FEEDBACK_ERROR_MESSAGE: {
				type: 'textarea',
				text: '未解決時メッセージ',
			},
			ENQUETE_UNRESOLVED_DESCRIPTION: {
				type: 'textarea',
				text: '目安箱リード文',
			},
			ENQUETE_UNRESOLVED_CLOSE_MESSAGE: {
				type: 'textarea',
				text: '目安箱未回答メッセージ',
			},
			ENQUETE_UNRESOLVED_MESSAGE: {
				type: 'textarea',
				text: '目安箱回答後メッセージ',
			},
			ENQUETE_RESOLVED_DESCRIPTION: {
				type: 'textarea',
				text: 'アンケートリード文',
			},
			ENQUETE_RESOLVED_MESSAGE: {
				type: 'textarea',
				text: 'アンケート回答後メッセージ',
			},
		},
	},
];
const jpMapper = {
	// IS_WINDOW_OPEN: {
	// 	type: "boolean",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// HAS_FEEDBACK: {
	// 	type: "boolean",
	// 	text: "フィードバック"
	// },
	// HAS_AUTO_COMPLETE: {
	// 	type: "boolean",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// HAS_ENQUETE: {
	// 	type: "boolean",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// HAS_OPERATOR: {
	// 	type: "boolean",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// LAUNCHER_TITLE: {
	// 	type: "inputtext",
	// 	text: "window開いた時のヘッダー"
	// },
	CHAT_WINDOW_TITLE: {
		type: 'textarea',
		text: 'ヘッダータイトル',
	},
	BOT_NAME: {
		type: 'textarea',
		text: 'ボットネーム',
	},
	INIT_MESSAGE: {
		type: 'textarea',
		text: '初期メッセージ',
	},
	// FINAL_MESSAGE: {
	// 	type: "textarea",
	// 	text: "完了時メッセージ"
	// },
	// RESET_MESSAGE: {
	// 	type: "textarea",
	// 	text: "リセット時メッセージ"
	// },
	// SEARCH_FAILED_MESSAGE: {
	// 	type: "textarea",
	// 	text: "検索失敗メッセージ"
	// },
	SCRIPT_NOT_FOUND_MESSAGE: {
		type: 'textarea',
		text: '未収録時メッセージ',
	},
	OTHER_CHOICE_MESSAGE: {
		type: 'textarea',
		text: '検索失敗時メッセージ',
	},
	ASK_FEEDBACK_MESSAGE: {
		type: 'textarea',
		text: '回答終了後メッセージ',
	},
	ASK_FEEDBACK_CHOICES: {
		type: 'object',
		text: 'フィードバックボタン',
		keyMapper: {
			complete: '解決時',
			unsolved: '未解決時',
		},
	},
	FEEDBACK_DONE_MESSAGE: {
		type: 'textarea',
		text: '解決時メッセージ',
	},
	FEEDBACK_ERROR_MESSAGE: {
		type: 'textarea',
		text: '未解決時メッセージ',
	},
	ENQUETE_RESOLVED_DESCRIPTION: {
		type: 'textarea',
		text: 'アンケートリード文',
	},
	ENQUETE_RESOLVED_MESSAGE: {
		type: 'textarea',
		text: 'アンケート回答後メッセージ',
	},
	ENQUETE_UNRESOLVED_DESCRIPTION: {
		type: 'textarea',
		text: '目安箱リード文',
	},
	ENQUETE_UNRESOLVED_CLOSE_MESSAGE: {
		type: 'textarea',
		text: '目安箱未回答メッセージ',
	},
	ENQUETE_UNRESOLVED_MESSAGE: {
		type: 'textarea',
		text: '目安箱回答後メッセージ',
	},
	// CONNECT_OFFICIAL_INQUERY: {
	// 	type: "textarea",
	// 	text: "有人対応 時間外メッセージ"
	// },
	// INIT_CATEGORY: {
	// 	type: "object",
	// 	text: "初期カテゴリ"
	// },

	// CHAT_WINDOW_SUB_TITLE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	DEFAULT_INPUT_MESSAGE: {
		type: 'textarea',
		text: '検索窓の初期メッセージ',
	},
	// DEFAULT_INPUT_USERID: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// CHOICES_LIMIT: {
	// 	type: "number",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// CHOICES_TITLE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// OTHER_CHOICE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// ERROR_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// INTERRUPTION_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// INTERRUPTION_CHOICES: {
	// 	type: "object",
	// 	text: "初期カテゴリ"
	// },
	// BACK_TO_SCENARIO_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },

	// RESET_BOTTON_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ボットリセットメッセージ"
	// },
	// CONNECT_OPERATOR_CHOICES: {
	// 	type: "object",
	// 	text: "初期カテゴリ"
	// },
	// CONNECTING_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// REQUEST_DISCONNECT_CHOICE: {
	// 	type: "object",
	// 	text: "初期カテゴリ"
	// },
	// NO_NEED_CONNECT_MESSAGE: {
	// 	type: "textarea",
	// 	text: "オペレータ未接続メッセージ"
	// },
	// DISCONNECT_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// CANCELL_MESSEGE_TO_SERVER: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// CANCELL_SENDING_MESSEGE_TO_SERVER: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// ERROR_SENDING_MESSEGE_TO_SERVER: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// SALES_TIME: {
	// 	type: "object",
	// 	text: "初期カテゴリ"
	// },
	// ENQUETE_SENT_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },

	// OPERATOR_FEEDBACK_CHOICES: {
	// 	type: "object",
	// 	text: "初期カテゴリ"
	// },
	// OPERATOR_FEEDBACK_SIGH: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// OPERATOR_FEEDBACK_ERROR_MESSAGE: {
	// 	type: "textarea",
	// 	text: "ウィンドウが初期状態で開いているか"
	// },
	// ENQUETES: {
	// 	type: "enquete",
	// 	text: "アンケート"
	// },
	// RESET_TRIGGER_MESSAGES: {
	// 	type: "stringArray",
	// 	text: "リセットトリガーメッセージ"
	// },
	// GREETING_CHAT: {
	// 	type: "greetingchat",
	// 	text: "雑談チャット"
	// }
};
type Template = { [key: string]: string | Template };
const initTemplate = (template: Template, text = '') => {
	_parse(template);
	function _parse(item: Template) {
		for (const [key, value] of Object.entries(item)) {
			if (typeof value === 'string') {
				item[key] = text;
			} else {
				_parse(value);
			}
		}
	}
};
const template = {
	// IS_WINDOW_OPEN: true,
	// HAS_FEEDBACK: true,
	// HAS_AUTO_COMPLETE: true,
	// HAS_ENQUETE: false,
	// HAS_OPERATOR: false,
	// LAUNCHER_TITLE: "",
	CHAT_WINDOW_TITLE: '-',
	BOT_NAME: '-',
	INIT_MESSAGE: '-',
	// INIT_CATEGORY: {
	// 	menu01: "",
	// 	menu02: "",
	// 	menu03: ""
	// },
	// CHAT_WINDOW_SUB_TITLE: "",
	DEFAULT_INPUT_MESSAGE: '-',
	// DEFAULT_INPUT_USERID: "",
	// CHOICES_LIMIT: 3,
	// CHOICES_TITLE: "",
	// OTHER_CHOICE: "",
	OTHER_CHOICE_MESSAGE: '-',
	// SEARCH_FAILED_MESSAGE:
	// 	"-",
	SCRIPT_NOT_FOUND_MESSAGE: '-',
	// ERROR_MESSAGE: "",
	// INTERRUPTION_MESSAGE: "",
	// INTERRUPTION_CHOICES: {
	// 	ok: "-",
	// 	ng: "-"
	// },
	// BACK_TO_SCENARIO_MESSAGE: "",
	// FINAL_MESSAGE:
	// 	"-",
	// RESET_BOTTON_MESSAGE: "",
	// RESET_MESSAGE:
	// 	"-",
	INFO_MESSAGE_PARENT: '-',
	INFO_MESSAGE_CHILD: '-',
	ASK_FEEDBACK_MESSAGE: '-',
	ASK_FEEDBACK_CHOICES: {
		complete: '-',
		unsolved: '-',
	},
	FEEDBACK_DONE_MESSAGE: '-',
	FEEDBACK_ERROR_MESSAGE: '-',
	ENQUETE_RESOLVED_DESCRIPTION: '-',
	ENQUETE_RESOLVED_MESSAGE: '-',
	ENQUETE_UNRESOLVED_DESCRIPTION: '-',
	ENQUETE_UNRESOLVED_CLOSE_MESSAGE: '-',
	ENQUETE_UNRESOLVED_MESSAGE: '-',
	CONNECT_OFFICIAL_INQUERY: '-',
	NO_NEED_CONNECT_MESSAGE: '-',
	// CONNECT_OPERATOR_CHOICES: {
	// 	request_connect: "-",
	// 	no_connect: "-"
	// },
	// CONNECTING_MESSAGE: "",
	// REQUEST_DISCONNECT_CHOICE: {
	// 	request_unconnect: ""
	// },
	// CONNECT_OFFICIAL_INQUERY:
	// 	"-",

	// DISCONNECT_MESSAGE: "",
	// CANCELL_MESSEGE_TO_SERVER: "",
	// CANCELL_SENDING_MESSEGE_TO_SERVER: "",
	// ERROR_SENDING_MESSEGE_TO_SERVER: "",
	// SALES_TIME: {
	// 	START_TIME: "0900",
	// 	END_TIME: "2000"
	// },
	// ENQUETE_SENT_MESSAGE: "",
	// ENQUETE_DONE_MESSAGE: "-"
	// OPERATOR_FEEDBACK_CHOICES: {
	// 	complete: "解決した",
	// 	unsolved: "解決できない"
	// },
	// OPERATOR_FEEDBACK_SIGH: "",
	// OPERATOR_FEEDBACK_ERROR_MESSAGE: "",
	// ENQUETES: {
	// 	BOT: [
	// 		{
	// 			question: {
	// 				name: "",
	// 				text: ""
	// 			},
	// 			answers: [
	// 				{
	// 					text: "",
	// 					value: 1
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	// RESET_TRIGGER_MESSAGES: ["おわり"],
	// GREETING_CHAT: {
	// 	おはよう: ["おはようございます。"]
	// }
};
// @ts-ignore
@Component({
	filters: {},
	components: { draggable, WrapSppiner, EditWrap, EditEnd },
})
export default class DefaultChatMessage extends Vue {
	private ajax: Ajax = new Ajax();
	private cans: Array<any> = [];
	private isCanload = false;
	private isSynonymload = false;
	private readonly = false;
	private initMessage = '';
	private selected: any = {};
	private currentScript: any = {};
	private isPull = false;
	private isLoad = true;
	private data: object = {};
	@Prop({ default: '' })
	private discription?: string;

	@Prop({ default: 'dev' })
	private tabtype?: 'dev' | 'test' | 'prod';

	private jpMapper = jpMapper;
	doThis(event: any) {
		console.log(event);
		return '';
	}

	public callbackChecks: CallbackChecks = [
		// {
		// 	message: "編集開始と同時にバックアップファイル（CSVファイル）を保存する（推奨）", isCheck: false, callback: () => {
		// 		this.download();
		// 	}
		// }
	];
  get Role(){
    return UserModule.role;
  }

	public created() {
		this.init();
		eventHub.$on('setScript', this.setCurrentScript);
		eventHub.$on('saveScript', this.init);
	}

	public init() {
		initTemplate(template, '＜未設定＞');
		this.pullScript();
	}
  public reset(){
    this.init();
  }
	get JpMapGroupList() {
		return jpMapGroupList;
	}

	get FileName() {
		switch (this.tabtype) {
			case 'dev':
				return 'defaultMessage_dev.json';
				break;
			case 'test':
				return 'defaultMessage_test.json';
				break;
			case 'prod':
				return 'defaultMessage.json';
				break;
		}
		return 'defaultMessage_dev.json';
	}

	get IsDisable() {
		switch (this.tabtype) {
			case 'dev':
				return false;
				break;
			case 'test':
				return true;
				break;
			case 'prod':
				return true;
				break;
		}
		return true;
	}

	private destroyed() {
		eventHub.$off('setCurrentMessage', this.setCurrentScript);
		eventHub.$off('saveScript', this.init);
	}

	public setCurrentScript(data: any) {
		this.selected = data.data;
	}

	public async save() {
		const data: any = this.data;

		const json = JSON.stringify(data);
		const blob = new Blob([json], { type: 'application/json' });
		const reader: any = new FileReader();
		const base64Str = await this.loadFileAsBase64(blob);
		eventHub.$emit('BoxModalOpen', 'uploadModal', {
			file: null,
			synonimFile: null,
			defaultMessage: base64Str,
		});
	}

	public pullScript() {
		this.isLoad = true;
		axios({
			baseURL: `${s3}/${PRODUCT_ID}`,
			url: `${this.FileName}?version=${new Date().getTime()}`,
			method: 'GET',
		}).then(
			(res: any) => {
				this.initMessage = '';
				console.log(res);
				if (res.data) {
					if (this.tabtype === 'dev') {
						this.data = Object.assign({}, template, res.data);
					} else {
						this.data = res.data;
					}

					// this.initMessage = res.data["INIT_MESSAGE"];
					console.log(this.data);
				}
				this.isPull = true;
				this.isLoad = false;
			},

			res => {
				console.log(res);
				if (res?.response?.status === 403) {
					if (this.tabtype === 'dev') {
						this.data = Object.assign({}, template, res?.data || {});
					} else {
						this.data = res.data;
					}
					this.isPull = true;
					this.isLoad = false;
				}
			},
		);
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

	private doResetFile() {
		this.data = template;
	}

	public resetFile() {
		this.$modal.show('dialog', {
			title: '本当に初期化しますか？',
			text: '基本的にこの機能はアカウント立ち上げ初期以外は使わないでください',
			buttons: [
				{
					title: '初期化',
					handler: () => {
						this.doResetFile();
						this.$modal.hide('dialog');
					},
				},
				{
					title: 'キャンセル',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	public removeArray(items: Array<any>, index: number) {
		items.splice(index, 1);
	}

	public addArray(items: Array<any>) {
		items.push('');
	}

	public addBotAnser(items: Array<any>, index: number) {
		items.push({ value: '', index: items.length + 1 });
		for (let i = 0; i < items.length; i++) {
			items[i].index = i + 1;
		}
	}

	public removeBotAnser(items: Array<any>, index: number) {
		items.splice(index, 1);
	}

	public async updateMessage() {
		this.isLoad = true;
		// const jsonList=btoa(unescape(encodeURIComponent(JSON.stringify(this.talkScriptList))));
		const object = { key: 'data', n: 10 };
		const data: any = this.data;

		const json = JSON.stringify(data);
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
					fileName: '/defaultMessage.json',
				},
			})
			.then(
				(res: any) => {
					this.isPull = true;
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
					this.isPull = true;
					this.isLoad = false;
				},
			);
	}
}
</script>
<style type="sass" lang="scss"></style>
<style type="sass" lang="scss" scoped>
.listItem {
	border: 1px #ccc solid;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
	border-radius: 6px;
	margin: 12px;
	padding: 12px;
}
</style>
