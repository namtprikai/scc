import faker from 'faker'
import { Response, Request } from 'express'
import { IAdminData } from '../src/core/api/types'
const adminList: IAdminData[] = [
  {
    id: 0,
    name: 'adminuser1',
    password: 'Anyany',
    email: 'admin@test.com',
				is_master:false,
				config:{role:5},
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
				config:{role:5},
				is_enabled:true,
				is_lock:false,
  })
}
export const loginAdmin = (req: Request, res: Response) => {
  const { email,password } = req.body;
  for (const user of adminList) {
    if (user.email === email&&user.password === password) {
					const token = user.email + '-token';
      return res.json({
        code: 20000,
        data: {
									token,
									user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid Admin'
  })
}

export const logoutAdmin = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getAdmins = (req: Request, res: Response) => {
  // const { name } = req.query
  const users = adminList
		// .filter(user => {
  //   const lowerCaseName = user.name.toLowerCase()
  //   return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  // })
  return res.json({
    code: 20000,
    data: [...
      users
				]
  })
}
export const getAdminByToken = (token:string) => {
	for(const admin of adminList){
		if(`${admin.email}-token`===token){
			return admin
		}
	}
	return null;
}
export const getAdminInfo = (req: Request, res: Response) => {
  // Mock data based on access token
		const token = req.header('X-Access-Token');
		for(const admin of adminList){
			if(`${admin.email}-token`===token){
				return res.json({
					code: 20000,
					data: {...
						admin
					}
			})
			}

		}
		return res.status(400).json({
			code: 403,
			messaege: 'Invalid Token'
	})
}

export const getAdminById = (req: Request, res: Response) => {
  const { id } = req.params
  for (const admin of adminList) {
    if (String(admin.id) === id) {
      return res.json({
        code: 20000,
        data: {...
									admin
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid Admin'
  })
}

export const updateAdmin = (req: Request, res: Response) => {
  const { name } = req.params
  const { user } = req.body
  for (const admin of adminList) {
    if (admin.name === name) {
				Object.assign(admin,user);
      return res.json({
        code: 20000,
        data: {...
									admin
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid Admin'
  })
}

export const deleteAdmin = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
