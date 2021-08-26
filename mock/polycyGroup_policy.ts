import { IAdminData, ICrossReferenceTable } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let policyGroup_policy:Array<ICrossReferenceTable> = [];
class PolicyGroupPolicy extends CrossReferenceTable{
	public getPolycyByPolycyGroupId(polycyGroup_id: number,table:Array<ICrossReferenceTable>) {
		return this.getBByA(polycyGroup_id,table);
	}
	public deletebyPolycyGroupId(polycyGroup_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByAId(polycyGroup_id,table);
	}
	public deletebyPolicyId(policy_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByBId(policy_id,table);
	}
}


const policyGroupPolicyModel = new PolicyGroupPolicy("policy_group_id","policy_id");

export const getPolycyByPolicyGroupId = (policyGroupId:number):Array<number>=>{
	return policyGroupPolicyModel.getPolycyByPolycyGroupId(policyGroupId,policyGroup_policy);
}
export const deleteByPolicyGroupId = (policyGroupId:number):void=>{
	return policyGroupPolicyModel.deletebyPolycyGroupId(policyGroupId,policyGroup_policy);
}
