import faker from 'faker'
import { Response, Request } from 'express'
import { IConditionData } from '../src/core/api/types'
import { IAPIResponce} from '../src/core/api/types'
export const getConditionList = (req: Request, res: IAPIResponce):Response => {
	const { parent_id } = req.query;
	const conditions:Array<IConditionData> =[
		{
			id:0,
			label:"男",
			conditiongroup_id:0,
		},
		{
			id:1,
			label:"女",
			conditiongroup_id:0,
		}
	];
	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
			status: 20000,
			data: [...conditions]
	})
}
