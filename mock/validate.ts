import { Response, Request, NextFunction } from 'express'
const validList:Array<any> = [];
export const validation = (req: Request, res: Response, next: NextFunction) => {
		//バリデーション処理
		console.log(req.route.path);

  if (false) {
    // return res.status(401).json({
    //   code: 50001,
    //   messaege: 'Invalid Access Token'
    // })
  }
  next()
}

export const getValidation = (req: Request, res: Response) => {
	const { name } = req.params
	for (const valid of validList) {
			if (valid.name === name) {
					return res.json({
							code: 20000,
							data: {
								valid
							}
					})
			}
	}
	return res.status(400).json({
			code: 50004,
			messaege: 'Invalid Valid'
	})
}
