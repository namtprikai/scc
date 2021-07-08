import faker from "faker";
import { Response, Request } from "express";
import { ICategoryData,IProductData } from "../src/core/api/types";
import { IAPIResponce } from "../src/core/api/types";
import { userProducts } from "./user_products";
import { productions } from "./products";
import { secureObjectCreateByAdmin } from "./security";
// import { } from '';
const categorys: Array<ICategoryData> = [
	{
		id: 0,
		parent_id: null,
		label: "",
		text: "",
		created: new Date(),
		modified: new Date(),
	},
];
const Categorys = secureObjectCreateByAdmin<ICategoryData>(() => categorys, (c) => {
	const products: Array<IProductData> = [];
	for (const up of userProducts) {
		if (c.id === up.user_id) {
			for (const production of productions) {
				if (up.product_id === production.id) {
					products.push(production);
					break;
				}
			}
		}

	}
	return products;
});
export const getCategoryList = (req: Request, res: IAPIResponce): Response => {
	const { parent_id } = req.query;

	// const users = userList.filter(user => {
	// 		const lowerCaseName = user.name.toLowerCase()
	// 		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	// })
	return res.json({
		status: 20000,
		data: [...categorys],
	});
};
