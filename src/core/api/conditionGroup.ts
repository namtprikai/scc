import { AjaxService } from "@/services/ajax";
import { AxiosResponse } from "axios";

namespace ConditionGroup{
	const URL = "";
	export const getList = async ()=>{
		const { data }: AxiosResponse<any> = await AjaxService.ajax.http({
			url: `/condition_group`,
			method: "get",
			params: {},
		});
		return data;
	};
	export const post = ()=>{};
	export const patch = ()=>{};
	export const deleteObject = ()=>{};
}
