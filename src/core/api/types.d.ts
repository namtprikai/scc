interface ISAIAPIData{
	id:number;
	created?:Date;
	modified?:Date;
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
		config?: Object;
		is_mailauth_completed?: boolean;
		is_enabled: boolean;
		is_lock: boolean;
}
export interface IAdminData extends ISAIAPIData{
	id: number;
	name: string;
	password: string;
	email: string;
	config: Object;
	is_mailauth_completed?: boolean;
	is_master: boolean;
	is_enabled: boolean;
	is_lock: boolean;
	created?: Date;
	modified?: Date;
}
export interface ICategoryData extends ISAIAPIData{
	id:number;
	product_id:Array<number>;
	parent_id: number;
	label:string;
	text:string;
	config:Object;
	created:Date;
	modified: Date;
}
export interface IPolicyGroupData extends ISAIAPIData{
	label:string;
	created:Date;
}
export interface IPolicy extends ISAIAPIData{
	label:string;
	is_sharing:boolean;
}

export interface IQuestion extends ISAIAPIData{
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

