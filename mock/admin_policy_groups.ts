import { CrossReferenceTable } from "./utils";
let admin_policyGroup = [];

class AdminPolicyGroup extends CrossReferenceTable{
	public getPolycyGroupByAdminId(admin_id: number,table) {
		return this.getBByA(admin_id,table);
	}
}

const adminPolicyGroupModule = new AdminPolicyGroup("admin_id","policy_group_id");
export const addPolicyGroup = (admin_id: number, polycyGroup_id: number) => {
	adminPolicyGroupModule.add(admin_id,polycyGroup_id,admin_policyGroup);
};
