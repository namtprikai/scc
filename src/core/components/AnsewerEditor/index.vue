<template>
	<div class="tab-body">
		{{answerData}}
		<div v-if="Is_show">
			<div class="section">
				<b-card no-body>
					<b-card-header>
						公開設定
						<b-icon icon="info-circle" id="popover-target-kokai"></b-icon>
						<b-popover target="popover-target-kokai" triggers="hover" placement="top">
							公開設定を「公開」にすると、Q&amp;Aがユーザー画面上で公開されます。
							<br />公開設定を「非公開」にすると、Q&amp;Aがユーザー画面上で非公開となり、
							<br />管理画面からしか閲覧できなくなります。
						</b-popover>
					</b-card-header>
					<b-card-body>
						<b-form-radio
							value="published"
							v-model="answerData.is_public"
							name="status-radios"
							inline
							checked
							>公開</b-form-radio
						>
						<b-form-radio
							value="editing"
							v-model="answerData.is_public"
							name="status-radios"
							inline
							>非公開</b-form-radio
						>
					</b-card-body>
				</b-card>
			</div>
			<!-- <div class="section">
				<b-card no-body>
					<b-card-header>
						<template slot:label>Q.</template>
					</b-card-header>
					<b-card-body>
						<b-form-input
							id="textinput"
							name="title"
							type="text"
							v-model="answerData.data.text"
						/>
					</b-card-body>
				</b-card>
			</div> -->
			<div>
				<!-- <b-button v-if="!isEdit" v-on:click="isEdit=true">リッチテキスト編集</b-button>
				<b-button v-if="isEdit" v-on:click="isEdit=false">リッチテキスト編集を閉じる</b-button>-->
				<div class="section" v-if="Keywords">
					<b-card no-body>
						<b-card-header>
							キーワード
							<b-icon icon="info-circle" id="popover-target-keyword"></b-icon>
							<b-popover
								target="popover-target-keyword"
								triggers="hover"
								placement="top"
							>
								キーワードとは、ユーザーの想定質問から重要単語を抽出したものです。
								<br />詳しくは担当者からお送りするマニュアルをご覧ください。
							</b-popover>
						</b-card-header>
						<b-card-body>
							<b-input-group
								v-for="(question, index) in Keywords"
								:key="index"
								class="question"
							>
								<div class="input">
									<input-tag
										v-model="answerData.data.questions[index]"
										:item-click="tagClick"
									></input-tag>
									<b-button v-on:click="removeQuestion(index)">-</b-button>
								</div>
							</b-input-group>
							<b-container class="bv-example-row mb-3">
								<b-row class="justify-content-md-center">
									<b-button
										block
										class="addButton"
										v-if="answerData.isLeaf"
										@click="addQuestion"
										variant="secondary"
									>
										<b-icon icon="plus"></b-icon>
									</b-button>
								</b-row>
							</b-container>
						</b-card-body>
					</b-card>
				</div>
				<div class="section">
					<div class="section">
						<b-card no-body>
							<b-card-header>A.</b-card-header>
							<b-card-body>
								<!-- <b-button @click="openImageModal" size="sm">画像挿入</b-button> -->
								<editor
									v-model="answerData.text"
									:height="300"
									:id="Id"
									:init="{
										language: 'ja',
										menubar: false,
										plugins: plugins,
										toolbar: toolbar,
									}"
									@onChange="Edit()"
								></editor>
							</b-card-body>
						</b-card>
					</div>
				</div>
			</div>
		</div>
		<!-- <b-modal ref="synonymModal" hide-footer no-close-on-backdrop scrollable>
			<synonym :synonymvalue="CurrentSynonym" />
		</b-modal> -->
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
import { v4 } from 'uuid';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {IAnswerData} from '../../api/types';
import Editor from '@tinymce/tinymce-vue';
import Plugins from '@/components/Tinymce/plugins';
import Toolbar from '@/components/Tinymce/toolbar';
// @ts-ignore
@Component({
	components: {Editor},
})
export default class ScriptEditorComp extends Vue {
	protected isShow = true;
	protected toolbar = Toolbar;
	protected plugins = Plugins;
	get Keywords(){
		return false;
	}
	@Prop()
	public answerData!:IAnswerData;
	Edit(){

	}
	get Id(){
		return String(this.answerData.id);
	}
		get Is_show() {
		if (this.isShow && this.answerData && this.answerData.hasOwnProperty('id')) {
			return true;
		}
		return false;
	}
	protected created() {

	}

	protected destroyed() {

	}

}
</script>
