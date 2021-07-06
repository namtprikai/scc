import { IRoleData } from "../src/core/api/types";
import { roles } from "./roles";
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

export const addUserRole = (user_id: number, role_id: number) => {
	const id = userRoles[userRoles.length - 1].id + 1;
	userRoles.push({
		id,
		user_id,
		role_id,
	});
};
export const getUserRolesByUserId = (user_id: number): Array<IRoleData> => {
	// @ts-ignore
	return userRoles
		.filter((ur) => ur.user_id === user_id)
		.map((ur) => roles.find((r) => ur.role_id === r.id))
		.filter((o) => o != undefined);
};
