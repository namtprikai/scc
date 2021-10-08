import { AjaxService } from "@/services/ajax";
import {IKeywordGroupData, IProductData, IQuestionData} from "@/api/types";
export namespace Question{
	const URL = "question/";
	export const getList = async ()=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const getCategoryByQuestionId = async(questionId:number)=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url:  `${URL}${questionId}/category/`,
			method: "get",
			params: {},
		});
		return data;
	};
	export const getProductsByQuestionId  = async(questionId:number):Promise<Array<IProductData>>=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url:  `${URL}${questionId}/product/`,
			method: "get",
			params: {},
		});
		return data;
	};
	export const editProductsByQuestionId  = async(questionId:number,addId:Array<number>,deleteId:Array<number>):Promise<Array<IProductData>>=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url:  `${URL}${questionId}/product/`,
			method: "post",
			data:{product_id:addId,delete_id:deleteId},
		});
		return data;
	};
	export const getKeywordsByQuestionId = async(questionId:number):Promise<IKeywordGroupData[]>=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url:  `${URL}${questionId}/keyword/`,
			method: "get",
			params: {},
		});
		return data;
	};
	export const editKeywordsByQuestionId = async(questionId:number,addKeyword:Array<{group_id:number,keyword_id:Array<number>}>,deleteKeyword:Array<{group_id:number,keyword_id:Array<number>}>):Promise<IKeywordGroupData[]>=>{
		const { data,is_error,type }: any = await AjaxService.ajax.http({
			url:  `${URL}${questionId}/keyword/`,
			method: "post",
			data: {add:addKeyword,delete:deleteKeyword},
		});
		return data;
	};
	export const post = async(input:IQuestionData)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}`,
			method: "post",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const patch = async(id:number,input:any)=>{
		const { data }: any = await AjaxService.ajax.http({
			url:  `${URL}/${id}/`,
			method: "patch",
			data: input,
		});
		console.log(data);
		return data;
	};
	export const deleteObject = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}/${id}/`,
			method: "post",
			data: {},
		});
		console.log(data);
		return data;
	};
	export const lock = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}/${id}/lock`,
			method: "GET",
			params: {},
		});
		console.log(data);
		return data;
	}
	export const unlock = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}/${id}/unlock`,
			method: "GET",
			params: {},
		});
		console.log(data);
		return data;
	}
}

