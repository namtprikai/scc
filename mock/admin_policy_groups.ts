import { IAdminData } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let admin_policyGroup = [];

class AdminPolicyGroup extends CrossReferenceTable{
	public getPolycyGroupByAdminId(admin_id: number,table) {
		return this.getBByA(admin_id,table);
	}
	public deletebyAdminId(admin_id: number,table){
		this.deleteByAId(admin_id,table);
	}
	public deletebyPolicyGroupId(policyGroup_id: number,table){
		this.deleteByBId(policyGroup_id,table);
	}
}

const adminPolicyGroupModule = new AdminPolicyGroup("admin_id","policy_group_id");
export const addPolicyGroup = (admin_id: number, polycyGroup_id: number) => {
	adminPolicyGroupModule.add(admin_id,polycyGroup_id,admin_policyGroup);
};
export const deletePolicyGroup = (admin_id: number, polycyGroup_id: number) => {
	adminPolicyGroupModule.deleteByABId(admin_id,polycyGroup_id,admin_policyGroup);
};
export const deleteByAdminId  = (admin_id: number) => {
	adminPolicyGroupModule.deletebyAdminId(admin_id,admin_policyGroup);
};
export const getPolidyGroupListByAdminId  = (admin_id: number) => {
	return adminPolicyGroupModule.getPolycyGroupByAdminId(admin_id,admin_policyGroup);
};
