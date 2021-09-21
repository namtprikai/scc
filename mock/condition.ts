import faker from "faker";
import { Response, Request } from "express";
import { IConditionData } from "../src/core/api/types";
import { IAPIResponce } from "../src/core/api/types";
import { getUserByToken } from "./users";
import { userConditions } from "./user_conditions";
import { answerConditions } from "./answer_conditions";
export const conditions: Array<IConditionData> = [
	{
		id: 0,
		label: "男",
		conditiongroup_id: 0,
	},
	{
		id: 1,
		label: "女",
		conditiongroup_id: 0,
	},
	{
		id: 2,
		label: "500万円未満",
		conditiongroup_id: 1,
	},
	{
		id: 3,
		label: "500万円以上",
		conditiongroup_id: 1,
	},
];
export const getConditionList = (req: Request, res: IAPIResponce): Response => {
	const { parent_id } = req.query;

	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
		is_error: false,message:"",type:"Array",
		data: [...conditions],
	});
};

export const getConditionListByUserToken = (
	token: string
): Array<IConditionData> => {
	const user = getUserByToken(token);
	if (user) {
		const conditionIds = userConditions
			.filter((u) => u.user_id === user.id)
			.map((u) => u.condition_id);
		return conditions.filter((c) => new Set(conditionIds).has(c.id));
	}

	return [];
};
export const getConditionListByAnserId = (
	anserId: number
): Array<IConditionData> => {
	const conditionIds = answerConditions
		.filter((a) => a.answer_id === anserId)
		.map((a) => a.condition_id);
	return conditions.filter((c) => new Set(conditionIds).has(c.id));
};
export const getConditionListByConditionGroupId = (
	conditionGroupId: number
): Array<IConditionData> => {
	return conditions.filter((a) => a.conditiongroup_id === conditionGroupId);
};
