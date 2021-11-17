<template src="@/views/category/index.vue"></template>

<script lang="ts">
import { getList } from "@/api/table";
import { MessageList } from "@/api/messageList";
import { Component, Vue } from "vue-property-decorator";
import { MessageListModule } from "@/store/modules/messageList";
import { eventHub } from "@/init/eventHub";
import CategoryParent from "@/views/category";
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from "sl-vue-tree";
import WrapSppiner from "@/components/WrapSinner/index.vue";
import Answer from "@/components/Answer/index.vue";
import Keyword from "@/components/Keyword/index.vue";
import CategoryComp from "@/components/Category/Category.vue";
@Component({
	components: { CategoryComp},
})
export default class Category extends CategoryParent {
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
