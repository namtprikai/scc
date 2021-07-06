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
import { Ajax } from "@/utils/parts";
import { CLIENT_ID } from "@consoletype/utils/configration";
// @ts-ignore
@Component
export default class ForgotpwComp extends Vue {
	private ajax = new Ajax();
	private mail = "";
	private send() {
		this.ajax
			.http({
				url: "remind",
				method: "POST",
				data: {
					product_id: CLIENT_ID,
					email: this.mail,
				},
			})
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
