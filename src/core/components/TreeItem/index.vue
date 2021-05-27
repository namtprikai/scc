<template>
	<li v-show="isShow">
		<div>space</div>
		<div
			draggable="true"
			:style="styleObj"
			@drag.stop="drag"
			@dragstart.stop="dragStart"
			@dragover.stop="dragOver"
			@dragenter.stop="dragEnter"
			@dragleave.stop="dragLeave"
			@drop.stop="drop"
			@dragend.stop="dragEnd"
		>
			<div :class="{ bold: isFolder }" @click="setCurrentItem" @dblclick="makeFolder">
				{{ currentItem.text }}
				<span v-if="isFolder" @click="toggle">[{{ isOpen ? '-' : '+' }}]</span>
			</div>
			<ul v-show="isOpen" v-if="isFolder">
				<tree-item class="item" v-for="child in Children" :key="child.id" :currentItem="child" :item="item" @make-folder="$emit('make-folder', $event)" @add-item="$emit('add-item', $event)"></tree-item>
				<li class="add" @click="$emit('add-item', currentItem)">+</li>
			</ul>
		</div>
	</li>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';
import pathToRegexp from 'path-to-regexp';
import { eventHub } from '@/init/eventHub';
import { TalkScript } from '@/store/modules/talkScript';
// @ts-ignore
@Component
export default class TreeItem extends Vue {
	styleObj = { opacity: 1 };
	isOpen = false;
	isShow = true;
	@Prop()
	private item: any;

	@Prop()
	private currentItem: TalkScript | undefined;

	private created() {}
	public toggle() {
		console.log('toggle');
		this.isOpen = !this.isOpen;
	}

	public setCurrentItem() {
		console.log('Set current item');
		eventHub.$emit('setScript', this.currentItem);
	}

	public makeFolder() {
		if (!this.isFolder && this.currentItem) {
			this.$emit('make-falder', this.currentItem.parent);
			this.isOpen = true;
		}
	}

	get Children() {
		return this.item.filter((o: TalkScript) => {
			if (this.currentItem) {
				return o.parent === this.currentItem.id;
			}
			return false;
		});
	}

	get isFolder() {
		if (this.currentItem) {
			return this.currentItem.type === 'node';
		}
		return false;
	}

	dragFromData: any;
	drag(e: DragEvent) {
		console.log('drag');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		this.dragFromData = this.currentItem;
		this.isShow = false;
	}

	dragStart(e: DragEvent) {
		// e.preventDefault();
		console.log('dragStart');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		eventHub.$emit('setCurrentItem', this.currentItem);
		return true;
	}

	dragLeave(e: DragEvent) {
		console.log('dragLeave');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		this.styleObj.opacity = 1;
	}

	dragEnter(e: DragEvent) {
		console.log('dragEnter');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		// e.preventDefault();
		// if (
		// 	this.currentItem &&
		// 	this.dragFromData &&
		// 	this.currentItem.id !== this.dragFromData.id
		// ) {
		// 	console.log("opacity 0.5");
		// 	this.styleObj.opacity = 0.5;
		// }
		this.styleObj.opacity = 0.1;
		// return true;
	}

	dragOver(e: DragEvent) {
		console.log('dragOver');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		// e.preventDefault();
		// rootTree.emitDragOver(this.model, this, e)
		return true;
	}

	dragEnd(e: DragEvent) {
		console.log('dragEnd');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		this.isShow = true;
	}

	drop(e: DragEvent) {
		console.log('drop');
		if (this.currentItem) console.log(this.currentItem.id);
		console.log(e);
		// e.preventDefault();
		// this.styleObj.opacity = 1
		// // 如果判断当前节点不允许被drop，return;
		// if (!this.allowDrop(this.model, this)) {
		//   return
		// }
		// toData = this
		// exchangeData(rootTree, fromData, toData)
		// rootTree.emitDrop(this.model, this, e)
	}
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 10px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
.item {
	cursor: pointer;
}
.bold {
	font-weight: bold;
}
ul {
	padding-left: 1em;
	line-height: 1.5em;
	list-style-type: dot;
}
.flip-list-move {
	transition: transform 1s;
}
</style>
