import faker from "faker";
import { Response, Request } from "express";
import { IPolicyData, IAPIResponce } from "../src/core/api/types";
const policys: Array<IPolicyData> = [
	{
		id: 0,
		label: "ロールの作成",
		is_sharing: false,
	},
	{
		id: 1,
		label: "ロールの編集",
		is_sharing: false,
	},
	{
		id: 2,
		label: "ロールの削除",
		is_sharing: false,
	},
	{
		id: 3,
		label: "ロールの詳細",
		is_sharing: false,
	},
	{
		id: 4,
		label: "ユーザーの詳細",
		is_sharing: false,
	},
	{
		id: 5,
		label: "ユーザーの編集",
		is_sharing: false,
	},
	{
		id: 6,
		label: "ユーザーの削除",
		is_sharing: false,
	},
	{
		id: 7,
		label: "ユーザーの作成",
		is_sharing: false,
	},
	{
		id: 8,
		label: "アドミンの詳細取得",
		is_sharing: false,
	},
];

export const getPolicyList = (req: Request, res: IAPIResponce): Response => {
	const { parent_id } = req.query;

	return res.json({
		status: 20000,
		data: [...policys],
	});
};
