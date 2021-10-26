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
		const { is_error,data } = await Admin.getList();
		return data;
	}

	@Action
	public async editAdminUser(adminUser: IAdminData) {
		console.log("SETADMINUSER");
		const admin = await Admin.patch(adminUser.id, { name: adminUser.name,config:adminUser.config });
		this.getAdminUserList();
	}
	@Action({
		commit: "SET_ADMINLIST",
	})
	public async addAdminUser(adminUser: {  name: string; email: string; password: string; config: any; is_master: number}) {
		const {  name, email, password, is_master, config } = adminUser;
		const admin = await Admin.add({  name, email, password, is_master, config });
		this.getAdminUserList();
		return admin;
	}
	public async deleteAdminUser(id: number) {
		console.log("SETADMINUSER");
		const admin = await Admin.disabledObject(id);
		this.getAdminUserList();
	}
}

export const AdminUserModule = getModule(AdminUserStore);
