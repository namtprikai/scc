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
					class="treeDion__item"
					:class="{
						'treeDion__item--active': data.isActive,
						'treeDion__item--editing': data.isEditing,
						'treeDion__item--edited': data.isEdited,
					}"
					@click="SelectItem({ type: 'bot', item: data })"
					@click.stop
				>
					<span v-if="IsClose" class="treeDion__item__isOpen" @click="open" @click.stop>
						<b-icon icon="chevron-right"></b-icon>
					</span>
					<span v-if="IsOpen" class="treeDion__item__isOpen" @click="close" @click.stop>
						<b-icon icon="chevron-down"></b-icon>
					</span>
					<span>{{ Title }}</span>
					<span class="treeDion__Button treeDion__Button--remove" v-if="CanRemove" @click="remove">
						<b-icon icon="dash"></b-icon>
					</span>
					<span class="treeDion__Button treeDion__Button--add" @click="addNext" v-if="IsSentaku">
						<b-icon icon="plus"></b-icon>
					</span>
				</div>
				<div v-if="isOpen">
					<botdion
						@editing="editing"
						v-for="(child, index) in children"
						:key="index"
						:index="index"
						:data="child"
						@setCurrentItem="SetCurrentItem"
						:currentItem="CurrentItem"
						:parentData="data"
						@SelectItem="SelectItem"
					/>
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
import { Wait, Ajax } from '@/utils/parts';
import { TalkScriptModule, TalkScript, ScriptDataTree } from '@/store/modules/talkScript';
// import { BotConfigModule } from "@/store/modules/botConfig";
import { OldScenario, BotConfigFlow } from '@/utils/allInOneCsv/scenario';
import { BotConfig2Module, defaultBotFlow } from '@/store/modules/botConfig2';
interface BotConfigFlowData extends BotConfigFlow {
	isActive: boolean;
	isEdited: boolean;
	// isEditing: boolean;
}
// @ts-ignore
@Component({
	components: {
		botdion: () => import('./bot.vue'),
	},
})
export default class TreeBotFile extends Vue {
	// public isActive: boolean = false;
	// public isEdited: boolean = false;
	// public isEditing: boolean = false;
	public isDragoverTop = false;
	public visible = false;
	public isDragover = false;
	public isDragoverItem = false;
	public isOpen = false;
	@Prop()
	data!: BotConfigFlowData;

	@Prop()
	parentData!: BotConfigFlow;

	@Prop()
	index!: number;

	private talkScript: Array<TalkScript> | undefined;
	get Id() {
		return this.data.id;
	}

	get children(): any {
		return this.data.next;
	}

	get Title() {
		return this.data.label;
	}

	get IsTop() {
		return this.index == 0;
	}

	get IsSentaku() {
		return this.children.length > 0;
	}

	get CanRemove() {
		return this.parentData.next.length > 1;
	}

	@Watch('data.text', { deep: true })
	@Watch('data.label')
	@Watch('data.items')
	public dataChange(item: any) {
		this.data.isEdited = true;
		this.data.items.update_date = `${new Date().getTime()}`;
		eventHub.$emit('allInOneEditing');
		this.$emit('editing');
		this.$forceUpdate();
	}

	@Emit('SelectItem')
	public SelectItem(item: { type: 'bot' | 'script'; item: ScriptDataTree | BotConfigFlow }) {
		eventHub.$emit('setBot', item.item);
		return item;
	}

	@PropSync('currentItem', {
		type: Object,
		// default:()=>
		// 	{
		// 		return {}
		// 	}
	})
	public CurrentItem!: {
		item: BotConfigFlow | undefined;
		parent: BotConfigFlow | undefined;
	};

	public open() {
		this.isOpen = true;
	}

	public close() {
		this.isOpen = false;
	}

	get IsOpen() {
		return this.isOpen && this.children?.length > 0;
	}

	get IsClose() {
		return !this.isOpen && this.children?.length > 0;
	}

	public editing() {
		const old = !!this.data.isEdited;
		this.data.isEdited = true;
		this.$emit('editing');
		this.data.items.update_date = `${new Date().getTime()}`;
		if (old !== this.data.isEdited) {
			this.$forceUpdate();
		}
	}

	dragoverItem() {
		this.isDragoverItem = true;
	}

	dragleaveItem() {
		this.isDragoverItem = false;
		console.log('leave');
	}

	dragendItem() {
		this.isDragoverItem = false;
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
		return this.CurrentItem?.item?.id;
	}

	@Emit('setCurrentItem')
	SetCurrentItem(data: { item: BotConfigFlow; parent: BotConfigFlow }) {
		console.log('setCurrentItem');
		console.log(data);
		return data;
	}

	dragStart(e: DragEvent, item: BotConfigFlow, parent: BotConfigFlow) {
		this.SetCurrentItem({ item, parent });
		// this.CurrentItem.item = item;
	}

	dropItem(e: DragEvent, item: BotConfigFlow) {
		// console.log("dropItem");
		// console.log(e);
		// console.log(item);
		// console.log(this.data);
		// this.isDragoverItem=false;
		// if(this.CurrentItem?.item&&this.CurrentItem?.item.id!==this.data.id){
		// 	if(this.CurrentItem.parent){
		// 		this.CurrentItem.parent.next = this.CurrentItem.parent?.next?.filter(d=>d.id!==this.CurrentItem?.item?.id);
		// 		this.data.next?.push(this.CurrentItem.item);
		// 	}
		// }
	}

	remove() {
		this.parentData.next = this.parentData?.next?.filter(o => o.id !== this.data.id);
	}

	addNext() {
		this.open();
		// BotConfig2Module.addFlow({step:this.data.id,index:this.parentData.next.length,title:"新規"});
		this.data.next?.push(defaultBotFlow(v4(), '新規'));
	}

	dropValidate(item: BotConfigFlow, dropItem: BotConfigFlow): boolean {
		for (let i = 0; dropItem.next.length; i++) {
			if (item.id === dropItem.next[i].id) {
				return true;
			}
		}

		return false;
	}

	drop(e: DragEvent, item: ScriptDataTree, type?: string) {
		this.isDragover = false;
		this.isDragoverTop = false;
		if (this.CurrentItem?.item) {
			const CurrentItem = _.cloneDeep(this.CurrentItem.item);
			if (this.CurrentItem.parent) {
				if (this.dropValidate(this.CurrentItem.item, this.CurrentItem.parent)) {
					if (this.CurrentItem.parent?.next) {
						for (let i = 0; i < this.CurrentItem.parent.next.length; i++) {
							const sibling = this.CurrentItem.parent.next[i];
							if (this.CurrentItem?.item?.id === sibling.id) {
								sibling.id = 'deleteFlg';
							}
						}
					}

					this.parentData.next?.splice(this.index + (type === 'top' ? 0 : 1), 0, CurrentItem);

					this.CurrentItem.parent.next = this.CurrentItem.parent?.next?.filter((d, i) => {
						return d.id !== 'deleteFlg';
					});
				}
			}
			// this.parentData.children=this.parentData.children?.filter(d=>d.data.id!==this.CurrentItem?.item?.data.id);
		}
	}

	// get childPaths(): any  {
	// 	return this.paths.slice(1);
	// }
	public resetEditing() {
		// console.log("reset");
		// this.data.isEditing = false;
		// this.$forceUpdate();
	}

	public setActive(item: any) {
		const old = this.data.isActive;
		this.data.isActive = item?.id === this.data.id;
		if (old !== this.data.isActive) {
			this.$forceUpdate();
		}
	}

	public async mounted() {
		eventHub.$on('allInOneEditing', this.resetEditing);
		eventHub.$on(['setScript', 'setBot'], this.setActive);
	}

	public destroyed() {
		eventHub.$off('allInOneEditing', this.resetEditing);
		eventHub.$off(['setScript', 'setBot'], this.setActive);
	}
}
</script>
<style lang="scss" scoped src="./style.scss">
// @import "@/styles/variables.scss";
// @keyframes expansion {
//   0% {
//     transform: scale(1.1);
//   }
//   100% {
//     transform: scale(1);
//   }
// }
// .treeDionWrap {
//   padding-bottom: 0px;
//   &__ghoast {
//     border: #111 dotted 2px;
//     height: 70px;
//   }
//   &__dragErea {
//     margin-top: -12px;
//     height: 12px;
//   }
// }
// .treeDionDrop {
//   margin: 0;
//   padding: 0;
// }
// .treeDion {
//   padding-left: 12px;
//   &--dragover {
//     border: dotted 3px #333;
//   }
//   &__item {
//     margin: 12px 0 0 0;
//     padding: 12px;
//     border-left: solid 2px $active;
//     box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 3px;
//     position: relative;
//     &--active {
//       // border-color:#f00;
//       color: #fff;
//       background: $active;
//     }
//     &--edited {
//       border-left: solid 3px #f00;
//     }
//     &--editing {
//       border: solid 1px #0f0;
//       animation: 1s ease-in 0.5s infinite alternate forwards running expansion;
//     }

//     &__isOpen {
//       padding: 12px;
//       &--close {
//       }
//       &--open {
//       }
//     }
//   }
//   &__Button {
//     width: 40px;
//     height: 40px;
//     text-align: center;
//     line-height: 40px;
//     font-size: 20px;
//     display: block;
//     border-radius: 12px;
//     background-color: #ddd;
//     position: absolute;
//     right: 0px;
//     margin: auto;
//     top: 0;
//     bottom: 0;
//     &--add {
//       right: 46px;
//     }
//     &--remove {
//     }
//   }
// }
</style>
