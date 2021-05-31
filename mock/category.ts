import faker from 'faker'
import { Response, Request } from 'express'
import { ICategoryData } from '../src/core/api/types'
export const getCategoryList = (req: Request, res: Response):Response => {
	const { parent_id } = req.query;
	const categorys:Array<ICategoryData> =[];
	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
			code: 20000,
			data: [...categorys]
	})
}
