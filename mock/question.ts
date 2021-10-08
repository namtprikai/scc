import faker from "faker";
import { Response, Request } from "express";
import { IProductData, IQuestionData, IRoleData } from "../src/core/api/types";
import { IAPIResponce } from "../src/core/api/types";
import { secureObjectCreateByAdmin, secureObjectCreateByUser } from './security';
import {
	questionProducts,
	deleteQuestionProductsByQuestionId,
} from "./question_products";
import { question_roles } from "./question_roles";
import { productions } from "./products";
import { getAdminByToken } from "./admins";
import { deleteQuestionKeywordsByQuestionId } from "./question_keywords";
import { getId, SAITableModel } from "./utils";
import {getKeywordsByQuestionId as _getKeywordsByQuestionId,editKeywordsByQuestionId as _editKeywordsByQuestionId} from "./keyword_questions";
export let questions: Array<IQuestionData> = [
	{
		id: 0,
		label: "",
		title: "私におすすめの車は？",
		is_public: true,
		config: {},
		created: new Date(),
		modified: new Date(),
	},
	{
		id: 1,
		label: "",
		title: "私におすすめのバイクは？",
		is_public: true,
		config: {},
		created: new Date(),
		modified: new Date(),
	},
];

// interface IProductsAPIResponce extends Response {
// 	json: (args: {
// 		status: number;
// 		data: {
// 			products: Array<IAnswerData>;
// 		};
// 	}) => any;

// }
const deleteIntermadiateTables = (question_id: number) => {
	deleteQuestionProductsByQuestionId(question_id);
	deleteQuestionKeywordsByQuestionId(question_id);
};
const Questions = secureObjectCreateByAdmin<IQuestionData>(
	() => questions,
	(q) => {
		const products: Array<IProductData> = [];
		for (const qp of questionProducts) {
			if (q.id === qp.question_id) {
				for (const production of productions) {
					if (qp.product_id === production.id) {
						products.push(production);
						break;
					}
				}
			}
		}
		return products;
	}
);
const QuestionsByUser = secureObjectCreateByUser<IQuestionData>(
	() => questions,
	(q) => {
		const roles: Array<IRoleData> = [];
		for (const qr of question_roles) {
			if (q.id === qr.question_id) {
				for (const role of roles) {
					if (qr.role_id === role.id) {
						roles.push(role);
						break;
					}
				}
			}
		}
		return roles;
	}
);
const questionsModel = new SAITableModel(questions,'/question/', Questions, QuestionsByUser);
export const addQuestion = (req: Request, res: IAPIResponce): Response => {
	const { title, config, label, is_public } = req.body;
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if (admin) {
		const newId = getId(questions);
		const question = {
			id: newId,
			label,
			config,
			title,
			is_public,
			created: new Date(),
			modified: new Date(),
		};
		questions.push(question);
		return res.json({
			is_error: false,message:"",type:"Object",
			data: question
		});
	}
	return res.status(400).json({
		is_error: true,message:"",type:"Object",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
export const getKeywordsByQuestionId = (req: Request, res: IAPIResponce): Response => {
	const { question_id, text } = req.params;
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if (admin && question_id == null) {
		return res.json({
			is_error: false,message:"",type:"Array",
			data: [..._getKeywordsByQuestionId(parseInt(question_id))],
		});
	}
	return res.status(400).json({
		is_error: true,message:"",type:"Object",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
export const editKeywordsByQuestionId = (req: Request, res: IAPIResponce): Response => {
	const { question_id,  keyword_id,delete_id} = req.body;
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if (admin && question_id == null) {
		const [addList,deleteList] = _editKeywordsByQuestionId(question_id,keyword_id,delete_id);
		return res.json({
			is_error: false,message:"",type:"Array",
			data: [],
		});
	}
	return res.status(400).json({
		is_error: true,message:"",type:"Object",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
export const getQuestionList = (req: Request, res: IAPIResponce): Response => {
	const { category_id, text } = req.params;
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if (admin && category_id == null) {
		return res.json({
			is_error: false,message:"",type:"Array",
			data: [...Questions.getData(admin,'/api/questions/','get')],
		});
	}
	return res.status(400).json({
		is_error: true,message:"",type:"Object",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
/**
	*
		*
		*
		url /api/question/{question_id}/
	*/
export const deleteQuestion = (req: Request, res: IAPIResponce): Response => {
	const { question_id, text } = req.params;
	if (!/\d/.test(question_id)) {
		return res.status(400).json({
			is_error: true,message:"",type:"Object",
			data: {
				errors: [{ status: "validation_error" }],
			},
		});
	}
	const accessToken = req.header("Authorization") || "";
	const admin = getAdminByToken(accessToken);
	if (
		admin &&
		Questions.getData(admin,'/api/question/{question_id}/','delete').find((q) => q.id === parseInt(question_id, 10))
	) {
		questions = questions.filter((q) => q.id !== parseInt(question_id, 10));
		deleteIntermadiateTables(parseInt(question_id, 10));
		return res.json({
			is_error: false,message:"",type:"Array",
			data: [...questions],
		});
	}
	return res.status(400).json({
		is_error: false,message:"",type:"Object",
		data: {
			errors: [{ status: "forbidden_error" }],
		},
	});
};
