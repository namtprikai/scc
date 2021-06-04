import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData, IAPIResponce } from '../src/core/api/types'
const userList: IUserData[] = [
	{
		id: 0,
		password: 'any',
		name: 'Super Admin',
		email: 'admin@test.com',
		is_lock: false,
	},
	{
		id: 1,
		password: 'any',
		name: 'Normal Editor',
		email: 'editor@test.com',
		is_lock: false,
	}
];
const userCount = 100;

for (let i = 2; i < userCount; i++) {
	userList.push({
		id: i,
		password: faker.random.alphaNumeric(20),
		name: faker.name.findName(),
		email: faker.internet.email(),
		config: {},
		is_enabled: true,
		is_mailauth_completed: true,
		is_lock: false,
	})
}

export const register = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {}
	})
};

export const loginUser = (req: Request, res: IAPIResponce) => {
	const { id } = req.body
	for (const user of userList) {
		if (user.id === id) {
			return res.json({
				status: 20000,
				data: {
					accessToken: name + '-token'
				}
			})
		}
	}
	return res.status(400).json({
		status: 50004,
		data: {
			errors: [
				{ status: 'forbidden_error' }
			]
		}
	})
};

export const logoutUser = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {}
	})
};

export const getUsers = (req: Request, res: IAPIResponce): Response => {
	const { name } = req.query
	const users = userList.filter(user => {
		const lowerCaseName = user.name.toLowerCase()
		return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
	})
		.map(user => {
			const { id, name, email } = user;
			return { id, name, email }
		})
	return res.json({
		status: 20000,
		data: [...users]
	})
};

export const getUserInfo = (req: Request, res: IAPIResponce) => {
	// Mock data based on access token
	return res.json({
		status: 20000,
		data: {
			user: req.header('X-Access-Token') === 'admin-token' ? userList[0] : userList[1]
		}
	})
};
export const getUserById = (req: Request, res: IAPIResponce) => {
	const { id } = req.params
	for (const user of userList) {
		if (String(user.id) === id) {
			return res.json({
				status: 20000,
				data: {
					user
				}
			})
		}
	}
	return res.status(400).json({
		status: 50004,
		data: {
			errors: [
				{ status: 'forbidden_error' }
			]
		}
	})
};
export const getUserByName = (req: Request, res: IAPIResponce) => {
	const { name } = req.params
	for (const user of userList) {
		if (user.name === name) {
			return res.json({
				status: 20000,
				data: {
					user
				}
			})
		}
	}
	return res.status(400).json({
		status: 50004,
		data: {
			errors: [
				{ status: 'forbidden_error' }
			]
		}
	})
}
export const getUserByToken = (token: string) => {
	for (const user of userList) {
		if (String(user.id) === token.split('-')[0]) {
			return user;
		}
	}
	return null;
}
export const updateUser = (req: Request, res: IAPIResponce) => {
	const { name } = req.params
	const { user } = req.body
	for (const v of userList) {
		if (v.name === name) {
			return res.json({
				status: 20000,
				data: {
					user
				}
			})
		}
	}
	return res.status(400).json({
		status: 50004,
		data: {
			errors: [
				{ status: 'forbidden_error' }
			]
		}
	})
}

export const deleteUser = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {
			errors: [
				{ status: 'forbidden_error' }
			]
		}
	})
}
