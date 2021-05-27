import Cookies from 'js-cookie';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID } from '@product/utils/configration';
import { v4 } from 'uuid';
const ajax: Ajax = new Ajax();
export interface IAdminUserState {
	AdminList: any;
	// TalkScriptTree:any;
}
export interface IAdminUser {
	id: string;
	name: string;
	product_id: string;
	role: number;
	email: string;
}

@Module({ dynamic: true, store, name: 'adminUser' })
class AdminUserStore extends VuexModule implements IAdminUserState {
	private adminList: any = [];
	get AdminList() {
		return this.adminList.filter((user: any) => user.role > 0);
	}

	@Mutation
	private SET_ADMINLIST(adminUser: Array<IAdminUser>) {
		this.adminList = adminUser.sort((a: IAdminUser, b: IAdminUser) => Number(a.id) - Number(b.id));
	}

	@Action({
		commit: 'SET_ADMINLIST',
	})
	public async getAdminUserList() {
		const adminList = await ajax.http({
			url: `product/${PRODUCT_ID}/admin_user`,
			method: 'get',
			headers: {
				'Content-type': 'application/json',
			},
			params: {},
		});
		return adminList;
	}

	@Action
	public async setAdminUser(adminUser: IAdminUser) {
		console.log('SETADMINUSER');
		const admin = await ajax.http({
			url: `product/${PRODUCT_ID}/admin_user/${adminUser.id}/`,
			method: 'patch',
			headers: {
				'Content-type': 'application/json',
			},
			data: { role: adminUser.role, name: adminUser.name },
		});
		this.getAdminUserList();
	}

	@Action
	public async addAdminUser(adminUser: { role: number; name: string; email: string; password: string }) {
		const { role, name, email, password } = adminUser;
		const admin = await ajax.http({
			url: `product/${PRODUCT_ID}/admin_user/`,
			method: 'post',
			headers: {
				'Content-type': 'application/json',
			},
			data: { role, name, email, password },
		});
		this.getAdminUserList();
	}
}

export const AdminUserModule = getModule(AdminUserStore);
