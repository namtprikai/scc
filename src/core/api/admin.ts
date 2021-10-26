import { AjaxService } from "@/services/ajax";

export namespace Admin {
	const URL = "admin/";
	interface AdminData {
		name?: string;
		email?: string;
		password?: string;
		role?: number;
		is_master?:number;
		config?:any;
		product_id?:Array<number>;
	}
	export const login = async (name: string, password: string): Promise<any> =>{
		const {is_error,message,type,data}= await AjaxService.ajax.http({
			url: `${URL}login/`,
			method: "POST",
			data:{
				name,
				password,
			},
		});
		if(!is_error){
			data.user = JSON.parse(atob(data.access_token.split('.')[1]))
			data.token = "Bearer "+data.access_token;
		}
		return data;
	};
	export const add = ( data: AdminData) => {
		return AjaxService.ajax.http({
			url: `${URL}`,
			method: "POST",
			data,
		});
	};
	export const getList = ()=>{
		return AjaxService.ajax.http({
			url: `${URL}`,
			method: "get",
			headers: {
				"Content-type": "application/json",
			},
			params: {},
		});
	}
	// export const getDetail = (token:string)=>{
	// 	return AjaxService.ajax.http({
	// 		url: `${URL}$/`,
	// 		method: "get",
	// 		headers: {
	// 			"Content-type": "application/json",
	// 		},
	// 		params: {token},
	// 	});
	// }
	export const get = (id:number)=>{
		return AjaxService.ajax.http({
			url: `${URL}${id}/`,
			method: "get",
			headers: {
				"Content-type": "application/json",
			},
			params: {},
		});
	}
	export const disabledObject = async (id:number)=>{
		const { data }: any = await AjaxService.ajax.http({
			url: `${URL}disabled/`,
			method: "post",
			data: {admin_id:id},
		});
		console.log(data);
		return data;
	};
	export const patch = (id:number,data: AdminData)=>{
		return AjaxService.ajax.http({
			url: `${URL}${id}/`,
			method: "PATCH",
			data,
		});
	}
	export const changePw = (id:number,data: {
		old_password: string,
		new_password: string,
	})=>{
		return AjaxService.ajax.http({
			url: `${URL}changepw/${id}/`,
			method: "PATCH",
			data,
		});
	}
}
