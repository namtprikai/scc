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
			<edit-wrap
				:messages="[
					'編集を開始すると、他のユーザーは編集できなくなります。 編集が終了したら「編集終了」をクリックして終了してください。',
					'編集を行って保存すると編集前の状態は失われます。バックアップを取りたい場合は以下のチェックボックスを選択し、編集前の状態をCSVファイルで保存してください。',
				]"
				:editingmessage="''"
				:callback-checks="callbackChecks"
				:isEndbutton="false"
			/>
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
import { CallbackChecks } from '@/components/EditWrap/csv.i';
import EditWrap from '@/components/EditWrap/csv.vue';
import EditEnd from '@/components/EditWrap/end.vue';

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
		EditWrap,
		EditEnd,
		WrapSppiner,
	},
})
export default class QuestionComp extends QuestionParent {
	public isShow = true;
	public callbackChecks: CallbackChecks = [
		{
			message: '編集開始と同時にバックアップファイル（CSVファイル）を保存する（推奨）',
			isCheck: true,
			callback: () => {
			},
		},
	];
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
