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
			return res.status(200).json({
				is_error: false,message:"",type:"Object",
				data: {
					valid,
				},
			});
		}
	}
	return res.status(400).json({
		is_error: true,message:"",type:"Object",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
