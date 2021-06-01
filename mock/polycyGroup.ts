import faker from 'faker'
import { Response, Request } from 'express'
import { IPolicyGroupData } from '../src/core/api/types'
const policyGroups:Array<IPolicyGroupData> =[
	{
		id:0,
		label:"管理者",
		config:{
			role:[1,2,3,4,5]
		}
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
			data: [...policyGroups]
	})
}
