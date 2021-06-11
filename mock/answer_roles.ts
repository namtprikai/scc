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
