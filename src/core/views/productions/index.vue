<template>
	<div>
		<ProductList :values="Products"></ProductList>
		<div>
			<BCardAccordion :title="'追加'" class :visible="false">
				<template slot="header"><div class="h3">ついか</div></template>
				<template slot="body">


							<b-form-group
								label-cols="4"
								label="プロダクト名"
								label-for="product-name"
							>
								<b-form-input
									id="product-name"
									size
									type="text"
									v-model="productName"
									placeholder="プロダクト名"
								></b-form-input>
								<b-button @click="addProduct(productName)">追加する</b-button>
							</b-form-group>
				</template>
			</BCardAccordion>

		</div>
	</div>
</template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue } from "vue-property-decorator";
import { ProductsModule } from "@/store/modules/products";
import { eventHub } from "@/init/eventHub";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import ProductList from "@/components/ProductList/index.vue";
import { IProductData } from "@/api/types";
import {BCardAccordion} from "@/components/BCardAccodion";
import { Wait } from "@/utils/parts";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {},
	components: {
		SlVueTree,
		WrapSppiner,
		ProductList,
		BCardAccordion,
	},
})
export default class ProductionsParent {
	public isShow = true;
	public products: Array<IProductData> = [];
	public productName:string = '';
	async created() {
		await ProductsModule.GetProducts();
	}
	get Products() {
		return ProductsModule.Products;
	}
	public addProduct(name:string,max_failure_count_user:number=5,max_failure_time_user:number=5){
		ProductsModule.AddProduct({name,config:{hoge:"asdf"},max_failure_count_user,max_failure_time_user});
	}
}
</script>
<style type="sass"></style>
<style type="scss" scoped>
.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
