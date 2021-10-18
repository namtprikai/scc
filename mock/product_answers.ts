import { IProductData,IProductAnswer } from "../src/core/api/types";
import { productions } from "./products";
import { IAdminData } from "../src/core/api/types";
import { CrossReferenceTable } from "./utils";
let productAnswers:Array<IProductAnswer> = [
	{
		id: 0,
		product_id: 0,
		answer_id: 0,
	},
	{
		id: 1,
		product_id: 2,
		answer_id: 0,
	},
];
class CategoryQuestion extends CrossReferenceTable<IProductAnswer>{
	public getProductByAnswerId(answer_id: number, table: Array<IProductAnswer>) {
		return this.getAByB(answer_id, table);
	}
	public addProductsToAnswer(answer_id: number, product_id_list: Array<number>, table: Array<IProductAnswer>) {
		for (const product_id of product_id_list) {
			this.add(product_id,answer_id,table);
		}
		return answer_id;
	}
	public deletebyAnswerId(answer_id: number, table: Array<IProductAnswer>) {
		this.deleteByBId(answer_id, table);
	}
	public deletebyProductId(product_id: number, table: Array<IProductAnswer>) {
		this.deleteByAId(product_id, table);
	}
}
const productAnswerModel = new CategoryQuestion("product_id","answer_id");

export const getProductsByAnswerId = (answer_id: number): Array<number> => {
	return productAnswerModel.getProductByAnswerId(answer_id,productAnswers);
}

export const addProductsToAnswer = (answer_id: number, productIdList: Array<number>) => {
	return productAnswerModel.addProductsToAnswer(answer_id,productIdList,productAnswers);
}
