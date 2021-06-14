<template>
	<div>
		<div v-for="(anser) in answers" :key="anser.id" @click="setAnswer(anser)">
			{{anser.text}}
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import {AjaxService} from '../../services/ajax';
import {IAnswerData} from '../../api/types';
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
	setAnswer(item:IAnswerData){
		eventHub.$emit('setAnswer', item);
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
	}
}
</script>

<style lang="scss" scoped>

</style>
