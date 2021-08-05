import faker from "faker";
import { Response, Request } from "express";
import {
	IPolicyGroupData,
	IAdminPolicyGroupData,
	IAPIResponce,
} from "../src/core/api/types";
import { productions } from "./products";
import { getId, SAITableModel } from "./utils";
import { secureObjectCreateByAdmin } from "./security";
import {getPolidyGroupListByAdminId} from "./admin_policy_groups";
const policyGroups: Array<IPolicyGroupData> = [
	{
		id: 0,
		label: "管理者",
		config: {
			role: [1, 2, 3, 4, 5],
		},
	},
];
const PolicyGroups = secureObjectCreateByAdmin<IPolicyGroupData>(
	() => policyGroups,
	(q) => {
		return productions;
	}
);
const polycyGroupModel = new SAITableModel(policyGroups, PolicyGroups);
export const getPolicyGroupByAdminId = (req: Request, res: IAPIResponce) => {
	const { admin_id } = req.params;
	console.log(admin_id);
	if (typeof admin_id === "string") {
		const policyGroupIdSet = new Set(getPolidyGroupListByAdminId(parseInt(admin_id)));
		// for (const admin of adminList) {
		// 		if (String(admin.id) === id) {
		return res.json({
			status: 20000,
			data: [
				...policyGroups.filter((p) => policyGroupIdSet.has(p.id)),
			],
		});
	}
	// 		}
	// }
	return res.status(400).json({
		status: 50004,
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
/**
	* アドミンにあるポリシーを取得する内部用
	*/
	export const getPolicyListByAdminId = (admin_id: number)=>{

	}
export const getPolicyList = (req: Request, res: IAPIResponce): Response => {
	const { parent_id } = req.query;

	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
		status: 20000,
		data: [...policyGroups],
	});
};
export const getPolicyGroup = (req: Request, res: IAPIResponce): Response => {
	const { id } = req.query;
	if (!/^\d$/.test(`${id}`)) {
		return res.json({
			status: 50000,
			data: {},
		});
	}
	for (const policyGroup of policyGroups) {
		if (policyGroup.id === parseInt(String(id))) {
			return res.json({
				status: 20000,
				data: { ...policyGroup },
			});
		}
	}
	return res.json({
		status: 50000,
		data: {},
	});
};
