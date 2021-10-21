import request from "@/utils/request";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { AxiosPromise, AxiosResponse } from "axios";
import { Auth } from "@/utils/auth";
import { eventHub } from "@/init/eventHub";
import { AjaxService } from "@/services/ajax";
import { IAdminData, IAdmin } from "./types";
namespace Login {
	export const login = (username: string, password: string): Promise<any> =>
		new Promise((r) => {
			console.log("login");
			request({
				url: "admin/login/",
				method: "post",
				data: {
					name: username,
					password,
					// product_id: CLIENT_ID,
				},
			})
				.then((res: any) => {
					console.log(res);
					r(res);
					// setTimeout(()=>{
					//   eventHub.$emit('loginAfterInit');
					// },1000);
				})
				.catch((res) => {
					console.log(res);
					r(res);
				});
		});

	export const getInfo = async (token: string,admin_id: number): Promise<IAdmin | null> => {

		const data: AxiosResponse<any> = await AjaxService.ajax.http({
			url: `/admin/${admin_id}`,
			method: "get",
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				Authorization: token,
			},
			params: {},
		});
		const admin: IAdmin = {
			id: data.data.id,
			email: data.data.email,
			name: data.data.name,
			token: data.data.token,
			is_master: data.data.is_master,
			role: new Set(data.data.config.role),
		};
		// const roledata: AxiosResponse<any> = await AjaxService.ajax.http({
		// 	url: `/policygroup/${admin.id}`,
		// 	method: "get",
		// 	headers: {
		// 		"X-Requested-With": "XMLHttpRequest",
		// 		Authorization: token,
		// 	},
		// });
		// if (roledata.data) {
		// 	for (const polycyGroup of roledata.data) {
		// 		if (Array.isArray(polycyGroup.config.role)) {
		// 			for (const _role of polycyGroup.config.role) {
		// 				const role: number = _role;
		// 				admin.role.add(role);
		// 			}
		// 		}
		// 	}
		// }
		return admin;
	};
	export const logout = () =>
		new Promise<void>((r) => {
			// EditModule.editUnlock();
			Auth.removeToken();
			// Auth.removeAdminUser();
			r();
		});
}
