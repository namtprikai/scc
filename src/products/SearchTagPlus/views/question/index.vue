<template>
	<div>
		<TabHeader>
			<EditEnd />
			<b-button
				class="ml-2"
				size="sm"
				variant="primary"
				@click="openSaveModal()"
				:disabled="isLoad"
				>反映ステップへ進む</b-button
			>
		</TabHeader>

		<div class="tab-body">
			<div class="text-right mt-3">
				<b-button class @click="addRoot()" variant="secondary">
					<svg-icon name="arrows_plus" />
				</b-button>
			</div>
			<div>
				<wrap-sppiner v-if="isLoad" />
				<b-list-group>
					<b-list-group-item v-for="(question, index) in Questions" :key="index">{{
						question.title
					}}</b-list-group-item>
				</b-list-group>
				<div id="End"></div>
				<div class="mt-3">
					<b-button block class @click="addRoot()" variant="secondary">
						<svg-icon name="arrows_plus" />
					</b-button>
				</div>
				<div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
					<div @click="removeNode">Remove</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { Component, Vue } from 'vue-property-decorator';
import { MessageListModule } from '@/store/modules/messageList';
import { eventHub } from '@/init/eventHub';
import QuestionParent from '@/views/question';
import SlVueTree, { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import WrapSppiner from '@/components/WrapSinner/index.vue';

// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
	},
	components: {
		SlVueTree,
		WrapSppiner,
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
