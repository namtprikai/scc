import faker from "faker";
import { Response, Request } from "express";
import { ICategoryData,IProductData, IRoleData } from "../src/core/api/types";
import { IAPIResponce } from "../src/core/api/types";
import { userProducts } from "./user_products";
import {userRoles} from "./user_roles";
import { productions } from "./products";
import { ProductRoleFilter, RoleFilter, secureObjectCreateByAdmin } from "./security";
import {SAITableModel} from './utils';
import { getAdminByToken } from "./admins";
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
const CategoryModel = new SAITableModel(
	categorys,
	new ProductRoleFilter(() => categorys, (c) => {
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
}),
new RoleFilter(
	() => categorys,
	(c) => {
		const roles: Array<IRoleData> = [];
		for (const up of userRoles) {
			if (c.id === up.user_id) {
				for (const role of roles) {
					if (up.role_id === role.id) {
						roles.push(role);
						break;
					}
				}
			}

		}
		return roles;
	}
	)
);

export const getCategoryList = (req: Request, res: IAPIResponce): Response => {
	const { parent_id } = req.query;
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if(admin){
		const categoryList = CategoryModel.getListByAdmin(admin);
		return res.json({
			status: 20000,
			data: [...categoryList],
		});
	}
	return res.json({
		status: 400,
		data: [],
	});
};
