import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData } from '../src/core/api/types'
const userList: IUserData[] = [
  {
    id: 0,
    password: 'any',
    name: 'Super Admin',
    email: 'admin@test.com',
				is_lock:false,
  },
  {
    id: 1,
    password: 'any',
    name: 'Normal Editor',
    email: 'editor@test.com',
				is_lock:false,
  }
]
const userCount = 100

for (let i = 2; i < userCount; i++) {
  userList.push({
    id: i,
    password: faker.random.alphaNumeric(20),
    name: faker.name.findName(),
    email: faker.internet.email(),
				config:{},
				is_enabled:true,
				is_mailauth_completed:true,
				is_lock:false,
  })
}

export const register = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const loginUser = (req: Request, res: Response) => {
  const { id } = req.body
  for (const user of userList) {
    if (user.id === id) {
      return res.json({
        code: 20000,
        data: {
          accessToken: name + '-token'
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const logoutUser = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getUsers = (req: Request, res: Response):Response => {
  const { name } = req.query
  const users = userList.filter(user => {
    const lowerCaseName = user.name.toLowerCase()
    return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  })
		.map(user => {
			const {id,name,email}=user;
			return {id,name,email}
		})
  return res.json({
    code: 20000,
    data: [...users]
  })
}

export const getUserInfo = (req: Request, res: Response) => {
  // Mock data based on access token
  return res.json({
    code: 20000,
    data: {
      user: req.header('X-Access-Token') === 'admin-token' ? userList[0] : userList[1]
    }
  })
}
export const getUserById = (req: Request, res: Response) => {
	const { id } = req.params
	for (const user of userList) {
			if (String(user.id) === id) {
					return res.json({
							code: 20000,
							data: {
									user
							}
					})
			}
	}
	return res.status(400).json({
			code: 50004,
			messaege: 'Invalid User'
	})
}
export const getUserByName = (req: Request, res: Response) => {
  const { name } = req.params
  for (const user of userList) {
    if (user.name === name) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const updateUser = (req: Request, res: Response) => {
  const { name } = req.params
  const { user } = req.body
  for (const v of userList) {
    if (v.name === name) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const deleteUser = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
