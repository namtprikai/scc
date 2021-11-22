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
import { AxiosResponse } from "axios";
import { PolicyGroup } from "@/api/policygroup";
@Module({ dynamic: true, store, name: "policys" })
class PolicysStore extends VuexModule {
	policyList: Array<IPolicyData> = [];
	get Policys() {
		return this.policyList;
	}
	@Mutation
	public async GetPolicys() {
		const data = await PolicyGroup.getList();
		this.policyList = data;
	}
	@Mutation
	public async AddPolicy(data:IPartialPolicyGroupData){
		const res = await PolicyGroup.post(data);
		this.policyList.push(res);
	}
}
export const PolicysModule = getModule(PolicysStore);
