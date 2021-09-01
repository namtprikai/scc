import { AjaxService } from "@/services/ajax";

export namespace Admin {
	interface AdminData {
		name?: string;
		email?: string;
		password?: string;
		role?: number;
		is_master?:number;
		config?:any;
	}
	export const add = ( data: AdminData) => {
		return AjaxService.ajax.http({
			url: `/admin/`,
			method: "POST",
			data,
		});
	};
	export const get = ()=>{
		return AjaxService.ajax.http({
			url: `/admin/`,
			method: "get",
			headers: {
				"Content-type": "application/json",
			},
			params: {},
		});
	}
	export const patch = (id:number,data: AdminData)=>{
		return AjaxService.ajax.http({
			url: `/admin/${id}/`,
			method: "PATCH",
			data,
		});
	}
}
