interface IAnswerListByQuestionIdResponce{
	"is_error": boolean;
	type:"Object";
	message:string;
	data:{
		// このconditionListは、conditionGroupのlevel順にソートされています。
		conditionList: Array<{
			conditionGroup: IConditionGroupData;
			conditions: Array<IConditionData>;
		}>,
		answers: Array<IAnswerDataCondition>;
	}
}
// ------以下補足-------
interface ISAIAPIData {
	id: number;
	created?: Date;
	modified?: Date;
}
interface IConditionGroupData extends ISAIAPIData {
	level: number;
	is_setting: boolean;
	label: string;
}
interface IConditionData extends ISAIAPIData {
	conditiongroup_id: number;
	label: string;
}
interface IAnswerData extends ISAIAPIData {
	question_id: number;
	text: string;
}
interface IAnswerDataCondition extends IAnswerData {
	anserConditionMap?: IConditionObj;
}
type IConditionObj = {
	[key: number]: {
		conditionGroup: IConditionGroupData;
		conditions: Array<IConditionData>;
	};
}
