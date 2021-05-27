<template>
	<div class="accordion" v-bind:id="'sid' + data.step">
		<b-button class="d-flex align-items-center record" @click="setBotConfig" style="min-height: 50px">
			<span v-if="this.data.next.length > 0">
				<b-button v-b-toggle="step" class="icon" @click="expandDropdown">▶︎</b-button>
			</span>
			<span class="non-icon" v-else></span>
			<span class="condition">
				<b>{{ getTitle(this.data.condition.value) }}</b>
			</span>
			<b-button class="editbutton editbutton--remove" size="sm" @click="deleate()">-</b-button>
			<b-button class="editbutton editbutton--add" @click="addNext(step)" size="sm">＋</b-button>
		</b-button>

		<!-- Rendered After Click -->
		<b-collapse :id="step" v-model="visible">
			<accordion v-for="child in children" :key="child.step" :value="child.condition.value" :data="child" :childlength="child.next.length" />
		</b-collapse>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { getList } from '@/api/table';
import { MessageList } from '@/api/messageList';
import { eventHub } from '@/init/eventHub';
import BotConfigParent from '@/views/botConfig/index';
// import SlVueTree from "sl-vue-tree";
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import BotConfigTemp from '@/components/BotConfigTemp/index.vue';
import { Wait } from '@/utils/parts';
import { TalkScriptModule, TalkScript } from '@/store/modules/talkScript';
import { BotConfigModule } from '@/store/modules/botConfig';
import { OldScenario } from '@/utils/allInOneCsv/scenario';
// @ts-ignore
@Component({
	components: {
		Accordion: () => import('@/components/BotConfigTemp/Accordion.vue'),
	},
})
export default class Accordion extends Vue {
	visible = false;
	@Prop()
	name: any;

	@Prop()
	data: any;

	@Prop()
	value: any;

	@Prop()
	childlength: number | any;

	private talkScript: Array<TalkScript> | undefined;
	public async mounted() {}
	get children(): any {
		return this.data.next;
	}

	// get childPaths(): any  {
	// 	return this.paths.slice(1);
	// }
	get step(): any {
		return `${this.data.step}`;
	}

	public getTitle(scenarioId: string) {
		const talkScriptList = TalkScriptModule.TalkScript;
		if (talkScriptList) {
			for (const talkScript of talkScriptList) {
				if (talkScript.scenario === scenarioId) {
					return talkScript.text;
				}
			}
		}

		return scenarioId;
	}

	expandDropdown(e: any) {
		if (this.data.next.length > 0) {
			e.target.innerText = e.target.innerText == '▶︎' ? '▼' : '▶︎';
		}
	}

	async addNext(step: any) {
		const index = this.childlength + 1;
		this.visible = true;
		const { newStepId } = await BotConfigModule.addTestFlow({ step, index });
		await Wait(100);
		this.$scrollTo(`#sid${newStepId}`, 500, {
			container: '#BotConfigList',
			easing: 'ease-in',
			offset: -60,
			force: true,
			cancelable: true,
			onStart: element => {
				// scrolling started
			},
			onDone: element => {
				// scrolling is done
			},
			onCancel: () => {
				// scrolling has been interrupted
			},
			x: false,
			y: true,
		});
	}

	setBotConfig(e: any) {
		eventHub.$emit('setCurrentBotFlow', this.data);
	}

	doRemove(step: any) {
		BotConfigModule.dleateTestFlow(step);
	}

	deleate() {
		console.log(this.data);
		if (this.data.hasOwnProperty('step')) {
			this.$modal.show('dialog', {
				title: '削除してよろしいですか？',
				text: '',
				buttons: [
					{
						title: 'はい',
						handler: () => {
							console.log(this.data.id);
							this.doDelate(this.data.step);
							this.$modal.hide('dialog');
						},
					},
					{
						title: 'いいえ',
					},
				],
			});
		}
	}

	async doDelate(id: string) {
		this.$modal.show('dialog', {
			title: '削除中',
			text: '削除しています',
		});
		BotConfigModule.dleateTestFlow(id);
		// this.reset();
		// await this.ajax.http({
		// 	url: `product/${PRODUCT_ID}/botConfig/${id}`,
		// 	method: 'DELETE',
		// 	data: {}
		// });
		// await UpdateServer.update();
		// await BotConfigModule.getBotConfig();
		this.$modal.show('dialog', {
			title: '削除完了',
			text: '削除が完了しました',
			buttons: [
				{
					title: '閉じる',
				},
			],
		});
	}
}
</script>
<style lang="scss">
.accordion {
	margin: 5px 0px 5px 15px;
	color: #000000 !important;
	h1,
	h2 {
		font-weight: normal;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		display: inline-block;
		margin: 0 10px;
	}
	a {
		color: #42b983;
	}
	.row {
		margin: 0 !important;
	}

	.editbutton {
		font-weight: bold !important;
		margin-left: auto;
		border: 1px #ffffff solid !important;
		margin-right: 3px;
		position: absolute;
		width: 30px;
		height: 30px;
		&--add {
			right: 8px;
		}
		&--remove {
			right: 44px;
		}
	}
	.record {
		width: 100%;
		border-radius: 1em;
		color: #ffffff !important;
		padding: 5px;
	}
	.btn:hover,
	button:hover {
		cursor: pointer;
	}
	.icon {
		color: #ffffff !important;
		font-weight: bold;
		margin-right: 5px;
	}
	.non-icon {
		width: 45px;
	}
	.add {
		font-weight: bold !important;
		margin-left: auto;
		border: 1px #ffffff solid !important;
	}
	.delete {
		font-weight: bold !important;
		margin-right: 2px;
		margin-left: 2px;
		border: 1px #ffffff solid !important;
	}
	.condition {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 5px;
	}
}
</style>
