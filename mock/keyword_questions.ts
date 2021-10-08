import { ICategory_Question, ISAIAPIData } from '../src/core/api/types';
import { IAdminData, ICrossReferenceTable } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
interface IKeywordQuestion extends ICrossReferenceTable{
	// question_id:number;
	// group_id:number;
	// keyword_id:number;
}
let keywordQuestions:Array<IKeywordQuestion> = [
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
class KeywordQuestion extends CrossReferenceTable<IKeywordQuestion>{
	public getKeywordByQuestionId(question_id: number,table:Array<ICrossReferenceTable>) {
		return this.getBByA(question_id,table);
	}
	public deletebyKeywordId(keyword_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByAId(keyword_id,table);
	}
	public addGrpupbyKeywordIdList(question_id: number,group_id:number,keyword_idList: Array<number>,table:Array<ICrossReferenceTable>):Array<number>{
		const addIdList = [];
		for(const keyword_id of keyword_idList){
			table.push({
				id:this.getMaxId(table),
				question_id,
				group_id,
				keyword_id,
			});
			addIdList.push(keyword_id);
		}
		return addIdList;
	}
	public deleteGrpupbyKeywordIdList(question_id: number,group_id:number,keyword_idList: Array<number>,table:Array<ICrossReferenceTable>):Array<number>{
		const deleteIdList = [];
		for(const keyword_id of keyword_idList){
			table = table.filter(t=>{
				return !(t.question_id!==question_id && t.group_id !== group_id && t.keyword_id !==keyword_id)
			});
			this.deleteByABId(question_id,keyword_id,table);
			deleteIdList.push(keyword_id);
		}
		return deleteIdList;
	}
	public deletebyQuestionId(question_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByBId(question_id,table);
	}
	addGroupId(aId: number, bId: number,groupId:number, table: Array<IKeywordQuestion>) {
		const id = this.getMaxId(table);
		table.push({
			id,
			[this.aName]: aId,
			[this.bName]: bId,
			group_id:groupId
		});
	}
	public addKeywordByQuestionId(question_id: number,keywordIdList:Array<number>,table:Array<ICrossReferenceTable>):Array<number> {
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
export const editKeywordsByQuestionId = (question_id: number,addList:Array<{keyword_id:Array<number>,group_id:number}>,deleteList:Array<{keyword_id:Array<number>,group_id:number}>):[Array<{keyword_id:Array<number>,group_id:number}>,Array<{keyword_id:Array<number>,group_id:number}>] => {
	const addQuestionList = [];
	for(const addObject of addList){
		keywordQuestionModel.addGrpupbyKeywordIdList(question_id,addObject.group_id,addObject.keyword_id,keywordQuestions);
		addQuestionList.push({keyword_id:addObject.keyword_id,group_id:addObject.group_id});
	}
	const deleteQuestionList = [];
	for(const deleteObject of deleteList){
		keywordQuestionModel.deleteGrpupbyKeywordIdList(question_id,deleteObject.group_id,deleteObject.keyword_id,keywordQuestions);
		deleteQuestionList.push({keyword_id:deleteObject.keyword_id,group_id:deleteObject.group_id});
	}
	// const addList = keywordQuestionModel.addKeywordByQuestionId(question_id,add_id,keywordQuestions);
	// const deleteList = keywordQuestionModel.deletebyKeywordIdList(question_id,delete_id,keywordQuestions);
	return [addQuestionList,deleteQuestionList];
	};
