import { Response, Request } from 'express'
interface ISAIAPIData{
	id:number;
	created?:Date;
	modified?:Date;
}
export interface IAPIResponce extends Response{
	json:(args:{
		status:number;
		data:{[key:string]:any}|Array<{[key:string]:any}>
	})=>any;
}
export interface IRoleData{
	[key:any]:any;
}
export interface IProductData extends ISAIAPIData{
	name:string;
	confing:Object;
	max_failure_count_user:number;
	max_failure_time_user:number;
}
export interface IConditionGroupData extends ISAIAPIData{
	id:number;
	level:number;
	is_setting:boolean;
	label:string;
}
export interface IConditionData extends ISAIAPIData{
	id:number;
	conditiongroup_id:number;
	label:string;
}
export interface IUserData extends ISAIAPIData{
  password?: string;
  name: string;
  email: string;
		config?: any;
		is_mailauth_completed?: boolean;
		is_enabled?: boolean;
		is_lock?: boolean;
}
export interface IAdminData extends ISAIAPIData{
	id: number;
	name: string;
	password: string;
	email: string;
	config?: any;
	is_mailauth_completed?: boolean;
	is_master: boolean;
	is_enabled: boolean;
	is_lock: boolean;
	created?: Date;
	modified?: Date;
}
export interface IAdmin{
	id: number;
	name: string;
	email: string;
	role:Set<number>;
	is_master?: boolean;
	token:string;
}
export interface ICategoryData extends ISAIAPIData{
	id:number;
	parent_id: number|null;
	label:string;
	text:string;
	config?: any;
	created:Date;
	modified: Date;
}
export interface IAdminPolicyGroupData extends ISAIAPIData{
	admin_id:number;
	policy_group_id:number;
}
export interface IPolicyGroupData extends ISAIAPIData{
	label:string;
	config?: any;
}
export interface IPolicyData extends ISAIAPIData{
	label:string;
	is_sharing:boolean;
}

export interface IQuestionData extends ISAIAPIData{
	title:string;
	label:string;
	is_public:boolean;
}
export interface IAnswer extends ISAIAPIData{
	question_id:number;
	text:string;
	is_public:boolean;
}
export interface IKeyword extends ISAIAPIData{
	label:string;
	weight:number;
}

export interface ILog extends ISAIAPIData{
	value: Object;
	type:string;
}
