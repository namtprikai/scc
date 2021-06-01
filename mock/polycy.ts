import faker from 'faker';
import { Response, Request } from 'express';
import { IPolicyData } from '../src/core/api/types';
const policys:Array<IPolicyData> =[
	{
		id:0,
		label:"",
		is_sharing:false
	}
];

export const getPolicyList = (req: Request, res: Response):Response => {
	const { parent_id } = req.query;

	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
			code: 20000,
			data: [...policys]
	})
}
