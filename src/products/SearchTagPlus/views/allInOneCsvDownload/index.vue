<template src="@/views/allInOneCsv/templateDownload.html"></template>

<script lang="ts">
import { v4 } from "uuid";
import { getList } from "@/api/table";
import { Component, Vue } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import ScenarioParent from "@/views/scenario/index";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";

import ScenarioTemp from "@/components/ScenarioTemp/index.vue";
import AllInOneCsvParent from "@/views/allInOneCsv";
import { BotConfigModule } from "@/store/modules/botConfig";
import { OldScenario } from "@/utils/allInOneCsv/scenario";
import EditWrap from "@/components/EditWrap/index.vue";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: {},
})
export default class AllInOneCsv extends AllInOneCsvParent {
	public download() {
		this.doDownload("search");
	}
}
</script>
<style type="sass" lang="scss"></style>
<style type="sass" lang="scss" scoped src="@/views/allInOneCsv/index.scss"></style>
