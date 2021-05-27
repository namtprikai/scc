<template>
	<div>
		<div class="blockWrap">
			<div class="relCon">
				<div class="blockWrap__inner" @click.stop>
					<div class="relCon">
						<div class="UploadModal__close" @click="close()">
							<b-icon icon="x" @click="close()"></b-icon>
						</div>
						<div class="UploadModal__image">
							<div class="relCon">
								<div
									class="UploadModal__image__item"
									v-for="(imageItem, index) in imageList"
									:key="index"
								>
									<img :src="imageItem.src" alt v-if="imageItem.active" />
								</div>
							</div>
						</div>
						<div class="relCon UploadModal__contents">
							<div class="UploadModal__interface" @mouseout="mouseout()">
								<ul class="UploadModal-List__ul">
									<li
										v-for="(imageItem, index) in ImageList"
										:key="index"
										@click="start(imageItem)"
										@mouseover="hover(imageItem)"
										:class="{
											'UploadModal-List__item--active': imageItem.active,
											'UploadModal-List__item--disable': imageItem.disable,
										}"
										class="UploadModal-List__item"
									>
										<b-icon
											class="UploadModal-List__item__icon"
											v-if="imageItem.active && !imageItem.disable"
											icon="check-circle-fill"
										></b-icon>
										{{ imageItem.discription }}
									</li>
								</ul>
							</div>
							<div class="UploadModal__discription">
								<div
									class="alert alert-info text-discription __Info mb-0"
									v-html="$sanitize(UploadModalDiscription)"
								>
									<p>テスト環境、本番環境への反映方法：</p>
									<p>
										1.
										「保存」を選択し、管理画面の変更内容をサーバーに保存してください。
									</p>
									<p>
										2.
										「テスト環境に反映」あるいは「本番環境に反映」を選択してください。サーバーに保存されているボット表示設定とFAQ設定の内容が選択した環境に反映されます。
									</p>
									<p>
										※「保存して〇〇環境に反映」を選択すると保存と反映が同時に行われます。
									</p>
								</div>
							</div>
							<div v-if="isUpload" class="UploadModal__cover">
								<div class="relCon">
									<div class="UploadModal__cover__item">アップロード中</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
// import { apiUrl, scriptUrl, PRODUCT_ID } from "@product/utils/configration";
import axios from "axios";
import { UpdateServer } from "@/api/updateServer";
import { BotConfig, BotConfig2Module } from "@/store/modules/botConfig2";
import {
	ScriptDataTree,
	TalkScript,
	TalkScriptModule,
} from "@/store/modules/talkScript";
import { AllInOneCsvMaker } from "@/utils/allInOneCsv";
import { Ajax } from "@/utils/parts";
import _ from "lodash";
import {
	PRODUCT_ID,
	subsystemUrl,
	scriptUrl,
	s3,
} from "@product/utils/configration";
// import { Ajax } from "@/utils/parts";
// import { clearTimeout, setTimeout, clearInterval, setInterval } from "timers";
import { eventHub } from "@/init/eventHub";
import { UpdateFlowItem } from "@/components/UploadModal/index.i";
import { imageList, UploadModalDiscription } from "@pconfig/config";
const csvSync = require("csv-parse/lib/sync");
const Encoding = require("encoding-japanese");
// @ts-ignore
@Component
export default class UploadModal extends Vue {
	private isUpload = false;
	private ajax: Ajax = new Ajax();
	private UploadModalDiscription: string = UploadModalDiscription;
	private imageList: Array<UpdateFlowItem> = _.cloneDeep(imageList);
	@Prop()
	private params?: {
		file?: File;
		synonymFile?: File;
		defaultMessage: string;
		scriptDataTree?: ScriptDataTree;
		botData?: BotConfig;
		type: "bot" | "search";
	};

	public get ImageList() {
		return this.imageList.filter((item) => !item.hidden);
	}

	public mouseout() {
		if (!this.isUpload) {
			this.imageReset();
		}
	}

	public imageReset() {
		for (const image of this.imageList) {
			image.active = false;
		}
		this.imageList[0].active = true;
	}

	public hover(item: any) {
		if (item.disable) {
			return;
		}
		for (const image of this.imageList) {
			image.active = false;
		}
		item.active = true;
	}

	public created() {
		this.imageReset();
	}

	public destroyed() {}
	public async start(item: UpdateFlowItem) {
		if (item.disable) {
			return;
		}
		this.isUpload = true;
		eventHub.$emit("saveScriptStart");
		let dres: any = { data: null };

		try {
			dres = await axios({
				baseURL: `${s3}/${PRODUCT_ID}`,
				url: `defaultMessage_dev.json?version=${new Date().getTime()}`,
				method: "GET",
			});
		} catch (e) {
			console.log(e);
		}
		/**
		 * ここにアップロードロジック
		 */
		if (item.flow.has("save")) {
			/**
			 * 保存
			 */
			if (this.params?.defaultMessage) {
				await this.ajax.http({
					baseURL: `${subsystemUrl}/product/${PRODUCT_ID}`,
					url: "upload",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					data: {
						data: this.params?.defaultMessage,
						fileName: "/defaultMessage_dev.json",
					},
				});
				dres = await axios({
					baseURL: `${s3}/${PRODUCT_ID}`,
					url: `defaultMessage_dev.json?version=${new Date().getTime()}`,
					method: "GET",
				});
			}
			const getText = async (_file: File): Promise<string> => {
				return new Promise((r) => {
					const reader: any = new FileReader();
					reader.onload = () => {
						let csvOb: Uint8Array = new Uint8Array(reader.result);
						const isSJIS = Encoding.detect(csvOb);
						if (isSJIS === "SJIS") {
							csvOb = Encoding.convert(csvOb, {
								to: "UTF8", // to_encoding
								from: "SJIS", // from_encoding
							});
							csvOb = new Uint8Array(csvOb);
						}
						const csvString = new TextDecoder("utf-8").decode(csvOb);
						r(csvString);
					};
					// reader.readAsText(_file);
					reader.readAsArrayBuffer(_file);
				});
			};
			if (this.params?.synonymFile) {
				try {
					const synonymFile = this.params?.synonymFile;
					const synonymFileText: string = await getText(synonymFile);
					const synonymArray = csvSync(synonymFileText, {
						relax_column_count: true,
					});
					const synonymObj: { [key: string]: string } = {};
					for (const synonym of synonymArray) {
						for (const s of synonym) {
							if (s == "") {
								break;
							}
							synonymObj[s] = synonym[0];
						}
					}
					// const synonym = synonym;
					const res = await Promise.all([
						await this.ajax.http({
							baseURL: `${scriptUrl}`,
							// baseURL: 'https://80867101.ngrok.io/api',
							url: "/synonym_data/",
							method: "POST",
							headers: {
								"Content-Type": "application/json;",
							},
							data: {
								version: "1",
								type: this.params.type,
								product_id: PRODUCT_ID,
								file: synonymObj,
							},
						}),
						await this.ajax.http({
							baseURL: `${scriptUrl}`,
							// baseURL: 'https://80867101.ngrok.io/api',
							url: "/synonym_data/",
							method: "POST",
							headers: {
								"Content-Type": "application/json;",
							},
							data: {
								version: "2",
								type: this.params.type,
								product_id: PRODUCT_ID,
								file: synonymObj,
							},
						}),
						await this.ajax.http({
							baseURL: `${scriptUrl}`,
							// baseURL: 'https://80867101.ngrok.io/api',
							url: "/synonym_data/",
							method: "POST",
							headers: {
								"Content-Type": "application/json;",
							},
							data: {
								version: "1",
								product_id: PRODUCT_ID,
								file: synonymObj,
							},
						}),
					]);

					console.log(res);
				} catch (e) {
					this.$bvToast.toast(e, {
						title: "類義語ファイルのエラー",
						toaster: "b-toaster-top-center",
						solid: true,
						appendToast: true,
					});
				}
			}
			if (this.params?.file) {
				const file = this.params.file;

				let fileText: any = await getText(file);
				// fileText = fileText.replace(/[\(\)]/g, (m: any) => {
				// 	if (m == "(") {
				// 		return "（";
				// 	}
				// 	return "）";
				// });
				fileText = csvSync(fileText, { relax_column_count: true });
				const { talkScript, scenario, rootmenu } = AllInOneCsvMaker.start(
					fileText,
					dres.data
				);
				await BotConfig2Module.setBotConfig2(scenario);
				console.log(talkScript);
				await TalkScriptModule.setTalkScript(talkScript);
			}
			if (this.params?.scriptDataTree) {
				await TalkScriptModule.setTalkScriptTree(this.params?.scriptDataTree);
			}
			const _talkScript = TalkScriptModule.TalkScript;
			if (this.params?.botData) {
				await BotConfig2Module.setBotConfig2(this.params?.botData);
			}
			if (this.params?.scriptDataTree && this.params?.botData) {
				const _botConfig = BotConfig2Module.BotConfig2;
				if ("title" in _botConfig) {
					const {
						TalkScript,
						BotScenario,
					} = AllInOneCsvMaker.MakeScriptAndScenarioByData(
						_talkScript,
						_botConfig,
						dres.data
					);
					console.log(BotScenario);
					await BotConfig2Module.setBotConfig2(BotScenario);
					await TalkScriptModule.setTalkScript(TalkScript);
				}
			}
			try {
				await TalkScriptModule.saveTalkscript();
				await BotConfig2Module.saveConfig2(this.params?.type || "bot");
			} catch (e) {
				console.log(e);
				this.$bvToast.toast(e, {
					title: "保存エラー",
					toaster: "b-toaster-top-center",
					solid: true,
					appendToast: true,
				});
			}
			if (this.params?.defaultMessage) {
				await TalkScriptModule.getTalkScript();
				await BotConfig2Module.getConfig2(this.params.type);
			}
			const BotConfig2 = BotConfig2Module.BotConfig2;
			if (BotConfig2 && "flow" in BotConfig2) {
				await BotConfig2Module.setBotConfig2(
					dres.data
						? AllInOneCsvMaker.updateInfoMessage(BotConfig2, dres.data)
						: BotConfig2
				);
			}
			await TalkScriptModule.saveTalkscript();
			await BotConfig2Module.saveConfig2(this.params?.type || "bot");
		}
		if (item.flow.has("test")) {
			/**
			 * テスト環境反映
			 */
			const base64DefaultMessage = await this.changeBase64(dres.data);
			if (base64DefaultMessage) {
				await this.ajax.http({
					baseURL: `${subsystemUrl}/product/${PRODUCT_ID}`,
					url: "upload",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					data: {
						data: base64DefaultMessage,
						fileName: "/defaultMessage_test.json",
					},
				});
			}
			await UpdateServer.update({ env: "test" });
		}
		const talkScript = TalkScriptModule.TalkScript;
		const rootmenu = AllInOneCsvMaker.getRootMenu(talkScript);
		const rootMenuObj: any = {};
		if (Array.isArray(rootmenu) && rootmenu.length > 0) {
			for (const menuText of rootmenu) {
				// menuText = AllInOneCsvMaker.cleanRegExp(menuText);
				rootMenuObj[menuText] = menuText;
			}
		}

		if (item.flow.has("test")) {
			await this.uploadDefaultCategory(rootMenuObj, "category_test");
		}
		if (item.flow.has("prod")) {
			await this.uploadDefaultCategory(rootMenuObj, "category");
		}

		if (item.flow.has("prod")) {
			/**
			 * 本番環境反映
			 */

			try {
				const base64DefaultMessage = await this.changeBase64(dres.data);
				if (base64DefaultMessage) {
					await this.ajax.http({
						baseURL: `${subsystemUrl}/product/${PRODUCT_ID}`,
						url: "upload",
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						data: {
							data: base64DefaultMessage,
							fileName: "/defaultMessage.json",
						},
					});
				}
			} catch (e) {
				console.log(e);
			}
			await UpdateServer.update();
		}
		await TalkScriptModule.getTalkScript();
		this.isUpload = false;
		this.imageReset();
		this.$bvToast.toast("正常に終了しました", {
			// title: `挿入されました`,
			toaster: "b-toaster-top-center",
			solid: true,
			appendToast: true,
		});
		/**
		 * すでに行ったフローのあるものはdisable
		 */
		root: for (const imageItem of this.imageList) {
			for (const flowItem of imageItem.flow) {
				if (item.flow.has(flowItem)) {
					imageItem.disable = true;
					continue root;
				}
			}
		}

		eventHub.$emit("saveScript");
	}

	public close() {
		eventHub.$emit("BoxModalClose");
	}

	public async changeBase64(data: any) {
		const json = JSON.stringify(data);
		const blob = new Blob([json], { type: "application/json" });
		const reader: any = new FileReader();
		const base64Str = await this.loadFileAsBase64(blob);
		return base64Str;
	}

	get Message() {
		return this.$attrs.message;
	}

	protected loadFileAsBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				if (!blob) {
					throw new Error("file undefined.");
				}

				const reader: any = new FileReader();
				reader.onloadend = () => {
					const base64Str = reader.result.split(",")[1];
					resolve(base64Str);
				};
				reader.readAsDataURL(blob);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async uploadDefaultCategory(data: object, filename = "category") {
		const json = JSON.stringify(data);
		const blob = new Blob([json], { type: "application/json" });
		const reader: any = new FileReader();
		const base64Str = await this.loadFileAsBase64(blob);
		this.ajax
			.http({
				baseURL: `${subsystemUrl}/product/${PRODUCT_ID}`,
				url: "upload",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				data: {
					data: base64Str,
					fileName: `/${filename}.json`,
				},
			})
			.then(
				(res: any) => {},
				(res: any) => {}
			);
	}
}
</script>

<style lang="scss" type="scss" scoped>
@import "@/styles/_variables.scss";
$imageHeight: 280px;
$modalTopMargin: 20px;
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
	width: 700px;
	height: 100%;
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	&__inner {
		background-color: #fff;
		position: absolute;
		top: $modalTopMargin;
		left: 0px;
		right: 0px;
		// bottom: 0px;
		margin: auto;
		text-align: center;
		// width:100px;
		// height:30px;
		width: 700px;

		min-height: 300px;
		font-weight: bold;
		padding: 0px;
		border-radius: 0px;
	}
}
.UploadModal {
	&__image {
		width: 100%;
		height: $imageHeight;
		background-image: url("./img/back.jpg");
		background-size: contain;
		background-position: center center;
		&__item {
			// 			position: absolute;
			// top: 0px;
			// left: 0px;
			// right: 0px;
			// bottom: 0px;
			// margin: auto;
			// width: 600px;
			// height: 230px;
		}
	}
	&__contents {
		overflow: auto;
		max-height: calc(
			100vh - #{$modalTopMargin + $imageHeight + $headerHeight + 50px}
		);
	}
	&__interface {
		min-height: 200px;
		padding: 20px;
	}
	&__discription {
		padding: 20px;
		padding-top: 0px;
		// padding: 40px;
		// color: #555;
		// font-size: 12px;
		text-align: left;
	}
	&__close {
		position: absolute;
		top: 0px;
		right: 0px;
		width: 40px;
		height: 40px;
		// background:blue;
		color: #fff;
		cursor: pointer;
		font-size: 30px;
		z-index: 999;
	}
	&__cover {
		position: absolute;
		top: 0px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		margin: auto;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		&__item {
			width: 150px;
			height: 80px;
			line-height: 80px;
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			margin: auto;
			background-color: rgba(0, 0, 0, 1);
			color: #fff;
		}
	}
}
$listHeight: 40px;
.UploadModal- {
	&List {
		&__ul {
			padding: 0px;
			margin: 0px;
		}
		&__item {
			list-style-type: none;
			height: $listHeight;
			line-height: $listHeight;
			text-align: left;
			padding-left: 40px;
			border-bottom: 1px #aaa;
			cursor: pointer;
			position: relative;
			&__icon {
				position: absolute;
				left: 20px;
				top: 0px;
				bottom: 0px;
				right: auto;
				margin: auto;
				display: block;
			}
			&--active {
				background: $active;
			}
			&--disable {
				// background: $negative;
				opacity: 0.5;
			}
		}
	}
}
</style>
