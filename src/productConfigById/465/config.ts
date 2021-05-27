import Vue from 'vue';
import { RouterOptions } from 'vue-router';
import Frame1 from '@/frames/b_1.vue';
import Frame2 from '@/frames/b_2.vue';
import Frame3 from '@/frames/b_3.vue';
import Frame4 from '@/frames/b_4.vue';
import Frame5 from '@/frames/b_5.vue';
import Frame6 from '@/frames/b_6.vue';
import Frame7 from '@/frames/b_7.vue';
import { EditModule } from '@/store/modules/edit';
import { component, VueConstructor } from 'vue/types/umd';
import { UpdateFlowItem } from '@/components/UploadModal/index.i';
export const MaxFaqFile = 500;
export const MaxFaqSize = 500;
export const WindowPageUrl: string = process.env.PRODUCT_WINDOW_URL||'https://service.ai-x-supporter-dev.com/chat_demo2/';
export const WindowTestPageUrl: string = '';
export const imageList: Array<UpdateFlowItem> = [
	{
		src: './img/uploadmodal/0.png',
		flow: new Set(['save']),
		discription: 'default',
		active: false,
		hidden: true,
	},
	{
		src: './img/uploadmodal/1.webp',
		flow: new Set(['save']),
		discription: '保存',
		active: false,
	},
	{
		src: './img/uploadmodal/2.webp',
		flow: new Set(['save', 'test']),
		discription: '保存してテスト環境に反映',
		active: false,
		disable: true,
	},
	{
		src: './img/uploadmodal/3.webp',
		flow: new Set(['save', 'prod']),
		discription: '保存して本番環境に反映',
		active: false,
	},
	{
		src: './img/uploadmodal/4.webp',
		flow: new Set(['test']),
		discription: 'テスト環境に反映',
		active: false,
		disable: true,
	},
	{
		src: './img/uploadmodal/5.webp',
		flow: new Set(['prod']),
		discription: '本番環境に反映',
		active: false,
	},
	{
		src: './img/uploadmodal/6.webp',
		flow: new Set(['save', 'test', 'prod']),
		discription: '保存してテスト環境と本番環境に反映',
		active: false,
		disable: true,
	},
];

export const UploadModalDiscription = `
	<p>テスト環境、本番環境への反映方法：</p>
	<p>1. 「保存」を選択し、管理画面の変更内容をサーバーに保存してください。</p>
	<p>2. 「テスト環境に反映」あるいは「本番環境に反映」を選択してください。サーバーに保存されているボット表示設定とFAQ設定の内容が選択した環境に反映されます。</p>
	<p>※「保存して〇〇環境に反映」を選択すると保存と反映が同時に行われます。</p>
`;
export const KeywordEditorButtons: Array<string> = [
	// "test",
	// "prod",
	'all',
];

export function RouterConfig(Layout: VueConstructor<Vue>, Box: VueConstructor<Vue>): RouterOptions {
	return {
		mode: 'hash',
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
				path: '/login',
				component: () => import(/* webpackChunkName: "login" */ 'views/login/index.vue'),
				meta: {
					hidden: true,
				},
			},
			{
				path: '/404',
				component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
				meta: { hidden: true },
			},
			{
				path: '/',
				component: Layout,
				redirect: '/index/dashboardtop',
				name: 'Dashboard',
				meta: { title: 'TOP', icon: 'home', hidden: true },
				children: [
					{
						path: 'index',
						component: Frame3,
						redirect: '/index/dashboardtop',
						name: 'dashboard',
						meta: {
							title: 'ダッシュボード',
							icon: 'example',
							roles: [0, 1, 2, 3, 4, 5, 6, 999],
						},
						children: [
							{
								path: 'accountsetting',
								name: 'accountsetting',
								components: {
									v1: Box,
								},
								meta: {
									title: 'アカウント設定',
									icon: 'table',
									v1: {
										default: 'Dashboard',
										tabs: [
											{
												label: 'TOP',
												key: 'Dashboard',
												roles: [0, 1, 2, 3, 4, 5, 6, 999],
											},
											{
												label: 'パスワード変更',
												key: 'Password',
												roles: [0, 1, 2, 3, 4, 5, 6, 999],
											},
											{
												label: 'アカウントリスト',
												key: 'AdminUser',
												roles: [5, 6, 999],
											},
											{
												label: 'お知らせ',
												key: 'Oshirase',
												roles: [4, 5, 6],
												discription: '管理画面のヘッダーに表示する文言を指定できます。',
											},
										],
									},
								},
							},
							{
								path: 'dashboardtop',
								name: 'dashboard',
								components: {
									v1: Box,
								},
								meta: {
									title: 'ダッシュボード',
									icon: 'table',
									v1: {
										default: 'Dashboard',
										tabs: [
											{
												label: 'TOP',
												key: 'Dashboard',
												roles: [0, 1, 2, 3, 4, 5, 6, 999],
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
						path: 'dashboard',
						redirect: '/index/dashboardtop',
						component: () => import('views/dashboard/index.vue'),
					},
					{
						path: 'pass',
						component: () => import('views/dashboard/index.vue'),
					},
				],
			},
			{
				path: './',
				component: Layout,
				children: [
					{
						path: 'index',
						component: Layout,
						redirect: '/index/dashboardtop',
						name: 'Dashboard',
						meta: { title: 'TOP', icon: 'home', hidden: false },
					},
				],
			},
			{
				path: '/setting',
				component: Layout,
				redirect: '/setting',
				name: 'setting',
				meta: { title: '基本設定', icon: 'cog', roles: [4, 5, 6, 999] },
				children: [
					{
						path: 'index',
						component: Frame6,
						redirect: '/setting/index',
						name: 'index',
						meta: {
							title: 'setting',
							icon: 'cog',
							roles: [4, 5, 6, 999],
						},
						children: [
							{
								path: 'botmessageconfig',
								name: 'botmessageconfig',
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: 'ボット表示設定',
									icon: 'table',
									confirmation: {
										is: true,
										message: '「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。本当に編集終了しますか？',
										after: () => {
											EditModule.editUnlock();
										},
									},
									v1: {
										default: 'DefaultChatMessage',
										tabs: [
											{
												label: 'ボット表示設定',
												key: 'DefaultChatMessage',
												tabtype: 'dev',
												discription: 'ボットに表示される文言を編集できます。<br>保存して反映するには「反映ステップに進む」を選択してください。',
											},
										],
									},
									v2: {
										default: 'DefaultChatMessageProd',
										tabs: [
											// {
											// 	label: "テスト環境",
											// 	key: "DefaultChatMessageTest",
											// 	component: "DefaultChatMessage",
											// 	tabtype: "test",
											// 	discription:
											// 		"テスト環境で表示されている文言です",
											// },
											{
												label: '本番環境',
												key: 'DefaultChatMessageProd',
												component: 'DefaultChatMessage',
												tabtype: 'prod',
												discription: '本番環境で表示されている文言です。',
											},
											// {
											// 	label: "テスト環境",
											// 	key: "BotMessageConfigDevelopPreviewer",
											// 	discription: "テスト環境で表示されている文言です。",
											// },
											// {
											// 	label: "本番環境",
											// 	key: "BotMessageConfigMasterPreviewer",
											// 	discription: "本番環境で表示されている文言です。",
											// },
										],
									},
								},
							},
						],
					},
					{
						path: 'index2',
						component: Frame3,
						redirect: '/setting/index2',
						name: 'index2',
						meta: {
							title: 'setting',
							icon: 'cog',
							roles: [4, 5, 6, 999],
						},
						children: [
							{
								path: 'consoleconfig',
								name: 'consoleconfig',
								components: {
									v1: Box,
								},
								meta: {
									title: '管理画面設定',
									icon: 'table',
									v1: {
										default: 'Oshirase',
										tabs: [
											{
												label: 'お知らせ設定',
												key: 'Oshirase',
												discription: '管理画面のヘッダーに、お知らせやリンクを設定できます。',
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
				path: '/script',
				component: Layout,
				redirect: '/script',
				name: 'script',
				meta: {
					title: 'FAQ設定',
					icon: 'script',
					roles: [0, 1, 2, 3, 4, 5, 6, 999],
				},
				children: [
					{
						path: 'index2',
						components: { default: Frame7 },
						redirect: '/script/index2',
						name: 'script',
						meta: {
							title: 'スクリプト',
							icon: 'example',
							roles: [4, 5, 6, 999],
						},
						children: [
							{
								path: 'scenarioedit',
								name: 'scenarioedit',
								components: {
									v1: Box,
									v2: Box,
									main: Frame3,
								},
								meta: {
									title: 'CSV編集',
									icon: 'edit',
									confirmation: {
										is: true,
										message: '「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。本当に編集終了しますか？',
										after: () => {
											EditModule.editUnlock();
										},
									},
									v1: {
										default: 'AllInOneCsvDownload',
										tabs: [{ label: 'CSVダウンロード', key: 'AllInOneCsvDownload' }],
									},
									v2: {
										default: 'AllInOneCsv',
										tabs: [{ label: 'CSVアップロード', key: 'AllInOneCsv' }],
									},
								},
							},
						],
					},
					{
						path: 'index4',
						components: { default: Frame6 },
						redirect: '/script/index4',
						name: 'script',
						meta: {
							title: 'スクリプト',
							icon: 'example',
							roles: [4, 5, 6, 999],
						},
						children: [
							{
								path: 'scriptedit',
								name: 'scriptedit',
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: '直接編集',
									icon: 'edit',
									confirmation: {
										is: true,
										message: '「反映ステップに進む」から内容を保存しないまま編集終了すると変更内容が失われます。本当に編集終了しますか？',
										after: () => {
											EditModule.editUnlock();
										},
									},
									v1: {
										default: 'Talkscript',
										tabs: [
                      { label: 'FAQ一覧', key: 'Talkscript' },
                      { label: 'FAQ検索', key: 'ScriptSearch' }
                    ],
									},
									v2: {
										default: 'AllInOneEditor',
										tabs: [{ label: 'FAQ編集', key: 'AllInOneEditor' }],
									},
								},
							},
							{
								path: 'medialist',
								name: 'medialist',
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: 'キーワードの重み',
									icon: 'edit',
									v1: {
										default: 'KeywordEditor',
										tabs: [
											{
												label: '重み編集',
												key: 'KeywordEditor',
												discription: 'キーワードの重みを変更できます。<br>編集を終えて適用するには「本番環境に反映」を選択してください。',
											},
										],
									},
									v2: {
										default: 'KeywordShow',
										tabs: [
											// {
											// 	label: "テスト環境",
											// 	key: "KeywordShowDev",
											// 	discription: "テスト環境に適用されているキーワードの重みです。",
											// },

											{
												label: '本番環境',
												key: 'KeywordShow',
												discription: '本番環境に適用されているキーワードの重みです。',
											},
										],
									},
								},
							},
						],
					},
					{
						path: 'index3',
						components: { default: Frame3 },
						redirect: '/script/index3',
						name: 'script',
						meta: {
							title: 'スクリプト',
							icon: 'example',
							roles: [4, 5, 6, 999],
						},
						children: [
							{
								path: 'filesearch',
								name: 'ファイルUP',
								components: {
									v1: Box,
									v2: Box,
								},
								meta: {
									title: 'メディア一覧',
									icon: 'image',
									v1: {
										default: 'MediaList',
										tabs: [{ label: 'メディア一覧', key: 'MediaList' }],
									},
								},
							},
						],
					},
				],
			},
			{
				path: '/botconfig',
				component: Layout,
				redirect: '/botconfig',
				name: 'botconfig',
				meta: { title: '現状分析', icon: 'bolt', roles: [4, 5, 6, 999] },
				children: [
					{
						path: 'index',
						component: Frame3,
						redirect: '/botconfig/index',
						name: 'index',
						meta: {
							title: 'botconfig',
							icon: 'example',
							roles: [4, 5, 6, 999],
						},
						children: [
							{
								path: 'ticketanalyzer',
								name: 'ticketanalyzer',
								components: {
									v1: Box,
								},
								meta: {
									title: '利用履歴',
									icon: 'table',
									v1: {
										default: 'TicketDownload',
										tabs: [
                      // {
											// 	label: '利用履歴',
											// 	key: 'TicketAnalyzer,
											// 	discription: '検索ボタンを押すと利用履歴の集計結果をグラフなどで表示できます。',
											// },
											{
												label: '利用履歴',
												key: 'TicketDownload',
												discription: 'CSVファイルがダウンロードできます。',
											},
										],
									},
								},
							},
							{
								path: 'scriptevaluation',
								name: 'scriptevaluation',
								components: {
									v1: Box,
								},
								meta: {
									title: '精度検証',
									icon: 'table',
									v1: {
										default: 'ScriptEvaluation',
										tabs: [
											{
												label: '精度検証',
												key: 'ScriptEvaluation',
												discription: 'CSVファイルのA列に検索クエリ、B列にヒットさせたい質問文を記載してアップロードしてください',
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
				path: '/users/index',
				component: Layout,
				meta: {
					roles: [5, 6, 999],
				},
				children: [
					{
						path: '/users/index',
						component: Layout,
						redirect: '/users/index/setting',
						name: 'Accounts',
						meta: {
							title: 'ユーザー管理',
							icon: 'user',
							hidden: false,
						},
					},
				],
			},
			{
				path: '/users',
				component: Layout,
				meta: { hidden: true },
				children: [
					{
						path: 'index',
						component: Frame3,
						redirect: '/users/index',
						name: 'Accounts',
						meta: {
							title: 'ユーザー管理',
							icon: 'user',
							hidden: true,
						},
						children: [
							{
								name: 'setting',
								path: 'setting',
								components: {
									v1: Box,
								},
								meta: {
									title: 'ユーザー管理',
									icon: 'user',
									v1: {
										default: 'AdminUser',
										tabs: [
											{
												label: 'ユーザー一覧',
												key: 'AdminUser',
												roles: [5, 6, 999],
											},
											{ label: '新規追加', key: 'AddUser', roles: [5, 6, 999] },
										],
									},
								},
							},
						],
					},
				],
			},
			{
				path: './account',
				component: Layout,
				meta: { isBottom: true, icon: 'avatar' },
				children: [
					{
						path: '/account/index',
						component: Layout,
						redirect: '/account/index/setting',
						name: 'Account',
						meta: { title: 'アカウント設定', icon: 'avatar', hidden: false },
					},
				],
			},
			{
				path: '/account',
				component: Layout,
				meta: {
					// isBottom: true ,
					hidden: true,
				},
				children: [
					{
						path: 'index',
						component: Frame3,
						redirect: '/account/index',
						name: 'Account',
						meta: {
							title: 'アカウント設定',
							icon: 'example',
							hidden: true,
						},
						children: [
							{
								name: 'setting',
								path: 'setting',
								components: {
									v1: Box,
								},
								meta: {
									title: 'アカウント設定',
									icon: 'table',
									v1: {
										default: 'AccountInfo',
										tabs: [
											{
												label: 'アカウント情報',
												key: 'AccountInfo',
												roles: [0, 1, 2, 3, 4, 5, 6, 999],
											},
											{
												label: 'パスワード変更',
												key: 'Password',
												roles: [0, 1, 2, 3, 4, 5, 6, 999],
											},
											{
												label: "容量情報",
												key: "Capacity",
												discription: "現在のFAQの容量を確認できます。",
												roles: [0, 1, 2, 3, 4, 5, 6, 999],
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
				path: '*',
				redirect: '/404',
				meta: { hidden: true },
			},
		],
	};
}
