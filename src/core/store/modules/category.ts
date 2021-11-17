import Cookies from "js-cookie";
import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
} from "vuex-module-decorators";
import store from "@/store";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { ICategoryData } from "@/api/types";
import { v4 } from "uuid";
import { Category} from "@/api/category";
export interface ICategoryState {
	categoryList: any;
	// TalkScriptTree:any;
}

@Module({ dynamic: true, store, name: "category" })
class CategoryStore extends VuexModule implements ICategoryState {
	public categoryList: any = [];
	get AdminList() {
		return this.categoryList.filter((user: any) => true);
	}

	@Mutation
	private SET_ADMINLIST(categoryUser: Array<ICategoryData>) {
		this.categoryList = categoryUser.sort(
			(a: ICategoryData, b: ICategoryData) => Number(a.id) - Number(b.id)
		);
	}

	@Action({
		commit: "SET_ADMINLIST",
	})
	public async getCategoryList() {
		const categoryList = await Category.getList();
		return categoryList;
	}

	@Action
	public async setCategory(categoryData: ICategoryData) {
		console.log("SETADMINUSER");
		const category = await Category.post(categoryData);
		this.getCategoryList();
	}

	@Action
	public async addCategory(categoryData: ICategoryData) {
		const category = await Category.post(categoryData);
		this.getCategoryList();
	}
}

export const CategoryModule = getModule(CategoryStore);
