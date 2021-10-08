import { ICategory_Question } from '../src/core/api/types';
import { IAdminData, ICrossReferenceTable } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let keywordQuestions = [
	{
		id: 0,
		question_id: 0,
		group_id:1,
		keyword_id: 3,
	},
	{
		id: 1,
		question_id: 1,
		group_id:1,
		keyword_id: 4,
	},
];
class KeywordQuestion extends CrossReferenceTable{
	public getKeywordyQuestionId(question_id: number,table:Array<ICrossReferenceTable>) {
		return this.getBByA(question_id,table);
	}
	public deletebyCategoryId(keyword_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByAId(keyword_id,table);
	}
	public deletebyPolicyId(question_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByBId(question_id,table);
	}
}
const keywordQuestionModel = new KeywordQuestion("keyword_id","question_id");

export const getKeywordsByQuestionId = (id:number)=>{
	return keywordQuestionModel.getKeywordyQuestionId(id,keywordQuestions);
}
