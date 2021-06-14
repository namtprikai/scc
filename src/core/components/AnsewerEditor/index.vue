<template>
	<div class="tab-body">
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
							value="true"
							v-model="answerData.is_public"
							name="status-radios"
							inline
							checked
							>公開</b-form-radio
						>
						<b-form-radio
							value="false"
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
				<!-- <b-button v-if="!isEdit" v-on:click="isEdit=true">リッチテキスト編集</b-button>
				<b-button v-if="isEdit" v-on:click="isEdit=false">リッチテキスト編集を閉じる</b-button>-->
				<div class="section" v-if="Conditions">
					<b-card no-body>
						<b-card-header>
							コンディション
							<b-icon icon="info-circle" id="popover-target-keyword"></b-icon>
							<b-popover
								target="popover-target-keyword"
								triggers="hover"
								placement="top"
							>
								コンディションとは、xxxです。
								<br />詳しくは担当者からお送りするマニュアルをご覧ください。
							</b-popover>
						</b-card-header>
						<b-card-body>
							<b-list-group>
								<b-list-group-item
									v-for="(condition, k) in ConditionList"
									:key="k"
									class=""
								>
									<b-input-group>
										<div>
											コンディショングループテキスト
											<b-form-textarea
												type="text"
												v-model="condition.conditionGroup.label"
											/>
										</div>
										<div class="input">
											{{ condition.isFocus }}
											<vue-tags-input
												:tags="getAnserCondition(k, condition.conditionGroup).conditions"
												:autocomplete-items="condition.conditions"
												:add-only-from-autocomplete="true"
												:autocomplete-always-open="
													condition.conditions.length && condition.isFocus
												"
												@focus="focusin(condition)"
												@blur="focusout(condition)"
												:value="''"
											>
												<div slot="tag-center" slot-scope="props" class="my-item">
													{{ props.tag.text }}
												</div>
												<div slot="autocomplete-item" slot-scope="props" class="my-item">
													{{ props.item.text }}
												</div>
											</vue-tags-input>
											<b-button v-on:click="removeConditions(condition.conditions)"
												>-</b-button
											>
										</div>
									</b-input-group>
								</b-list-group-item>
							</b-list-group>
							<b-container class="bv-example-row mb-3">
								<b-row class="justify-content-md-center">
									<b-button
										block
										class="addButton"
										@click="addConditionGroup"
										variant="secondary"
									>
										<b-icon icon="plus"></b-icon>
									</b-button>
								</b-row>
							</b-container>
						</b-card-body>
					</b-card>
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
import {IAnswerDataCondition, IConditionData,IAnswerDataConditionJson, IConditionGroupData,IConditionObj} from '../../api/types';
import Editor from '@tinymce/tinymce-vue';
import Plugins from '@/components/Tinymce/plugins';
import Toolbar from '@/components/Tinymce/toolbar';
import VueTagsInput from '@johmun/vue-tags-input';
export interface IConditionTagData {
	id:number;
	conditiongroup_id:number;
	text:string;
}
type IConditionTagObj = {[key:number]: { conditionGroup: IConditionGroupData, conditions: Array<IConditionTagData> }} ;
// @ts-ignore
@Component({
	components: {Editor,VueTagsInput},
})
export default class ScriptEditorComp extends Vue {
	protected isShow = true;
	protected toolbar = Toolbar;
	protected plugins = Plugins;
	protected anserConditionMap:IConditionTagObj = {};
	get Conditions(){
		if(this.answerData.anserConditionMap&& this.conditionList){

			return this.answerData.anserConditionMap;
		}
		return false;
	}
	getAnserCondition(groupId:number,conditionGroup:IConditionGroupData){
		if(this.answerData.anserConditionMap){
		if(groupId in this.anserConditionMap){
			return this.anserConditionMap[groupId];
		}
		else if(groupId in this.answerData.anserConditionMap){
			const aConObj = this.answerData.anserConditionMap[groupId];
			return this.anserConditionMap[groupId] = {conditionGroup:aConObj.conditionGroup,conditions:aConObj.conditions.map(c=>({id:c.id,text:c.label,conditiongroup_id:c.conditiongroup_id}))};
		}else{
			this.anserConditionMap[groupId] = {conditionGroup:conditionGroup,conditions:[]};
		}
		return this.anserConditionMap[groupId];
		}
		return null;
	}
	focusin(item: any) {
			item.isFocus = true;
		this.$forceUpdate();
	}
		private focusout(item: any) {
		setTimeout(() => {
			item.isFocus = false;
		}, 380);
	}
	@Prop()
	public answerData!:IAnswerDataConditionJson;
	@Prop()
	public conditionList!:Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }>;
	get ConditionList(){
		return this.conditionList.map(co=>({isFocus:false,conditionGroup:co.conditionGroup,conditions:co.conditions.map(c=>({id:c.id,text:c.label,conditiongroup_id:c.conditiongroup_id,name:c.label,value:c.label}))}));
	}
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
	public addConditionGroup(){}
	protected created() {

	}

	protected destroyed() {

	}

}
</script>
