<template>
	<div class="tab-body">
		<div>
<b-card-group>
<b-card v-for="(product) in productList" :key="product.id" :title="product.name">
	<b-card-text>
		{{product.config}}
</b-card-text>
</b-card>

</b-card-group>
</div>
	</div>
</template>
<style type="scss" lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from "vue-property-decorator";
import Plugins from "@/components/Tinymce/plugins";
import Toolbar from "@/components/Tinymce/toolbar";
import _ from "lodash";
// @ts-ignore
@Component({
	components: {},
})
export default class ProductListComp extends Vue {
	@PropSync("values", { type: String })
	public productList!: string;

	protected created() {
		// eventHub.$on("tabclick", this.tabClick);
	}

	protected destroyed() {
		// eventHub.$off("tabclick", this.tabClick);
	}

	public async mounted() {}
}
</script>
