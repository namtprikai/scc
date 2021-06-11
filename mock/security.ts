import { Response, Request, NextFunction } from 'express'
import { IPolicyData,IAPIResponce, IUserData, IRoleData } from '../src/core/api/types';
import {getUserRolesByUserId} from "./user_roles";
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
