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
import { IProductData, IQuestionData } from "@/api/types";
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
}
export const ProductsModule = getModule(ProductsStore);
