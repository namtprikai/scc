import Cookies from "js-cookie";
import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { Ajax } from "@/utils/parts";
import { CLIENT_ID, subsystemUrl } from "@consoletype/utils/configration";
import { v4 } from "uuid";
const ajax: Ajax = new Ajax();
export interface IScenarioState {
	FileList: any;
	// TalkScriptTree:any;
}
export interface ScenarioFlow {
	step: string;
	condition?: { value: string };
	next: Array<ScenarioFlow>;
}

@Module({ dynamic: true, store, name: "fileList" })
class FileStore extends VuexModule implements IScenarioState {
	private fileList: any = [];
	get FileList() {
		return this.fileList.filter((file: any) => !/\.json$/g.test(file.Key));
	}

	@Mutation
	private SET_FILE(fileList: Array<any>) {
		this.fileList = fileList.sort((a: any, b: any) => {
			try {
				return new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime();
			} catch (e) {
				console.log(e);
			}
			return -1;
		});
	}

	@Action({
		commit: "SET_FILE",
	})
	public async getFile(ob: { parent: string; type: string }) {
		const { parent, type } = ob;
		const data: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/download`,
			method: "get",
			params: { parent, type },
		});
		return data;
	}

	@Action({
		commit: "SET_FILE",
	})
	public async deleateFile(ob: { parent: string; fileName: string }) {
		const { parent, fileName } = ob;
		const file = `${parent}/${fileName}`;
		const setData: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/upload`,
			method: "post",
			data: {
				type: "deleate",
				fileName: `${parent}/${fileName}`,
			},
		});

		const data: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/download`,
			method: "get",
			params: { parent, type: "list" },
		});
		return data;
	}

	@Action({
		commit: "SET_FILE",
	})
	public async postFile(ob: { parent: string; fileName: string; base64Str: string; type: string }) {
		const { parent, fileName, base64Str, type } = ob;
		const file = `${parent}/${fileName}`;
		const setData: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/upload`,
			method: "post",
			data: {
				fileName: `${parent}/${fileName}`,
				data: base64Str,
			},
		});

		const data: any = await ajax.http({
			baseURL: subsystemUrl,
			url: `product/${CLIENT_ID}/download`,
			method: "get",
			params: { parent, type },
		});
		return data;
	}
}

export const FileModule = getModule(FileStore);
