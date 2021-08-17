import { ICrossReferenceTable, IRoleData, ISAIAPIData } from "../src/core/api/types";
import { roles } from "./roles";
import { CrossReferenceTable } from "./utils";
class UserRoleModel extends CrossReferenceTable {

	public getUserRolesByUserId(user_id: number,table:Array<ICrossReferenceTable>) {
		return this.getAByB(user_id,table);
	}
}
export const userRoles = [
	{
		id: 0,
		role_id: 0,
		user_id: 0,
	},
	{
		id: 1,
		role_id: 1,
		user_id: 0,
	},
	{
		id: 2,
		role_id: 2,
		user_id: 0,
	},
];
const UserRoleModule = new CrossReferenceTable("role_id","user_id");

export const addUserRole = (user_id: number, role_id: number) => {
	UserRoleModule.add(role_id,user_id,userRoles);
};
export const getUserRolesByUserId = (user_id: number): Array<IRoleData> => {
	// @ts-ignore
	return userRoles
		.filter((ur) => ur.user_id === user_id)
		.map((ur) => roles.find((r) => ur.role_id === r.id))
		.filter((o) => o != undefined);
};
