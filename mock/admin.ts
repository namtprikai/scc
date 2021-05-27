import { param2Obj } from './utils';

const tokens: { [index: string]: any } = {
	admin: {
		token: 'admin-token',
	},
	editor: {
		token: 'editor-token',
	},
};

const admins: { [index: string]: any } = {
	'admin-token': {
		id:2,
		name:"nishida",
		email:"nishida@sciseed.jp",
		is_mailauth_completed:true,

	},
	'editor-token': {
		id:3,
		name:"nishida3",
		email:"nishida3@sciseed.jp",
		is_mailauth_completed:true,

	},
};

export default {
	login: (res: any) => {
		const { username } = JSON.parse(res.body);
		const data = tokens[username];

		if (data) {
			return {
				code: 20000,
				data,
			};
		}

		return {
			code: 60204,
			message: 'Account or password is incorrect.',
		};
	},
	getList:(res:any)=>{
		return {
			data:[...Object.values(admins)]
		}
	},
	getInfo: (res: any) => {
		const { token } = param2Obj(res.url);
		const info = admins[token];

		if (info) {
			return {
				code: 20000,
				data: info,
			};
		}

		return {
			code: 50008,
			message: 'Login failed, unable to get user details.',
		};
	},

	logout: () => ({
		code: 20000,
		data: 'success',
	}),
};
