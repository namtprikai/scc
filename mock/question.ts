import faker from 'faker'
import { Response, Request } from 'express'
import { IQuestionData } from '../src/core/api/types'
import { IAPIResponce} from '../src/core/api/types'
const questions:Array<IQuestionData> =[
	{
		id:0,
		label:"",
		title:"私におすすめの車は？",
		is_public:true,
		config:{},
		created:new Date(),
		modified:new Date(),
	},
	{
		id:1,
		label:"",
		title:"私におすすめのバイクは？",
		is_public:true,
		config:{},
		created:new Date(),
		modified:new Date(),
	}
];
export const getQuestionList = (req: Request, res: IAPIResponce):Response => {
	const { category_id,text } = req.params;

	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	if(category_id==null){
		return res.json({
				status: 20000,
				data: [...questions]
		})
	}
	return res.status(400).json({
		status: 50004,
		data:{
			errors:[
				{status: 'forbidden_error'}
			]
		}
})
}
