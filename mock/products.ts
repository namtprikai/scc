import { IProductData } from '../src/core/api/types';
import { Response, Request } from 'express'
import { IAnswerData, IConditionData, IConditionGroupData, IScenarioTree, IScenarioTreeCondition } from '../src/core/api/types'
import { IAPIResponce, IAnswerDataCondition, IConditionMap } from '../src/core/api/types'
import { secureObjectCreateByAdmin } from './security';
import { getAdminByToken } from './admins';
export const productions:Array<IProductData> =[
	{
		id:0,
		name:"サーチタグ(自社顧客向けCPサイト埋め込み)",
		config:{},
		created:new Date(),
		modified:new Date(),
		max_failure_count_user:3,
		max_failure_time_user:5
	},
	{
		id:1,
		name:"ショッピングサイトAのチャットボット",
		config:{},
		created:new Date(),
		modified:new Date(),
		max_failure_count_user:3,
		max_failure_time_user:5
	},
	{
		id:2,
		name:"ショッピングサイトBのチャットボット",
		config:{},
		created:new Date(),
		modified:new Date(),
		max_failure_count_user:3,
		max_failure_time_user:5
	},
	{
		id:3,
		name:"会員サロンAのタグサーチ",
		config:{},
		created:new Date(),
		modified:new Date(),
		max_failure_count_user:3,
		max_failure_time_user:5
	}
];
interface IProductsAPIResponce extends Response {
	json: (args: {
		status: number;
		data: {
			products: Array<IAnswerData>;
		};
	}) => any;

}

const Productions =  secureObjectCreateByAdmin<IProductData>(()=>productions, ()=>productions);

export const getProducts = (req: Request, res: IAPIResponce): IProductsAPIResponce => {
	const accessToken = req.header('Authorization') || "";
	const admin = getAdminByToken(accessToken);
	if (admin) {
		const productList = Productions.getData(admin);

			return res.json({
				status: 20000,
				data: { products: productList }
			})
	}
				return res.json({
				status: 400,
				data: { }
			})
}
