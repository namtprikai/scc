import faker from "faker";
import { Response, Request } from "express";
import {
	IPolicyGroupData,
	IAdminPolicyGroupData,
	IAPIResponce,
} from "../src/core/api/types";
const admin_policyGroup: Array<IAdminPolicyGroupData> = [
	{
		id: 0,
		admin_id: 0,
		policy_group_id: 0,
	},
];
const policyGroups: Array<IPolicyGroupData> = [
	{
		id: 0,
		label: "管理者",
		config: {
			role: [1, 2, 3, 4, 5],
		},
	},
];
export const getPolicyGroupByAdminId = (req: Request, res: IAPIResponce) => {
	const { admin_id } = req.params;
	console.log(admin_id);
	if (typeof admin_id === "string") {
		const policyGroupIdList = admin_policyGroup
			.filter((o) => o.admin_id === parseInt(admin_id))
			.map((o) => o.policy_group_id);
		// for (const admin of adminList) {
		// 		if (String(admin.id) === id) {
		return res.json({
			status: 20000,
			data: [
				...policyGroups.filter((p) => policyGroupIdList.indexOf(p.id) !== -1),
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
