import faker from "faker";
import { Response, Request } from "express";
import { IProductData, IRoleData } from "../src/core/api/types";
import { IConditionGroupData, IAPIResponce } from "../src/core/api/types";
import { productions } from "./products";
import { ProductRoleFilter, RoleFilter, secureObjectCreateByAdmin } from "./security";
import {SAITableModel} from './utils';
import {userRoles} from "./user_roles";
import { getAdminByToken } from "./admins";
export const conditionGroups: Array<IConditionGroupData> = [
	{
		id: 0,
		label: "sex",
		is_setting: true,
		level: 1,
	},
	{
		id: 1,
		label: "収入",
		is_setting: true,
		level: 2,
	},
];
const ConditionGroupModel = new SAITableModel<IConditionGroupData>(
	conditionGroups,
	'condition_group'
	,
	new ProductRoleFilter(() => conditionGroups,
	 (c) => {
	return productions;
}),
new RoleFilter(
	() => conditionGroups,
	(c) => {
		const roles: Array<IRoleData> = [];
		for (const up of userRoles) {
			if (c.id === up.user_id) {
				for (const role of roles) {
					if (up.role_id === role.id) {
						roles.push(role);
						break;
					}
				}
			}

		}
		return roles;
	}
	)
);
export const getConditionGroupList = (
	req: Request,
	res: IAPIResponce
): Response => {
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if(admin){
		const categoryList = ConditionGroupModel.getListByAdmin(admin);
		return res.json({
			is_error: false,message:"",type:"Object",
			data: [...categoryList],
		});
	}
	return res.json({
		is_error: true,message:"",type:"Array",
		data: [],
	});
};
export const addConditionGroup =(	req: Request,
	res: IAPIResponce)=>{
		try{
		const accessToken = req.header("Authorization") || "";
		const admin = getAdminByToken(accessToken);
		const { level,label,config,is_setting} = req.query;
		if(admin){
			const conditionGroup = ConditionGroupModel.add({level,label,config,is_setting});
			return res.status(200).json({
				is_error: false,message:"",type:"Object",
				data: {...conditionGroup},
			});
		}
	}catch(e){
		return res.status(400).json({
			is_error: true,message:String(e),type:"Array",
			data: [],
		});
	}
		return res.json({
			is_error: true,message:"",type:"Array",
			data: [],
		});
}
export const getConditionGroupById = (id: number) => {
	return conditionGroups.find((c) => c.id === id);
};

