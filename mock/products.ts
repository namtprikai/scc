import { IProductData } from '../src/core/api/types';
import { Response, Request } from 'express'
import { IAnswerData, IConditionData, IConditionGroupData, IScenarioTree, IScenarioTreeCondition } from '../src/core/api/types'
import { IAPIResponce, IAnswerDataCondition, IConditionMap } from '../src/core/api/types'
import { secureObjectCreateByAdmin } from './security';
import { getAdminByToken } from './admins';
import { productAdmins ,deleteProductAdminsByProductId} from './product_admins';
import { getUserById } from './users';
export let productions: Array<IProductData> = [
	{
		id: 0,
		name: "サーチタグ(自社顧客向けCPサイト埋め込み)",
		config: {},
		created: new Date(),
		modified: new Date(),
		max_failure_count_user: 3,
		max_failure_time_user: 5
	},
	{
		id: 1,
		name: "ショッピングサイトAのチャットボット",
		config: {},
		created: new Date(),
		modified: new Date(),
		max_failure_count_user: 3,
		max_failure_time_user: 5
	},
	{
		id: 2,
		name: "ショッピングサイトBのチャットボット",
		config: {},
		created: new Date(),
		modified: new Date(),
		max_failure_count_user: 3,
		max_failure_time_user: 5
	},
	{
		id: 3,
		name: "会員サロンAのタグサーチ",
		config: {},
		created: new Date(),
		modified: new Date(),
		max_failure_count_user: 3,
		max_failure_time_user: 5
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

const Productions = secureObjectCreateByAdmin<IProductData>(() => productions, (p) => [p]);

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
		data: {}
	})
}
export const getProductsByAdminId = (req: Request, res: IAPIResponce): IProductsAPIResponce => {
	const accessToken = req.header('Authorization') || "";
	const admin = getAdminByToken(accessToken);
	if (admin) {
		const { admin_id } = req.params;
		const productList = Productions.getData(admin, (d) => d,
			(p) => {
				for (const pa of productAdmins) {
					if (p.id === pa.product_id && pa.admin_id === parseInt(admin_id)) {
						return true;
					}
				}
				return false;
			});

		return res.json({
			status: 20000,
			data: { products: productList }
		})
	}
	return res.json({
		status: 400,
		data: {}
	})
}
function getId(){
	let maxId = 0;
	for(const product of productions){
		maxId = Math.max(product.id,maxId);
	}
	return maxId+=1;
}
export const addProduct = (req: Request, res: IAPIResponce): IProductsAPIResponce => {
	const accessToken = req.header('Authorization') || "";
	const admin = getAdminByToken(accessToken);
	if (admin) {
		const { name,config,max_failure_count_user,max_failure_time_user} = req.body;
		const newId = getId();
		const product = {
			id:newId,
			name,
			config,
			max_failure_count_user:max_failure_count_user||0,
			max_failure_time_user:max_failure_time_user||0,
			created: new Date(),
			modified: new Date(),
		};
		productions.push(product);
		return res.json({
			status: 200,
			data: product
		})
	}
	return res.json({
		status: 400,
		data: {}
	})
};


export const deleteProduct  = (req: Request, res: IAPIResponce): IProductsAPIResponce => {
	const accessToken = req.header('Authorization') || "";
	const admin = getAdminByToken(accessToken);
	if (admin) {
		const { product_id } = req.params;
		const productList = Productions.getData(admin);
		for (const product of productList) {
			if (product.id === parseInt(product_id,10)) {
				productions = productions.filter(p => p.id !== parseInt(product_id, 10));
				//  中間テーブルの削除ロジック群
				deleteProductAdminsByProductId(parseInt(product_id, 10));
				break;
			}
		}
		return res.json({
			status: 200,
			data: {}
		})
	}
	return res.json({
		status: 400,
		data: {}
	})
}
