import { IProductData } from '../src/core/api/types';
import { productions} from './products';
import { IAdminData } from '../src/core/api/types';
export const productAdmins = [
	{
		id:0,
		product_id:0,
		admin_id:0
	},
		{
		id:1,
		product_id:2,
		admin_id:0
	}
];
export const addProductAdmin = (admin_id:number,product_id:number)=>{
	const id = productAdmins[productAdmins.length-1].id + 1;
	productAdmins.push({
		id,
		product_id,
		admin_id
	});
}
export const getProductsByAdminId = (admin_id:number):Array<IProductData>=>{
	const products: Array<IProductData> = [];
	for (const productAdmin of productAdmins) {
		if (productAdmin.admin_id === admin_id) {
			for (const production of productions) {
				if (productAdmin.product_id === production.id) {
					products.push(production);
				}
			}
		}
	}
	return products;
}
export const getProductsByAdmin = (admin: IAdminData): Array<IProductData> => {
	return getProductsByAdminId(admin.id);
}
