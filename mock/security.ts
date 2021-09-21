import { Response, Request, NextFunction } from "express";
import {
	IPolicyData,
	IAPIResponce,
	IUserData,
	IRoleData,
	ISAIAPIData,
	IAdminData,
	IProductData,
	IAdmin,
} from "../src/core/api/types";
import { getUserRolesByUserId } from "./user_roles";
import { getProductsByAdmin, getProductsByAdminId } from "./product_admins";
import { getPolicyListByAdmin } from "./polycy";
export const accessTokenAuth = (
	req: Request,
	res: IAPIResponce,
	next: NextFunction
) => {
	const accessToken = req.header("Authorization");
	if (!accessToken && false) {
		return res.status(401).json({
			is_error: true,message:"",type:"Object",
			data: {
				errors: [{ status: "forbidden_error" }],
			},
		});
	}
	next();
};
export const auth = (user: IUserData, roles: Array<IRoleData>) => {
	const userRoles = getUserRolesByUserId(user.id);
	for (const userRole of userRoles) {
		if (roles.find((r) => r.id === userRole.id)) {
			return true;
		}
	}
	return false;
};
export const authAdminRead = (admin: IAdminData, products: Array<IProductData>,uri:string,method: string):[boolean,Array<IProductData>] => {
	// masterであれば無条件に返す
	if (admin.is_master) {
		return [true, products];
	}
	const adminProducts = getProductsByAdminId(admin.id);
/**
	* ここでポリシー検証
	*/
	const isPolicyAuth = authPolicy(admin,uri,method);
	if(isPolicyAuth===false){
		return [false, adminProducts];
	}
	for (const product of products) {
		if (adminProducts.find((ap) => ap.id === product.id)) {
			return [true, adminProducts];
		} else {
			return [false, adminProducts];
		}
	}
	// if(roles.find(r=>r.id === adminRoles.id)){
	// 	return true;
	// }
	return [false, adminProducts];
};
const authPolicy = (admin: IAdminData,uri:string,method: string) =>{
	const policyList = getPolicyListByAdmin(admin);
	for(const policy of policyList){
		if(policy.url === uri&&policy.method===method){
			return true;
		}
	}
	return false;
}
export const authAdminWhite = (admin: IAdminData, products: Array<IProductData>,uri:string,method: string):[boolean,Array<IProductData>] => {
	// masterであれば無条件に返す
	if (admin.is_master) {
		return [true, products];
	}
	const adminProducts = getProductsByAdminId(admin.id);
/**
	* ここでポリシー検証
	*/
	const isPolicyAuth = authPolicy(admin,uri,method);
	if(isPolicyAuth===false){
		return [false, adminProducts];
	}
	const authList = [];
	for (const product of products) {
		if (adminProducts.find((ap) => ap.id === product.id)) {
			authList.push(true);
		} else {
			return [false, adminProducts];
		}
	}
	if(authList.length>0){
	return [true, adminProducts];
	}
	// if(roles.find(r=>r.id === adminRoles.id)){
	// 	return true;
	// }
	return [false, adminProducts];
};
export class ProductRoleFilter<T extends  ISAIAPIData> {
	constructor(
		protected getDataList: () => Array<T>,
		protected getProductsFunc: (data: T) => Array<IProductData>
	) {}
	public  isWhite(admin: IAdminData,data:T,uri:string,method:string):boolean{
		const dataProducts = this.getProductsFunc(data);
		const [isAuth, adminProducts] = authAdminWhite(admin, dataProducts,uri,method);
		return isAuth;
	}
	public  isRead(admin: IAdminData,data:T,uri:string,method:string):boolean{
		const dataProducts = this.getProductsFunc(data);
		const [isAuth, adminProducts] = authAdminRead(admin, dataProducts,uri,method);
		return isAuth;
	}
	public getData(
		admin: IAdminData,
		uri:string,
		method:string,
		mapFunc?: (data: T, intersectionProducts: Array<IProductData>) => T,
		filter?: (d: T) => boolean
	): Array<T> {
		const res: Array<T> = [];
		const dataList = this.getDataList();
		for (let data of dataList) {
			if (filter && !filter(data)) {
				continue;
			}
			const dataProducts = this.getProductsFunc(data);
			const [isAuth, adminProducts] = authAdminRead(admin, dataProducts,uri,method);
			console.log(isAuth);
			if (isAuth) {
				if (mapFunc) {
					data = data;
				}
				res.push(data);
			}
		}
		return res;
	}
}
export class RoleFilter<T extends  ISAIAPIData> {
	constructor(
		protected getDataList: () => Array<T>,
		protected getRoleFunc: (data: T) => Array<IRoleData>
	) {}
	public getData(user: IUserData, filter?: (d: T) => boolean): Array<T> {
		return this.getDataList().filter((a) => {
			if (filter && !filter(a)) {
				return false;
			}
			const aRoles = this.getRoleFunc(a);
			return auth(user, aRoles);
		});
	}
}
export const secureObjectCreateByAdmin = <T extends  ISAIAPIData>(
	getDataList: () => Array<T>,
	getProductsFunc: (data: T) => Array<IProductData>
): ProductRoleFilter<T> => {
	return new ProductRoleFilter<T>(getDataList, getProductsFunc);
};
export const secureObjectCreateByUser = <T extends  ISAIAPIData>(
	getDataList: () => Array<T>,
	getRoleFunc: (data: T) => Array<IRoleData>
): RoleFilter<T> => {
	return new RoleFilter<T>(getDataList, getRoleFunc);
};
