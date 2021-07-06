import faker from "faker";
import { Response, Request } from "express";
import { asyncRoutes, constantRoutes } from "./routes";
import { IRoleData, IAPIResponce } from "../../src/core/api/types";

const routes = [...constantRoutes, ...asyncRoutes];
const roles: IRoleData[] = [];

export const getRoles = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {
			total: roles.length,
			items: roles,
		},
	});
};

export const createRole = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {
			key: faker.datatype.number({ min: 3, max: 10000 }),
		},
	});
};

export const updateRole = (req: Request, res: IAPIResponce) => {
	const { role } = req.body;
	return res.json({
		status: 20000,
		data: {
			role,
		},
	});
};

export const deleteRole = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {},
	});
};

export const getRoutes = (req: Request, res: IAPIResponce) => {
	return res.json({
		status: 20000,
		data: {
			routes,
		},
	});
};
