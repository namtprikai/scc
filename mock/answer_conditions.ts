import { ICategory_Question, ISAIAPIData } from '../src/core/api/types';
import { IAdminData, ICrossReferenceTable } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
interface IAnswerCondition extends ICrossReferenceTable{
	// question_id:number;
	// group_id:number;
	// keyword_id:number;
}

export let answerConditions:Array<IAnswerCondition> = [
	{
		id: 0,
		answer_id: 0,
		condition_id: 3,
	},
	{
		id: 0,
		answer_id: 1,
		condition_id: 4,
	},
];
class AnswerCondition extends CrossReferenceTable<IAnswerCondition>{
	public getConditionByAnswerId(answer_id: number,table:Array<ICrossReferenceTable>) {
		return this.getAByB(answer_id,table);
	}
	public deletebyConditionId(condition_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByBId(condition_id,table);
	}
	public deletebyAnswerId(answer_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByAId(answer_id,table);
	}
	public addConditionByAnswerId(answer_id: number,conditionIdList:Array<number>,table:Array<ICrossReferenceTable>):Array<number> {
		const addIdList = [];
		for(const conditionId of conditionIdList){
			this.add(answer_id,conditionId,table);
			addIdList.push(conditionId);
		}
		return addIdList;
	}
}
const answerConditionModel = new AnswerCondition("answer_id","condition_id");
