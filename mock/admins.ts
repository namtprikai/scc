import faker from 'faker'
import { Response, Request } from 'express'
import { IAdminData, ISAIAPIData,IAPIResponce } from '../src/core/api/types';
const admin_polycyGropup = [];
const adminList: IAdminData[] = [
  {
    id: 0,
    name: 'サイシード西田',
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
export const loginAdmin = (req: Request, res: IAPIResponce) => {
  const { email,password } = req.body;
  for (const user of adminList) {
    if (user.email === email&&user.password === password) {
					const token = `${user.id}-${user.email}-token`;
      return res.json({
        status: 200,
        data: {
									token,
									user
        }
      })
    }
  }
  return res.status(400).json({
				status: 50004,
    data:{
					errors:[
						{status: 'forbidden_error'}
					]
				}
  })
}

export const logoutAdmin = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 200,
		data: {
		}
})
}

export const getAdmins = (req: Request, res: IAPIResponce) => {
  // const { name } = req.query
  const users = adminList
		// .filter(user => {
  //   const lowerCaseName = user.name.toLowerCase()
  //   return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  // })
  return res.json({
    status: 200,
    data: [...
      users
				]
  })
}
export const getAdminByToken = (token:string) => {
	for(const admin of adminList){
		if(`${admin.id}-${admin.email}-token`===token){
			return admin
		}
	}
	return null;
}
export const getAdminInfo = (req: Request, res: IAPIResponce) => {
  // Mock data based on access token
		const token = req.header('Authorization');
		console.log(token);
		for(const admin of adminList){
			if(`${admin.id}-${admin.email}-token`===token){
				return res.json({
					status: 20000,
					data: {...
						admin
					}
			})
			}

		}
		return res.status(400).json({
			status: 403,
			data:{
				errors:[
					{status: 'forbidden_error'}
				]
			}
	})
}

export const getAdminById = (req: Request, res: IAPIResponce) => {
  const { id } = req.params
  for (const admin of adminList) {
    if (String(admin.id) === id) {
      return res.json({
        status: 20000,
        data: {...
									admin
        }
      })
    }
  }
  return res.status(400).json({
    status: 50004,
    data:{
					errors:[
						{status: 'forbidden_error'}
					]
				}
  })
}


export const updateAdmin = (req: Request, res: IAPIResponce) => {
  const { name } = req.params
  const { user } = req.body
  for (const admin of adminList) {
    if (admin.name === name) {
				Object.assign(admin,user);
      return res.json({
        status: 20000,
        data: {...
									admin
        }
      })
    }
  }
  return res.status(400).json({
    status: 50004,
    data:{
					errors:[
						{status: 'forbidden_error'}
					]
				}
  })
}

export const deleteAdmin = (req: Request, res: IAPIResponce) => {
  return res.json({
    status: 20000,
    data:{}
  })
}
