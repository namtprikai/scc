import request from '@/utils/request';
import { CLIENT_ID } from '@consoletype/utils/configration';
import { AxiosPromise } from 'axios';
import { Auth } from '@/utils/auth';

export interface SendMessage {
	user_id: string;
	type: string;
	text: string;
	assignee_id: number;
}

export interface SearchMessage {
	q: string;
	limit: number;
	page: number;
	st: string;
	en: string;
	owner: 'all' | 'admin' | 'user';
}

export interface UpdateMessage {
	is_read?: boolean;
	description?: any;
	assignee_id?: number;
}

export namespace MessageList {
	export const getMessageList = (): Promise<any> =>
		new Promise(async r => {
			const token = await Auth.getToken();
			request({
				url: `product/${CLIENT_ID}/message/unread`,
				method: 'get',
				headers: {
					Authorization: token,
				},
				data: {
					duration: 336,
				},
			})
				.then((res: any) => {
					console.log(res);
					r({ data: res });
				})
				.catch(res => {
					console.log(res);
					r(res);
				});
		});

	export const sendMessage = async (data: SendMessage, userName: string): Promise<any> => {
		const token = await Auth.getToken();
		let apiName = 'line/send_message';
		if (String(userName).match(/AIChatWindowUser/)) {
			apiName = 'ai_chat_window/send';
		}
		return request({
			url: `product/${CLIENT_ID}/${apiName}`,
			method: 'post',
			data: JSON.stringify(data),
			headers: {
				Authorization: token,
			},
		});
	};

	export const updateMessage = async (id: string, data: UpdateMessage): Promise<any> => {
		const token = await Auth.getToken();
		return request({
			url: `product/${CLIENT_ID}/message/${id}`,
			method: 'patch',
			data: JSON.stringify(data),
			headers: {
				Authorization: token,
			},
		});
	};

	export const readMessage = async (id: string): Promise<any> => {
		const token = await Auth.getToken();
		return request({
			url: `product/${CLIENT_ID}/message/${id}/read`,
			method: 'patch',
			headers: {
				Authorization: token,
			},
		});
	};

	export const searchMessageList = async (data: SearchMessage): Promise<object[]> => {
		const token = await Auth.getToken();

		const impl = async (data: SearchMessage, list: object[] = []): Promise<object[]> => {
			const { q, limit, page, st, en } = data;
			const next: any = await request({
				url: `product/${CLIENT_ID}/search_message`,
				method: 'get',
				headers: {
					Authorization: token,
				},
				params: data,
			});

			const newList = [...list, ...next];
			if (next.length === limit) {
				return impl({ ...data, page: page + 1 }, newList);
			} else {
				return newList;
			}
		};

		return impl(data);
	};
}
