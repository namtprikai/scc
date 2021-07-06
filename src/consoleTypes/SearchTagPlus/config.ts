import { component, VueConstructor } from "vue/types/umd";
import { RouterOptions } from "vue-router";
import Frame1 from "@/frames/b_1.vue";
import Frame2 from "@/frames/b_2.vue";
import Frame3 from "@/frames/b_3.vue";
import Frame4 from "@/frames/b_4.vue";
import Frame5 from "@/frames/b_5.vue";
import Frame6 from "@/frames/b_6.vue";
import Frame7 from "@/frames/b_7.vue";
import moment from "moment";
import TicketCompParent, { Ticket, TicketData, TicketGroup, Condition, EnquateTicket } from "@/views/ticketTable";
export const NoneString = "なし";
export const MaxFaqFile = 500;
export const WindowTestPageUrl: string = process.env.DEV_WINDOW_URL || "https://service.ai-x-supporter-dev.com/search_tag_plus_demo_test/";
export const MaxFaqSize = 500;
export const WindowPageUrl: string = process.env.PRODUCT_WINDOW_URL || "https://service.ai-x-supporter-dev.com/search_tag_plus_demo/";
export const KeywordEditorButtons: Array<string> = [
	"test",
	"prod",
	// 'all',
	// "test",
	// "prod",
	// 'all',
];
export const UploadModalDiscription = `
	<p>テスト環境、本番環境への反映方法：</p>
	<p>1. 「保存」を選択し、管理画面の変更内容をサーバーに保存してください。</p>
	<p>2. 「テスト環境に反映」あるいは「本番環境に反映」を選択してください。サーバーに保存されているボット表示設定とFAQ設定の内容が選択した環境に反映されます。</p>
	<p>※「保存して〇〇環境に反映」を選択すると保存と反映が同時に行われます。</p>
`;
export function RouterConfig(Layout: VueConstructor<Vue>, Box: VueConstructor<Vue>): RouterOptions {
	return {
		mode: "hash",
		scrollBehavior: (to, from, savedPosition) => {
			if (savedPosition) {
				return savedPosition;
			} else {
				return { x: 0, y: 0 };
			}
		},
		base: process.env.BASE_URL,
		routes: [
			{
				path: "/login",
				component: () => import(/* webpackChunkName: "login" */ "views/login/index.vue"),
				meta: {
					hidden: true,
				},
			},
			{
				path: "/404",
				component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
				meta: { hidden: true },
			},
			{
				path: "/",
				component: Layout,
				redirect: "/index/dashboardtop",
				name: "Dashboard",
				meta: { title: "TOP", icon: "home", hidden: true },
				children: [
					{
						path: "index",
						component: Frame3,
						redirect: "/index/dashboardtop",
						name: "dashboard",
						meta: {
							title: "ダッシュボード",
							icon: "example",
							roles: [4, 5, 999],
						},
						children: [
							{
								path: "accountsetting",
								name: "accountsetting",
								components: {
									v1: Box,
								},
								meta: {
									title: "アカウント設定",
									icon: "table",
									v1: {
										default: "Dashboard",
										tabs: [
											{
												label: "TOP",
												key: "Dashboard",
												roles: [4, 5, 999],
											},
											{
												label: "パスワード変更",
												key: "Password",
												roles: [4, 5, 999],
											},
											{
												label: "アカウントリスト",
												key: "AdminUser",
												roles: [5, 999],
											},
											{
												label: "お知らせ",
												key: "Oshirase",
												roles: [4, 5, 999],
												discription: "管理画面のヘッダーに表示する文言を指定できます。",
											},
										],
									},
								},
							},
							{
								path: "dashboardtop",
								name: "dashboard",
								components: {
									v1: Box,
								},
								meta: {
									title: "ダッシュボード",
									icon: "table",
									v1: {
										default: "Dashboard",
										tabs: [
											{
												label: "TOP",
												key: "Dashboard",
												roles: [4, 5, 999],
											},
											// {
											// 	label: "パスワード変更",
											// 	key: "Password",
											// 	roles: [0, 1, 2, 3, 4, 5, 6],
											// },
											// { label: "アカウントリスト", key: "AdminUser", roles: [5, 6] },
											// {
											// 	label: "お知らせ",
											// 	key: "Oshirase",
											// 	roles: [4, 5, 6],
											// 	discription: "管理画面のヘッダーに表示する文言を指定できます。",
											// },
										],
									},
								},
							},
						],
					},
					{
						path: "dashboard",
						redirect: "/index/dashboardtop",
						component: () => import("views/dashboard/index.vue"),
					},
					{
						path: "pass",
						component: () => import("views/dashboard/index.vue"),
					},
				],
			},
			{
				path: "./",
				component: Layout,
				children: [
					{
						path: "index",
						component: Layout,
						redirect: "/index/dashboardtop",
						name: "Dashboard",
						meta: { title: "TOP", icon: "home", hidden: false },
					},
				],
			},
			{
				path: "/setting",
				component: Layout,
				redirect: "/setting",
				name: "setting",
				meta: { title: "基本設定", icon: "cog", roles: [4, 5, 999] },
				children: [
					// {
					// 	path: 'index',
					// 	component: Frame6,
					// 	redirect: '/setting/index',
					// 	name: 'index',
					// 	meta: {
					// 		title: 'setting',
					// 		icon: 'cog',
					// 		roles: [4, 5, 999],
					// 	},
					// 	children: [
					// {
					// 	path: 'botmessageconfig',
					// 	name: 'botmessageconfig',
					// 	components: {
					// 		v1: Box,
					// 		v2: Box,
					// 	},
					// 	meta: {
					// 		title: 'ボット表示設定',
					// 		icon: 'table',
					// 		confirmation: {
					// 			is: true,
					// 			message: '「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。本当に編集終了しますか？',
					// 			after: () => {
					// 				EditModule.editUnlock();
					// 			},
					// 		},
					// 		v1: {
					// 			default: 'DefaultChatMessage',
					// 			tabs: [
					// 				{
					// 					label: 'ボット表示設定',
					// 					key: 'DefaultChatMessage',
					// 					tabtype: 'dev',
					// 					discription: 'ボットに表示される文言を編集できます。<br>保存して反映するには「反映ステップに進む」を選択してください。',
					// 				},
					// 			],
					// 		},
					// 		v2: {
					// 			default: 'DefaultChatMessageProd',
					// 			tabs: [
					// 				// {
					// 				// 	label: "テスト環境",
					// 				// 	key: "DefaultChatMessageTest",
					// 				// 	component: "DefaultChatMessage",
					// 				// 	tabtype: "test",
					// 				// 	discription:
					// 				// 		"テスト環境で表示されている文言です",
					// 				// },
					// 				{
					// 					label: '本番環境',
					// 					key: 'DefaultChatMessageProd',
					// 					component: 'DefaultChatMessage',
					// 					tabtype: 'prod',
					// 					discription: '本番環境で表示されている文言です。',
					// 				},
					// 				// {
					// 				// 	label: "テスト環境",
					// 				// 	key: "BotMessageConfigDevelopPreviewer",
					// 				// 	discription: "テスト環境で表示されている文言です。",
					// 				// },
					// 				// {
					// 				// 	label: "本番環境",
					// 				// 	key: "BotMessageConfigMasterPreviewer",
					// 				// 	discription: "本番環境で表示されている文言です。",
					// 				// },
					// 			],
					// 		},
					// 	},
					// },
					// 	],
					// },
					{
						path: "index2",
						component: Frame3,
						redirect: "/setting/index2",
						name: "index2",
						meta: {
							title: "setting",
							icon: "cog",
							roles: [4, 5, 999],
						},
						children: [
							{
								path: "consoleconfig",
								name: "consoleconfig",
								components: {
									v1: Box,
								},
								meta: {
									title: "管理画面設定",
									icon: "table",
									v1: {
										default: "Oshirase",
										tabs: [
											{
												label: "お知らせ設定",
												key: "Oshirase",
												discription: "管理画面のヘッダーに、お知らせやリンクを設定できます。",
											},
										],
									},
								},
							},
						],
					},
				],
			},
			// {
			// 	path: '/scriptSearch',
			// 	component: Layout,
			// 	redirect: '/scriptSearch/index',
			// 	name: 'scriptSearch',
			// 	meta: {
			// 		title: 'スクリプト検索',
			// 		icon: 'chat',
			// 		roles: [4, 5, 999],
			// 	},
			// 	children: [
			// 		{
			// 			path: 'index',
			// 			component: Frame6,
			// 			redirect: '/messagelist/index',
			// 			name: 'Example',
			// 			meta: {
			// 				title: 'スクリプト検索',
			// 				icon: 'example',
			// 				roles: [0, 1, 2, 3, 4, 5, 6],
			// 			},
			// 			children: [
			// 				{
			// 					path: 'search',
			// 					name: 'search',
			// 					components: {
			// 						v1: Box,
			// 						v2: Box,
			// 						v3: Box,
			// 						v4: Box,
			// 					},
			// 					meta: {
			// 						title: '検索',
			// 						icon: 'list-rich',
			// 						v1: {
			// 							default: 'ScriptCategory',
			// 							tabs: [
			// 								// { label: "メッセージリスト", key: "MessageList" },
			// 								// { label: "chart", key: "Charts" },
			// 								{
			// 									label: 'スクリプト検索',
			// 									key: 'ScriptCategory',
			// 									all: true,
			// 								},
			// 								{
			// 									label: 'よく使われるリスト',
			// 									key: 'ScriptRank',
			// 									all: true,
			// 								},
			// 								{
			// 									label: '最近追加したFAQ',
			// 									key: 'ScriptNewList',
			// 									all: true,
			// 								},
			// 							],
			// 						},
			// 						v2: {
			// 							default: 'ScriptShow',
			// 							tabs: [
			// 								{ label: 'スクリプト内容', key: 'ScriptShow' },
			// 								// { label: "キーワード重み", key: "KeywordEditor" }
			// 							],
			// 						},
			// 						v3: {
			// 							default: 'Response',
			// 							tabs: [
			// 								{ label: '返信', key: 'Response' },
			// 								{ label: 'ユーザー詳細', key: 'UserDetail', all: true },
			// 							],
			// 						},
			// 						v4: {
			// 							default: 'MessageHistory',
			// 							tabs: [
			// 								{ label: 'メッセージ履歴', key: 'MessageHistory' },
			// 								{ label: 'キーワード重み', key: 'KeywordEditor' },
			// 							],
			// 						},
			// 					},
			// 				},
			// 			],
			// 		},
			// 	],
			// },
			{
				path: "/script",
				component: Layout,
				redirect: "/script",
				name: "script",
				meta: {
					title: "FAQ設定",
					icon: "script",
					roles: [4, 5, 999],
				},
				children: [
					{
						path: "index2",
						components: { default: Frame7 },
						redirect: "/script/index2",
						name: "script",
						meta: {
							title: "スクリプト",
							icon: "example",
							roles: [4, 5, 999],
						},
						children: [
							{
								path: "scenarioedit",
								name: "scenarioedit",
								components: {
									v1: Box,
									v2: Box,
									main: Frame3,
								},
								meta: {
									title: "CSV編集",
									icon: "edit",
									confirmation: {
										is: true,
										message: "「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。本当に編集終了しますか？",
										after: () => {
											// EditModule.editUnlock();
										},
									},
									v1: {
										default: "AllInOneCsvDownload",
										tabs: [{ label: "CSVダウンロード", key: "AllInOneCsvDownload" }],
									},
									v2: {
										default: "AllInOneCsv",
										tabs: [{ label: "CSVアップロード", key: "AllInOneCsv" }],
									},
								},
							},
						],
					},
					{
						path: "index4",
						components: { default: Frame6 },
						redirect: "/script/index4",
						name: "script",
						meta: {
							title: "スクリプト",
							icon: "example",
							roles: [4, 5, 999],
						},
						children: [
							{
								path: "scriptedit",
								name: "scriptedit",
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: "直接編集",
									icon: "edit",
									confirmation: {
										is: true,
										message: "「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。本当に編集終了しますか？",
										after: () => {
											// EditModule.editUnlock();
										},
									},
									v1: {
										default: "Question",
										tabs: [{ label: "FAQ一覧", key: "Question" }],
									},
									v2: {
										default: "AllInOneEditor",
										tabs: [
											{ label: "FAQ編集", key: "AllInOneEditor" },
											{ label: "ユーザー画面でも", key: "UserWin", discription: `` },
										],
									},
								},
							},
							{
								path: "keyword",
								name: "keyword",
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: "キーワードの重み",
									icon: "edit",
									v1: {
										default: "KeywordEditor",
										tabs: [
											{
												label: "重み編集",
												key: "KeywordEditor",
												discription: `キーワードの重みを変更できます。<br>
                        編集の際は、まず「テスト環境に反映」をしてから「本番環境に反映」で本番環境に適用してください。<br>
                        以下にはテスト環境の内容が表示されています。<br>
                        `,
											},
										],
									},
									v2: {
										default: "KeywordShow",
										tabs: [
											{
												label: "テスト環境",
												key: "KeywordShowDev",
												discription: "テスト環境に適用されているキーワードの重みです。",
											},

											{
												label: "本番環境",
												key: "KeywordShow",
												discription: "本番環境に適用されているキーワードの重みです。",
											},
										],
									},
								},
							},
							// {
							// 	path: 'tags',
							// 	name: 'tags',
							// 	components: {
							// 		v1: Box,
							// 		v2: Box,
							// 	},
							// 	meta: {
							// 		title: 'タグ編集',
							// 		icon: 'edit',
							// 		v1: {
							// 			default: 'Tags',
							// 			tabs: [
							// 				{
							// 					label: 'タグ編集',
							// 					key: 'Tags',
							// 					discription: 'タグを修正できます',
							// 				},
							// 			],
							// 		},
							// 		v2: {
							// 			default: 'Tags',
							// 			tabs: [
							// 				// {
							// 				// 	label: "テスト環境",
							// 				// 	key: "KeywordShowDev",
							// 				// 	discription: "テスト環境に適用されているキーワードの重みです。",
							// 				// },

							// 				{
							// 					label: 'タグ編集',
							// 					key: 'Tags',
							// 					discription: 'タグを修正できます',
							// 				},
							// 			],
							// 		},
							// 	},
							// },
						],
					},

					{
						path: "index3",
						components: { default: Frame3 },
						redirect: "/script/index3",
						name: "script",
						meta: {
							title: "スクリプト",
							icon: "example",
							roles: [4, 5, 999],
						},
						children: [
							{
								path: "filesearch",
								name: "ファイルUP",
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: "メディア一覧",
									icon: "image",
									v1: {
										default: "MediaList",
										tabs: [{ label: "メディア一覧", key: "MediaList" }],
									},
								},
							},
						],
					},
				],
			},
			{
				path: "/botconfig",
				component: Layout,
				redirect: "/botconfig",
				name: "botconfig",
				meta: { title: "現状分析", icon: "bolt", roles: [4, 5, 999] },
				children: [
					{
						path: "index",
						component: Frame3,
						redirect: "/botconfig/index",
						name: "index",
						meta: {
							title: "botconfig",
							icon: "example",
							roles: [4, 5, 999],
						},
						children: [
							{
								path: "ticketanalyzer",
								name: "ticketanalyzer",
								components: {
									v1: Box,
								},
								meta: {
									title: "利用履歴",
									icon: "table",
									v1: {
										default: "TicketAnalyzer",
										tabs: [
											{
												label: "利用履歴",
												key: "TicketAnalyzer",
												discription: "検索ボタンを押すと利用履歴の集計結果をグラフなどで表示できます。",
											},
										],
									},
								},
							},
							{
								path: "scriptevaluation",
								name: "scriptevaluation",
								components: {
									v1: Box,
								},
								meta: {
									title: "精度検証",
									icon: "table",
									v1: {
										default: "ScriptEvaluation",
										tabs: [
											{
												label: "精度検証",
												key: "ScriptEvaluation",
												discription: "CSVファイルのA列に検索クエリ、B列にヒットさせたい質問文を記載してアップロードしてください",
											},
										],
									},
								},
							},
						],
					},
				],
			},
			{
				path: "/users/index",
				component: Layout,
				meta: {
					roles: [5, 999],
				},
				children: [
					{
						path: "/users/index",
						component: Layout,
						redirect: "/users/index/setting",
						name: "Accounts",
						meta: {
							title: "ユーザー管理",
							icon: "user",
							hidden: false,
						},
					},
				],
			},
			{
				path: "/users",
				component: Layout,
				meta: { hidden: true },
				children: [
					{
						path: "index",
						component: Frame3,
						redirect: "/users/index",
						name: "Accounts",
						meta: {
							title: "ユーザー管理",
							icon: "user",
							hidden: true,
						},
						children: [
							{
								name: "setting",
								path: "setting",
								components: {
									v1: Box,
								},
								meta: {
									title: "ユーザー管理",
									icon: "user",
									v1: {
										default: "AdminUser",
										tabs: [
											{
												label: "ユーザー一覧",
												key: "AdminUser",
												roles: [5, 999],
											},
											{ label: "新規追加", key: "AddUser", roles: [5, 999] },
										],
									},
								},
							},
						],
					},
				],
			},
			{
				path: "./account",
				component: Layout,
				meta: { isBottom: true, icon: "avatar" },
				children: [
					{
						path: "/account/index",
						component: Layout,
						redirect: "/account/index/setting",
						name: "Account",
						meta: { title: "アカウント設定", icon: "avatar", hidden: false },
					},
				],
			},
			{
				path: "/account",
				component: Layout,
				meta: {
					// isBottom: true ,
					hidden: true,
				},
				children: [
					{
						path: "index",
						component: Frame3,
						redirect: "/account/index",
						name: "Account",
						meta: {
							title: "アカウント設定",
							icon: "example",
							hidden: true,
						},
						children: [
							{
								name: "setting",
								path: "setting",
								components: {
									v1: Box,
								},
								meta: {
									title: "アカウント設定",
									icon: "table",
									v1: {
										default: "AdminUser",
										tabs: [
											{
												label: "アカウント情報",
												key: "AdminUser",
												roles: [4, 5, 999],
											},
											{
												label: "管理プロダクト一覧",
												key: "Productions",
												roles: [4, 5, 999],
											},
											{
												label: "パスワード変更",
												key: "Password",
												roles: [4, 5, 999],
											},
											// {
											// 	label: "容量情報",
											// 	key: "DataSizeInfo",
											// 	discription: "現在のFAQの容量を確認できます。",
											// 	roles: [4, 5, 999],
											// },
										],
									},
								},
							},
						],
					},
				],
			},
			{
				path: "*",
				redirect: "/404",
				meta: { hidden: true },
			},
		],
	};
}
export const conditionList: Array<Condition> = [
	{
		label: "ステータス",
		key: "status",
		checkList: [
			{ value: ["open"], label: "離脱", flg: false },
			// { value: "escalated", text: "直通" },
			{ value: ["answered"], label: "回答済み", flg: false },
			{ value: ["scriptNotFound"], label: "未収録", flg: false },
			{ value: ["searchFailed"], label: "検索失敗", flg: false },
			{ value: ["re-search"], label: "再検索", flg: false },
			// { value: "unsupported", text: "未対応" },
			{ value: ["quit"], label: "未完了", flg: false },
			// { value: ["open"], label: "離脱", flg: false },
			// { value: ["searchNoScript"], label: "未収録", flg: false },
			// { value: ["quit"], label: "未完了", flg: false },
			// { value: ["answering"], label: "回答閲覧中", flg: false },
			// {
			//   value: ["answered", "feedbackDone", "enqueteDone"],
			//   label: "回答閲覧済み",
			//   flg: false
			// }
			// { value: ["feedbackDone", "enqueteDone"], label: "完了", flg: false }
		],
	},
	// {
	//   label: "発行元",
	//   key: "origin",
	//   mapper(data: TicketData) {
	//     if ("origin" in data) {
	//       return String(data["origin"]);
	//     }
	//     return "window";
	//   },
	//   checkList: [
	//     { value: ["console"], label: "管理画面", flg: false },
	//     { value: ["window"], label: "ウィンドウ", flg: false }
	//   ]
	// }
];
const EnquateGet = (key: string, enquateKey: string) => (_enquate: EnquateTicket, ticket: any) => {
	const enquate: EnquateTicket = ticket[enquateKey];
	if (enquate) {
		const ENQUATE_VALUE = enquate[key];
		if (!Array.isArray(enquate) && typeof enquate === "object" && ENQUATE_VALUE) {
			if (ENQUATE_VALUE.type === "radio") {
				if (ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value.label;
				}
			} else if (ENQUATE_VALUE.type === "checkbox") {
				if (Array.isArray(ENQUATE_VALUE.value) && ENQUATE_VALUE.value.length > 0) {
					return ENQUATE_VALUE.value.map((e) => e.label).join(", ");
				}
			} else if (ENQUATE_VALUE.type === "textarea") {
				if (TicketGroup.noneSt !== ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value;
				}
			}
		}
	}
	return NoneString;
};
const EnquateMap = (key: string, enquateKey: string) => (_enquate: EnquateTicket, ticket: any) => {
	const enquate: EnquateTicket = ticket[enquateKey];
	if (enquate) {
		const ENQUATE_VALUE = enquate[key];
		if (!Array.isArray(enquate) && typeof enquate === "object" && ENQUATE_VALUE) {
			if (ENQUATE_VALUE.type === "radio") {
				if (ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value.label;
				}
			} else if (ENQUATE_VALUE.type === "checkbox") {
				if (Array.isArray(ENQUATE_VALUE.value)) {
					return ENQUATE_VALUE.value.map((e) => e.label);
				}
			} else if (ENQUATE_VALUE.type === "textarea") {
				if (TicketGroup.noneSt !== ENQUATE_VALUE.value) {
					return ENQUATE_VALUE.value;
				}
			}
		}
	}
	return TicketGroup.noneSt;
};
export const tableKeyList = [
	// {
	//   key: "mode",
	//   label: "応答モード",
	//   valueMapper: (value: string) => {
	//     const label: any = { bot: "BOT", operator: "有人" };
	//     return value && label[value];
	//   }
	// },
	// {
	//   key: "assignee",
	//   label: "対応者",
	//   valueMapper: (value: string) => {
	//     return value;
	//   }
	// },
	{
		key: "user_id",
		label: "ユーザーID",
		discription: "ユーザーのIDです",
		valueMapper: (value: string) => {
			return value;
		},
	},
	{
		key: "start_time",
		label: "開始日時",
		valid: (value: string) => {
			return !!String(value).match(/^\d+$/);
		},
		valueGetter: (value: string) => {
			return moment(parseInt(value, 10)).format("YYYY/MM/DD HH:mm:ss");
		},
	},
	{
		key: "end_time",
		label: "完了日時",
		valid: (value: string) => {
			return true; //! !String(value).match(/^\d+$/);
		},
		valueGetter: (value: string, ticketData: TicketData) => {
			let endTime = value;
			if (!String(endTime).match(/^\d+$/)) {
				endTime = String(ticketData.start_time);
			}
			return moment(parseInt(endTime, 10)).format("YYYY/MM/DD HH:mm:ss");
		},
	},
	{
		key: "duration",
		label: "対応時間",
		discription: "終了時間ー開始時間",
		valueMapper: (value: string, ticketData: TicketData) => {
			if (ticketData.status === "open") {
				return "-";
			}
			const startDate = String(ticketData.start_date || ticketData.start_time);
			let endDate = String(ticketData.end_date || ticketData.end_time || ticketData.start_date);
			if (!String(endDate).match(/^\d+$/)) {
				endDate = String(ticketData.start_time);
			}
			if (String(startDate).match(/^\d+$/) && String(endDate).match(/^\d+$/)) {
				const diff = parseInt(endDate, 10) - parseInt(startDate, 10);
				return String(diff);
				// const duration = moment.duration(diff);
				// let retStr = "";
				// if (retStr !== "" || duration.hours()) {
				//   retStr += duration.hours() + "時間";
				// }
				// if (retStr !== "" || duration.minutes()) {
				//   retStr += duration.minutes() + "分";
				// }
				// if (retStr !== "" || duration.seconds()) {
				//   retStr += duration.seconds() + "秒";
				// }
				// return retStr;
			}
			return "-";
		},
		valueGetter: (value: string) => {
			if (!/^\d+$/.test(value)) {
				return value;
			}
			const diff = parseInt(value);
			const duration = moment.duration(diff);
			let retStr = "";
			if (retStr !== "" || duration.hours()) {
				retStr += duration.hours() + "時間";
			}
			if (retStr !== "" || duration.minutes()) {
				retStr += duration.minutes() + "分";
			}
			if (retStr !== "" || duration.seconds()) {
				retStr += duration.seconds() + "秒";
			}
			return retStr;
		},
	},
	{
		key: "end_time",
		label: "年",
		valueGetter: (value: string, ticketData: TicketData) => {
			let endTime = value;
			if (!String(endTime).match(/^\d+$/)) {
				endTime = String(ticketData.start_time);
			}
			return moment(parseInt(endTime, 10)).format("YYYY");
		},
	},
	{
		key: "end_time",
		label: "月",
		valueGetter: (value: string, ticketData: TicketData) => {
			let endTime = value;
			if (!String(endTime).match(/^\d+$/)) {
				endTime = String(ticketData.start_time);
			}
			return moment(parseInt(endTime, 10)).format("MM");
		},
	},
	{
		key: "end_time",
		label: "日",
		valueGetter: (value: string, ticketData: TicketData) => {
			let endTime = value;
			if (!String(endTime).match(/^\d+$/)) {
				endTime = String(ticketData.start_time);
			}
			return moment(parseInt(endTime, 10)).format("DD");
		},
	},
	{
		key: "end_time",
		label: "曜日",
		valueGetter: (value: string, ticketData: TicketData) => {
			let endTime = value;
			if (!String(endTime).match(/^\d+$/)) {
				endTime = String(ticketData.start_time);
			}
			return moment(parseInt(endTime, 10)).format("dddd");
		},
	},
	// {
	//   key: "mail_address",
	//   label: "メールアドレス",
	//   valueMapper: (value: string) => {
	//     return value;
	//   }
	// },
	// {
	//   key: "device",
	//   label: "デバイス",
	//   valueMapper: (value: string) => {
	//     return value;
	//   }
	// },
	// {
	//   key: "os_name",
	//   label: "OS",
	//   valueMapper: (value: string) => {
	//     return value;
	//   }
	// },
	// {
	//   key: "browser_name",
	//   label: "ブラウザ",
	//   valueMapper: (value: string) => {
	//     return value;
	//   }
	// },
	// {
	//   key: "origin",
	//   label: "発行元",
	//   valid: (value: string) => {
	//     // if (value == undefined) {
	//     //   return false;
	//     // }
	//     // return /^.+$/.test(value);
	//     return true;
	//   },
	//   valueMapper: (value: "window" | "console") => {
	//     if (value === "console") {
	//       return "管理画面";
	//     }
	//     return "ウィンドウ";
	//     // const mapper = {
	//     //   window: "ウィンドウ",
	//     //   console: "管理画面"
	//     // };
	//     // return mapper[value] || value;
	//   }
	// },
	{
		key: "status",
		label: "ステータス",
		valueMapper: (value: string) => {
			const condition = conditionList.find((c) => c.key == "status");
			if (condition) {
				for (const check of condition.checkList) {
					if (check.value.indexOf(value) !== -1) {
						return check.label;
					}
				}
			}
			return value;
		},
	},
	// {
	//   key: "log_faq_channel",
	//   label: "検索方法",
	//   valueMapper: (value: string) => {
	//     return Array.isArray(value)
	//       ? value
	//           .map(v => {
	//             const mapper: { [key: string]: string } = {
	//               category: "カテゴリー選択",
	//               search: "検索",
	//               frequent: "よくある質問"
	//             };
	//             return mapper[v] || v;
	//           })
	//           .join(",")
	//       : value;
	//   }
	// },

	{
		key: "log_faq_parent_category",
		label: "親カテゴリ",
		valueMapper: (value: Array<string>) => {
			return Array.isArray(value) ? value[value.length - 1] : value;
		},
	},
	{
		key: "log_faq_child_category",
		label: "子カテゴリ",
		valueMapper: (value: Array<string>) => {
			return Array.isArray(value) ? value[value.length - 1] : value;
		},
	},
	{
		key: "log_faq",
		label: "FAQ番号",
		valueMapper: (value: Array<string>) => {
			return Array.isArray(value) ? value[value.length - 1] : value;
		},
	},
	{
		key: "log_faq_title",
		label: "FAQタイトル",
		valueMapper: (value: Array<string>) => {
			return Array.isArray(value) ? value[value.length - 1] : value;
		},
	},
	{
		key: "query",
		label: "ユーザー入力文字",
		valueMapper: (value: string) => {
			return value;
		},
	},
	{
		key: "results",
		label: "レコメンド結果",
		valueMapper: (value: string) => {
			return Array.isArray(value) ? value.join(",") : value;
		},
	},

	{
		key: "log_scenario",
		label: "シナリオログ",
		valueMapper: (value: Array<string>) => {
			return Array.isArray(value) ? value[value.length - 1] : value;
		},
	},
	{
		key: "feedback",
		label: "フィードバック",
		valueMapper: (value: string) => {
			switch (value) {
				case "resolved":
					return "解決";
				case "unresolved":
					return "未解決";
			}
			return TicketGroup.noneSt;
		},
		valueGetter: (value: string) => {
			if (value === "-") {
				return NoneString;
			}
			return value;
		},
	},
	// {
	//   key: "log_tag_id",
	//   label: "タグ番号",
	//   valueMapper: (value: Array<string>) => {
	//     return Array.isArray(value) ? value.join(",") : value;
	//   }
	// },
	// {
	//   key: "log_tag_name",
	//   label: "タグ表示名",
	//   valueMapper: (value: Array<string>) => {
	//     return Array.isArray(value) ? value.join(",") : value;
	//   }
	// },
	// {
	//   key: "enquete_resolved",
	//   label: "アンケート",
	//   valueGetter: (enquate: EnquateTicket) => {
	//     if (enquate && !Array.isArray(enquate) && typeof enquate === "object") {
	//       return Object.entries(enquate)
	//         .map(q => {
	//           const [key, value] = q;
	//           return `${value.label}:${JSON.stringify(value.value)}`;
	//         })
	//         .join("¥n");
	//     }
	//     return NoneString;
	//   }
	// },
	// {
	//   key: "enquete_unresolved",
	//   label: "アンケート",
	//   valueGetter: (enquate: EnquateTicket) => {
	//     if (enquate && !Array.isArray(enquate) && typeof enquate === "object") {
	//       return Object.entries(enquate)
	//         .map(q => {
	//           const [key, value] = q;
	//           return `${value.label}:${JSON.stringify(value.value)}`;
	//         })
	//         .join("¥n");
	//     }
	//     return "なし";
	//   }
	// },
	{
		key: "enquete_resolved_1",
		nativeKey: "enquete_resolved",
		label: "アンケート1",
		valueMapper: EnquateMap("1", "enquete_resolved"),
		valueGetter: (value: string) => {
			if (value === "-") {
				return NoneString;
			}
			return value;
		},
	},
	{
		key: "enquete_resolved_2",
		nativeKey: "enquete_resolved",
		label: "アンケート2",
		valueMapper: EnquateMap("2", "enquete_resolved"),
		valueGetter: EnquateGet("2", "enquete_resolved"),
	},

	{
		key: "enquete_resolved_3",
		nativeKey: "enquete_resolved",
		label: "アンケート3",
		valueMapper: EnquateMap("3", "enquete_resolved"),
		valueGetter: (value: string) => {
			if (value === "-") {
				return NoneString;
			}
			return value;
		},
	},
	// {
	//   key: "enquete_resolved_free_entry_field_kanjo",
	//   label: "アンケート3感情",
	//   valueMapper: (_enquate: EnquateTicket, ticket: any) => {
	//     const emotionMapper: { [key: string]: string } = {
	//       happy: "喜び",
	//       sad: "悲しみ",
	//       disgust: "不快",
	//       angry: "怒り",
	//       fear: "恐怖",
	//       surprise: "驚き"
	//     };
	//     const enquate: EnquateTicket = ticket.enquete_resolved;
	//     if (
	//       enquate &&
	//       !Array.isArray(enquate) &&
	//       typeof enquate === "object" &&
	//       enquate.free_entry_field &&
	//       enquate.free_entry_field.type === "textarea"
	//     ) {
	//       if (TicketGroup.noneSt !== enquate.free_entry_field.value) {
	//         const kanjo = Saiko.mindSync(enquate.free_entry_field.value);
	//         if (kanjo !== null) {
	//           const kanjoString = Saiko.KanjoStringto(kanjo, 40);
	//           console.log(kanjo);
	//           if (kanjoString && kanjoString in emotionMapper) {
	//             return emotionMapper[kanjoString];
	//           } else {
	//             return "該当なし";
	//           }
	//         }
	//       }
	//     }
	//     return NoneString;
	//   }
	// },
	{
		key: "enquete_unresolved_1",
		nativeKey: "enquete_unresolved",
		label: "目安箱1",
		valueMapper: EnquateMap("1", "enquete_unresolved"),
		valueGetter: EnquateGet("1", "enquete_unresolved"),
	},
	{
		key: "enquete_unresolved_2",
		nativeKey: "enquete_unresolved",
		label: "目安箱2",
		valueMapper: EnquateMap("2", "enquete_unresolved"),
		valueGetter: EnquateGet("2", "enquete_unresolved"),
	},
	{
		key: "enquete_unresolved_3",
		nativeKey: "enquete_unresolved",
		label: "目安箱3",
		valueMapper: EnquateMap("3", "enquete_unresolved"),
		valueGetter: EnquateGet("3", "enquete_unresolved"),
	},
	// {
	//   key: "enquete_unresolved_free_entry_field_kanjo",
	//   label: "目安箱3感情",
	//   valueMapper: (_enquate: EnquateTicket, ticket: any) => {
	//     const emotionMapper: { [key: string]: string } = {
	//       happy: "喜び",
	//       sad: "悲しみ",
	//       disgust: "不快",
	//       angry: "怒り",
	//       fear: "恐怖",
	//       surprise: "驚き"
	//     };
	//     const enquate: EnquateTicket = ticket.enquete_unresolved;
	//     if (
	//       enquate &&
	//       !Array.isArray(enquate) &&
	//       typeof enquate === "object" &&
	//       enquate.free_entry_field &&
	//       enquate.free_entry_field.type === "textarea"
	//     ) {
	//       if (TicketGroup.noneSt !== enquate.free_entry_field.value) {
	//         const kanjo = Saiko.mindSync(enquate.free_entry_field.value);
	//         if (kanjo !== null) {
	//           const kanjoString = Saiko.KanjoStringto(kanjo, 40);
	//           console.log(kanjo);
	//           if (kanjoString && kanjoString in emotionMapper) {
	//             return emotionMapper[kanjoString];
	//           } else {
	//             return "該当なし";
	//           }
	//         }
	//       }
	//     }
	//     return NoneString;
	//   }
	// },

	// {
	//   key: "memo",
	//   label: "メモ",
	//   valueMapper: (value: Array<string>) => {
	//     return Array.isArray(value) ? value.join(",") : "なし";
	//   }
	// }
];
export const updateServerParams: object = {};
