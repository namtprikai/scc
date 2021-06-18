<template>
	<div>
		<wrap-message v-if="isMessage" :message="message" />
		<div v-if="Is_show">
			<b-form-group label="編集理由" v-if="item.feedback">
				<b-form-textarea id="editmeentextarea" name="text" type="text" rows="6" v-model="item.feedback.feedback" disabled></b-form-textarea>
			</b-form-group>
			<!-- <edit-wrap/> -->
			<b-form-group label="データ種別">
				<b-form-radio value="node" v-model="item.data.type" name="some-radios" inline disabled>カテゴリ</b-form-radio>
				<b-form-radio value="leaf" v-model="item.data.type" name="some-radios" inline disabled>スクリプト</b-form-radio>
			</b-form-group>
			<b-form-group label="公開状態">
				<b-form-radio value="published" v-model="item.data.status" name="status-radios" inline checked>公開</b-form-radio>
				<b-form-radio value="editing" v-model="item.data.status" name="status-radios" inline>非公開</b-form-radio>
			</b-form-group>
			<b-form-group label="タイトル">
				<b-form-input id="textinput" name="title" type="text" v-model="item.data.text" />
			</b-form-group>
			<!-- <div v-if="isLog_script(item.data)">
			<b-form-group :label="key" v-for="(logdatas,key) in item.data.items" v-bind:key="key">
				<b-form-input name="title" type="text" v-model="logdatas[i]" v-for="(logdata,i) of logdatas" v-bind:key="i" />
			</b-form-group>
			</div> -->
			<div v-if="item.isLeaf">
				<!-- <b-button v-if="!isEdit" v-on:click="isEdit=true">リッチテキスト編集</b-button>
				<b-button v-if="isEdit" v-on:click="isEdit=false">リッチテキスト編集を閉じる</b-button>
				<div v-if="isEdit">
					<tinymce v-model="editValue" :height="300" :init="{language:'ja'}"></tinymce>
					<b-form-group class="text-center m-20">
						<b-button class="m-20" v-on:click="setEdit">反映</b-button>
					</b-form-group>
				</div>

				<b-form-group label="テキスト">
					<b-form-textarea id="textarea" name="text" type="text" rows="17" v-model="item.data.value"></b-form-textarea>
				</b-form-group> -->
				<b-form-group label="シナリオID">
					<b-form-input id="textinput" name="title" type="text" v-model="item.data.scenario" />
				</b-form-group>
				<div class="mb-2">
					<router-link
						v-if="item.data.items.scenario_id"
						:to="{
							path: '/botconfig/index/botconfigedit',
							query: { scenarioId: item.data.items.scenario_id },
						}"
					>シナリオ編集へ</router-link
					>
				</div>
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
import WrapMessage from '@/components/WrapMessage/index.vue';
import { Component, Vue, Watch, Mixins } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Tinymce from '@/components/Tinymce/index.vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import ScriptEditorCompParent from '@/views/scriptEditor/index';
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym, WrapMessage },
})
export default class ScriptEditorComp extends ScriptEditorCompParent {
	constructor() {
		super();
	}
}
</script>
