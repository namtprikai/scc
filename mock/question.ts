import faker from 'faker'
import { Response, Request } from 'express'
import { IProductData, IQuestionData } from '../src/core/api/types'
import { IAPIResponce} from '../src/core/api/types'
import { secureObjectCreateByAdmin } from './security';
import {questionProducts} from './question_products';
import {productions} from "./products";
export const questions:Array<IQuestionData> =[
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

// interface IProductsAPIResponce extends Response {
// 	json: (args: {
// 		status: number;
// 		data: {
// 			products: Array<IAnswerData>;
// 		};
// 	}) => any;

// }

const Questions =  secureObjectCreateByAdmin<IQuestionData>(()=>questions, (q)=>{
	const products:Array<IProductData> = [];
	for(const qp of questionProducts){
		if(q.id===qp.question_id){
			for(const production of productions){
				if(qp.product_id === production.id){
					products.push(production);
					break;
				}
			}
		}

	}
	return products;
});
export const getQuestionList = (req: Request, res: IAPIResponce):Response => {
	const { category_id,text } = req.params;
console.log("question");
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
