<template>
	<div>
		<vue-tree
			style="width: 800px; height: 600px; border: 1px solid gray"
			:dataset="categoryData"
			:config="treeConfig"
			:isSync="true"
			:leafClick="selectLeaf"
			:nodeClick="selectNode"
		></vue-tree>
		<div>
			<h3>選択カテゴリ</h3>
			<p>{{ currentCategory }}</p>
		</div>
		<div>
			<h3>新規追加</h3>
			<b-form-group label="プロダクト">
				<b-form-checkbox-group
					id="checkbox-1"
					v-model="currentProducts"
					:options="ProductOptions"
					name="checkbox-1"
				>
				</b-form-checkbox-group>
			</b-form-group>
			<b-input type="text" v-model="text"></b-input>
			<b-button @click="addCategory(text)">追加</b-button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// @ts-ignore
import VueTree from '@ssthouse/vue-tree-chart';
import { CategoryModule } from '@/store/modules/category';
import { Category } from '@/api/category';
import {ProductsModule} from "@/store/modules/products";
// Vue.component('vue-tree', VueTree)
@Component({
	components: { VueTree },
})
export default class CategoryComp extends Vue {
	categoryData:Array<any> = [];
	// {
	// 	hoge:123,
	// 	value: '1',
	// 	children: [
	// 		{ value: '2', children: [{ value: '4' }, { value: '5' }] },
	// 		{ value: '3' }
	// 	]
	// }
	treeConfig = { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }
	currentCategory:any = null;
	text: string = '';
	private setCategoryList(categoryList:Array<any>){
		return categoryList.map(category=>{
			return {
				value:category.label,
				data:category,
				children:[],
			}
		});
	}
	public currentProducts: Array<any> = [];
	get ProductOptions() {
		return ProductsModule.Products.map((p) => {
			return { text: p.name, value: p.id };
		});
	}
	async mounted(){
		const categoryList = await Category.getList(null);
		debugger;
		this.categoryData = this.setCategoryList(categoryList);
	}
	public addCategory(text:string, parent:number|null=null){
		console.log(this.currentProducts);
		debugger;
		Category.post({
			product_id:[1],
			text,
			label:text
		});
	}
	public selectNode(data:any){
		console.log(data);
		this.currentCategory = data.value;
	}
	// @Prop()
	// title!: string;
	public selectLeaf(data:any){
		console.log(data);
		return [{value:"asdf"},{value:"asdfa"}];
	}
}
</script>
