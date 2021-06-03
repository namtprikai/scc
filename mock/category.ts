import faker from 'faker'
import { Response, Request } from 'express'
import { ICategoryData } from '../src/core/api/types'
import { IAPIResponce} from '../src/core/api/types'
export const getCategoryList = (req: Request, res: IAPIResponce):Response => {
	const { parent_id } = req.query;
	const categorys:Array<ICategoryData> =[
		{
			id:0,
			parent_id:null,
			label:"",
			text:"",
			created:new Date(),
			modified:new Date(),
		}
	];
	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
			status: 20000,
			data: [...categorys]
	})
}
