import {IRoleData,IAPIResponce} from "../src/core/api/types";
import { Response, Request } from 'express';
export const roles:Array<IRoleData> = [
	{
		id:0,
		label:"ゲスト",
	}
];

export const getRoleList = (req: Request, res: IAPIResponce)=> {

}
