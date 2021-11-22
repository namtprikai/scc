<template src="@/views/policyGroupList/index.vue"></template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue } from "vue-property-decorator";
import { MessageListModule } from "@/store/modules/messageList";
import { eventHub } from "@/init/eventHub";
import PolicyGroupListParent from "@/views/policyGroupList/index.vue";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import Answer from "@/components/Answer/index.vue";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {},
	components: {
		SlVueTree,
		WrapSppiner,
		Answer,
	},
})
export default class PolicyGroupList extends PolicyGroupListParent {
	public isShow = true;
}
</script>
<style type="sass"></style>
<style type="scss" scoped>
.item-icon {
	display: inline-block;
	text-align: left;
	width: 20px;
}
</style>
