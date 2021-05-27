<template>
	<el-row :gutter="32" class="mx-0 b_3Frame">
		<el-col :xs="24" :sm="24" :lg="24" class="px-0">
			<div class="box-wrapper">
				<router-view name="v1" data-name="v1" />
			</div>
		</el-col>
	</el-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
.box-wrapper {
	/* overflow: auto;
	height: 100%; */
}
.b_3Frame .panelWrap {
	padding: 0;
	overflow: auto;
	height: calc(100vh - 50px - (30px + 10px));
}
/* .flame {
	width: 300px;
	height: 300px;
} */
</style>
