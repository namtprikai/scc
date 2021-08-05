import { IAdminData } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let policyGroup_policy = [];
class PolicyGroupPolicy extends CrossReferenceTable{
	public getPolycyByPolycyGroupId(polycyGroup_id: number,table) {
		return this.getBByA(polycyGroup_id,table);
	}
	public deletebyPolycyGroupId(polycyGroup_id: number,table){
		this.deleteByAId(polycyGroup_id,table);
	}
	public deletebyPolicyId(policy_id: number,table){
		this.deleteByBId(policy_id,table);
	}
}


const policyGroupPolicyModel = new PolicyGroupPolicy("policy_group_id","policy_id");

export const getPolycyByPolicyGroupId = (policyGroupId:number)=>{
	return policyGroupPolicyModel.getPolycyByPolycyGroupId(policyGroupId,policyGroup_policy);
}
