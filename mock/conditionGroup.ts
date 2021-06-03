import faker from 'faker'
import { Response, Request } from 'express'
import { IConditionGroupData ,IAPIResponce} from '../src/core/api/types'
export const getConditionGroupList = (req: Request, res: IAPIResponce):Response => {
	const { parent_id } = req.query;
	const conditionGroups:Array<IConditionGroupData> =[
		{
			id:0,
			label:"sex",
			is_setting:true,
			level:1,
		}
	];
	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
			status: 20000,
			data: [...conditionGroups]
	})
}
