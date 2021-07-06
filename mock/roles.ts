import { IRoleData, IAPIResponce } from "../src/core/api/types";
import { Response, Request } from "express";
export const roles: Array<IRoleData> = [
	{
		id: 0,
		label: "ゲスト",
	},
	{
		id: 2,
		label: "会員",
	},
	{
		id: 2,
		label: "VIP会員",
	},
];

export const getRoleList = (req: Request, res: IAPIResponce) => {};
