import faker from "faker";
import { Response, Request } from "express";
import { IKeywordData } from "../src/core/api/types";
import { IAPIResponce } from "../src/core/api/types";
import { questionKeywords } from "./question_keywords";
const keywords: Array<IKeywordData> = [
	{
		id: 0,
		label: "車",
		weight: 3,
	},
	{
		id: 1,
		label: "バイク",
		weight: 3,
	},
];
export const getKeywordList = (req: Request, res: IAPIResponce): Response => {
	const { question_id } = req.query;
	if (question_id == null) {
		return res.json({
			is_error: false,message:"",type:"Array",
			data: [...keywords],
		});
	} else if (/\d/.test(String(question_id))) {
		const keywordIdList = questionKeywords
			.filter((q) => q.question_id === parseInt(String(question_id), 10))
			.map((q) => q.keyword_id);
		return res.json({
			is_error: false,message:"",type:"Array",
			data: [...keywords.filter((k) => new Set(keywordIdList).has(k.id))],
		});
	}
	return res.status(400).json({
		is_error: true,message:"",type:"Array",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
