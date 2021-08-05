import faker from "faker";
import { Response, Request } from "express";
import { IPolicyData, IAPIResponce, IAdminData } from "../src/core/api/types";
import { getPolidyGroupListByAdminId } from "./admin_policy_groups";
import { getPolycyByPolicyGroupId } from "./polycyGroup_policy";
const policys: Array<IPolicyData> = [
	{
		"id": 1,
		"label": "adminのリスト取得",
		"method": "get",
		"url": "/api/admin/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 2,
		"label": "adminの作成",
		"method": "post",
		"url": "/api/admin/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 3,
		"label": "adminの詳細",
		"method": "get",
		"url": "/api/admin/{admin_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 4,
		"label": "adminの編集",
		"method": "patch",
		"url": "/api/admin/{admin_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 5,
		"label": "adminのパスワード変更",
		"method": "post",
		"url": "/api/admin/{admin_id}/password/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 6,
		"label": "adminの有効化",
		"method": "post",
		"url": "/api/admin/enabled/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 7,
		"label": "adminの無効化",
		"method": "post",
		"url": "/api/admin/disabled/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 8,
		"label": "adminのログインロック解錠",
		"method": "post",
		"url": "/api/admin/unlock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 9,
		"label": "adminのポリシーグループリスト取得",
		"method": "get",
		"url": "/api/admin/{admin_id}/policy_group/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 10,
		"label": "adminのポリシーグループ変更",
		"method": "post",
		"url": "/api/admin/{admin_id}/policy_group/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 11,
		"label": "adminのproduct取得",
		"method": "get",
		"url": "/api/admin/{admin_id}/product/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 12,
		"label": "adminのproduct更新（追加・削除）",
		"method": "post",
		"url": "/api/admin/{admin_id}/product/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 13,
		"label": "adminのメール認証（アカウント作成）",
		"method": "get",
		"url": "/api/admin/enabled/{hash}",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 14,
		"label": "adminにメール転送（パスワード紛失）",
		"method": "post",
		"url": "/api/admin/reset-password/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 15,
		"label": "adminのメール認証（パスワード紛失）",
		"method": "post",
		"url": "/api/admin/reset-password/{hash}",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 16,
		"label": "adminのログイントークン確認",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 17,
		"label": "adminのログイン",
		"method": "post",
		"url": "/api/admin/login/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 18,
		"label": "adminのログアウト",
		"method": "post",
		"url": "/api/admin/logout/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 19,
		"label": "プロダクションのリスト取得",
		"method": "get",
		"url": "/api/product/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 20,
		"label": "プロダクションの作成",
		"method": "post",
		"url": "/api/product/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 21,
		"label": "プロダクションの詳細",
		"method": "get",
		"url": "/api/product/{product_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 22,
		"label": "プロダクションの編集",
		"method": "patch",
		"url": "/api/product/{product_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 23,
		"label": "プロダクションの削除",
		"method": "delete",
		"url": "/api/product/{product_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 24,
		"label": "ロールのリスト取得",
		"method": "get",
		"url": "/api/role/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 25,
		"label": "ロールの作成",
		"method": "post",
		"url": "/api/role/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 26,
		"label": "ロールの詳細",
		"method": "get",
		"url": "/api/role/{role_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 27,
		"label": "ロールの編集",
		"method": "patch",
		"url": "/api/role/{role_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 28,
		"label": "ロールの削除",
		"method": "delete",
		"url": "/api/role/{role_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 29,
		"label": "ロールのカテゴリリスト取得",
		"method": "get",
		"url": "/api/role/{role_id}/category",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 30,
		"label": "ロールの質問リスト取得",
		"method": "get",
		"url": "/api/role/{role_id}/question",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 31,
		"label": "バリデートの検索",
		"method": "get",
		"url": "/api/validation/search/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 32,
		"label": "バリデートの詳細",
		"method": "get",
		"url": "/api/validation/{validation_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 33,
		"label": "バリデートの編集",
		"method": "patch",
		"url": "/api/validation/{validation_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 34,
		"label": "カテゴリのリスト取得",
		"method": "get",
		"url": "/api/category/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 35,
		"label": "カテゴリの作成",
		"method": "post",
		"url": "/api/category/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 36,
		"label": "カテゴリの詳細",
		"method": "get",
		"url": "/api/category/{category_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 37,
		"label": "カテゴリの編集",
		"method": "patch",
		"url": "/api/category/{category_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 38,
		"label": "カテゴリの削除",
		"method": "delete",
		"url": "/api/category/{category_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 39,
		"label": "カテゴリの編集（一括）",
		"method": "post",
		"url": "/api/category/edit/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 40,
		"label": "カテゴリの削除（一括）",
		"method": "post",
		"url": "/api/category/delete/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 41,
		"label": "カテゴリのオーダーの変更",
		"method": "post",
		"url": "/api/product/{product_id}/category/order/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 42,
		"label": "カテゴリの施錠",
		"method": "post",
		"url": "/api/category/lock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 43,
		"label": "カテゴリの解錠",
		"method": "post",
		"url": "/api/category/unlock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 44,
		"label": "カテゴリのリスト取得（フロント用）",
		"method": "get",
		"url": "/api/product/{product_id}/category/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 45,
		"label": "カテゴリの詳細（フロント用）",
		"method": "get",
		"url": "/api/product/{product_id}/category/{category_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 46,
		"label": "カテゴリとロールの取得",
		"method": "get",
		"url": "/api/category/{category_id}/role",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 47,
		"label": "カテゴリとロールの更新（追加・削除）",
		"method": "post",
		"url": "/api/category/{category_id}/role",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 48,
		"label": "ポリシーのリスト取得",
		"method": "get",
		"url": "/api/policy/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 49,
		"label": "ポリシーの詳細",
		"method": "get",
		"url": "/api/policy/{policy_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 50,
		"label": "ポリシーの編集",
		"method": "patch",
		"url": "/api/policy/{policy_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 51,
		"label": "ポリシーグループのリスト取得",
		"method": "get",
		"url": "/api/policy_group/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 52,
		"label": "ポリシーグループの作成",
		"method": "post",
		"url": "/api/policy_group/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 53,
		"label": "ポリシーグループの詳細",
		"method": "get",
		"url": "/api/policy_group/{policy_group_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 54,
		"label": "ポリシーグループの編集",
		"method": "patch",
		"url": "/api/policy_group/{policy_group_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 55,
		"label": "ポリシーグループの削除",
		"method": "delete",
		"url": "/api/policy_group/{policy_group_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 56,
		"label": "ポリシーグループとポリシーの取得",
		"method": "get",
		"url": "/api/policy_group/{policy_group_id}/policy",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 57,
		"label": "ポリシーグループとポリシーの更新（追加・削除）",
		"method": "post",
		"url": "/api/policy_group/{policy_group_id}/policy",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 58,
		"label": "userのリスト取得",
		"method": "get",
		"url": "/api/user/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 59,
		"label": "userの作成",
		"method": "post",
		"url": "/api/user/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 60,
		"label": "userの詳細",
		"method": "get",
		"url": "/api/user/{user_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 61,
		"label": "userの編集",
		"method": "patch",
		"url": "/api/user/{user_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 62,
		"label": "userの有効化",
		"method": "patch",
		"url": "/api/user/{user_id}/enabled/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 63,
		"label": "userの無効化",
		"method": "patch",
		"url": "/api/user/{user_id}/disabled/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 64,
		"label": "userのログイン解錠",
		"method": "patch",
		"url": "/api/user/unlock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 65,
		"label": "userの条件リスト取得",
		"method": "get",
		"url": "/api/user/{user_id}/condiion/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 66,
		"label": "userの条件変更",
		"method": "post",
		"url": "/api/user/{user_id}/condiion/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 67,
		"label": "userのロールリスト取得",
		"method": "get",
		"url": "/api/user/{user_id}/role/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 68,
		"label": "userのロール変更",
		"method": "post",
		"url": "/api/user/{user_id}/role/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 69,
		"label": "userのproduct取得",
		"method": "get",
		"url": "/api/user/{user_id}/product/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 70,
		"label": "userのproduct更新（追加・削除）",
		"method": "post",
		"url": "/api/user/{user_id}/product/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 71,
		"label": "userの登録（フロント用）- userが入力",
		"method": "post",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 72,
		"label": "userの登録（フロント用）- 自動生成",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 73,
		"label": "userの詳細（フロント用）",
		"method": "get",
		"url": "/api/product/{product_id}/user/{user_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 74,
		"label": "userの編集（フロント用）",
		"method": "patch",
		"url": "/api/product/{product_id}/user/{user_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 75,
		"label": "userのパスワード変更（フロント用）",
		"method": "patch",
		"url": "/api/product/{product_id}/product/{product_id}/user/{user_id}/password/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 76,
		"label": "userのメール認証（アカウント作成）",
		"method": "get",
		"url": "/api/product/{product_id}/user/enabled/{hash}",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 77,
		"label": "userにメール転送（パスワード紛失）",
		"method": "post",
		"url": "/api/product/{product_id}/user/reset-password/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 78,
		"label": "userのメール認証（パスワード紛失）",
		"method": "post",
		"url": "/api/product/{product_id}/user/reset-password/{hash}",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 79,
		"label": "userのログイントークン確認",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 80,
		"label": "userのログイン",
		"method": "post",
		"url": "/api/product/{product_id}/user/login/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 81,
		"label": "userのログアウト",
		"method": "post",
		"url": "/api/product/{product_id}/user/logout/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 82,
		"label": "キーワードリスト取得",
		"method": "get",
		"url": "/api/keyword/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 83,
		"label": "キーワード作成",
		"method": "post",
		"url": "/api/keyword/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 84,
		"label": "キーワード編集",
		"method": "patch",
		"url": "/api/keyword/{keyword_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 85,
		"label": "キーワード削除",
		"method": "delete",
		"url": "/api/keyword/{keyword_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 86,
		"label": "キーワード編集（一括）",
		"method": "post",
		"url": "/api/keyword/edit/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 87,
		"label": "キーワード削除（一括）",
		"method": "post",
		"url": "/api/keyword/delete/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 88,
		"label": "条件グループのリスト取得",
		"method": "get",
		"url": "/api/condition_group/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 89,
		"label": "条件グループの作成",
		"method": "post",
		"url": "/api/condition_group/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 90,
		"label": "条件グループの詳細",
		"method": "get",
		"url": "/api/condition_group/{condition_group_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 91,
		"label": "条件グループの編集",
		"method": "post",
		"url": "/api/condition_group/{condition_group_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 92,
		"label": "条件グループの削除",
		"method": "delete",
		"url": "/api/condition_group/{condition_group_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 93,
		"label": "条件のリスト取得",
		"method": "get",
		"url": "/api/condition/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 94,
		"label": "条件の作成",
		"method": "post",
		"url": "/api/condition/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 95,
		"label": "条件の詳細",
		"method": "get",
		"url": "/api/condition/{condition_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 96,
		"label": "条件の編集",
		"method": "patch",
		"url": "/api/condition/{condition_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 97,
		"label": "条件の削除",
		"method": "delete",
		"url": "/api/condition/{condition_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 98,
		"label": "質問のリスト取得",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 99,
		"label": "質問の作成",
		"method": "post",
		"url": "/api/question/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 100,
		"label": "質問の詳細",
		"method": "get",
		"url": "/api/question/{question_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 101,
		"label": "質問の編集",
		"method": "patch",
		"url": "/api/question/{question_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 102,
		"label": "質問の削除",
		"method": "delete",
		"url": "/api/question/{question_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 103,
		"label": "質問の編集（一括）",
		"method": "post",
		"url": "/api/question/edit/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 104,
		"label": "質問の削除（一括）",
		"method": "post",
		"url": "/api/question/delete/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 105,
		"label": "質問とプロダクトの取得",
		"method": "get",
		"url": "/api/question/{question_id}/product",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 106,
		"label": "質問とプロダクトの更新（追加・削除）",
		"method": "post",
		"url": "/api/question/{question_id}/product",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 107,
		"label": "質問とカテゴリの取得",
		"method": "get",
		"url": "/api/question/{question_id}/category",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 108,
		"label": "質問とカテゴリの更新（追加・削除）",
		"method": "post",
		"url": "/api/question/{question_id}/category",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 109,
		"label": "質問とキーワードの取得",
		"method": "get",
		"url": "/api/question/{question_id}/keyword",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 110,
		"label": "質問とキーワードの更新（追加・削除）",
		"method": "post",
		"url": "/api/question/{question_id}/keyword",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 111,
		"label": "質問とロールの取得",
		"method": "get",
		"url": "/api/question/{question_id}/role",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 112,
		"label": "質問とロールの更新（追加・削除）",
		"method": "post",
		"url": "/api/question/{question_id}/role",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 113,
		"label": "質問の施錠",
		"method": "post",
		"url": "/api/question/lock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 114,
		"label": "質問の解錠",
		"method": "post",
		"url": "/api/question/unlock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 115,
		"label": "質問の履歴リスト取得",
		"method": "get",
		"url": "/api/question/history/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 116,
		"label": "質問の詳細（フロント用）",
		"method": "get",
		"url": "/api/product/{product_id}/question/{question_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 117,
		"label": "よくある質問リスト取得",
		"method": "get",
		"url": "/api/question/faq/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 118,
		"label": "よくある質問追加",
		"method": "post",
		"url": "/api/question/faq/add/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 119,
		"label": "よくある質問削除",
		"method": "post",
		"url": "/api/question/faq/delete/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 120,
		"label": "よくある質問オーダーの変更",
		"method": "post",
		"url": "/api/question/faq/order/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 121,
		"label": "よくある質問リスト取得（フロント用）",
		"method": "get",
		"url": "/api/product/{product_id}/question/faq/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 122,
		"label": "答えのリスト取得",
		"method": "get",
		"url": "/api/question/{question_id}/answer/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 123,
		"label": "答えの作成",
		"method": "post",
		"url": "/api/question/{question_id}/answer/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 124,
		"label": "答えの詳細",
		"method": "get",
		"url": "/api/question/{question_id}/answer/{answer_id}",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 125,
		"label": "答えの編集",
		"method": "patch",
		"url": "/api/question/{question_id}/answer/{answer_id}",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 126,
		"label": "答えの削除",
		"method": "delete",
		"url": "/api/question/{question_id}/answer/{answer_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 127,
		"label": "答えの施錠",
		"method": "post",
		"url": "/api/question/{question_id}/answer/lock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 128,
		"label": "答えの解錠",
		"method": "post",
		"url": "/api/question/{question_id}/answer/unlock/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 129,
		"label": "答えとプロダクトの取得",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 130,
		"label": "答えとプロダクトの更新（追加・削除）",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 131,
		"label": "答えと条件の取得",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 132,
		"label": "答えと条件の更新（追加・削除）",
		"method": "",
		"url": "",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 133,
		"label": "答えの履歴リスト取得",
		"method": "get",
		"url": "/api/answer/history/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 134,
		"label": "答えの詳細（フロント用）",
		"method": "get",
		"url": "/api/product/{product_id}/answer/{answer_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 135,
		"label": "メディアのリスト取得",
		"method": "get",
		"url": "/api/media/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 136,
		"label": "メディアの追加",
		"method": "post",
		"url": "/api/media/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 137,
		"label": "メディアの詳細",
		"method": "get",
		"url": "/api/media/{media_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 138,
		"label": "メディアの編集",
		"method": "patch",
		"url": "/api/media/{media_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 139,
		"label": "メディアの削除",
		"method": "delete",
		"url": "/api/media/{media_id}/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 140,
		"label": "メディアの編集（一括）",
		"method": "post",
		"url": "/api/media/edit/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 141,
		"label": "メディアの削除（一括）",
		"method": "post",
		"url": "/api/media/delete/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 142,
		"label": "ログの検索",
		"method": "get",
		"url": "/api/log/search/",
		"description": "-",
		"is_active": 1
	},
	{
		"id": 143,
		"label": "テキスト検索",
		"method": "get",
		"url": "/api/search/",
		"description": "-",
		"is_active": 1
	}
];
export const getPolicyList = (req: Request, res: IAPIResponce): Response => {
	const { parent_id } = req.query;

	return res.json({
		status: 20000,
		data: [...policys],
	});
};
export const getPolicyListByAdmin = (admin:IAdminData)=>{
	const policyGroupIdList = getPolidyGroupListByAdminId(admin.id);
	const policyIdSet = new Set();
	for(const policyGroupId of policyGroupIdList){
		const policyList = getPolycyByPolicyGroupId(policyGroupId);
		for(const policyId of policyList){
			policyIdSet.add(policyId);
		}
	}
	return policys.filter(p=>policyIdSet.has(p.id));
}
