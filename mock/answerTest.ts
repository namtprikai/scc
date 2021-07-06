import { IAnswerDataCondition } from "answer";
import faker from "faker";
import {
	IConditionData,
	IConditionGroupData,
	IQuestionData,
} from "../src/core/api/types";
// const questions:IQuestionData = [];
const ansers: Array<IAnswerDataCondition> = [];
const conditions: Array<IConditionData> = [];
const conditionGroups: Array<IConditionGroupData> = [];

export const init = () => {};

export const getTestConditionsByAnserId = (anserId: number) => {};
export const getTestconditionGroup = (conditionId: number) => {};
export const getTestAnser = (
	questionId: number,
	conditions?: Array<IConditionData>
) => {};
