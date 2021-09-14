<template>
	<div class="autocomplete">
		<ul ref="list" class="autocomplete-results" v-show="isOpen">
			<li
				class="autocomplete-result"
				v-for="(result, i) in results"
				:key="i"
				@click="
					select(result);
					isOpen = false;
				"
				:class="{ 'is-active': i === arrowCounter }"
			>
				{{ result }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
import { RouteRecord } from "vue-router";
import pathToRegexp from "path-to-regexp";
import { eventHub } from "@/init/eventHub";

import { clearTimeout, setTimeout } from "timers";
// import { TalkScript } from "@/store/modules/talkscript";
import { v4 } from "uuid";

import { OldScenario } from "@/utils/allInOneCsv/scenario";
import { BModal } from "bootstrap-vue";
import { chown } from "fs";
// @ts-ignore
@Component
export default class AutoComplete extends Vue {
	@Prop({ default: true }) onChangeEvent!: boolean;
	$refs!: {
		list: HTMLElement;
	};

	isOpen = false;
	@Prop({ default: () => {} })
	select!: Function;

	@Prop({ default: [] })
	results!: string[];

	arrowCounter = -1;
	onArrowDown(): void {} // ↓ キーイベント
	onArrowUp(): void {} // ↑ キーイベント
	@Emit("input")
	setResult(result: string): string {
		return result;
	} // 候補リストの選択イベントと親へのEmit

	@Watch("option")
	onOptionChanged(newVal: string, oldVal: string): void {} // 確定内容でフォーム表示

	handleClickOutside(evt: any): void {} // 候補リストの領域外クリックでリスト非表示
	mounted(): void {} // 領域外クリックのイベントハンドラ登録
	destroyed(): void {} // 領域外クリックのイベントハンドラ削除
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
.botFlow {
	margin-top: 15px;
}
.choices {
	display: inline-block;
}
</style>
