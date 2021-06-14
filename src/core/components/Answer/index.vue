<template>
	<div>
		<b-list-group>
		<b-list-group-item v-for="(anser) in answers" :key="anser.id" @click="setAnswer(anser)" class="d-block">
			<p> <span v-for="(conditionObj,key) in anser.anserConditionMap" :key="key">
				<b-badge v-for="(condition,index) in conditionObj.conditions" :key="index">{{condition.label}}</b-badge>
				</span></p>
			<p class="text-truncate text-nowrap d-block">{{anser.text}}</p>
		</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import {AjaxService} from '../../services/ajax';
import {IAnswerData,IConditionGroupData,IConditionData} from '../../api/types';
@Component
export default class AnswerComp extends Vue {
	fetchTime:number|null=null;
	@Prop()
	questionId!:number;
	@Prop()
	is_show!:boolean;
	@Watch('is_show')
	changeShow(){
		console.log("change");
		if(this.fetchTime===null){
			this.fetch();
			this.fetchTime = new Date().getTime();
		}
	}
	answers:Array<IAnswerData> = [];
	conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> = [];
	setAnswer(item:IAnswerData){
		eventHub.$emit('setAnswer',{ answer:item,conditionList:this.conditionList});
	}
	async created(){

	}
	async fetch(){
		const {data}: any = await AjaxService.ajax.http({
			url: `ansers/${this.questionId}`,
			method: 'get',
			params: {
			},
		});
		this.answers = data.ansers;
		this.conditionList = data.conditionList;
	}
}
</script>

<style lang="scss" scoped>

</style>
