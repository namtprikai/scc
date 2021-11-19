<template>
	<div>
		<vue-tree
			style="width: 800px; height: 600px; border: 1px solid gray;"
			:dataset="categoryData"
			:config="treeConfig"
			:isSync="true"
			:leafClick="selectLeaf"
			:nodeClick="selectNode"
		></vue-tree>
		<div>
			<h3>選択カテゴリ</h3>
			<p>{{currentCategory}}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// @ts-ignore
import VueTree from '@ssthouse/vue-tree-chart';
import { CategoryModule } from '@/store/modules/category';
import { Category } from '@/api/category';
// Vue.component('vue-tree', VueTree)
@Component({
	components: { VueTree },
})
export default class CategoryComp extends Vue {
	categoryData = {
		hoge:123,
		value: '1',
		children: [
			{ value: '2', children: [{ value: '4' }, { value: '5' }] },
			{ value: '3' }
		]
	}
	treeConfig = { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }
	currentCategory:any = null;
	async mounted(){
		const categoryList = await Category.getList(null);

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
