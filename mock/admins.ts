import faker from 'faker'
import { Response, Request } from 'express'
import { IAdminData } from '../src/core/api/types'

const adminList: IAdminData[] = [
  {
    id: 0,
    name: 'adminuser1',
    password: 'any',
    email: 'admin@test.com',
				is_master:false,
				config:{},
				is_enabled:true,
				is_lock:false,
  },
]
const userCount = 100

for (let i = 2; i < userCount; i++) {
	adminList.push({
    id: i,
    name: 'admin_' + faker.random.alphaNumeric(9),
    password: faker.random.alphaNumeric(20),
    email: faker.internet.email(),
				is_master:false,
				config:{},
				is_enabled:true,
				is_lock:false,
  })
}

export const register = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const login = (req: Request, res: Response) => {
  const { name } = req.body
  for (const user of adminList) {
    if (user.name === name) {
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

export const logout = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getUsers = (req: Request, res: Response) => {
  const { name } = req.query
  const users = adminList.filter(user => {
    const lowerCaseName = user.name.toLowerCase()
    return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  })
  return res.json({
    code: 20000,
    data: {
      items: users
    }
  })
}

export const getUserInfo = (req: Request, res: Response) => {
  // Mock data based on access token
  return res.json({
    code: 20000,
    data: {
      user: req.header('X-Access-Token') === 'admin-token' ? adminList[0] : adminList[1]
    }
  })
}

export const getUserByName = (req: Request, res: Response) => {
  const { username } = req.params
  for (const user of adminList) {
    if (user.name === username) {
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
  for (const v of adminList) {
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
