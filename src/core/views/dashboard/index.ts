import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { mapGetters } from 'vuex';
import { CLIENT_ID } from '@consoletype/utils/configration';
import { ImageChack } from '../../utils/parts';
// @ts-ignore
@Component
export default class DashboardParent extends Vue {
	private imageChack = new ImageChack();
	create() {}
	public roleStyle(role: number) {
		return { 'background-image': `url(${this.roleGif(role)})` };
	}

	get name() {
		return UserModule.name;
	}

	public roleGif(role: number) {
		// const imageUrl = `https://file.ai-x-supporter.com/${CLIENT_ID}/${role}_role_theme.gif`;
		// if (this.imageChack.safeList.has(imageUrl)) {
		// 	return imageUrl;
		// }
		// if (!await this.imageChack.checkLink(imageUrl)) {
		return require(`./img/${role}.png`);
		// }
		// return imageUrl;
	}

	get avatar() {
		const imageUrl = `https://file.ai-x-supporter.com/${CLIENT_ID}/${UserModule.id}_thumb.gif`;
		// if (this.imageChack.safeList.has(imageUrl)) {
		// 	return imageUrl;
		// }
		// this.imageChack.checkLink(imageUrl);
		return imageUrl;
		// return require(`./img/theme.gif`);
	}

	get emptyGif() {
		const imageUrl = `https://file.ai-x-supporter.com/${CLIENT_ID}/${UserModule.id}_theme.gif`;
		// if (this.imageChack.safeList.has(imageUrl)) {
		return imageUrl;
		// }
		// this.imageChack.checkLink(imageUrl);
		// return require(`./img/theme.gif`);
	}

	get role() {
		return UserModule.role;
	}
}
