<template>
	<div>
		<TabHeader>
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
<div>
<b-form-input type="text" placeholder="検索文" v-model="searchText"></b-form-input>
</div>
			<div class="text-right mt-3">
				<b-button class @click="addRoot()" variant="secondary">
					<svg-icon name="arrows_plus" />
				</b-button>
			</div>
			<div>
				<wrap-sppiner v-if="isLoad" />
				<div v-for="(question, index) in Questions" :key="index">
					<BCardAccordion
						class="bot-message-config_editor_group section"
						:visible="false"
					>
					<template v-slot:header>
						<b-breadcrumb :items="[{text:'親カテ'},{text:'子カテ'}]"></b-breadcrumb>
						{{question.title}}
					</template>
						<template v-slot:body="body"><Answer :questionId="question.id" :is_show="body.isShow" /> </template>
					</BCardAccordion>
				</div>
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
import Answer from '@/components/Answer/index.vue';
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
