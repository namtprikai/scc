import Cookies from "js-cookie";
import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { IAdminData } from "@/api/types";
import { Admin } from "@/api/admin";
import { v4 } from "uuid";
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
		const { data } = await Admin.get();
		return data;
	}

	@Action
	public async setAdminUser(adminUser: IAdminData) {
		console.log("SETADMINUSER");
		const admin = await Admin.patch(adminUser.id, { name: adminUser.name });
		this.getAdminUserList();
	}

	@Action({
		commit: "SET_ADMINLIST",
	})
	public async addAdminUser(adminUser: { role: number; name: string; email: string; password: string; config: any; is_master: number }) {
		const { role, name, email, password, is_master, config } = adminUser;
		const admin = await Admin.add({ role, name, email, password, is_master, config });
		this.getAdminUserList();
		return admin;
	}
}

export const AdminUserModule = getModule(AdminUserStore);
