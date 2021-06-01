<template>
	<div>
		<div v-if="Is_show">
			<b-form-group label="このスクリプトが使われたときのメッセージ">
				<div v-for="(leaf, index) in currentLeafs" v-bind:key="index">
					<b-form-textarea id="textarea" name="text" type="text" rows="17" v-model="leaf.text"></b-form-textarea>
				</div>
			</b-form-group>
			<!-- <b-form-group label="編集理由" v-if="item.feedback">
				<b-form-textarea
					id="editmeentextarea"
					name="text"
					type="text"
					rows="6"
					v-model="item.feedback.feedback"
					disabled
				></b-form-textarea>
			</b-form-group>-->
			<!-- <edit-wrap/> -->
			<b-form-group label="データ種別">
				<b-form-radio value="node" v-model="item.data.type" name="some-radios">node</b-form-radio>
				<b-form-radio value="leaf" v-model="item.data.type" name="some-radios">leaf</b-form-radio>
			</b-form-group>
			<b-form-group label="タイトル">
				<b-form-input id="textinput" name="title" type="text" v-model="item.data.text" />
			</b-form-group>
			<b-form-group label="スクリプトログ" v-if="isLog_script(item.data)">
				<b-form-input id="textinput" name="title" type="text" v-model="item.data.items.log_faq[0]" />
			</b-form-group>
			<div v-if="item.isLeaf">
				<!-- <b-button v-on:click="isEdit=true">エディター編集</b-button>
				<div v-if="isEdit">
					<tinymce v-model="editValue" :height="300"></tinymce>
					<b-form-group class="text-center m-20">
						<b-button class="m-20" v-on:click="setEdit">反映</b-button>
					</b-form-group>
				</div>

				<b-form-group label="テキスト">
					<b-form-textarea id="textarea" name="text" type="text" rows="17" v-model="item.data.value"></b-form-textarea>
				</b-form-group>
				<b-form-group label="シナリオID">
					<b-form-input id="textinput" name="title" type="text" v-model="item.data.scenario"/>
				</b-form-group> -->
				<h3>キーワード</h3>
				<div v-for="(question, index) in item.data.questions" :key="index" class="question">
					<div class="input">
						<input-tag v-model="item.data.questions[index]" :item-click="tagClick">
							<!-- <div slot="menu" v-if="is_menu_show">
								<ul>
									<li>list</li>
									<li>list2</li>
								</ul>
							</div>-->
						</input-tag>
					</div>
					<div class="removeButton">
						<button v-on:click="removeQuestion(index)">-</button>
					</div>
				</div>
				<b-container class="bv-example-row">
					<b-row class="justify-content-md-center">
						<b-button class="addButton" v-if="item.isLeaf" @click="addQuestion" variant="outline-secondary">+</b-button>
					</b-row>
				</b-container>
			</div>
		</div>
		<b-modal ref="synonymModal" hide-footer no-close-on-backdrop scrollable>
			<synonym :synonymvalue="CurrentSynonym" />
		</b-modal>
	</div>
</template>
<style type="scss" lang="scss" scoped>
.question {
	position: relative;
	overflow: hidden;
	display: flex;
	.input {
		// float: left;
		display: flex;
		width: 100%;
	}
	.removeButton {
		display: flex;
		// float: right;
	}
	.vue-input-tag-wrapper {
		width: 100%;
	}
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Tinymce from '@/components/Tinymce/index.vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import { Ajax, MessageObj, Message, MessageList } from '@/utils/parts';
import { subsystemUrl, PRODUCT_ID, script_logUrl } from './../../utils/configration';
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym },
})
export default class LeafEditorComp extends Vue {
	private ajax: Ajax = new Ajax();
	private message: Array<any> = [];
	private listLoading = false;
	private item: any = '';
	private isShow = true;
	private currentLeafs: Array<any> = [];
	private currentSynonym = '';
	private editValue = '';
	private isEdit = false;
	private setItem(item: any) {
		this.item = item;
		if ('data' in item && 'value' in item.data) {
			this.editValue = item.data.value.replace(/\n/g, '<br>');
			this.getSearchLog(item.data);
		}
		if ('items' in item.data && !('log_faq' in item.data.items)) {
			item.data.items.log_faq = [''];
		}
	}

	public resetItem() {
		this.editValue = this.item = '';
	}

	public setEdit() {
		if ('data' in this.item) {
			this.item.data.value = this.editValue;
		}
	}

	private itemChangeId: any = null;
	get CurrentSynonym() {
		return this.currentSynonym;
	}

	@Watch('item', { deep: true })
	private itemChange(item: any, oldItem: any) {
		this.isEdit = false;
		if (this.itemChangeId !== null) {
			clearTimeout(this.itemChangeId);
		}
		this.itemChangeId = setTimeout(() => {
			if (this.item.data && this.item.data.type === 'leaf') {
				this.item.isLeaf = true;
			} else {
				this.item.isLeaf = false;
			}
			this.editValue = item.data.value.replace(/\n/g, '<br>');
			this.$forceUpdate();
		}, 500);
	}

	public getSearchLog(script: any) {
		// this.listLoading = true;
		this.ajax
			.http({
				baseURL: `${subsystemUrl}`,
				url: `product/${PRODUCT_ID}/data_get`,
				method: 'GET',
				params: {
					script_id: script.id,
					type: 'query_script_log',
				},
			})
			.then((data: any) => {
				console.log(data);
				const { message } = data;
				this.setCurrentLeafs(message);
				// this.listLoading = false;
			});
	}

	public setCurrentLeafs(items: Array<any>) {
		this.currentLeafs = items.map((e, i) => {
			return { text: e.query };
		});
	}

	public removeQuestion(index: number) {
		this.item.data.questions.splice(index, 1);
	}

	public addQuestion() {
		if (!this.item.data.questions) {
			this.item.data.questions = [];
		}
		this.item.data.questions.push([]);
	}

	public tagClick(a: any, b: any) {
		console.log(a);
		console.log(b);
		// tslint:disable-next-line:no-string-literal
		this.currentSynonym = a;
		const modal: any = this.$refs.synonymModal;
		modal.show();
		// this.$modal.show(Synonym, { synonymvalue: a }, { draggable: true });
	}

	public isLog_script(data: any) {
		if ('items' in data && 'log_faq' in data.items) {
			return true;
		}
		return false;
	}

	get Is_show() {
		if (this.isShow && this.item && this.item.hasOwnProperty('data')) {
			return true;
		}
		return false;
	}

	public tabClick() {
		console.log('tabclick');
		this.resetItem();
	}

	private created() {
		eventHub.$on('setScript', this.setItem);
		eventHub.$on('tabclick', this.tabClick);
	}

	private destroyed() {
		eventHub.$off('setScript', this.setItem);
		eventHub.$off('tabclick', this.tabClick);
	}
}
</script>
