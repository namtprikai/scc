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
	export const getList = ()=>{
		return AjaxService.ajax.http({
			url: `/admins/`,
			method: "get",
			headers: {
				"Content-type": "application/json",
			},
			params: {},
		});
	}
	export const get = (id:number)=>{
		return AjaxService.ajax.http({
			url: `/admin/${id}/`,
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
	export const changePw = (id:number,data: {
		old_password: string,
		new_password: string,
	})=>{
		return AjaxService.ajax.http({
			url: `/admin/changepw/${id}/`,
			method: "PATCH",
			data,
		});
	}
}
