<template>
	<div @mousewheel="controlScale">
		<div v-if="isShow">
			<vue-tree
				ref="scaleTree"
				style="width: 100%; height: 1000px; border: 1px solid gray"
				:dataset="categoryData"
				:config="treeConfig"
				:isSync="true"
				:nodeSelect="selectLeaf"
				:nodeClick="selectNode"
				:linkStyleIdMap="LinkStyleIdMap"
			>
				<template v-slot:node="{ node, collapsed }">
					<div
						class="rich-media-node"
						:style="{
							border:
								currentCategory && currentCategory.id === node.data.id
									? '2px solid red'
									: '',
						}"
					>
						<span style="padding: 4px 0; font-weight: bold">{{ node.value }}</span>
						<div>
							<b-badge
								pill
								inline
								v-for="product_id in node.data.product_id"
								:key="product_id"
								style="margin: auto; border: 1px"
								:style="{ 'background-color': LinkStyleIdMap[product_id].stroke }"
							>{{ product_id }}</b-badge>
						</div>

						<div>
							<!-- roles:
						<span
							v-for="roles in node.data.roles"
							:key="roles"
							style="margin: auto;border:1px;"
							>{{ roles }}</span>-->
						</div>
					</div>
				</template>
			</vue-tree>
			<div class="flex section text-center">
				<div v-for="(value, key) in LinkStyleIdMap" :key="key" class="inline-block flex">
					<span v-if="key > 0" class="inline-block">product{{ key }}:</span>
					<span v-else>プロダクトによらないデータ上の親子関係</span>
					<div
						class="inline-block mx-1 my-2"
						:style="{
							'background-color': value.stroke,
							width: '10px',
							height: '10px',
						}"
					></div>
				</div>
			</div>
			<div class="section">
				<h3>選択カテゴリ</h3>
				<p>{{ currentCategory }}</p>
			</div>
			<div>
				<h3>新規追加</h3>
				<span v-if="currentCategory">{{ currentCategory.label }}の子要素</span>
				<span v-else>ルート</span>として追加します。
				<b-form-group label="プロダクト">
					<b-form-checkbox-group
						id="checkbox-1"
						v-model="currentProducts"
						:options="ProductOptions"
						name="checkbox-1"
					></b-form-checkbox-group>
				</b-form-group>
				<b-input type="text" v-model="text"></b-input>
				<b-button @click="addCategory(text)">追加</b-button>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
@import "@/styles/_variables.scss";
.rich-media-node {
	width: 130px;
	padding: 8px;
	// display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	color: white;
	background-color: $Primary;
	border-radius: 4px;
	font-size: 0.8rem;
}
.flex {
	display: flex;
}
// @for $i from 0 through 10 {
//   .product-#{$i} { border-c: 10px * $i; }
// }
</style>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// @ts-ignore
import VueTree from '@ssthouse/vue-tree-chart/src/vue-tree/VueTree.vue';
import type { VueTreeChart } from '@ssthouse/vue-tree-chart/src/vue-tree/types';
import { CategoryModule } from '@/store/modules/category';
import { Category } from '@/api/category';
import { ProductsModule } from "@/store/modules/products";
import { eventHub } from '@/init/eventHub';
// Vue.component('vue-tree', VueTree)
@Component({
	components: { VueTree },
})
export default class CategoryComp extends Vue {
	$refs!: {
		scaleTree: any;
	};
	isShow: boolean = false;
	categoryData: Array<VueTreeChart.IPartialDataSet> = [];
	linkStyleIdMap = {
		1: { "stroke": "#000000" },
		2: { "stroke": "#0000ff" },
		3: { "stroke": "#00ff00" },
		4: { "stroke": "#ff0000" },
	};
	get LinkStyleIdMap() {
		const retObj: VueTreeChart.ILinkStyleIdMap = { 0: { "stroke": `#aaaaaa`, "stroke-dasharray": "5,5" } };
		let count = 0;
		for (const product of ProductsModule.Products) {
			retObj[product.id] = { "stroke": `hsl(${count}deg, 60%, 40%)` };
			count += 37;
		}
		return retObj;
	}
	controlScale(event: any) {
		if (event.shiftKey) {
			if (event.wheelDelta > 0) {
				this.$refs.scaleTree.zoomIn(1.05);
			} else {
				this.$refs.scaleTree.zoomOut(1.05);
			}
			// case 'restore':
			// 	this.$refs.scaleTree.restoreScale();
			// 	break;
		}
	}
	// {
	// 	hoge:123,
	// 	value: '1',
	// 	children: [
	// 		{ value: '2', children: [{ value: '4' }, { value: '5' }] },
	// 		{ value: '3' }
	// 	]
	// }
	treeConfig = { nodeWidth: 160, nodeHeight: 80, levelHeight: 100 }

	currentCategory: any = null;
	text: string = '';
	private setCategoryList(categoryList: Array<any>) {
		return categoryList.map(category => {
			return {
				value: category.label,
				data: category,
				dataIdList: [...category.product_id, 0]
				// children:[],
			}
		});
	}
	public currentProducts: Array<any> = [];
	get ProductOptions() {
		return ProductsModule.Products.map((p) => {
			return { text: `${p.id}: ${p.name}`, value: p.id };
		});
	}
	async mounted() {
		this.isShow = false;
		const [categoryList] = await Promise.all([
			Category.getList(null),
			ProductsModule.GetProducts(),
		]);
		this.categoryData = this.setCategoryList(categoryList);
		this.isShow = true;
	}
	public addCategory(text: string, parent: number | null = null) {

		Category.post({
			product_id: this.currentProducts,
			text,
			label: text,
			parent_id: this.currentCategory?.id || null
		});
	}
	public async selectNode(data: any) {
		console.log(data);
		this.currentCategory = data.data;
		const lock = await Category.lock(this.currentCategory.id);
		console.log(lock);
		debugger;
		eventHub.$emit("setCategory", { category: this.currentCategory });
	}
	// @Prop()
	// title!: string;
	public async selectLeaf(data: any) {
		console.log(data);
		const categoryList = await Category.getList(data.data.id);
		return this.setCategoryList(categoryList);
		// const roleList = await Promise.all(categoryList.map(c => Category.getRoleListByCategoryId(c.id)));
		// return this.setCategoryList(categoryList.map((c, i) => {
		// 	c.roles = roleList[i].map(r => r.id);
		// 	return c;
		// }));
	}
}
</script>
