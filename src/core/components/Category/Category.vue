<template>
	<div>
		<vue-tree
			style="width: 800px; height: 600px; border: 1px solid gray"
			:dataset="categoryData"
			:config="treeConfig"
			:isSync="true"
			:leafClick="selectLeaf"
			:nodeClick="selectNode"
		>
		<template v-slot:node="{ node, collapsed }">
        <div
          class="rich-media-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
        >
          <span style="padding: 4px 0; font-weight: bold;"
          >{{ node.value }}</span>
<span v-for="product_id in node.data.product_id" :key="product_id" style="margin: auto;border:1px;"
          >{{ product_id }}</span>
        </div>
      </template>
		</vue-tree>
		<div>
			<h3>選択カテゴリ</h3>
			<p>{{ currentCategory }}</p>
		</div>
		<div>

			<h3>新規追加</h3>
			<span v-if="currentCategory">{{currentCategory.label}}の子要素</span>
			<span v-else>ルート</span>として追加します。
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
<style lang="scss">
@import "@/styles/_variables.scss";
.rich-media-node {
  width: 80px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: white;
  background-color: $Primary;
  border-radius: 4px;
}
// @for $i from 0 through 10 {
//   .product-#{$i} { border-c: 10px * $i; }
// }
</style>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// @ts-ignore
import VueTree from '@ssthouse/vue-tree-chart/src/vue-tree/VueTree.vue';
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
				// children:[],
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
		this.categoryData = this.setCategoryList(categoryList);
	}
	public addCategory(text:string, parent:number|null=null){
		console.log(this.currentProducts);
		debugger;
		Category.post({
			product_id:this.currentProducts,
			text,
			label:text,
			parent_id:this.currentCategory?.id||null
		});
	}
	public selectNode(data:any){
		console.log(data);
		this.currentCategory = data.data;
	}
	// @Prop()
	// title!: string;
	public async selectLeaf(data:any){
		console.log(data);
		const categoryList = await Category.getList(data.data.id);
		return this.setCategoryList(categoryList);
	}
}
</script>
