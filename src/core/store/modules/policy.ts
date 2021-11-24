import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
	MutationAction,
} from "vuex-module-decorators";
import store from "@/store";
import { AjaxService } from "@/services/ajax";
import type { IPolicyData, IQuestionData,IPartialPolicyGroupData, IPartialPolicyData } from "@/api/types";
import { Policy } from "@/api/policy";
@Module({ dynamic: true, store, name: "policys" })
class PolicysStore extends VuexModule {
	policyList: Array<IPolicyData> = [];
	get Policys() {
		return this.policyList;
	}
	@MutationAction({
		mutate: [
			'policyList']
	})
	public async GetPolicys() {
		const data = await Policy.getList();
		return { policyList:data };
	}
}
export const PolicysModule = getModule(PolicysStore);
