import request from '@/utils/request';
import { PRODUCT_ID } from '@product/utils/configration';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Auth } from '@/utils/auth';
import { eventHub } from '@/init/eventHub';
import { AjaxService } from '@/services/ajax';
import { IAdminData ,IAdmin} from './types';
export namespace Login {
	export const login = (username: string, password: string): Promise<any> =>
		new Promise(r => {
			console.log('login');
			request({
				url: 'admin/login',
				method: 'post',
				data: {
					email: username,
					password,
					product_id: PRODUCT_ID,
				},
			})
				.then((res: any) => {
					console.log(res);
          r(res);
          // setTimeout(()=>{
          //   eventHub.$emit('loginAfterInit');
          // },1000);

				})
				.catch(res => {
					console.log(res);
					r(res);
				});
		});

	export const getInfo = async (
		token: string,
		id:number
	): Promise<IAdmin|null> => {
	if(id===-1){
	return null;
	}
		const data: AxiosResponse<any> = await AjaxService.ajax.http({
			url: `/admin/${id}`,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				Authorization: token,
			},
			params: {},
		});
		console.log(data);
		debugger;
		const admin:IAdmin = {
			id:data.data.id,
			email:data.data.email,
			name:data.data.name,
			token:data.data.token,
			role:0,
		};
		if(data.data.config?.role){
			admin.role=data.data.config?.role;
		}
		return admin;
	}
	export const logout = () =>
    new Promise<void>(r => {
      // EditModule.editUnlock();
			Auth.removeToken();
			// Auth.removeAdminUser();
			r();
		});
}
