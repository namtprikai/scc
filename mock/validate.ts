import { Response, Request, NextFunction } from "express";
import { IAPIResponce } from "../src/core/api/types";
const validList: Array<any> = [
	{
		id: 0,
	},
];
export const validation = (
	req: Request,
	res: IAPIResponce,
	next: NextFunction
) => {
	//バリデーション処理
	console.log(req.route.path);

	if (false) {
		// return res.status(401).json({
		//   status: 50001,
		//   messaege: 'Invalid Access Token'
		// })
	}
	next();
};

export const getValidation = (req: Request, res: IAPIResponce) => {
	const { name } = req.params;
	for (const valid of validList) {
		if (valid.name === name) {
			return res.json({
				status: 20000,
				data: {
					valid,
				},
			});
		}
	}
	return res.status(400).json({
		status: 50004,
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
