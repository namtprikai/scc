<template>
	<el-row :gutter="32">
		<el-col :xs="24" :sm="24" :lg="12">
			<div class="box-wrapper">
				<router-view name="v1" data-name="v1" :height="Height" />
			</div>
		</el-col>
	</el-row>
	<!-- <b-container class="relative row">
		<b-row class="justify-content-md-center">
			<b-col class="flame col-xl-6 grid-margin">
				<router-view name="v1"/>s
			</b-col>
			<b-col class="flame col-xl-6 grid-margin">
				<router-view name="v2"/>
			</b-col>
		</b-row>
	</b-container>-->
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// import {} from "router.ts";
import FitStyle from "@/frames/mixin/fitStyle.vue";
import { eventHub } from "@/init/eventHub";
// @ts-ignore
@Component
export default class Hirizontal extends mixins(FitStyle) {
	height: any = 600;
	Height(size: any) {
		this.height = size - 110;
	}

	mounted() {}
}
</script>
<style lang="scss" scoped>
.box-wrapper {
	max-height: 100%;
	overflow: auto;
}
</style>

<style type="scss">
.relative {
	display: block;
	position: relative;
}
/* .flame {
	width: 300px;
	height: 300px;
} */
</style>
