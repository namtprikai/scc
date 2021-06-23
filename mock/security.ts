import { Response, Request, NextFunction } from 'express'
import { IPolicyData,IAPIResponce, IUserData, IRoleData,ISAIAPIData,IAdminData, IProductData } from '../src/core/api/types';
import {getUserRolesByUserId} from "./user_roles";
import {getProductsByAdmin, getProductsByAdminId} from './product_admins';
export const accessTokenAuth = (req: Request, res: IAPIResponce, next: NextFunction) => {
  const accessToken = req.header('Authorization')
  if (!accessToken&&false) {
    return res.status(401).json({
      status: 50001,
						data:{
							errors:[
								{status: 'forbidden_error'}
							]
						}
    })
  }
  next()
}
export const auth = (user:IUserData,roles:Array<IRoleData>)=>{
	const userRoles = getUserRolesByUserId(user.id);
	for(const userRole of userRoles){
		if(roles.find(r=>r.id === userRole.id)){
			return true;
		}
	}
	return false;
}
export const authAdmin = (admin:IAdminData,products:Array<IProductData>)=>{
	const adminProducts = getProductsByAdminId(admin.id);
	for(const adminProduct of adminProducts){
		if (products.find(p => p.id === adminProduct.id)) {
			return true;
		}
	}
	// if(roles.find(r=>r.id === adminRoles.id)){
	// 	return true;
	// }
	return false;
}

class ProductRoleFilter<T>{
	constructor(protected getDataList: () => Array<T>, protected getProductsFunc: (data: T) => Array<IProductData>) { }
	public getData(admin:IAdminData,filter?:(d:T)=>boolean):Array<T>{
		return this.getDataList()
			.filter(a => {
			if(filter&&!filter(a)){
				return false;
			}
			const aProducts = this.getProductsFunc(a);
				return authAdmin(admin,aProducts);
		});
	}
}
class RoleFilter<T>{
	constructor(protected getDataList:()=>Array<T>,protected getRoleFunc:(data:T)=>Array<IRoleData>){}
	public getData(user:IUserData,filter?:(d:T)=>boolean):Array<T>{
		return this.getDataList().filter(a => {
			if(filter&&!filter(a)){
				return false;
			}
				const aRoles = this.getRoleFunc(a);
				return auth(user,aRoles);
		});
	}
}
export const secureObjectCreateByAdmin = <T>(getDataList:()=>Array<T>,getProductsFunc:(data:T)=>Array<IProductData>):ProductRoleFilter<T> => {
	return new ProductRoleFilter<T>(getDataList,getProductsFunc);
}
export const secureObjectCreateByUser = <T>(getDataList:()=>Array<T>,getRoleFunc:(data:T)=>Array<IRoleData>):RoleFilter<T> =>{
	return new RoleFilter<T>(getDataList,getRoleFunc);
}
