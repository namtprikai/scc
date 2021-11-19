import { Response, Request } from "express";
export interface ISAISystemAPI{
	is_error:boolean;
	message:string;
	type:"Object"|"Array";
	data:Object|Array;
}
export interface ISAIAPIData {
	id: number;
	created?: Date;
	modified?: Date;
}
export interface ICrossReferenceTable extends ISAIAPIData {
	[key: string]: number;
}
export interface IAPIResponce extends Response {
	json: (args: ISAISystemAPI) => any;
}
export interface IRoleData extends ISAIAPIData {
	[key: any]: any;
	label: string;
}
/**
	* productsテーブル
	*/
export interface IProductData extends ISAIAPIData {
	name: string;
	config: any;
	max_failure_count_user: number;
	max_failure_time_user: number;
}
export type IPartialProductData = {
	[P in keyof IProductData]?:IProductData[P];
}
export interface ILook extends ISAIAPIData {
	admin_id: number;
	table_name: string;
	table_id: number;
	lock_time: Date;
}
export interface IConditionGroupData extends ISAIAPIData {
	id: number;
	level: number;
	is_setting: boolean;
	label: string;
}
export interface IConditionData extends ISAIAPIData {
	id: number;
	conditiongroup_id: number;
	label: string;
}
export interface IUserData extends ISAIAPIData {
	password?: string;
	name: string;
	email: string;
	config?: any;
	is_mailauth_completed?: boolean;
	is_enabled?: boolean;
	is_lock?: boolean;
}
export type IPartialUserData = {
	[P in keyof IUserData]?:IUserData[P];
}
export interface IAdminData extends ISAIAPIData {
	id: number;
	name: string;
	password: string;
	email: string;
	config?: any;
	is_mailauth_completed?: boolean;
	is_master: boolean;
	is_enabled: boolean;
	is_lock: boolean;
	product_id?:Array<number>;
	created?: Date;
	modified?: Date;
}
export interface IAdminDataLocal extends IAdminData{
	editProducts:Array<number>;
}
export type IPartialAdminData = {
	[P in keyof IAdminData]?:IAdminData[P];
}
export interface IConditionMap extends Map<number, { conditionGroup: IConditionGroupData; conditions: Array<IConditionData> }> { }
export type IConditionObj = {
	[key: number]: {
		conditionGroup: IConditionGroupData;
		conditions: Array<IConditionData>;
	};
};
export interface IAdmin {
	id: number;
	name: string;
	email: string;
	role: Set<number>;
	is_master?: boolean;
	token: string;
}
export interface ICategoryData extends ISAIAPIData {
	id: number;
	product_id:Array<number>;
	label: string;
	text: string;
	config?: any;
	created: Date;
	modified: Date;
}
export interface ICategory_Question extends ISAIAPIData {
	category_id: number;
	question_id: number;
	display_order: number;
}
export interface IKeyword_Question extends ISAIAPIData {
	keyword_id: number;
	question_id: number;
	display_order: number;
}
export interface IAdminPolicyGroupData extends ISAIAPIData {
	admin_id: number;
	policy_group_id: number;
}
export interface IPolicyGroupData extends ISAIAPIData {
	label: string;
	config?: any;
}

export type IPartialPolicyGroupData = {
	[P in keyof IPolicyGroupData]?:IPolicyGroupData[P];
}
/**
	* 管理システムの機能の権限を管理するテーブル。
テーブルに存在しない機能は誰でも利用できる。
テーブルに存在し、「is_active」が0の場合、マスターアカウント以外は利用できない。
	*/
export interface IPolicyData extends ISAIAPIData {
	label: string;
	// is_sharing: 0|1;
	url: string;
	method: string;
	is_active: 0 | 1;
	description: string;
}
export type IPartialPolicyData = {
	[P in keyof IPolicyData]?:IPolicyData[P];
}
export interface IQuestionData extends ISAIAPIData {
	title: string;
	label: string;
	config?: any;
	is_public: boolean;
}
export interface IAnswerData extends ISAIAPIData {
	question_id: number;
	text: string;
	is_public: boolean;
}
export interface IAnswerDataCondition extends IAnswerData {
	anserConditionMap?: IConditionMap;
}
export interface IAnswerDataConditionJson extends IAnswerData {
	anserConditionMap?: IConditionObj;
}
export interface IKeywordData extends ISAIAPIData {
	label: string;
	weight: number;
}
export interface IKeywordGroupData{
	group_id:number;
	keywords:Array<IKeywordData>;
}
export interface ILogData extends ISAIAPIData {
	value: Object;
	type: string;
}
export type IPartialLogData = {
	[P in keyof ILogData]?:ILogData[P];
}
export interface IScenarioTree {
	conditionGroup?: IConditionGroupData;
	conditions?: Array<IScenarioTreeCondition>;
	conditionHistory?: Array<IConditionData>;
	anserIds: Array<number>;
}
export interface IScenarioTreeCondition {
	condition: IConditionData;
	next?: IScenarioTree;
}
export interface IMailTemp extends ISAIAPIData {
	account_id: number;
	cd_user_type: number;
	cd_mail_type: number;
	hash: string;
	expire_time: Date;
}
export interface IProductCategory extends ICrossReferenceTable {
	product_id: number;
	category_id: number;
}
export type IPartialCategoryData = {
	[P in keyof ICategoryData]?:ICategoryData[P];

}
export interface IProductAnswer extends ICrossReferenceTable {
	product_id: number;
	answer_id: number;
}
