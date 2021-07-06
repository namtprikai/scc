<template>
	<el-row :gutter="32">
		<el-col :xs="24" :sm="24" :lg="8">
			<div class="box-wrapper">
				<router-view name="v1" data-name="v1" />
			</div>
		</el-col>
		<el-col :xs="24" :sm="24" :lg="8">
			<div class="box-wrapper">
				<router-view name="v2" data-name="v2" />
			</div>
		</el-col>
		<el-col :xs="24" :sm="24" :lg="8">
			<div class="box-wrapper">
				<router-view name="v3" data-name="v3" />
			</div>
		</el-col>
	</el-row>
	<!-- <b-container class="relative row">
		<b-row class="justify-content-md-center">
			<b-col class="flame col-xl-6 grid-margin">
				<router-view name="v1"/>
			</b-col>
			<b-col class="flame col-xl-6 grid-margin">
				<router-view name="v2"/>
			</b-col>
		</b-row>
	</b-container>-->
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// import {} from "router.ts";
// @ts-ignore
@Component
export default class Hirizontal extends Vue {}
</script>

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
