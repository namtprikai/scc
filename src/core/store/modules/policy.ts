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
import { PolycyGroup } from "@/api/policyGroup";
@Module({ dynamic: true, store, name: "products" })
class PolicysStore extends VuexModule {
	productList: Array<IPolicyData> = [];
	get Policys() {
		return this.productList;
	}
	@Mutation
	public async GetPolicys() {
		const data = await PolycyGroup.getList();
		this.productList = data;
	}
	@Mutation
	public async AddPolicy(data:IPartialPolicyGroupData){
		const res = await PolycyGroup.post(data);
		this.productList.push(res);
	}
}
export const PolicysModule = getModule(PolicysStore);
