import { IProductCategory } from '../src/core/api/types';
import { IAdminData, ICrossReferenceTable } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let product_categoryList: Array<IProductCategory> = [];
class CategoryQuestion extends CrossReferenceTable<IProductCategory>{
	public getProductByCategoryId(category_id: number,table:Array<IProductCategory>) {
		return this.getAByB(category_id,table);
	}
	public deletebyCategoryId(category_id: number,table:Array<IProductCategory>){
		this.deleteByBId(category_id,table);
	}
	public deletebyProductId(product_id: number,table:Array<IProductCategory>){
		this.deleteByAId(product_id,table);
	}
}
const categoryQuestionModel = new CategoryQuestion("product_id","category_id");
