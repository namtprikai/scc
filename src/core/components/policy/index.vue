<template>
	<div>
		<div>
			<div v-for="(policy,index) in Policys" :key="index">
{{policy}}
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { PolicysModule } from "@/store/modules/policy";
import { eventHub } from "@/init/eventHub";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import { IPolicyData } from "@/api/types";
import {BCardAccordion} from "@/components/BCardAccodion";
import { Wait } from "@/utils/parts";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {},
	components: {
		SlVueTree,
		WrapSppiner,
		BCardAccordion,
	},
})
export default class PolicyComp {
	public isShow = true;
	public products: Array<IPolicyData> = [];
	public productName:string = '';
	async created() {
		await PolicysModule.GetPolicys();
	}
	get Policys() {
		return PolicysModule.Policys;
	}
	public addPolicyToPolicyGroup(policyId:number,policyGroupId:number){
		// PolicysModule.AddPolicy({name,config:{},max_failure_count_user,max_failure_time_user});
	}
}
</script>
<style type="sass"></style>
<style type="scss" scoped>
.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
