<template>
	<div>
		<b-button v-if="!IsEditFree" v-on:click="editUnlock()">編集を終了する</b-button>
		<span v-if="!IsEditFree">{{ editingmessage }}</span>
		<div class="blockWrap" v-if="IsEdit">
			<div class="relCon">
				<div class="blockWrap__inner">
					<p>スクリプトが{{ EditUserName }}によって編集中です。</p>
				</div>
			</div>
		</div>
		<div class="blockWrap" v-if="IsEditFree">
			<div class="relCon">
				<div class="blockWrap__inner">
					<b-button class="editButton" v-on:click="editlock()" variant="outline-secondary">編集を開始する</b-button>
				</div>
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
import { eventHub } from '@/init/eventHub';
// @ts-ignore
@Component
export default class EditWrap extends Vue {
	protected intervalId: NodeJS.Timeout | null = null;
	@Prop({
		default: '他人の編集をロックしています。編集を終えたら必ず編集を終了するボタンを押してください。',
	})
	public editingmessage!: string;

	@Prop({ default: false })
	public isEndButton!: boolean;

	public created() {
    this.resetInterval();
		EditModule.getEditStatus();
		this.intervalId = setInterval(() => {
			EditModule.getEditStatus();
		}, 1000 * 15);
	}
  public resetInterval(){
		if (this.intervalId != null) {
			console.log('clearInterval');
			clearInterval(this.intervalId);
		}
  }
	public destroyed() {
    this.resetInterval();
	}

	get EditUserName() {
		return EditModule.EditUserName;
	}

	get IsEdit() {
		return EditModule.IsEdit;
	}

	get IsEditFree() {
		return EditModule.IsEditFree;
	}

	public editUnlock() {
		EditModule.editUnlock();
		eventHub.$emit('editUnLock');
	}

	public editlock() {
		EditModule.editlock();
	}
}
</script>

<style lang="scss" type="scss" scoped>
.relCon {
	position: relative;
	width: 100%;
	height: 100%;
}
.block-center {
	margin: auto;
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
	background-color: rgba(255, 255, 255, 0.7);

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
		width: 100%;
		height: 1em;
		font-weight: bold;
	}
}
</style>
