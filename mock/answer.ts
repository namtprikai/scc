import faker from 'faker'
import { Response, Request } from 'express'
import { IAnswerData } from '../src/core/api/types'
import { IAPIResponce} from '../src/core/api/types'
const answers:Array<IAnswerData> =[
	{
		id:0,
		question_id:0,
		text:"それはプリウスです。何故ならば・・・",
		is_public:true,
		created:new Date(),
		modified:new Date(),
	},
	{
		id:1,
		question_id:0,
		text:"それはランクルです。何故ならば・・・",
		is_public:true,
		created:new Date(),
		modified:new Date(),
	}
];
export const getAnser = (req: Request, res: IAPIResponce):Response => {
	const { question_id } = req.params;

	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
			status: 20000,
			data: [...answers]
	})
}
