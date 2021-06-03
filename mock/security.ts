import { Response, Request, NextFunction } from 'express'
import { IPolicyData,IAPIResponce } from '../src/core/api/types';
export const accessTokenAuth = (req: Request, res: IAPIResponce, next: NextFunction) => {
  const accessToken = req.header('Authorization')
  if (!accessToken) {
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
