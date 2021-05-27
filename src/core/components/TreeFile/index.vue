<template>
	<div class="treeDionWrap">
		<div
			v-if="IsTop"
			class="treeDionWrap__dragErea treeDionWrap__dragErea--top"
			@dragover="dragover($event, 'top')"
			@dragover.prevent.stop
			@dragleave="dragleave($event, 'top')"
			@dragover.stop
			@dragleave.stop
			@drop="drop($event, data, 'top')"
			@drop.stop
		></div>
		<div class="treeDionWrap__ghoast" v-show="IsTop && isDragoverTop"></div>
		<div class="treeDionDrop">
			<div
				class="treeDion"
				:data-id="Id"
				:class="isDragoverItem ? 'treeDion--dragover' : ''"
				draggable
				@dragover.prevent.stop
				@dragover="dragoverItem"
				@drop="dropItem($event, data)"
				@drop.stop
				@dragstart="dragStart($event, data, parentData)"
				@dragstart.stop
				@dragleave="dragleaveItem"
				@dragleave.stop
				@dragend="dragendItem"
			>
				<div
					@click="setItem({ type: 'script', item: data })"
					@click.stop
					class="treeDion__item"
					:class="{
						'treeDion__item--active': data.isActive,
						'treeDion__item--editing': data.isEditing,
						'treeDion__item--edited': data.isEdited,
					}"
				>
					<span v-if="IsClose" class="treeDion__item__isOpen" @click="open" @click.stop>
						<b-icon icon="chevron-right"></b-icon>
					</span>
					<span v-if="IsOpen" class="treeDion__item__isOpen" @click="close" @click.stop>
						<b-icon icon="chevron-down"></b-icon>
					</span>
					<span>{{ Title }}</span>
					<span class="treeDion__Button treeDion__Button--remove" @click="remove">
						<b-icon icon="dash"></b-icon>
					</span>
					<span class="treeDion__Button treeDion__Button--add" @click="addNext" v-if="!data.isLeaf && !IsSizenbun">
						<b-icon icon="plus"></b-icon>
					</span>
					<span class="treeDion__Button treeDion__Button--add" @click="addBotNext" v-if="IsSentakusi && !IsSizenbun">
						<b-icon icon="plus"></b-icon>
					</span>
				</div>
				<div v-if="isOpen&&children">
					<treedion
						v-for="(child, index) in children"
						:key="index"
						:index="index"
						:data="child"
						:botData="botData"
						@setCurrentItem="SetCurrentItem"
						@SelectItem="SelectItem"
						@editing="editing"
						:currentItem="CurrentItem"
						:parentData="data"
						:depth="depth + 1"
					/>

					<div v-if="BotScenario">
						<botdion :key="index" :botData="BotScenario" :parentData="BotScenario" @setCurrentItem="SetCurrentItem" @SelectItem="SelectItem" @editing="editing" />
					</div>
				</div>
			</div>
		</div>
		<div class="treeDionWrap__dragErea" @dragover="dragover" @dragover.prevent.stop @dragleave="dragleave" @dragover.stop @dragleave.stop @drop="drop($event, data)" @drop.stop></div>
		<div class="treeDionWrap__ghoast" v-show="isDragover"></div>
	</div>
</template>
<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { eventHub } from '@/init/eventHub';
import _ from 'lodash';
// import SlVueTree from "sl-vue-tree";
import { Component, Vue, Watch, Prop, PropSync, Emit } from 'vue-property-decorator';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
import { Wait } from '@/utils/parts';
import { ScriptDataTree } from '@/utils/allInOneCsv/script';
import { TalkScriptModule, TalkScript, getScenarioIDListByScriptTreeData } from '@/store/modules/talkScript';
import { BotConfig2Module, defaultBotFlow, getFlowByLinkScriptId } from '@/store/modules/botConfig2';
// import { BotConfigModule } from "@/store/modules/botConfig";
import { OldScenario, BotConfig, BotConfigFlow } from '@/utils/allInOneCsv/scenario';
// @ts-ignore
@Component({
	components: {
		// Accordion: () => import("@/components/BotConfigTemp/Accordion.vue")
		botdion: () => import('@/components/AllInOneBot/index.vue'),
	},
})
export default class TreeFile extends Vue {
	public visible = false;
	public isDragoverTop = false;
	public isDragover = false;
	public isDragoverItem = false;
	public isOpen = false;
	// @Watch("data", { deep: true })
	// public dataChange(item: any) {
	// 	if (item.isEditing) {
	// 		this.$emit("editing");
	// 	}
	// }
	// 	@Watch("data", { deep: true })
	// 	public editingEdited() {
	// console.log(123456789,this.data.isEdited);
	// 		if (this.data.isEdited) {
	// debugger;
	// this.editing();
	// 		}
	// 	}
	public updateScript(id: string) {
		if (this.data.data.id == id) {
			this.editing();
		}
	}

	@Watch('data.data.text', { deep: false })
	@Watch('data.data.questions', { deep: false })
	@Watch('data.data', { deep: false })
	// @Watch("data.data.label")
	// @Watch("data.data.items")
	public editing() {
		console.log('Editing');
		this.data.isEdited = true;
		if (!this.data?.data?.items) {
			this.data.data.items = {};
		}
		this.data.data.items.update_date = `${new Date().getTime()}`;
		if (this.BotScenario?.items) {
			this.BotScenario.items.update_date = `${new Date().getTime()}`;
		}
		this.$emit('editing');
		this.$forceUpdate();
	}

	public linkCategoryScenario() {
		const BotScenario = this.BotScenario;
		if (BotScenario) {
			const { flow, flowList, is, deep } = getFlowByLinkScriptId(BotScenario.next, String(this.data.data.id));
			if (is && this.data.data.text) {
				flow.label = this.data.data.text;

				// カテゴリ文言を挿入；
				// if(deep==0){
				// 	flow.text = String(searchActionConfig?.INFO_MESSAGE_PARENT || this.data.data.text).replace(/\[category-text\]/, String(this.parentData.data.text));
				// }	else{
				// 	flow.text = String(searchActionConfig?.INFO_MESSAGE_CHILD || this.data.data.text).replace(/\[category-text\]/, String(this.parentData.data.text));
				// }
			}
		}
	}

	@Prop({ default: 0 })
	depth!: number;

	@Prop()
	data!: ScriptDataTree;

	@Prop()
	parentData!: ScriptDataTree;

	@Prop()
	botData!: BotConfig;

	@Prop()
	index!: number;

	get IsSizenbun() {
		if (this.Title === '[自然文検索用]' && this.depth === 0) {
			return true;
		}
		return false;
	}

	get IsTop() {
		return this.index == 0;
	}

	remove() {
		this.$modal.show('dialog', {
			title: '削除しますか？',
			text: '',
			buttons: [
				{
					title: '削除',
					handler: () => {
						if (this.data.data.parent === '#') {
							eventHub.$emit('removeScriptDataTree', this.data.data.id);
						}
						const idList = getScenarioIDListByScriptTreeData(this.data);
						console.log(idList);
						this.parentData.children = this.parentData?.children?.filter(o => o.data.id !== this.data.data.id);
						this.$modal.hide('dialog');
					},
				},
				{
					title: 'キャンセル',
					handler: () => {
						this.$modal.hide('dialog');
					},
				},
			],
		});
	}

	addBotNext() {
		const botScenario = this.BotScenario;
		if (botScenario) {
			this.open();
			botScenario.next.push(defaultBotFlow(v4(), '新規'));
		}
	}

	async addNext() {
		this.open();
		const ScenarioId = v4();
		if (this.depth > 0) {
			// BotConfig2Module.addFlow({step:this.data.id,index:this.parentData.next.length,title:"新規"});

			await BotConfig2Module.addFlow2ID({
				step: 'init',
				scenarioId: ScenarioId,
				title: '新規1',
			});
		}
		const nScript: ScriptDataTree = {
			isLeaf: !(this.depth < 1),
			isExpanded: false,
			title: '新規',
			data: {
				id: v4(),
				text: '新規',
				type: this.depth < 1 ? 'node' : 'leaf',
				position: this.data?.data?.children?.length || 1,
				parent: this.data.data.id,
				value: '新規',
				children: [],
				status: 'published',
				questions: [],
				// scenario: ScenarioId,
				feedback: [],
				tags: [],
				items: { update_date: `${new Date().getTime()}` },
			},
			item: {},
			status: 'published',
			children: [],
		};
		if (this.depth > 0 && nScript.data.items) {
			nScript.data.scenario = ScenarioId;
			nScript.data.items.scenario_id = ScenarioId;
		}

		this.data.children?.push(nScript);
	}

	private talkScript: Array<TalkScript> | undefined;
	created() {
		this.data.isEditing = false;
	}

	private addFlowAfterAction(id: string) {
		if (this.data.data.id === id) {
			this.open();
		}
	}

	public async mounted() {
		eventHub.$on('allInOneEditing', this.resetEditing);
		eventHub.$on(['setScript', 'setBot'], this.setActive);
		eventHub.$on('addFlow', this.addFlowAfterAction);
		eventHub.$on('updateScript', this.updateScript);
	}

	public destroyed() {
		eventHub.$off('allInOneEditing', this.resetEditing);
		eventHub.$off(['setScript', 'setBot'], this.setActive);
		eventHub.$off('addFlow', this.addFlowAfterAction);
		eventHub.$off('updateScript', this.updateScript);
	}

	public setActive(item: any) {
		const old = this.data.isActive;
		this.data.isActive = item.data?.id === this.data.data.id;
		if (this.data.isActive !== old) {
			this.$forceUpdate();
		}
	}

	public resetEditing() {
		console.log('reset');
		this.data.isEditing = false;
		this.$forceUpdate();
	}

	get Id() {
		return this.data?.data?.id;
	}

	get children(): any {
		return this.data?.children||[];
	}

	get Title() {
		return this.data?.data?.text;
	}

	@PropSync('currentItem', {
		type: Object,
		// default:()=>
		// 	{
		// 		return {}
		// 	}
	})
	public CurrentItem!: {
		item: ScriptDataTree | undefined;
		parent: ScriptDataTree | undefined;
		depth?: number;
	};

	public open() {
		this.isOpen = true;
		console.log(this.botData);
	}

	public close() {
		this.isOpen = false;
	}

	get IsSentakusi() {
		const botScenario = this.BotScenario;
		if (botScenario) {
			return botScenario.next.length > 0;
		}
		return false;
	}

	get IsOpen() {
		return this.isOpen && (this.children?.length > 0 || (this.BotScenario && !(this.BotScenario.next.length <= 0)));
	}

	get IsClose() {
		return !this.isOpen && (this.children?.length > 0 || (this.BotScenario && !(this.BotScenario.next.length <= 0)));
	}

	get ScenarioId() {
		return this.data?.data?.items?.scenario_id||this.data.data.scenario;
	}

	get BotScenario() {
		if (this.data?.data?.items?.scenario_id) {
			for (const botItem of this.botData.flow?.next) {
				if (botItem.id == this.data.data.items.scenario_id) {
					return botItem;
				}
			}
		}
		if (this.data?.data?.scenario) {
			for (const botItem of this.botData.flow?.next) {
				if (botItem.id == this.data.data.scenario) {
					return botItem;
				}
			}
		}
		return null;
	}

	dragoverItem() {
		// this.isDragoverItem = true;
	}

	dragleaveItem() {
		// this.isDragoverItem = false;
		// console.log("leave");
	}

	dragendItem() {
		// this.isDragoverItem = false;
	}

	dragover(e: DragEvent, type?: string) {
		if (type == 'top') {
			this.isDragoverTop = true;
		} else {
			this.isDragover = true;
		}
	}

	dragleave(e: DragEvent, type?: string) {
		if (type == 'top') {
			this.isDragoverTop = false;
		} else {
			this.isDragover = false;
		}
	}

	get CurrentItemId() {
		return this.CurrentItem?.item?.data?.id;
	}

	@Emit('SelectItem')
	public SelectItem(item: { type: 'bot' | 'script'; item: ScriptDataTree | BotConfigFlow; depth?: number }) {
		return item;
	}

	public setItem(item: { type: 'bot' | 'script'; item: ScriptDataTree | BotConfigFlow }) {
		eventHub.$emit('setScript', item.item);
	}

	@Emit('setCurrentItem')
	SetCurrentItem(data: { item: ScriptDataTree; parent: ScriptDataTree; depth?: number }) {
		console.log('setCurrentItem');
		console.log(data);
		return data;
	}

	dragStart(e: DragEvent, item: ScriptDataTree, parent: ScriptDataTree) {
		this.SetCurrentItem({ item, parent, depth: this.depth });
		// this.CurrentItem.item = item;
	}

	dropItem(e: DragEvent, item: ScriptDataTree) {
		// console.log("dropItem");
		// console.log(e);
		// console.log(item);
		// console.log(this.data);
		// this.isDragoverItem = false;
		// if (
		//   this.CurrentItem?.item &&
		//   this.CurrentItem?.item.data.id !== this.data.data.id
		// ) {
		//   if (this.CurrentItem.parent) {
		// 			// Validate
		// 			if(this.CurrentItem.depth===this.depth){
		//     this.CurrentItem.parent.children = this.CurrentItem.parent?.children?.filter(
		//       d => d.data.id !== this.CurrentItem?.item?.data.id
		//     );
		//     this.data.children?.push(this.CurrentItem.item);
		// 			}
		//   }
		// }
	}

	dropValidate() {}
	drop(e: DragEvent, item: ScriptDataTree, type?: string) {
		this.isDragover = this.isDragoverTop = false;
		if (this.CurrentItem?.item) {
			const CurrentItem = _.cloneDeep(this.CurrentItem.item);
			if (this.CurrentItem.parent) {
				if (this.CurrentItem.depth === 0 && this.CurrentItem.depth === this.depth) {
					// this.CurrentItem.parent.children = this.CurrentItem.parent.children?.filter(d => d.data.id !== this.CurrentItem?.item?.data.id);
					if (this.CurrentItem.parent?.children) {
						for (let i = 0; i < this.CurrentItem.parent.children.length; i++) {
							const sibling = this.CurrentItem.parent.children[i];
							if (this.CurrentItem?.item?.data.id === sibling.data.id) {
								sibling.data.id = 'deleteFlg';
							}
						}
					}
					if (this.parentData && this.parentData.children && this.CurrentItem.parent) {
						this.parentData.children = this.CurrentItem.parent.children;
						this.parentData.children?.splice(this.index + (type === 'top' ? 0 : 1), 0, CurrentItem);
					}
					this.CurrentItem.parent.children = this.CurrentItem.parent?.children?.filter((d, i) => {
						return d.data.id !== 'deleteFlg';
					});

				} else if (this.CurrentItem.depth === this.depth && !Array.isArray(this.CurrentItem.parent)) {
					// this.parentData.children?.splice(this.index+1, 0, CurrentItem);
					if (this.CurrentItem.parent?.children) {
						for (let i = 0; i < this.CurrentItem.parent.children.length; i++) {
							const sibling = this.CurrentItem.parent.children[i];
							if (this.CurrentItem?.item?.data.id === sibling.data.id) {
								sibling.data.id = 'deleteFlg';
							}
						}
					}

					if (!Array.isArray(this.parentData)) {
						this.parentData.children?.splice(this.index + (type === 'top' ? 0 : 1), 0, CurrentItem);
					}
					this.CurrentItem.parent.children = this.CurrentItem.parent?.children?.filter((d, i) => {
						return d.data.id !== 'deleteFlg';
					});
				}
				if(this.CurrentItem.parent.children){
					this.CurrentItem.parent.children = this.CurrentItem.parent.children.map((c,i)=>{
						c.data.position=i;return c;
					});
				}
			}
			// this.parentData.children=this.parentData.children?.filter(d=>d.data.id!==this.CurrentItem?.item?.data.id);
		}
	}
// get childPaths(): any  {
// 	return this.paths.slice(1);
// }
}
</script>
<style lang="scss" scoped src="./style.scss"></style>
