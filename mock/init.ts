import faker from 'faker'
import {answers} from './answer';
import {questions} from './question';
import {answerConditions} from './answer_conditions';
import {conditions} from "./condition";
import {conditionGroups} from "./conditionGroup";
import { IConditionGroupData } from '../src/core/api/types';
import {addAnswer, answerRoles} from "./answer_roles";
import { roles } from './roles';
export const init = ()=>{
	const N = 100;//getRandomInt(60,100);

	let conditionIdCount = conditions[conditions.length-1].id+1;
	for(let i=questions[questions.length-1].id+1;i<N;i++){
		questions.push(
			{
				id: i,
				title: faker.hacker.noun()+"ってなんですか？",
				label: faker.hacker.noun()+"ってなんですか？",
				is_public: true,
				config:{},
				created: new Date(),
				modified: new Date(),
			},
		);
		const CGroup:IConditionGroupData = {
			id: i,
			label: `あなたの情報を${faker.hacker.noun()}を以下から選択してね！`,
			level:i,
			is_setting:true,
		}
		conditionGroups.push(CGroup);
		const M =getRandomInt(2,8);
		for(let j=0;j<M;j++){
			conditions.push({
				id:conditionIdCount++,
				label: `${faker.hacker.noun()}`,
				conditiongroup_id:i
			});
		}
	}
	let count = 0;
	let questionIdCount = 0;
	let anserConditionsIdCount = 0;
	while(questions.length>questionIdCount){
		console.log("QuestionId",questionIdCount);
		answers.push(
			{
				id: count,
				question_id: questionIdCount,
				text: `それはつまりね、${faker.hacker.noun()}ということだよ`,
				is_public: true,
				created: new Date(),
				modified: new Date(),
			},
		);
		const R = getRandomInt(1,roles.length);
		for(let j = 0;j<R;j++){
			addAnswer(count,j);
		}
		if(Math.random()*6<1){
			questionIdCount++;
		}
		const M =getRandomInt(2,5);
		const conditionIdSet = new Set();
		for(let j=0;j<M;j++){
			let cid = 0;

			do{
				cid = getRandomInt(2,conditionIdCount);
				console.log(cid);
			}while(conditionIdSet.has(cid));
			conditionIdSet.add(cid)
			answerConditions.push({
				id:anserConditionsIdCount++,
				answer_id:count,
				condition_id:cid
			});
		}

		count++;
	}
}

function getRandomInt(min:number, max:number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
