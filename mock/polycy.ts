import faker from 'faker';
import { Response, Request } from 'express';
import { IPolicyData,IAPIResponce } from '../src/core/api/types';
const policys:Array<IPolicyData> =[
	{
		id:0,
		label:"ロールの作成",
		is_sharing:false
	},
	{
		id:1,
		label:"ロールの編集",
		is_sharing:false
	},
	{
		id:2,
		label:"ロールの削除",
		is_sharing:false
	},
	{
		id:3,
		label:"ロールの詳細",
		is_sharing:false
	},
];

export const getPolicyList = (req: Request, res: IAPIResponce):Response => {
	const { parent_id } = req.query;

	return res.json({
			status: 20000,
			data: [...policys]
	})
}
