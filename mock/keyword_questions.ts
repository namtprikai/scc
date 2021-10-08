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
	public getKeywordByQuestionId(question_id: number,table:Array<ICrossReferenceTable>) {
		return this.getBByA(question_id,table);
	}
	public deletebyKeywordId(keyword_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByAId(keyword_id,table);
	}
	public deletebyKeywordIdList(question_id: number,keyword_idList: Array<number>,table:Array<ICrossReferenceTable>){
		const deleteIdList = [];
		for(const keyword_id of keyword_idList){
			this.deleteByABId(question_id,keyword_id,table);
			deleteIdList.push(keyword_id);
		}
		return deleteIdList;
	}
	public deletebyQuestionId(question_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByBId(question_id,table);
	}
	public addKeywordByQuestionId(question_id: number,keywordIdList:Array<number>,table:Array<ICrossReferenceTable>) {
		const addIdList = [];
		for(const keywordId of keywordIdList){
			this.add(keywordId,question_id,table);
			addIdList.push(keywordId);
		}
		return addIdList;
	}
}
const keywordQuestionModel = new KeywordQuestion("keyword_id","question_id");

export const getKeywordsByQuestionId = (id:number)=>{
	return keywordQuestionModel.getKeywordByQuestionId(id,keywordQuestions);
}
export const editKeywordsByQuestionId = (question_id: number,add_id:Array<number>,delete_id:Array<number>):[Array<{keyword_id:Array<number>,group_id:number}>,Array<{keyword_id:Array<number>,group_id:number}>] => {
	const addList = keywordQuestionModel.addKeywordByQuestionId(question_id,add_id,keywordQuestions);
	const deleteList = keywordQuestionModel.deletebyKeywordIdList(question_id,delete_id,keywordQuestions);
	return [addList,deleteList];
	};
