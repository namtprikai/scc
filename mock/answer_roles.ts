import { IAnswerData, IRoleData } from "../src/core/api/types";
import {roles} from "./roles";
export const answerRoles = [
	{
		id:0,
		role_id:0,
		answer_id:0
	}
];

export const addAnswer = (answer_id:number,role_id:number)=>{
	const id = answerRoles[answerRoles.length-1].id + 1;
	answerRoles.push({
id,
answer_id,
role_id
	});
}
export const getAnswerRolesByAnswer = (answer:IAnswerData):Array<IRoleData>=>{
	// @ts-ignore
	return answerRoles.filter(ur=>ur.answer_id === answer.id).map(ur=>roles.find(r=>ur.role_id===r.id))
	.filter(o=>o!=undefined);
}
