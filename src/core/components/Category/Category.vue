<template>
	<div>
asdf
		<vue-tree
			style="width: 800px; height: 600px; border: 1px solid gray;"
			:dataset="sampleData"
			:config="treeConfig"
		></vue-tree>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// @ts-ignore
import VueTree from '@ssthouse/vue-tree-chart';
// Vue.component('vue-tree', VueTree)
@Component({
	components: { VueTree },
})
export default class CategoryComp extends Vue {
	sampleData = {
		value: '1',
		children: [
			{ value: '2', children: [{ value: '4' }, { value: '5' }] },
			{ value: '3' }
		]
	}
	treeConfig = { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 }
	// @Prop()
	// title!: string;
}
</script>
