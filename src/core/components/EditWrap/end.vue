<template>
	<div class="EditWrapMessage">
		<b-button size="sm" v-on:click="editUnlockOpen()">編集終了</b-button>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { apiUrl, scriptUrl, PRODUCT_ID } from '@product/utils/configration';
import { UpdateServer } from '@/api/updateServer';
import { EditModule } from '@/store/modules/edit';
import { Ajax } from '@/utils/parts';
import { clearTimeout, setTimeout, clearInterval, setInterval } from 'timers';
import EditWrap from './index.vue';
import { CallbackChecks } from './csv.i';
import { eventHub } from '@/init/eventHub';
// @ts-ignore
@Component
export default class CsvEditWrap extends EditWrap {
	public editUnlockOpen() {
		eventHub.$emit('editUnlockOpen');
		// this.$modal.show("dialog", {
		// 	title: `「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。

		// 				本当に編集終了しますか？`,
		// 	buttons: [
		// 		{
		// 			title: "編集終了",
		// 			handler: () => {
		// 				this.editUnlock();
		// 				this.$modal.hide("dialog");
		// 			},
		// 		},
		// 		{
		// 			title: "キャンセル",
		// 			handler: () => {
		// 				this.$modal.hide("dialog");
		// 			},
		// 		},
		// 	],
		// });
	}
}
</script>

<style lang="scss" type="scss" scoped>
.EditWrapMessage {
	display: inline;
}
.relCon {
	position: relative;
	width: 100%;
	height: 100%;
}
.block-center {
	margin: auto;
}
.editMessage {
	text-align: center;
	&__ul {
		padding: 0px;
		margin: auto;
	}
	&__item {
		text-align: left;
		padding: 12px;
		padding-left: 0px;
		width: 400px;
		margin-left: 40px;
	}
}
.editMessageCheck {
	&__ul {
		padding: 0px;
		margin: auto;
	}
	&__item {
		padding: 12px;
		list-style: none;
	}
}
.blockWrap {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	margin: auto;
	width: 100%;
	height: 100%;
	z-index: 9;
	background-color: rgba(0, 0, 0, 0.294);

	&__inner {
		position: absolute;
		top: 100px;
		left: 0px;
		right: 0px;
		// bottom: 0px;
		margin: auto;
		text-align: center;
		// width:100px;
		// height:30px;
		width: 500px;
		height: auto;
		font-weight: bold;
		font-size: 12px;
		background: #fff;
		border-radius: 14px;
		padding: 16px;
	}
}
</style>
