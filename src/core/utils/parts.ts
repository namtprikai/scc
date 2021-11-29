import { CLIENT_ID, apiUrl } from "@consoletype/utils/configration";
import Cookies from "js-cookie";
import request from "@/utils/request";
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import { eventHub } from "@/init/eventHub";

import { OldScenario } from "@/utils/allInOneCsv/scenario";
import Password from "@/views/password/index.vue";
import { Admin } from "@/api/admin";
interface SAIPromiseArray{
	is_error:boolean;
	message:string;
	type:"Array";
	data:any;
}
interface SAIPromiseObject{
	is_error:boolean;
	message:string;
	type:"Object";
	data:any;
}
export interface MessageObj {
	assignee_id: string;
	created_date: string;
	updated_date: string;
	id: string;
	message_id: string;
	description: string;
	displayname: string;
	importance: number;
	is_admin: boolean;
	is_processed: boolean;
	is_read: boolean;
	is_replied: boolean;
	is_suspended: boolean;
	loyalty: number;
	message_type: string;
	recent_messages: Array<any>;
	text: string;
	user_id: string;
	talk_script_id?: string;
	user?: User;
	is_draft?: boolean;
	script_id: string | "no_script";
	product_id: string;
}
interface UnreadMessageObj extends MessageObj {
	user: User;
	type: string;
}
export class Message {
	protected assignee_id: string;
	protected created_date: string;
	protected updated_date: string;
	public id: string;
	public message_id: string;
	protected description: string;
	protected displayname: string;
	protected importance: number;
	protected is_admin: boolean;
	protected is_processed: boolean;
	protected is_read: boolean;
	protected is_replied: boolean;
	protected is_suspended: boolean;
	protected loyalty = 0;
	protected message_type = "";
	protected recent_messages: Array<any>;
	protected talk_script_id?: string;
	protected text: string;
	protected user_id: string;
	protected user?: User | null;
	protected product_id: string;
	protected script_id: string | "no_script" | undefined;
	constructor(message: MessageObj) {
		this.id = message.id;
		this.is_replied = message.is_replied;
		this.assignee_id = message.assignee_id;
		this.description = message.description;
		this.displayname = message.displayname;
		this.created_date = message.created_date;
		this.updated_date = message.created_date;
		this.importance = message.importance;
		this.is_admin = message.is_admin;
		this.is_processed = message.is_processed;
		this.is_read = message.is_read;
		this.text = message.text;
		this.user_id = message.user_id;
		this.talk_script_id = message.talk_script_id;
		this.user = message.user != null ? new User(message.user) : null;
		this.recent_messages = message.recent_messages;
		this.is_suspended = message.is_suspended;
		this.message_id = message.message_id;
		this.product_id = message.product_id;
	}
}
export class UnreadMessage extends Message {
	protected user: User;
	protected currentId?: string;
	protected type: string;
	constructor(message: UnreadMessageObj) {
		super(message);
		this.user = new User(message.user);
		this.type = message.type;
	}
}
export class Tag {
	public id: string | null = null;
	public category: string | null = null;
	public name: string | null = null;
	public parent: string | null = null;
	constructor(tag: any) {
		if (tag != null) {
			this.id = tag.id;
			this.name = tag.name;
			this.parent = tag.parent;
			this.category = tag.category || null;
		}
	}

	public is_category(): boolean {
		return this.category !== null;
	}
}

export interface UserObject {
	last_responded_date?: string;
	picture_url: string;
	tags: Array<string>;
	id: string;
	attribute: string;
	displayname: string;
	name: string;
	status: any;
	product_id: any;
	updated_date: any;
	asignee: any;
	chat_id: any;
	thumbnail_url: string;
	loyalty: any;
	assignee: any;
	created_date: any;
	source: string;
}
export class User {
	public assignee: Array<any>;
	public chat_id: string;
	public created_date: string;
	public attribute: string;
	public displayname: string;
	public thumbnail_url: string;
	public id: string;
	public loyalty: number;
	public name: string;
	public product_id: number;
	public status: number;
	public updated_date: string;
	public tags: Array<string> = [];
	public last_responded_date: string;
	public picture_url: string;
	public is_check = true;
	public source: string;
	public messageList: Array<Message> | null = null;
	constructor(user: UserObject | any) {
		this.tags = user.tags || [];
		this.id = user.id;
		this.attribute = user.attribute;
		this.displayname = user.displayname;
		this.thumbnail_url = user.thumbnail_url;
		this.name = user.name;
		this.status = user.status;
		this.product_id = user.product_id;
		this.updated_date = user.updated_date;
		this.assignee = user.assignee;
		this.chat_id = user.chat_id;
		this.picture_url = user.picture_url;
		this.created_date = user.created_date;
		this.loyalty = user.loyalty;
		this.last_responded_date = user.last_responded_date;
		this.source = user.source;
	}

	get Status() {
		return this.status;
	}

	set Status(status: number) {
		this.status = status;
	}

	get Attribute(): any {
		if (this.attribute != null && this.attribute != "") {
			try {
				return JSON.parse(this.attribute);
			} catch (e) {
				return {};
			}
		}
		return {};
	}

	set Attribute(obj: any) {
		this.attribute = JSON.stringify(obj);
	}

	set Memo(text: string) {
		const des = this.Attribute;
		des.memo = text;
		this.Attribute = des;
	}

	get Memo() {
		const des = this.Attribute;
		if (this.Attribute.memo == null) {
			des.memo = "";
			this.Attribute = des;
		}
		return this.Attribute.memo;
	}

	get Age() {
		try {
			const birthday: any = new Date(
				`${this.Attribute.birthdayY}-${this.Attribute.birthdayM}-${this.Attribute.birthdayD}`
			);
			if (birthday == "Invalid Date") {
				return "";
			}
			const today = new Date();
			let years = today.getFullYear() - birthday.getFullYear();

			// Reset birthday to the current year.
			birthday.setFullYear(today.getFullYear());

			// If the user's birthday has not occurred yet this year, subtract 1.
			if (today < birthday) {
				years--;
			}
			return years;
		} catch (e) {
			console.log(e);
		}
		return "";
	}

	public search(keyword = "") {
		if (keyword === "") {
			return true;
		}
		if (keyword) {
			// 全角スペースを半角スペースに置換
			keyword = keyword.replace(/　/g, " ");
		}
		const keywords = keyword.split(/\s+/);
		let is_keyword = false;
		for (let i = 0; i < keywords.length; i++) {
			if (this.displayname) {
				if (this.displayname.indexOf(keywords[i]) !== -1) {
					is_keyword = true;
					break;
				}
			}
			if (this.name) {
				if (this.name.indexOf(keywords[i]) !== -1) {
					is_keyword = true;
					break;
				}
			}
		}
		if (is_keyword) {
			return true;
		}
		return false;
	}
}
export class UserList {
	public is_users = false;
	protected users: Array<User> = [];
	protected _currentUser: User | null = null;
	protected _setCurrentUserCallback: () => void = () => {};
	protected _setCurrentUserCallbacks: Array<((currentUser: User) => {}) | any> =
		[];

	protected _readyCallbacks: Array<any> = [];
	protected _readyCallback: () => void = () => {};
	protected lastUpdateTime: Date = new Date();
	protected updateIntervalInSecond = 60;
	constructor(protected ajax: Ajax, users?: Array<User>) {
		if (users != null) {
			this.users = users.filter((el) => el.displayname != null);
		}
	}

	public get CurrentUser() {
		return this._currentUser;
	}

	public resetUsers() {
		this.users = [];
	}

	public resetCurrentUser() {
		this._currentUser = null;
	}

	public setUpdateIntervalInSecond(second: number) {
		this.updateIntervalInSecond = second;
	}

	public getUpdateIntervalInSecond(): number {
		return this.updateIntervalInSecond;
	}

	public allSelect() {
		this.users.forEach((value, index, array: Array<User>) => {
			value.is_check = true;
		});
	}

	public allUnSelect() {
		this.users.forEach((value, index, array: Array<User>) => {
			value.is_check = false;
		});
	}

	public getElapsedTimeInSecond(): number {
		const elapsedTime: number =
			new Date().getTime() - this.lastUpdateTime.getTime(); // ms
		const elapsedSecond: number = elapsedTime / 1000;
		return elapsedSecond;
	}

	public trigger(eventName: string, obj?: Object) {
		// Broadcaster.getInstance().trigger(eventName, obj)
	}

	public updateUser(id: string, user: User) {
		return new Promise((sucsess, error) => {
			this.getUser(id, (updateUser: User) => {
				if (user.Status) {
					updateUser.Status = user.Status;
				}
				if (user.Attribute) {
					updateUser.Attribute = user.Attribute;
				}
				if (user.tags) {
					updateUser.tags = user.tags;
				}
				if (user.displayname) {
					updateUser.displayname = user.displayname;
				}
				// updateUser.tags=[...new Set(updateUser.tags)];
				// tslint:disable-next-line:only-arrow-functions
				updateUser.tags = updateUser.tags.filter(function (x, i, self) {
					return self.indexOf(x) === i;
				});
				const tagIds: Array<string> = [];
				// this.ajax.http({
				// 	name: `product/${updateUser.product_id}/user/${id}`,
				// 	method: 'PATCH',
				// 	data: {
				// 		"tags": updateUser.tags,
				// 		"displayname": updateUser.displayname,
				// 		"status": updateUser.Status,
				// 		"attribute": updateUser.attribute
				// 	}

				// }).then((res) => {
				// 	sucsess(res);
				// }, (res) => {
				// 	error(res);
				// });
			});
		});
	}

	public updateUserTag(id: string, tags: Array<string>): any {
		return new Promise((sucsess, error) => {
			this.getUser(id, (updateUser: User) => {
				updateUser.tags = tags;
				this.ajax
					.http({
						url: `product/${updateUser.product_id}/user/${id}`,
						method: "PATCH",
						data: JSON.stringify({ tags: updateUser.tags }),
					})
					.then(
						(res: {} | PromiseLike<{}> | undefined) => {
							sucsess(res);
						},
						(res: any) => {
							error(res);
						}
					);
			});
		});
	}

	public updateUserAttribute(id: string, attribute: string, serverSend = true) {
		return new Promise((sucsess, error) => {
			this.getUser(id, (updateUser: User) => {
				updateUser.Attribute = attribute;
				if (serverSend) {
					// this.ajax
					// 	.http({
					// 		url: `product/${updateUser.product_id}/user/${id}`,
					// 		method: "PATCH",
					// 		data: { attribute: updateUser.Attribute },
					// 	})
					// 	.then(
					// 		(res: {} | PromiseLike<{}> | undefined) => {
					// 			sucsess(res);
					// 		},
					// 		(res: any) => {
					// 			error(res);
					// 		}
					// 	);
				} else {
					sucsess(updateUser);
				}
			});
		});
	}
	// public updateUserDisplayname(id: string, displayname: string, serverSend: boolean = true) {
	// 	let sucsess: any = () => { }, error: any = () => { };
	// 	return new Promise((sucsess, error) => {
	// 		this.getUser(id, (updateUser: User) => {
	// 			updateUser.displayname = displayname;
	// 			if (serverSend) {
	// 				this.ajax.http({
	// 					name: `product/${updateUser.product_id}/user/${id}`,
	// 					method: 'PATCH',
	// 					data: { "displayname": updateUser.displayname }
	// 				}).then((res: {} | PromiseLike<{}> | undefined) => {
	// 					sucsess(res);
	// 				}, (res: any) => {
	// 					error(res);
	// 				});
	// 			} else {
	// 				sucsess(updateUser);
	// 			}
	// 		});

	// 	})
	// }
	public getCheckedUsers(): Array<User> {
		return this.users.filter((el: User) => el.is_check);
	}

	public updateUserStatus(id: string, status: number) {
		return new Promise((sucsess, error) => {
			this.getUser(id, (updateUser: User) => {
				updateUser.Status = status;
				// setTimeout(()=>{
				this.ajax
					.http({
						url: `product/${updateUser.product_id}/user/${id}`,
						method: "PATCH",
						data: { status: updateUser.Status },
					})
					.then(
						(res: {} | PromiseLike<{}> | undefined) => {
							sucsess(res);
						},
						(res: any) => {
							error(res);
						}
					);
			});
		});
	}

	public setUserList(userList: Array<User>): void {
		this.users = [];
		userList = userList.filter((el) => el.displayname != null);
		for (let i = 0; i < userList.length; i++) {
			this.users.push(new User(userList[i]));
		}
		if (this.is_users === false) {
			this.trigger("ready");
		}
		this.is_users = true;
		this.lastUpdateTime = new Date();
	}

	public addUserList(users: Array<User>): void {
		users = users.filter((el) => el.displayname != null);
		this.users = this.users.concat(users);
	}

	public addUser(user: User): User | null {
		try {
			if (this.getLocalUser(user.id) === null) {
				const _user = new User(user);
				this.users.push(_user);
				return _user;
			} else {
				for (let i = 0; i < this.users.length; i++) {
					if (this.users[i].id === user.id) {
						this.users[i] = new User(user);
						return this.users[i];
					}
				}
			}
		} catch (e) {
			console.log(e);
		}
		return null;
	}

	protected getLocalUser(id: string): User | null {
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].id === id) {
				return this.users[i];
			}
		}
		return null;
	}

	public getUser(id: string, callback: Function): void {
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].id === id) {
				callback(this.users[i]);
				// return this.users[i];
				return;
			}
		}
		// this.ajax.http({
		// 	name: `product/${serviceConfiguration.product[0]}/user/${id}`,
		// 	method: "GET"
		// }).then(res => {
		// 	callback(this.addUser(res.data));
		// }, res => {

		// });
	}

	public getUsers(callback?: Function): Array<User> {
		if (callback == null) {
			return this.users;
		} else {
			const res = [];
			for (let i = 0; i < this.users.length; i++) {
				try {
					if (callback(this.users[i])) {
						res.push(this.users[i]);
					}
				} catch (e) {
					console.log(e);
				}
			}
			return res;
		}
	}

	public getUsersFromDate(startDate: Date, endDate: Date): Array<User> {
		return this.users;
	}

	public getCurrentUser(callback: (user: User) => {}): User | null {
		return this._currentUser;
	}

	public setCurrentUserById(id: string): void {
		this.getUser(id, (user: User) => {
			this._currentUser = user;
			this.trigger("setCurrentUser", this._currentUser);
		});
		// if(this.users!=null){
		// 	for(let i=0;i<this.users.length;i++){
		// 		// TODO stringの比較になるため、とりあえず==にしておく
		// 		if(this.users[i].id==id){
		// 			if(this._currentUser!=this.users[i]){
		// 				this._currentUser=this.users[i];
		// 				this.trigger('setCurrentUser');
		// 			}else{
		// 				this._currentUser=this.users[i];
		// 				this.trigger('setCurrentUser');
		// 			}
		// 			break;
		// 		}
		// 	}
		// }
	}
}
// import { Admin} from "@/api/admin";
export class Ajax {
	private token = "";
	private refresh_token = "";
	private logout: Function = () => {};
	private defObj: any = {
		url: "",
		withCredentials: false,
		headers: {
			"Content-type": "application/json",
			// "Access-Control-Allow-Origin":"http://localhost:5000/",
			// "Referer":"http://test.example.com",
			// 'X-Requested-With': 'XMLHttpRequest',
		},
	};

	private defParam = {};
	constructor(headers?: Object) {
		if (headers) {
			this.defObj.headers = headers;
		}
		const token = Cookies.get(`token_${CLIENT_ID}`);
		const refresh_token = Cookies.get(`refresh_token_${CLIENT_ID}`);
		if (token != null&&refresh_token!=null) {
			this.updateToken(token,refresh_token);
		}
	}

	public setLogoutFunction(func: Function) {
		this.logout = func;
	}

	public getToken() {
		const token = Cookies.get(`token_${CLIENT_ID}`);
		if (!this.token && token) {
			this.token = token;
		}
		return this.token;
	}
	private async refreshToken(){
		const { data, is_error } = await Admin.refresh(this.refresh_token);
		this.updateToken(data.access_token,data.refresh_token);
	}
	public resetToken() {
		this.token = "";
		Cookies.remove(`token_${CLIENT_ID}`);
		this.defObj.headers.Authorization = ``;
		request.interceptors.request.use(
			(config) => {
				// Add X-Token header to every request, you can add other custom headers here
				config.headers.Authorization = ``;
				return config;
			},
			(error) => {
				Promise.reject(error);
			}
		);
	}

	public updateToken(token: string,refresh_token:string) {
		this.token = token;
		this.refresh_token = refresh_token;
		this.defObj.headers.Authorization = `Bearer ${this.token}`;
		request.interceptors.request.use(
			(config) => {
				// Add X-Token header to every request, you can add other custom headers here
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				Promise.reject(error);
			}
		);
		Cookies.set(`token_${CLIENT_ID}`, token);
	}

	public http = (obj: AxiosRequestConfig):Promise<SAIPromiseObject|SAIPromiseArray> => {
		console.log(obj.headers);
		console.log(this.defObj.headers);
		obj.headers = Object.assign({}, this.defObj.headers || {}, obj.headers || {}, this.token ? { Authorization: `Bearer ${this.token}` } : {});
		const res: any = request(obj);
		res.then(() => {
			// this.refreshToken();
			console.log("then");
		})
		return res;
	};
}

export interface VueBeautifulChatData {
	author: "support" | "me";
	type: string;
	data: any;
}
export interface VirtualStreamData {
	id: string;
	index: string;
	author: string;
	avatar: string;
	message: string;
	attachment: string | null;
	isRight: boolean;
}
class AndyWoker {
	private is_start = false;
	constructor(private ajax: Ajax, private queueStocker: AndyQueue) {}
	public start(resolve: Function) {
		// if (this.is_start) {
		// 	console.log("doneResolve");
		// 	// resolve();
		// 	return;
		// }
		this.is_start = true;
		const queue:
			| { http: AxiosRequestConfig; resolve: Function; reject: Function }
			| undefined = this.queueStocker.getQueue();
		if (queue != null) {
			if (/delete/i.test(String(queue.http.method))) {
				axios
					.delete(`${queue.http.baseURL}/${queue.http.url}`, queue.http)
					.then((res) => {
						this.is_start = false;
						queue.resolve(res);
						this.start(resolve);
					})
					.catch((res) => {
						this.is_start = false;
						queue.reject(res);
						this.start(resolve);
					});
			} else if (/post/i.test(String(queue.http.method))) {
				axios
					.post(
						`${queue.http.baseURL}/${queue.http.url}`,
						queue.http.data,
						queue.http
					)
					.then((res) => {
						queue.resolve(res);
						this.is_start = false;
						this.start(resolve);
					})
					.catch((res) => {
						queue.reject(res);
						this.is_start = false;
						this.start(resolve);
					});
			} else if (/get/i.test(String(queue.http.method))) {
				axios
					.get(`${queue.http.baseURL}/${queue.http.url}`, queue.http)
					.then((res) => {
						this.is_start = false;
						queue.resolve(res);
						this.start(resolve);
					})
					.catch((res) => {
						this.is_start = false;
						queue.reject(res);
						this.start(resolve);
					});
			} else if (/patch/i.test(String(queue.http.method))) {
				axios
					.patch(
						`${queue.http.baseURL}/${queue.http.url}`,
						queue.http.data,
						queue.http
					)
					.then((res) => {
						this.is_start = false;
						queue.resolve(res);

						this.start(resolve);
					})
					.catch((res) => {
						this.is_start = false;
						queue.reject(res);

						this.start(resolve);
					});
			} else {
				this.ajax.http(queue.http).then(
					(res) => {
						queue.resolve(res);
						this.is_start = false;
						this.start(resolve);
					},
					(res) => {
						this.is_start = false;
						queue.reject(res);

						this.start(resolve);
					}
				);
			}
		} else {
			console.log("doneResolve");
			this.is_start = false;
			resolve();
		}
	}

	get Isstart() {
		return this.is_start;
	}
}

class AndyQueue {
	private queues: Array<{
		http: AxiosRequestConfig;
		resolve: Function;
		reject: Function;
		pr?: number;
	}> = [];

	public setQueue(
		http: AxiosRequestConfig,
		resolve: Function,
		reject: Function = () => {},
		pr?: number
	) {
		this.queues.push({ http, resolve, reject, pr });
	}

	public getQueue() {
		return this.queues.shift();
	}

	public clearQueue() {
		// this.queues = null;//絶対大丈夫と思うけど念のためガベージコレクタ発動！！
		this.queues = [];
	}

	public sortQueues(
		sortFunction: (
			a: {
				http: AxiosRequestConfig;
				resolve: Function;
				reject: Function;
				pr?: number;
			},
			b: {
				http: AxiosRequestConfig;
				resolve: Function;
				reject: Function;
				pr?: number;
			}
		) => number
	) {
		this.queues.sort(sortFunction);
	}
}
export class RequeuestWokersService {
	private queue: AndyQueue = new AndyQueue();
	private wokerSize = 3;
	private wokers: any = [];
	constructor(private ajax: Ajax) {
		this.init();
	}

	public init() {
		this.wokers = [];
		for (let i = 0; i < this.wokerSize; i++) {
			this.wokers.push(new AndyWoker(this.ajax, this.queue));
		}
	}

	set WokerSize(size: number) {
		this.wokerSize = size;
		this.init();
	}

	public setQueue(
		http: AxiosRequestConfig,
		resolve: Function,
		reject: Function = () => {},
		pr = -1
	) {
		this.queue.setQueue(http, resolve, reject, pr);
		// this.start();
	}

	private timmerId: any = null;
	public async start() {
		const data = await this.startWokers();
		return data;
		// if (this.timmerId !== null) {
		// 	clearTimeout(this.timmerId);
		// }
		// this.timmerId = await setTimeout(() => {

		// }, 1000);
	}

	private startWokers() {
		this.queue.sortQueues(
			(
				a: {
					http: AxiosRequestConfig;
					resolve: Function;
					reject: Function;
					pr?: number;
				},
				b: {
					http: AxiosRequestConfig;
					resolve: Function;
					reject: Function;
					pr?: number;
				}
			) => {
				if (a.pr && b.pr && a.pr < b.pr) {
					return 1;
				}
				return -1;
			}
		);
		// for (let i = 0; i < this.wokers.length; i++) {
		// 	this.wokers[i].start();
		// }
		return Promise.all(
			this.wokers.map((w: any) => new Promise((r) => w.start(r)))
		);
	}

	public reset() {
		this.queue = this.wokers;
		this.queue = new AndyQueue();
		this.wokers = [];
		for (let i = 0; i < this.wokerSize; i++) {
			this.wokers.push(new AndyWoker(this.ajax, this.queue));
		}
		// this.queue.clearQueue();
	}
}
export interface MessageObj {
	assignee_id: string;
	created_date: string;
	updated_date: string;
	id: string;
	message_id: string;
	description: string;
	displayname: string;
	importance: number;
	is_admin: boolean;
	is_processed: boolean;
	is_read: boolean;
	is_replied: boolean;
	is_suspended: boolean;
	loyalty: number;
	message_type: string;
	recent_messages: Array<any>;
	text: string;
	user_id: string;
	talk_script_id?: string;
	user?: User;
	script_id: string | "no_script";
	product_id: string;
}
interface UnreadMessageObj extends MessageObj {
	user: User;
	type: string;
}

export class MessageList {
	protected currentMessage: Message | null = null;
	protected messages: Array<Message> = [];
	protected _setCurrentMessageCallbacks: Array<
		((currentMessage: Message) => {}) | any
	> = [];

	protected _setCurrentUserCallbacks: Array<
		((currentMessage: Message) => {}) | any
	> = [];

	protected lastUpdateTime: Date = new Date();
	protected updateIntervalInSecond = 60;
	protected _updateCallbacks: Array<(() => {}) | any> = [];
	// private setCurrentMessageCallback:((currentMessage:Message)=>{})=null;
	constructor(protected ajax: Ajax, protected messageList?: Array<MessageObj>) {
		this.init();
		if (messageList != null) {
			this.replaceMessageList(messageList);
		}
	}

	protected init() {
		this.lastUpdateTime = new Date();
	}

	public setUpdateIntervalInSecond(second: number) {
		this.updateIntervalInSecond = second;
	}

	public getUpdateIntervalInSecond(): number {
		return this.updateIntervalInSecond;
	}

	public getElapsedTimeInSecond(): number {
		const elapsedTime: number =
			new Date().getTime() - this.lastUpdateTime.getTime(); // ms
		const elapsedSecond: number = elapsedTime / 1000;
		return elapsedSecond;
	}

	public replaceMessageList(messageList: Array<MessageObj> = []) {
		this.messages = [];
		for (let i = 0; i < messageList.length; i++) {
			this.messages.push(new Message(messageList[i]));
		}

		this.lastUpdateTime = new Date();
	}

	public getMessageSize(filterFunc: any = () => true): number {
		return (
			(this.messages || []).filter(
				(el: any) => !el.is_suspended && !el.is_replied
			) || []
		).filter(filterFunc).length;
	}

	public getMessages(callback?: Function): Array<Message> | Array<any> {
		if (callback == null) {
			return this.messages || [{ id: 23123 }];
		} else {
			const res = [];
			for (let i = 0; i < this.messages.length; i++) {
				try {
					if (callback(this.messages[i])) {
						res.push(this.messages[i]);
					}
				} catch (e) {
					console.log(e);
				}
			}
			return res;
		}
	}

	public getCurrentMessage(): Message | null {
		// //console.log(callback);
		// if(callback!==null){
		// 	this.setCurrentMessageCallback=callback;
		// }
		return this.currentMessage;
	}

	public setCurrentMessageByMessage(message: Message): void {
		this.currentMessage = message;
		console.log(this.currentMessage);
	}
}

export class ImageChack {
	private safeList = new Set();
	public checkLink(url: string) {
		return new Promise((r) => {
			const image = new Image();
			if (this.safeList.has(url)) {
				r(true);
			}
			image.onload = () => {
				r(true);
				this.safeList.add(url);
			};
			image.onerror = () => {
				r(false);
			};
			image.src = url;
		});
	}
}

export interface LogObj {
	scriptID: string;
	is_processed: number;
	text: string;
	is_autocomplete: string;
	search: string;
	unique_id: string;
	assignee: string;
	login_user: string;
	is_search_log: string;
	user_id: string;
}
export class ScriptLogger<T> {
	private logList: Array<T> = [];
	public reset() {
		this.logList = [];
	}

	public putLog(log: T) {
		this.logList.push(log);
	}

	public getLogListSize() {
		return this.logList.length;
	}

	public popLog() {
		const ret: T | undefined = this.logList.pop();
		return ret;
	}

	public getLog(index = -1) {
		if (this.logList.length >= 1 && index == -1) {
			return this.logList[this.logList.length - 1];
		} else if (index < this.logList.length && index >= 0) {
			return this.logList[index];
		}
		return null;
	}

	get LogList() {
		return this.logList;
	}

	public setNextLog(t: T, index: number) {
		if (index >= this.logList.length) {
			this.putLog(t);
		} else if (index >= 0) {
			this.logList[index] = t;
			this.logList.splice(index + 1);
		}
	}
}
export interface FlowObj {
	step: string;
	condition?: { value: string };
	next: Array<FlowObj>;
	is_current?: boolean;
}
export interface StepObj {
	id: string;
	items: any;
	options: Array<{ value: string }>;
	text: string;
	title: string;
	type: "q" | "a";
}
export class Flow {
	private currentNextButtonLabel = "";
	private log_scenario: string | null = null;
	private condition:
		| {
				// type: string;
				value: string;
		  }
		| undefined;

	private step: string;
	// title: string;
	private next: Array<any>;
	private stepObj: StepObj | null = null;
	private memo = "";
	constructor(flow: FlowObj, public index: number, public stepMap: any) {
		this.condition = flow.condition;
		this.step = flow.step;

		this.next = flow.next;
		// this.log_scenario = flow.log_scenario;
		// this.nextFlowsSetup();
	}

	public setCurrentNextButtonLabel(text: string) {
		this.currentNextButtonLabel = text;
	}

	public setStep(step: StepObj) {
		this.stepObj = step;
		try {
			// this.formatConditionValue(this.stepObj.text);
		} catch (e) {
			console.error(e);
		}
	}

	public nextFlowsSetup() {
		if (!this.stepObj) {
			return [];
		}
		return this.next.map((f: FlowObj) =>
			Object.assign(f, {
				label: (f.condition || { value: f.step }).value,
			})
		);
	}

	public getNextFlows() {
		return this.next.map((f: FlowObj) =>
			Object.assign(f, {
				label: (f.condition || { value: f.step }).value,
				title: this.stepMap[f.step].text,
			})
		);
	}

	private bnLinkValue: any = null;
	public isbnLink() {
		if (this.bnLinkValue) {
			return true;
		} else {
			return false;
		}
	}

	public formatConditionValue(value = "") {
		const bnMatch = value.match(/<bn>(.+)[\n]*$/);
		console.info(bnMatch);
		if (bnMatch && bnMatch.length > 0) {
			this.bnLinkValue = bnMatch[1];
		} else {
			this.bnLinkValue = null;
		}
	}

	public bnLink(index: number) {
		if (this.isbnLink()) {
			eventHub.$emit("selectBlanch", this, index);
		}
	}
}
export namespace Algorithm {
	// 通常のクイックソート
	export function quickSort(arr: Array<any>) {
		arr = arr.slice(0);
		quickSortCore(arr, 0, arr.length - 1);
		return arr;
	}

	function quickSortCore(arr: Array<any>, from: number, to: number) {
		const p = arr[to];
		let i = from;
		let j = to - 1;
		let tmp;

		if (from >= to) {
			return;
		}

		while (true) {
			while (arr[i] < p && i <= j) {
				i++;
			}
			while (arr[j] >= p && i <= j) {
				j--;
			}

			if (i >= j) {
				break;
			}

			tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}

		arr[to] = arr[i];
		arr[i] = p;
		quickSortCore(arr, from, i - 1);
		quickSortCore(arr, i + 1, to);
	}

	// 上位M件だけをソートするクイックソート
	export function quickTopSort(arr: Array<any>, M: number, fn: Function) {
		arr = arr.slice(0);
		quickTopSortCore(arr, M, 0, arr.length - 1, fn);
		return arr;
	}

	function quickTopSortCore(
		arr: Array<any>,
		M: number,
		from: number,
		to: number,
		fn: Function
	) {
		const p = arr[to];
		let i = from;
		let j = to - 1;
		let tmp;

		if (from >= to) {
			return;
		}

		while (true) {
			while (fn(arr[i], p) && i <= j) {
				i++;
			}
			while (!fn(arr[j], p) && i <= j) {
				j--;
			}

			if (i >= j) {
				break;
			}

			tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
		}

		arr[to] = arr[i];
		arr[i] = p;
		quickTopSortCore(arr, M, from, i - 1, fn);

		// 範囲外ならスルー
		if (i + 1 < M) {
			quickTopSortCore(arr, M, i + 1, to, fn);
		}
	}
}

export class PasswordValid {
	private minLength = 8;
	pw1 = "";
	pw2 = "";
	get invalidFeedbackPw() {
		return "";
	}
}
export class AndyPasswordValidator {
	private requiredScema: any;
	private scema: any;

	private messageMapper: any = {
		uppercase: "大文字が含まれていません",
		min: "文字数が足りません",
		lowercase: "小文字が含まれていません",
		symbols: "特殊文字が含まれていません",
		digits: "数字が含まれていません",
	};

	constructor(PasswordValidator: any) {
		this.requiredScema = new PasswordValidator();
		this.scema = new PasswordValidator();
		this.requiredScema.is().min(8);
		this.scema.has().uppercase().has().lowercase().has().symbols().has().digits();
	}

	public valid(text: string) {
		const requiredValidList = this.requiredScema.validate(text, { list: true });
		const validList = this.scema.validate(text, { list: true });
		if (requiredValidList.length > 0) {
			return false;
		}
		if (validList.length > 1) {
			return false;
		}
		return true;
	}

	public getValidMessage(text: string) {
		const requiredValidList = this.requiredScema.validate(text, { list: true });
		if (requiredValidList.length > 0) {
			return requiredValidList.map((o: any) => this.messageMapper[o]).join(" ");
		}
		const validList = this.scema.validate(text, { list: true });
		if (validList.length > 1) {
			return validList.map((o: any) => this.messageMapper[o]).join(" ");
		}
		return "";
	}

	public getValidMessageList(text: string) {
		const requiredValidList = this.requiredScema.validate(text, { list: true });
		const validList = this.scema.validate(text, { list: true });
		console.log(validList);
		return requiredValidList
			.map((o: any) => this.messageMapper[o])
			.concat(validList.map((o: any) => this.messageMapper[o]));
	}
}

export function Wait(time = 1000) {
	return new Promise<void>((r) => {
		setTimeout(() => {
			r();
		}, time);
	});
}

export function getIdByToken(token: string) {
	try {
		return JSON.parse(atob(token.split('.')[1])).id;
	} catch (e) {
		return null;
	}
}
