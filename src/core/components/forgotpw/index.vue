<template>
	<div>
		<b-input
			type="email"
			placeholder="メールアドレスを記入してください"
			v-model="mail"
		></b-input>
		<b-button v-on:click="send">パスワード再設定リクエスト</b-button>
	</div>
</template>

<script lang="ts">
import * as d3 from "d3";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { RouteRecord } from "vue-router";
import pathToRegexp from "path-to-regexp";
import { eventHub } from "@/init/eventHub";
import { CLIENT_ID } from "@consoletype/utils/configration";
// @ts-ignore
@Component
export default class ForgotpwComp extends Vue {
	private mail = "";
	private send() {
		// AjaxService.ajax
		// 	.http({
		// 		url: "remind",
		// 		method: "POST",
		// 		data: {
		// 			product_id: CLIENT_ID,
		// 			email: this.mail,
		// 		},
		// 	})
Promise.resolve()
			.then(
				(res: any) => {
					this.$modal.show("dialog", {
						title: "成功",
						text: "新しいパスワードのメールを送信しました",
						buttons: [
							{
								title: "OK",
							},
						],
					});
				},
				(res) => {
					this.$modal.show("dialog", {
						title: "エラーが発生しました",
						text: "ユーザーのパスワードの再発行に失敗しました",
						buttons: [
							{
								title: "OK",
							},
						],
					});
				}
			);
	}
}
</script>
<style lang="scss" scoped></style>

<style lang="scss"></style>
