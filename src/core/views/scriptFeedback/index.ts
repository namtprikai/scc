import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import EditWrap from '@/components/EditWrap/index.vue';
import { apiUrl, PRODUCT_ID, subsystemUrl } from '@product/utils/configration';
import { Ajax } from '@/utils/parts';
import { TalkScript, ScriptDataTree, TalkScriptModule, ParseTreeToList, ScriptDataTreeSearch } from '@/store/modules/talkScript';
import { UpdateServer } from '@/api/updateServer';
// @ts-ignore
@Component({
	components: { EditWrap },
})
export default class ScriptFeedbackParent extends Vue {
	protected feedbackList: any = []; // 表示するために整形したリスト
	protected ajax = new Ajax();
	protected talkScript: any = [];
	protected loadFlg = false;
	get FeedbackList() {
		return this.feedbackList.filter((o: any) => o.edited_flg != 1);
	}

	public async getFeedbacks() {
		await TalkScriptModule.getTalkScript();
		this.talkScript = this.parseTalkScript(TalkScriptModule.TalkScript);
		this.loadFlg = true;
		return this.ajax
			.http({
				baseURL: `${subsystemUrl}`,
				url: `product/${PRODUCT_ID}/data_get`,
				method: 'GET',
				params: {
					type: 'feedback',
				},
			})
			.then((res: any) => {
				this.feedbackList = this.parseFeedbackList(res.message.filter((o: any) => o.edited_flg != 1));
				this.loadFlg = false;
			})
			.catch(() => {
				this.loadFlg = false;
			});
	}

	public parseTalkScript(talkScriptList: any) {
		for (let i = 0; i < talkScriptList.length; i++) {
			if ('questions' in talkScriptList[i]) {
				talkScriptList[i].questions = talkScriptList[i].questions.map((q: any) => q.split(','));
			}
		}
		return talkScriptList;
	}

	public setFeedback(data: any) {
		let script;
		if (!('data' in data)) {
			script = this.talkScript.find(
				(ts: any) => ts.text == data.feedback.script_text,
				// return ts.id == data.feedback.script_id;
			);
			if (!script) {
				eventHub.$emit('setScript', null);
				return;
			}
			data.data = script;
		}
		// Object.assign(data, {data:script} || {});
		console.log(data);
		eventHub.$emit('setScript', data);
	}

	public parseFeedbackList(feedbacks: any) {
		return feedbacks.map((feedback: any) => ({ feedback }));
	}
	// isSave: boolean = false;
	// public async save() {
	// 	console.log('save');
	// 	this.isSave = true;
	// 	const scripts: Array<any> = [].concat(this.talkScript);
	// 	for (const script of scripts) {
	// 		if ('questions' in script) {
	// 			script.questions = script.questions.map((q: any) => q.join(","));
	// 		}

	// 	}
	// 	await TalkScriptModule.setTalkScript(scripts);
	// 	await TalkScriptModule.saveTalkscript();
	// 	this.talkScript = this.parseTalkScript(TalkScriptModule.TalkScript);
	// 	this.isSave = false;
	// }
	isSave = false;
	async save() {
		this.$modal.show('dialog', {
			title: '保存しますか？',
			text: '',
			buttons: [
				{
					title: 'はい',
					handler: async () => {
						const scripts: Array<any> = JSON.parse(JSON.stringify(this.talkScript));
						for (const script of scripts) {
							if ('questions' in script) {
								script.questions = script.questions.map((q: any) => q.join(','));
							}
						}
						this.isSave = true;
						console.log(scripts);
						await TalkScriptModule.setTalkScript(scripts);
						await TalkScriptModule.saveTalkscript();
						await UpdateServer.update();
						this.isSave = false;
						this.$modal.hide('dialog');
					},
				},
				{
					title: 'いいえ',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	async upsertFeedBack(selectedFeedback: any) {
		const body = JSON.stringify({
			product_id: selectedFeedback.product_id,
			partition_key: selectedFeedback.partitionKey,
			range_key: selectedFeedback.rangeKey,
			type: 'feedback',
			values: {
				feedback: selectedFeedback.feedback,
				script_id: selectedFeedback.script_id,
				script_text: selectedFeedback.script_text,
				script_value: selectedFeedback.script_value,
				search_text: selectedFeedback.search_text,
				edited_flg: 1,
			},
		});
		console.log(body);
		this.loadFlg = true;
		await this.ajax.http({
			baseURL: `${subsystemUrl}`,
			url: `product/${PRODUCT_ID}/data_post`,
			method: 'POST',
			data: body,
		});
		this.getFeedbacks();
		// return this.ajax.http({
		// 	url: `${serviceConfiguration.env.subsystemUrl}`,
		// 	name: `product/${serviceConfiguration.product[0]}/data_post`,
		// 	method: "POST",
		// 	data: body,
		// }).then(() => {
		// 	this.feedbackList = this.feedbackList.filter((fb: any) => {
		// 		return fb.feedback.rangeKey != selectedFeedback.feedback.rangeKey;
		// 	});
		// 	this.loadFlg = false;
		// })
	}

	protected created() {
		this.getFeedbacks();
		// eventHub.$on("setFeedback", this.setItem);
	}

	protected destroyed() {
		// eventHub.$off("setFeedback", this.setItem);
	}
}
