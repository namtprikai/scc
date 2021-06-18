import {IProductData} from '../src/core/api/types';
export const productAdmins = [
	{
		id:0,
		product_id:0,
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
export const getAdminProductsByAdminId = (user_id:number):Array<IProductData>=>{
	// @ts-ignore
	return userRoles.filter(ur=>ur.user_id === user_id).map(ur=>roles.find(r=>ur.role_id===r.id))
	.filter((o:any)=>o!=undefined);
}
