<template>
	<div>
		<b-button v-if="!IsEditFree && isEndButton" v-on:click="editUnlockOpen()">編集終了</b-button>
		<span v-if="!IsEditFree">{{ editingmessage }}</span>
		<div class="blockWrap" v-if="IsEdit">
			<div class="relCon">
				<b-card no-body class="blockWrap__inner">
					<div class="text-center h4 mt-2">
						<p>スクリプトが{{ EditUserName }}によって編集中です。</p>
					</div>
				</b-card>
			</div>
		</div>
		<div class="blockWrap" v-if="IsEditFree">
			<div class="relCon">
				<b-card no-body class="blockWrap__inner">
					<div class="text-center mb-2">
						<b-button variant="primary" class="mb-3" v-on:click="editlock()">編集開始</b-button>
					</div>
					<div class="editMessage">
						<ul class="editMessage__ul">
							<li class="editMessage__item mx-3" v-for="(message, index) in messages" :key="index">
								{{ message }}
							</li>
						</ul>
					</div>
					<div class="editMessageCheck">
						<ul class="editMessageCheck__ul">
							<li class="editMessageCheck__item text-left mx-3" v-for="(check, index) in callbackChecks" :key="index">
								<input type="checkbox" :id="'callback' + index" v-model="check.isCheck" :value="check.message" class="mr-1" />
								<label class="editMessageCheck__label" :for="'callback' + index">{{ check.message }}</label>
							</li>
						</ul>
					</div>
				</b-card>
			</div>
		</div>
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
	@Prop({
		default: '他人の編集をロックしています。編集を終えたら必ず編集を終了するボタンを押してください。',
	})
	public editingmessage!: string;

	@Prop({
		default: true,
	})
	public isEndbutton!: boolean;

	@Prop({ default: [] })
	public messages!: Array<string>;

	@Prop({ default: [] })
	public callbackChecks!: CallbackChecks;

	@Prop({ default: false })
	public isEndButton!: boolean;

	created() {
		eventHub.$on('editUnlockOpen', this.editUnlockOpen);
	}

	destroyed() {
		eventHub.$off('editUnlockOpen', this.editUnlockOpen);
	}

	public editUnlockOpen() {
		this.$modal.show('dialog', {
			title: `「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。

						本当に編集終了しますか？`,
			buttons: [
				{
					title: '編集終了',
					handler: () => {
						this.editUnlock();
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

	public async editlock() {
		await EditModule.editlock();
		for (const check of this.callbackChecks) {
			if (check.isCheck) {
				check.callback();
			}
		}
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
		padding-left: 20px;
	}
	&__item {
		text-align: left;
		padding: 12px;
		padding-left: 0px;
		margin-left: 30px;
		// width: 400px;
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
		margin-left: 30px;
	}
	&__label {
		display: inline;
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
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.294);
	backdrop-filter: blur(2px);
	&__inner {
		position: absolute;
		top: 100px;
		left: 0px;
		right: 0px;
		// // bottom: 0px;
		margin: auto;
		// text-align: center;
		// // width:100px;
		// // height:30px;
		width: 580px;
		height: auto;
		// font-weight: bold;
		font-size: 12px;
		// background: #fff;
		// border-radius: 14px;
		padding: 12px;
	}
}
</style>
