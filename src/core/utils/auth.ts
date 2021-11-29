import Cookies from "js-cookie";
import { UserModule } from "@/store/modules/user";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { Ajax } from "./parts";
import { AjaxService } from "@/services/ajax";
class AdminUser {
	constructor(
		private id: string = "",
		private name: string = "",
		private pw: string = "",
		private product_id: string,
		private email: string,
		private role?: number
	) {}

	public get Id() {
		return this.id;
	}

	public set Id(id: string) {
		this.id = id;
	}

	public get Name() {
		return this.name;
	}

	public set Name(name: string) {
		this.name = name;
	}

	public get Pw() {
		return this.pw;
	}

	public set Pw(pw: string) {
		this.pw = pw;
	}

	public get Role() {
		return this.role ? this.role : -1;
	}

	public set Role(role: number) {
		this.role = role;
	}

	public get Product_id() {
		return this.product_id;
	}

	public set Product_id(product_id: string) {
		this.product_id = product_id;
	}

	public get Email() {
		return this.email;
	}

	public set Email(email: string) {
		this.email = email;
	}
}
console.log(CLIENT_ID);
const TokenKey = `token_${CLIENT_ID}`;
interface LoginResponceData {
	id: string;
	name: string;
	role: number;
	product_id: string;
}
export namespace Auth {
	// export let adminUser: AdminUser | null;
	export const getToken = async () => {
		console.log(Cookies.get(TokenKey));
		// let token = '';
		// const info = await UserModule.GetInfo();
		// console.log(info);
		// return '';
		// if (info) {
		// 	return Cookies.get(TokenKey);
		// }

		return AjaxService.getInstance().getToken() || false;
	};
	export const isLogin = async () => (await getToken()) !== "";
	export const setToken = (token: string,refresh_token:string) => {
		AjaxService.getInstance().updateToken(token,refresh_token);
	};

	export const removeToken = () => {
		console.log("removeToken");
		// Cookies.remove(TokenKey);
		AjaxService.getInstance().resetToken();
	};
	// export const setAdminUser = (data: LoginResponceData, password: string, email: string) => {
	//   adminUser = new AdminUser(data.id, data.name, password, data.product_id, email, data.role);
	// }
	// export const removeAdminUser = () => {
	//   adminUser = null;
	// }
}
