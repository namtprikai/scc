import Cookies from "js-cookie";
import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { Ajax } from "@/utils/parts";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { IAdminData } from "@/api/types";
import { v4 } from "uuid";
const ajax: Ajax = new Ajax();
export interface IAdminUserState {
	AdminList: any;
	// TalkScriptTree:any;
}

@Module({ dynamic: true, store, name: "adminUser" })
class AdminUserStore extends VuexModule implements IAdminUserState {
	private adminList: any = [];
	get AdminList() {
		return this.adminList.filter((user: any) => true);
	}

	@Mutation
	private SET_ADMINLIST(adminUser: Array<IAdminData>) {
		this.adminList = adminUser.sort((a: IAdminData, b: IAdminData) => Number(a.id) - Number(b.id));
	}

	@Action({
		commit: "SET_ADMINLIST",
	})
	public async getAdminUserList() {
		const { data } = await ajax.http({
			url: `/admin/`,
			method: "get",
			headers: {
				"Content-type": "application/json",
			},
			params: {},
		});
		return data;
	}

	@Action
	public async setAdminUser(adminUser: IAdminData) {
		console.log("SETADMINUSER");
		const admin = await ajax.http({
			url: `/admin/${adminUser.id}/`,
			method: "patch",
			headers: {
				"Content-type": "application/json",
			},
			data: { name: adminUser.name },
		});
		this.getAdminUserList();
	}

	@Action
	public async addAdminUser(adminUser: { role: number; name: string; email: string; password: string; config: any; is_master: boolean }) {
		const { role, name, email, password, is_master, config } = adminUser;
		const admin = await ajax.http({
			url: `/admin/`,
			method: "post",
			headers: {
				"Content-type": "application/json",
			},
			data: { role, name, email, password, is_master, config },
		});
		this.getAdminUserList();
	}
}

export const AdminUserModule = getModule(AdminUserStore);
