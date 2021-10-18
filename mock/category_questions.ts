import { ICategory_Question } from '../src/core/api/types';
import { IAdminData, ICrossReferenceTable } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let category_questions: Array<ICrossReferenceTable> = [

];
class CategoryQuestion extends CrossReferenceTable<ICrossReferenceTable>{
	public getCategoryByQuestionId(question_id: number,table:Array<ICrossReferenceTable>) {
		return this.getBByA(question_id,table);
	}
	public deletebyCategoryId(category_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByAId(category_id,table);
	}
	public deletebyPolicyId(question_id: number,table:Array<ICrossReferenceTable>){
		this.deleteByBId(question_id,table);
	}
}
const categoryQuestionModel = new CategoryQuestion("category_id","question_id");
