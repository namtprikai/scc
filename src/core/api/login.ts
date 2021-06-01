import request from '@/utils/request';
import { PRODUCT_ID } from '@product/utils/configration';
import { AxiosPromise } from 'axios';
import { Auth } from '@/utils/auth';
import { eventHub } from '@/init/eventHub';
import { EditModule } from "@/store/modules/edit";
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
          r({ data: res });
          // setTimeout(()=>{
          //   eventHub.$emit('loginAfterInit');
          // },1000);

				})
				.catch(res => {
					console.log(res);
					r(res);
				});
		});

	export const getInfo = (
		token: string,
	): AxiosPromise<{
		email: string;
		id: string;
		name: string;
		product_id: string;
		role: number;
		token: string;
	}> =>
		request({
			url: '/admin/info',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				Authorization: token,
			},
			params: {},
		});

	export const logout = () =>
    new Promise<void>(r => {
      EditModule.editUnlock();
			Auth.removeToken();
			// Auth.removeAdminUser();
			r();
		});
}
