import faker from 'faker'
import { Response, Request } from 'express'
import { asyncRoutes, constantRoutes } from './routes'
import { IRoleData ,IAPIResponce} from '../../src/core/api/types'

const routes = [...constantRoutes, ...asyncRoutes]
const roles: IRoleData[] = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission') // Just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

export const getRoles = (req: Request, res: IAPIResponce) => {
  return res.json({
    status: 20000,
    data: {
      total: roles.length,
      items: roles
    }
  })
}

export const createRole = (req: Request, res: IAPIResponce) => {
  return res.json({
    status: 20000,
    data: {
      key: faker.datatype.number({ min: 3, max: 10000 })
    }
  })
}

export const updateRole = (req: Request, res: IAPIResponce) => {
  const { role } = req.body
  return res.json({
    status: 20000,
    data: {
      role
    }
  })
}

export const deleteRole = (req: Request, res: IAPIResponce) => {
  return res.json({
    status: 20000,
				data:{}
  })
}

export const getRoutes = (req: Request, res: IAPIResponce) => {
  return res.json({
    status: 20000,
    data: {
      routes
    }
  })
}
