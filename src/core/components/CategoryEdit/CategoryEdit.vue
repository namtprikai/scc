<template>
	<div @mousewheel="controlScale">
		<div class="section">
			<h3>選択カテゴリ</h3>
			<p>{{ data }}</p>
		</div>
		<div>
			<h3>新規追加</h3>
			<span v-if="data">{{ data.label }}の子要素</span>
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
			<b-button @click="editCategory(data)">編集</b-button>
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
	font-size:0.8rem;
}
.flex{
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
import { ICategoryData } from '@/api/types';
// Vue.component('vue-tree', VueTree)
@Component({
	components: { VueTree },
})
export default class CategoryEditComp extends Vue {
		$refs!: {
		scaleTree: any;
	};
	@Prop()
	data!:ICategoryData;
	editCategory(data:ICategoryData){

	}
}
</script>
