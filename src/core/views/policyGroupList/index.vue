<template>
	<div>
		<div v-for="(policyGroup, index) in policyGroupList" :key="index">

			<BCardAccordion :title="policyGroup.label" class :visible="false" :openHandler="patchPolicyByPolicyGroupId" :openHandlArg="policyGroup.id">
				<template slot="header"><div class="h3">{{policyGroup.label}}</div></template>
				<template slot="body">
					<b-form-group label-cols="4" label="ポリシー一覧" label-for="policy-name" v-if="policyGroupIdTopolicyIdList[policyGroup.id]">
						<b-form-checkbox-group
        :id="'checkbox-group-'+policyGroup.id"
        v-model="policyGroupIdTopolicyIdList[policyGroup.id]"
        :options="PoliCys"
        :aria-describedby="ariaDescribedby"
        name="flavour-1"
      ></b-form-checkbox-group>
					</b-form-group>
				</template>
			</BCardAccordion>
		</div>
		<div>
			<BCardAccordion :title="'追加'" class :visible="false">
				<template slot="header"><div class="h3">ついか</div></template>
				<template slot="body">
					<b-form-group
						label-cols="4"
						label="ポリシーグループ名"
						label-for="policy-name"
					>
						<b-form-input
							id="policy-name"
							size
							type="text"
							v-model="policyGroupName"
							placeholder="ポリシーグループ名"
						></b-form-input>
						<b-button @click="addProduct(policyGroupName)">追加する</b-button>
					</b-form-group>
				</template>
			</BCardAccordion>
		</div>
	</div>
</template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue } from "vue-property-decorator";
import { ProductsModule } from "@/store/modules/products";
import { eventHub } from "@/init/eventHub";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import ProductList from "@/components/ProductList/index.vue";
import { IPolicyData, IPolicyGroupData, IProductData } from "@/api/types";
import {PolicyGroup} from "@/api/policygroup";
import {BCardAccordion} from "@/components/BCardAccodion";
import {PolicyComp} from "@/components/policy";
import {PolicysModule} from "@/store/modules/policy";
import { Wait } from "@/utils/parts";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {},
	components: {
		SlVueTree,
		WrapSppiner,
		ProductList,
		BCardAccordion,
		PolicyComp,
	},
})
export default class PolicyGroupListParent {
	public isShow = true;
	public policyGroupList: Array<IPolicyGroupData> = [];
	public policyGroupName:string = '';
	public policyGroupIdTopolicyIdList:{[key:number]:Array<number>}={};
	async created() {

		if(PolicysModule.Policys.length===0){
				await PolicysModule.GetPolicys();
		}
		this.policyGroupList = await PolicyGroup.getList();

	}
	get PoliCys(){
		return PolicysModule.Policys.map(p=>({text:p.label,value:p.id}));
	}
	get PolicyGroupList() {
		return this.policyGroupList;
	}
	public makePolicyGroup(label:string,description:string){
		PolicyGroup.post({
			label,
			description,
		});
	}
	public async patchPolicyByPolicyGroupId(policyGroupId:number){
		this.policyGroupIdTopolicyIdList[policyGroupId] = await PolicyGroup.getPolicyByPolicyGroupId(policyGroupId);
	}
	public async getPolicyIdByPolicyGroupId(policyGroupId:number):Promise<Array<number>>{
		if(!(policyGroupId in this.policyGroupIdTopolicyIdList)){
			await this.patchPolicyByPolicyGroupId(policyGroupId);
		}
		return this.policyGroupIdTopolicyIdList[policyGroupId];
	}
	// public async getCheckMmodelByPolicyGroupId(policyGroupId:number){
	// 	const policyGroupPolicyList = await this.getPolicyByPolicyGroupId(policyGroupId);
	// 	const policyList = PolicysModule.Policys;
	// 	const policyListCheckModel:Array<{flg:boolean,text:string,value:string}> = [];
	// 	let i=0,j=0;
	// 	while(i<policyList.length){
	// 		if(policyList[i].id === policyGroupPolicyList[j].id){
	// 			policyListCheckModel.push({value:policyList[i].id,text:policyList[i].label});
	// 			i++;
	// 			j++;
	// 			continue;
	// 		}else if(policyList[i].id < policyGroupPolicyList[j].id){

	// 		}else if(policyList[i].id > policyGroupPolicyList[j].id){
	// 			j++;
	// 			continue;
	// 		}
	// 		i++;
	// 	}
	// }
		public removePolicyInPolicyGroup(policyGroupId:number,policyId:number){
		PolicyGroup.addPolicy([],[policyId],policyGroupId);
	}
	public addPolicyInPolicyGroup(policyGroupId:number,policyId:number){
		PolicyGroup.addPolicy([policyId],[],policyGroupId);
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
