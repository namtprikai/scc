import faker from 'faker'
import {answers} from './answer';
import {questions} from './question';
import {answerConditions} from './answer_conditions';
export const init = ()=>{
	const N = getRandomInt(10,100);

	for(let i=2;i<N;i++){
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
	}
	let count = 0;
	let questionIdCount = 0;
	while(questions.length>questionIdCount){
		answers.push(
			{
				id: count++,
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
	}
}

function getRandomInt(min:number, max:number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
