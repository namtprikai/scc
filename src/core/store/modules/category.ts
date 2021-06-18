import Cookies from 'js-cookie';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { Ajax } from '@/utils/parts';
import { CLIENT_ID } from '@consoletype/utils/configration';
import {ICategoryData} from "@/api/types";
import { v4 } from 'uuid';
const ajax: Ajax = new Ajax();
export interface ICategoryState {
	categoryList: any;
	// TalkScriptTree:any;
}


@Module({ dynamic: true, store, name: 'category' })
class CategoryStore extends VuexModule implements ICategoryState {
	public categoryList: any = [];
	get AdminList() {
		return this.categoryList.filter((user: any) => true);
	}

	@Mutation
	private SET_ADMINLIST(categoryUser: Array<ICategoryData>) {
		this.categoryList = categoryUser.sort((a: ICategoryData, b: ICategoryData) => Number(a.id) - Number(b.id));
	}

	@Action({
		commit: 'SET_ADMINLIST',
	})
	public async getCategoryList() {
		const categoryList = await ajax.http({
			url: `/category/`,
			method: 'get',
			headers: {
				'Content-type': 'application/json',
			},
			params: {},
		});
		return categoryList;
	}

	@Action
	public async setCategory(categoryData: ICategoryData) {
		console.log('SETADMINUSER');
		const category = await ajax.http({
			url: `/category/${categoryData.id}/`,
			method: 'patch',
			headers: {
				'Content-type': 'application/json',
			},
			data: {  },
		});
		this.getCategoryList();
	}

	@Action
	public async addCategory(categoryUser: { role: number; name: string; email: string; password: string,config:any,is_master:boolean }) {
		const { role, name, email, password ,is_master,config} = categoryUser;
		const category = await ajax.http({
			url: `/category/`,
			method: 'post',
			headers: {
				'Content-type': 'application/json',
			},
			data: { role, name, email, password,is_master,config },
		});
		this.getCategoryList();
	}
}

export const CategoryModule = getModule(CategoryStore);
