<template>
	<div class="scrollpanel">
		<div
			v-if="is_ready"
			v-bind:is="ComponentName"
			:tabtype="tabtype"
			:discription="discription"
		></div>
	</div>
</template>

<style type="scss">
.relative {
	display: block;
	position: relative;
}
/* .scrollpanel { */
/* overflow: auto; */
/* } */
/* .flame {
	width: 300px;
	height: 300px;
} */
</style>

<script lang="ts">
// asdf
import { CLIENT_ID } from "./utils/configration";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
const requireComponent = require.context(
	// The relative path of the components folder
	"./views",
	// Whether or not to look in subfolders
	true,
	// The regular expression used to match base component filenames
	/index\.(vue|js)$/
);
const componentNames: any = [];
console.log(requireComponent);
const nameMap: any = {};
requireComponent.keys().forEach((fileName) => {
	const componentConfig = requireComponent(fileName);
	const fileNamepathList = fileName.split("/");
	if (fileNamepathList.length >= 3) {
		const componentName = upperFirst(
			camelCase(
				// Gets the file name regardless of folder depth
				fileNamepathList[fileNamepathList.length - 2].replace(/\.\w+$/, "")
			)
		);
		componentNames.push(
			upperFirst(
				camelCase(
					// Gets the file name regardless of folder depth
					fileNamepathList[fileNamepathList.length - 2].replace(/\.\w+$/, "")
				)
			)
		);
		// Vue.component(componentName, componentConfig.default || componentConfig);
		nameMap[componentName] = componentConfig.default || componentConfig;
	}
});
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// import {} from "router.ts";
// asdf
// @ts-ignore
@Component
export default class Panels extends Vue {
	private is_ready = false;
	@Prop({ default: "Tree" })
	private defaultpanel?: any;

	@Prop({ default: "Tree" })
	private component?: string;

	@Prop({ default: "" })
	private discription?: string;
	@Prop({ default: "" })
	private tabtype?: string;
	// componentName: string = this.defaultpanel;
	@Watch("component")
	private async changeComponent(component: string) {
		if (component in nameMap) {
			await Vue.component(component, nameMap[component]);
		} else {
		}
	}

	public created() {
		if (this.defaultpanel) {
			this.defaultpanelcreated();
		}
	}

	get ComponentName() {
		return this.component || this.defaultpanel;
	}

	public defaultpanelcreated() {
		Vue.component(this.ComponentName, nameMap[this.ComponentName]);
		this.is_ready = true;
	}
}
</script>
