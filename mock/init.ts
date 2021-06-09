import faker from 'faker'
import {answers} from './answer';
import {questions} from './question';
import {answerConditions} from './answer_conditions';
import {conditions} from "./condition";
import {conditionGroups} from "./conditionGroup";
import { IConditionGroupData } from '../src/core/api/types';
export const init = ()=>{
	const N = getRandomInt(10,100);

	let conditionIdCount = conditions[conditions.length-1].id+1;
	for(let i=questions[questions.length-1].id+1;i<N;i++){
		questions.push(
			{
				id: i,
				title: faker.hacker.noun(),
				label: faker.hacker.noun(),
				is_public: true,
				config:{},
				created: new Date(),
				modified: new Date(),
			},
		);
		const CGroup:IConditionGroupData = {
			id: i,
			label: faker.hacker.noun(),
			level:i,
			is_setting:true,
		}
		conditionGroups.push(CGroup);
		const M =getRandomInt(2,10);
		for(let j=0;j<M;j++){
			conditions.push({
				id:conditionIdCount++,
				label: faker.hacker.noun(),
				conditiongroup_id:i
			});
		}
	}
	let count = 0;
	let questionIdCount = 0;
	let anserConditionsIdCount = 0;
	while(questions.length>questionIdCount){
		answers.push(
			{
				id: count,
				question_id: questionIdCount,
				text: faker.hacker.noun(),
				is_public: true,
				created: new Date(),
				modified: new Date(),
			},
		);
		if(Math.random()*10<2){
			questionIdCount++;
		}
		const M =getRandomInt(2,10);
		const conditionIdSet = new Set();
		for(let j=0;j<M;j++){
			let cid = 0;
			do{
				cid = getRandomInt(2,10);
			}while(!conditionIdSet.has(cid));
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
