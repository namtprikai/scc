<template>
	<div>
		<b-container v-if="currentMessage">
			<b-row>
				<b-form-group id="input-group-1" label="対象メッセージ" label-for="input-1" description="We'll never share your email with anyone else.">
					<b-form-textarea id="input-1" v-model="currentMessage.text" required disabled></b-form-textarea>
				</b-form-group>
			</b-row>
			<b-row class="my-2">
				<b-select v-model="scoreMessage" v-bind:options="scoreMessages" />
			</b-row>
			<b-row>
				<b-form-textarea id="textarea" v-model="comment" placeholder="Enter something..." v-bind:state="state" rows="4"></b-form-textarea>
			</b-row>
			<b-row class="my-2">
				<b-button class="mx-auto col-12" v-on:click="handleSend" v-bind:disabled="!state">送信</b-button>
			</b-row>
		</b-container>
		<wrap-message v-if="!currentMessage" message="メッセージを選択してください" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';
import { MessageList } from '@/api/messageList';
import { eventHub } from '@/init/eventHub';
import { MessageListModule } from '@/store/modules/messageList';
import { UserModule } from '@/store/modules/user';
import { PRODUCT_ID } from './../../utils/configration';
import { Ajax, MessageObj } from '@/utils/parts';
import WrapMessage from '@/components/WrapMessage/index.vue';
import { AdminUserModule } from '@/store/modules/adminUser';
import AdminUser from '../adminUser/index.vue';
// @ts-ignore
@Component({
	components: { WrapMessage },
})
export default class RecentAdminMessage extends Vue {
	protected ajax: Ajax = new Ajax();
	protected text = '';
	protected userId = '';
	protected userName = '';
	protected currentMessage: MessageObj | null = null;
	protected comment = '';
	protected is_CurrentMessageSet = false;
	protected scoreMessage: any;
	protected scoreMessages: Array<any> = [
		{ value: 5, text: '超イイネ♪' },
		{ value: 4, text: 'イイネ♪' },
		{ value: 3, text: 'OK！' },
		{ value: 2, text: 'おしい！' },
		{ value: 1, text: 'ナニコレ？' },
		{ value: 0, text: '-' },
	];

	getAdminUserNameById(id: string) {
		return AdminUserModule.AdminList.find((admin: any) => admin.id == id);
	}

	send() {
		if (this.currentMessage) {
			const assignee_id = this.currentMessage ? this.currentMessage.assignee_id : '';
			const score = this.scoreMessage.value;
			const messageId = this.currentMessage.id;
			const comment = this.comment;
			this.$modal.show('dialog', {
				title: `
			${this.getAdminUserNameById(assignee_id || '')}のメッセージに以下の評価をつけますか？
			<p class="response__modalTitle">評価：</p>
			<p class="response__modalVal">${this.scoreMessage.text}</p>
			<p class="response__modalTitle">コメント：</p>
			<p class="response__modalVal">${this.comment}</p>
			`,
				buttons: [
					{
						title: 'OK',
						handler: () => {
							this.$modal.hide('dialog');
							this.doSend(messageId, score, comment);
						},
					},
					{
						title: 'CANCEL',
						handler: () => {
							this.$modal.hide('dialog');
						},
					},
				],
			});
		}
	}

	doSend(messageId: string, score: string, comment: string) {
		this.ajax
			.http({
				url: `product/${PRODUCT_ID}/message_feedback`,
				method: 'POST',
				data: {
					message_id: messageId,
					score: parseInt(score),
					comment,
				},
			})
			.then(
				() => {
					this.$modal.show('dialog', {
						title: '評価が正常に完了しました',
						buttons: [
							{
								title: 'OK',
								handler: () => {
									this.$modal.hide('dialog');
								},
							},
						],
					});

					this.reset();
				},
				() => {},
			);
	}

	reset() {
		this.scoreMessage = this.scoreMessages[0];
		this.comment = '';
		this.currentMessage = null;
		this.is_CurrentMessageSet = false;
	}

	protected setUserByMessage(message: any, isHikitsugu: boolean) {
		console.log(message);
		this.currentMessage = message;
		this.text = '';
		this.userId = message.user_id;
		this.userName = message.user ? message.user.name : '';
	}

	protected created() {
		console.log('Created response');
		eventHub.$on('setCurrentMessage', this.setUserByMessage);
	}

	protected destroyed() {
		eventHub.$off('setCurrentMessage', this.setUserByMessage);
	}
}
</script>
<style lang="scss" scoped></style>
