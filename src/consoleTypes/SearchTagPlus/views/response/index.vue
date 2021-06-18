<template>
	<div>
		<b-container>
			<b-row class="my-2">
				<b-select v-model="header" v-bind:options="headers" v-bind:disabled="!active" @change="handleHeaderChange" />
			</b-row>
			<b-row>
				<b-form-textarea id="textarea" v-model="text" placeholder="Enter something..." v-bind:state="state" v-bind:disabled="!active" rows="4"></b-form-textarea>
			</b-row>
			<b-row class="my-2">
				<b-select v-model="footer" v-bind:options="footers" v-bind:disabled="!active" @change="handleFooterChange" />
			</b-row>
			<b-row class="my-2">
				<b-button class="mx-auto col-12" v-on:click="handleSend" v-bind:disabled="!state">送信</b-button>
			</b-row>
			<b-row class="my-2 mt-2">
				<b-button class="mx-auto col-12" v-on:click="setDraft" v-bind:disabled="!state">下書き</b-button>
			</b-row>
			<b-row class="my-2 mt-2">
				<b-button class="mx-auto col-12" v-bind:disabled="!replystate" v-on:click="responseComplete">対応完了</b-button>
			</b-row>
		</b-container>

		<wrap-message v-if="isHikitsugu" message="他人が対応中です" />
		<wrap-message v-if="!active" message="メッセージを選択してください" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';
import { MessageList } from '@/api/messageList';
import { eventHub } from '@/init/eventHub';
import { MessageListModule } from '@/store/modules/messageList';
import { UserModule } from '@/store/modules/user';
import { CLIENT_ID } from './../../utils/configration';
import { Ajax } from '@/utils/parts';
import WrapMessage from '@/components/WrapMessage/index.vue';
import ResponseParent from '@/views/response';
// @ts-ignore
@Component({
	components: { WrapMessage },
})
export default class Response extends ResponseParent {
	get headers() {
		return [
			'冒頭に挿入',
			`お問合せありがとうございます。担当の${UserModule.name}でございます。お調べいたしますので、しばらくお待ちください。`,
			'弊社商品（サービス）にご興味をお持ちいただき、ありがとうございます。○○についてご案内いたします。',
			'弊社サービス（ご案内）がわかりづらく、お手数をおかけし申し訳ございません。○○についてご案内いたします。',
			'現在確認中でございます。もうしばらくお待ちください。',
			'他にご質問はございますか。',
			'お問い合わせありがとうございました。この回答で問題が解決すれば「解決した」を、そうでなければ「解決できない」を選択して下さい。<feedback:true>',
		];
	}

	header = this.headers[0];
	get footers() {
		return [
			'末尾に挿入',
			'お問合せありがとうございました。またご不明点がございましたら、ご連絡ください。',
			'お問合せありがとうございました。○○についてぜひご検討ください。\nまたご不明点がございましたら、ご連絡ください。',
			'お問合せありがとうございました。○○のサンプル（資料）をご希望の場合には、フリーダイヤル：0120-596-221までご連絡ください。またご不明点がございましたら、ご連絡ください。',
			'お問合せありがとうございました。この度は、ご期待に沿うご案内ができず申し訳ございません。またご不明点がございましたら、ご連絡ください。',
			'詳細をお伺いした上でご案内いたしたく、大変お手数ではございますが、フリーダイヤル：0120-596-221までご連絡ください。',
		];
	}

	footer = this.footers[0];
	protected handleFooterChange(value: string) {
		this.text = `${this.text}\n${value}`;
		this.footer = this.footers[0];
	}
}
</script>
<style lang="scss" scoped></style>
