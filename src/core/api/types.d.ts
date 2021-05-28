import { Data } from "@/store/modules/talkScript";

export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}
export interface IAdminData {
	id: number;
	name: string;
	password: string;
	email: string;
	config: Object;
	is_mailauth_completed?: boolean;
	is_master: boolean;
	is_enabled: boolean;
	is_lock: boolean;
	created: Date;
	modified: Date;
}
export interface ICategoryData {
	id:number;
	product_id:Array<number>;
	parent_id: number;
	label:string;
	text:string;
	config:Object;
	created:Date;
	modified: Date;
}
export interface IPolicyGroupData {
	label:string;
	created:Date;
}
