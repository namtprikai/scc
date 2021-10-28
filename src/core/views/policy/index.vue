<template>
	<div>
		<PolicyList :values="Policys"></PolicyList>
		<div>
			<BCardAccordion :title="'追加'" class :visible="false">
				<template slot="header"><div class="h3">ついか</div></template>
				<template slot="body">


							<b-form-group
								label-cols="4"
								label="ポリシーグループ"
								label-for="policy-name"
							>
								<b-form-input
									id="policy-name"
									size
									type="text"
									v-model="policyName"
									placeholder="ポリシーグループ名"
								></b-form-input>
								<b-button @click="addPolicy(productName)">追加する</b-button>
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
import { PolicysModule } from "@/store/modules/policy";
import { eventHub } from "@/init/eventHub";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import PolicyList from "@/components/PolicyList/index.vue";
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
		PolicyList,
		BCardAccordion,
	},
})
export default class PolicyParent {
	public isShow = true;
	public products: Array<IPolicyData> = [];
	public productName:string = '';
	async created() {
		await PolicysModule.GetPolicys();
	}
	get Policys() {
		return PolicysModule.Policys;
	}
	public addPolicy(name:string,max_failure_count_user:number=5,max_failure_time_user:number=5){
		PolicysModule.AddPolicy({name,config:{},max_failure_count_user,max_failure_time_user});
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
