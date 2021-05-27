import { BModal } from 'bootstrap-vue';
import { MessageList } from '@/api/messageList';
import { eventHub } from '@/init/eventHub';
import { UserModule } from '@/store/modules/user';
import { Ajax } from '@/utils/parts';
import WrapMessage from '@/components/WrapMessage/index.vue';
import { Component, Vue } from 'vue-property-decorator';
import { PRODUCT_ID, subsystemUrl } from '@product/utils/configration';
import { AdminUserModule, IAdminUser } from '@/store/modules/adminUser';
import axios from 'axios';
// @ts-ignore
@Component({
	components: { WrapMessage },
})
export default class ImageSendParent extends Vue {
	protected file: File | null = null;
	protected ajax: Ajax = new Ajax();
	protected maxSize = 1048576;
	protected message: any = {};
	protected user: any;
	protected userId = '';
	protected userName = '';
	protected isSend = false;
	get active() {
		return this.userId && this.message && this.message.is_read;
	}

	get replystate() {
		return this.userId;
	}

	get state() {
		return this.userId && this.file && this.file.size < this.maxSize;
	}

	get errorMessage() {
		if (this.file && this.file.size >= this.maxSize) {
			return 'ファイルサイズが大きすぎます';
		}
		return '';
	}

	async handleSend() {
		const answer = await this.confirm('メッセージを送信しますか？');
		if (!answer) {
			return;
		}

		await this.sendMessage();
	}

	protected confirm(title: string): Promise<boolean> {
		return new Promise(resolve =>
			this.$modal.show('dialog', {
				title,
				buttons: [
					{
						title: 'はい',
						handler: () => {
							this.$modal.hide('dialog');
							resolve(true);
						},
					},
					{
						title: 'いいえ',
						handler: () => {
							this.$modal.hide('dialog');
							resolve(false);
						},
					},
				],
			}),
		);
	}

	protected async sendMessage() {
		const { userId, file } = this;
		if (userId == null || file == null) {
			return;
		}
		this.isSend = true;
		const data: any = await this.ajax.http({
			url: `product/${PRODUCT_ID}/message_data/upload`,
			method: 'GET',
		});
		console.log(data);
		// const formData = new FormData();
		// formData.append("product_id", PRODUCT_ID);
		// formData.append("file", file);
		const res = await axios({
			url: data.url,
			headers: {
				'Content-Type': 'image/*',
			},
			method: 'put',
			data: file,
		});
		console.log(res);
		await this.ajax.http({
			url: `product/${PRODUCT_ID}/line/send_message`,
			method: 'POST',
			data: {
				user_id: userId,
				type: 'image',
				text: data.key,
			},
		});
		if (this.user) {
			eventHub.$emit('setCurrentUser', this.user);
		}
		this.file = null;
		this.isSend = false;
		// const message = await MessageList.sendMessage(
		// 	{
		// 		user_id: this.userId,
		// 		type: "text",
		// 		text: this.text,
		// 		assignee_id: UserModule.id
		// 	},
		// 	this.userName
		// );

		// eventHub.$emit("setCurrentMessage", message);
	}

	protected setUserByMessage(message: any, isHikitsugu: boolean) {
		this.message = message;
		this.userId = message.user_id;
		this.user = message.user;
		this.userName = message.user ? message.user.name : '';
	}

	protected setUser(user: any) {
		this.message = { is_read: true };
		this.user = user;
		this.userId = user.id;
		this.userName = user ? user.name : '';
	}

	protected created() {
		console.log('Created response');
		eventHub.$on('setCurrentMessage', this.setUserByMessage);
		eventHub.$on('setCurrentUser', this.setUser);
	}

	protected destroyed() {
		eventHub.$off('setCurrentMessage', this.setUserByMessage);
		eventHub.$off('setCurrentUser', this.setUser);
	}
}
