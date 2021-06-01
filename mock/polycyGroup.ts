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
export const getPolicyGroupByAdminId = (req: Request, res: Response) => {
	const { id } = req.params
	// for (const admin of adminList) {
	// 		if (String(admin.id) === id) {
					return res.json({
							code: 20000,
							data: [...policyGroups]
					})
	// 		}
	// }
	return res.status(400).json({
			code: 50004,
			messaege: 'Invalid Admin'
	})
}
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
export const getPolicyGroup = (req: Request, res: Response):Response => {
	const { id } = req.query;
	if(!/^\d$/.test(`${id}`)){
		return res.json({
			code: 50000,
			data: {}
	})
	}
	for(const policyGroup of policyGroups){
		if(policyGroup.id===parseInt(String(id))){
			return res.json({
				code: 20000,
				data: {...policyGroup}
		})
		}
	}
	return res.json({
		code: 50000,
		data: {}
})
}
