import {
	VuexModule,
	Module,
	MutationAction,
	Mutation,
	Action,
	getModule,
} from "vuex-module-decorators";
// import { Login } from "@/api/login";
import {Admin} from "@/api/admin";
import { Auth } from "@/utils/auth";
import store from "@/store";

export interface IUserState {
	email: string;
	id: number;
	name: string;
	product_id: string;
	role: number;
	token: string;
}

@Module({ dynamic: true, store, name: "user" })
class User extends VuexModule implements IUserState {
	public id = -1;
	public token = "";
	public name = "";
	public role: number = 0;
	public email = "";
	public is_master:0|1 = 0;
	public product_id = "";
	public avatar = "";
	public password = "";
	public config={};
	@Action({ commit: "SET_TOKEN" })
	public async Login(userInfo: { username: string; password: string }) {
		const username = userInfo.username.trim();
		const data  = await Admin.login(username, userInfo.password);
		console.log(data);
		Auth.setToken(data.token);
		// this.password = userInfo.password;
		// this.name = username;
		return { token: data.token, id: data.user.id };
	}
	get Token() {
		return this.token;
	}
	@Action({ commit: "SET_TOKEN" })
	public async FedLogOut() {
		Auth.removeToken();
		return { token: "", id: "" };
	}
	@MutationAction({
		mutate: ["id", "role", "name","avatar", "email", "token", "is_master"],
	})
	public async GetInfo() {
		const token = await Auth.getToken();
		if (token === undefined || token === "" || token === false) {
			throw Error("GetInfo: token is undefined!");
		}
		if (UserModule.Id === null) {
			throw Error("GetInfo: id is undefined!");
		}
		const {data,type} = await Admin.get(UserModule.Id);
		if (type==="Object") {
			return {
				id: data.id,
				role: data.config?.role||0,
				name: data.name,
				avatar: "",
				email: data.email,
				token: data.token,
				is_master: data.is_master||0,
			};
		} else {
			throw Error("GetInfo: roles must be a non-null array!");
		}
	}

	@MutationAction({ mutate: ["token", "role"] })
	public async LogOut() {
		const token = await Auth.getToken();
		if (token === undefined || token === false) {
			throw Error("LogOut: token is undefined!");
		}
		await Auth.removeToken();
		Auth.removeToken();
		return {
			token: "",
			role: -1,
		};
	}
	get Role() {
		return this.role;
	}
	get Id() {
		return this.id;
	}
	@Mutation
	private SET_TOKEN({ id, token }: { id: number; token: string }) {
		this.token = token;
		this.id = id;
	}
	@Mutation
	private SET_INFO({ id,role,name,is_master,email, token,config }: { id: number;role:number,name:string,is_master:boolean,email:string; token: string;config:any }){
		return {
			id,
			role,
			name,
			is_master,
			avatar: "",
			email,
			token,
		};
	}
}

export const UserModule = getModule(User);
