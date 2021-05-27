import Cookies from 'js-cookie';
import { VuexModule, Module, Mutation, Action, getModule, MutationAction } from 'vuex-module-decorators';
import store from '@/store';
import { Ajax } from '@/utils/parts';
import { PRODUCT_ID, subsystemUrl } from '@product/utils/configration';
import { v4 } from 'uuid';
import { MessageList } from '@/api/messageList';

import { UserModule } from './user';
import { AdminUserModule } from './adminUser';
const ajax: Ajax = new Ajax();
interface IEditState {
	status: string;
	user: string | undefined;
	editUserName: string;
}
@Module({ dynamic: true, store, name: 'edit' })
class EditStore extends VuexModule implements IEditState {
	status = 'closed';
	user: string | undefined = '';
	editUserName = '';
	isGetEditStatus = false;
	isEditGetTime = 0;
	@MutationAction({ mutate: ['status', 'user', 'editUserName'] })
	public async getEditStatus() {
		if (this.isGetEditStatus == true || new Date().getTime() - this.isEditGetTime < 1000 * 10) {
			throw Error('EditStatus Doing');
		}
		this.isGetEditStatus = true;
		const res: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${PRODUCT_ID}/editor-lock`,
			method: 'get',
		});
		console.log(res);
		if (AdminUserModule.AdminList.length == 0 && UserModule.role > 2) {
			await AdminUserModule.getAdminUserList();
		}
		this.isEditGetTime = new Date().getTime();
		const message = res.message;
		const adminuser = AdminUserModule.AdminList.find((user: any) => user.id == message.user);
		const editUserName = adminuser == null ? '' : adminuser.name;
		this.isGetEditStatus = false;
		return {
			status: message.status,
			user: message.user,
			editUserName,
		};
	}

	get IsEdit() {
		if (this.user == '') {
			return true;
		}
		if (this.user != UserModule.id && this.status === 'closed') {
			return true;
		}
		return false;
	}

	get IsEditFree() {
		return this.status !== 'closed';
	}

	get EditUserName() {
		return this.editUserName;
	}

	@Action
	public async editUnlock() {
		const res: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${PRODUCT_ID}/editor-lock`,
			method: 'post',
			data: {
				action: 'unlock',
				adminUser: UserModule.id,
			},
		});
		this.getEditStatus();
	}

	@Action
	public async editlock() {
		const res: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${PRODUCT_ID}/editor-lock`,
			method: 'post',
			data: {
				action: 'lock',
				adminUser: UserModule.id,
				duration: 60 * 60 * 2,
			},
		});
		this.getEditStatus();
	}
}

export const EditModule = getModule(EditStore);
