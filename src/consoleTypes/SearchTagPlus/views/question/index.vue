<template src="@/views/question/index.vue"></template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue } from "vue-property-decorator";
import { MessageListModule } from "@/store/modules/messageList";
import { eventHub } from "@/init/eventHub";
import QuestionParent from "@/views/question";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import Answer from "@/components/Answer/index.vue";
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: "success",
				draft: "gray",
				deleted: "danger",
			};
			return statusMap[status];
		},
	},
	components: {
		SlVueTree,
		WrapSppiner,
		Answer,
	},
})
export default class QuestionComp extends QuestionParent {
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
