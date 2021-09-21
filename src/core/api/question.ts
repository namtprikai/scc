import { AjaxService } from "@/services/ajax";
export namespace Question{
	export const getList = async ()=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `questions/`,
			method: "get",
			params: {},
		});
		console.log(data);
		return data;
	};
	export const post = ()=>{};
	export const patch = ()=>{};
	export const deleteObject = ()=>{};
}
