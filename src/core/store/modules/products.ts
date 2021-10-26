import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
	MutationAction,
} from "vuex-module-decorators";
import store from "@/store";
import { AjaxService } from "@/services/ajax";
import type { IProductData, IQuestionData,IPartialProductData } from "@/api/types";
import { AxiosResponse } from "axios";
import { Product } from "@/api/product";
@Module({ dynamic: true, store, name: "products" })
class ProductsStore extends VuexModule {
	productList: Array<IProductData> = [];
	get Products() {
		return this.productList;
	}
	@Mutation
	public async GetProducts() {
		const data = await Product.getList();
		this.productList = data;
	}
	@Mutation
	public async AddProduct(data:IPartialProductData){
		const res = await Product.post(data);
		this.productList.push(res);
	}
}
export const ProductsModule = getModule(ProductsStore);
