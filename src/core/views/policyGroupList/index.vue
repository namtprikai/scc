<template>
	<div>
		<div v-if="isShow">
			<div v-for="(policyGroup, index) in policyGroupList" :key="index">
				<BCardAccordion
					:title="policyGroup.label"
					class
					:visible="false"
					:openHandler="patchPolicyByPolicyGroupId"
					:openHandlArg="{ id: policyGroup.id, policyGroupIdTopolicyIdList }"
				>
					<template slot="header">
						<div class="h3">{{ policyGroup.label }}</div>
					</template>
					<template slot="body">
						<b-form-group
							label-cols="4"
							label="ポリシー一覧"
							label-for="policy-name"
							v-if="policyGroupIdTopolicyIdList[policyGroup.id]"
						>
							<b-form-checkbox
								v-for="(check, j) in policyGroupIdTopolicyIdList[policyGroup.id].after"
								v-model="check.flg"
								:key="j"
								>{{ check.label }}</b-form-checkbox
							>
							<!-- <b-form-checkbox-group
								:id="'checkbox-group-' + policyGroup.id"
								v-model.lazy="policyGroupIdTopolicyIdList[policyGroup.id].after"
								:options="policys"
								value-field="value"
								:indeterminate="true"
								text-field="text"
								name="flavour-1"
								stacked
							></b-form-checkbox-group> -->
							<b-button @click="allCheck(policyGroupIdTopolicyIdList[policyGroup.id].after)"
								>全てにチェック</b-button
							><b-button
								@click="allUnCheck(policyGroupIdTopolicyIdList[policyGroup.id].after)"
								>全てチェック解除</b-button
							>
						</b-form-group>
						<b-button
							@click="
								changePolicyInPolicyGroup(
									policyGroup.id,
									policyGroupIdTopolicyIdList[policyGroup.id].before,
									policyGroupIdTopolicyIdList[policyGroup.id].after
								)
							"
							>更新する</b-button
						>
					</template>
				</BCardAccordion>
			</div>
			<div>
				<BCardAccordion :title="'追加'" class :visible="false">
					<template slot="header">
						<div class="h3">ポリシーグループの追加</div>
					</template>
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
							<b-button @click="addPolicyGroup(policyGroupName)">追加する</b-button>
						</b-form-group>
					</template>
				</BCardAccordion>
			</div>
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
import { PolicyGroup } from "@/api/policygroup";
import { BCardAccordion } from "@/components/BCardAccodion";
import { PolicyComp } from "@/components/policy";
import { PolicysModule } from "@/store/modules/policy";
import { Wait } from "@/utils/parts";
import { diffArray } from "@sciseed/andytools";
type PolicyCheckModel={label:string,value:number,flg:boolean};
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
export default class PolicyGroupListParent extends Vue {
	public isShow = false;
	public policys: Array<{ text: string, value: number }> = [];
	public policyGroupList: Array<IPolicyGroupData> = [];
	public policyGroupName: string = '';
	public policyGroupIdTopolicyIdList: { [key: number]: { before: Array<number>, after: Array<PolicyCheckModel> } } = {};
	async created() {
		if (PolicysModule.Policys.length === 0) {
			await PolicysModule.GetPolicys();

		}
		this.setPolicys();
		this.policyGroupList = await PolicyGroup.getList();
		this.isShow = true;
	}
	setPolicys() {
		this.policys = PolicysModule.Policys.sort(o=>o.id).map(p => ({ text: p.label, value: p.id }));
	}
	get PolicyGroupList() {
		return this.policyGroupList;
	}
	public makePolicyGroup(label: string, description: string) {
		PolicyGroup.post({
			label,
			description,
		});
	}
	public allUnCheck(policyCheckModelList: Array<PolicyCheckModel>){
		for(const check of policyCheckModelList){
			check.flg = false;
		}
		this.$forceUpdate();
	}
	public allCheck(policyCheckModelList: Array<PolicyCheckModel>){
		for(const check of policyCheckModelList){
			check.flg = true;
		}
		this.$forceUpdate();
	}
	public async patchPolicyByPolicyGroupId(arg: { id: number, policyGroupIdTopolicyIdList?: { [key: number]: { before: Array<number>, after: Array<number> } } }) {

		const policyGroupList = await (await PolicyGroup.getPolicyByPolicyGroupId(arg.id)).sort(o=>o.id);
		const policyGroupIdList = policyGroupList.map(p => p.id);
		const policyCheckModel:Array<PolicyCheckModel>=[];
		let i=0,j=0;
		while(this.policys.length>i){
			const checkModel:PolicyCheckModel={value:this.policys[i].value,label:this.policys[i].text,flg:false};

			if(policyGroupList.length<=j||this.policys[i].value < policyGroupList[j].id){
				policyCheckModel.push(checkModel);
				i++;
				continue;
			}else if(this.policys[i].value === policyGroupList[j].id){
				checkModel.flg=true;
				policyCheckModel.push(checkModel);
				i++;j++;
				continue;
			}else{
				j++;
			}
		}
		this.policyGroupIdTopolicyIdList[arg.id] = { before: [...policyGroupIdList], after: policyCheckModel };
		// if (arg.policyGroupIdTopolicyIdList) {
		// 	arg.policyGroupIdTopolicyIdList[arg.id] = { before: [...policyGroupIdList], after: [...policyGroupIdList] };
		// }
		this.$forceUpdate();
	}
	public addPolicyGroup(label: string) {
		PolicyGroup.post({ label });

	}
	public async getPolicyIdByPolicyGroupId(policyGroupId: number): Promise<{ before: Array<number>, after: Array<PolicyCheckModel> }> {
		if (!(policyGroupId in this.policyGroupIdTopolicyIdList)) {
			await this.patchPolicyByPolicyGroupId({ id: policyGroupId });
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
	public removePolicyInPolicyGroup(policyGroupId: number, policyId: number) {
		PolicyGroup.addPolicy([], [policyId], policyGroupId);
	}
	public addPolicyInPolicyGroup(policyGroupId: number, policyId: number) {
		PolicyGroup.addPolicy([policyId], [], policyGroupId);
	}
	public async changePolicyInPolicyGroup(policyGroupId: number, before: Array<number>, after: Array<PolicyCheckModel>) {
		const [add, remove] = diffArray(after.filter(a=>a.flg).map(a=>a.value), before);
		await PolicyGroup.addPolicy(add, remove, policyGroupId);
		await this.patchPolicyByPolicyGroupId({id:policyGroupId});
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
