export let questionKeywords = [
	{
		id: 0,
		question_id: 0,
		keyword_id: 0,
	},
];
export const deleteQuestionKeywordsByQuestionId = (question_id: number) => {
	questionKeywords = questionKeywords.filter(
		(p) => p.question_id !== question_id
	);
};
// export const editQuestionKeywordsByQuestionId = (question_id: number,add_id,delete_id:Array<number>) => {
// 	questionKeywords = questionKeywords.filter(
// 		(p) => p.question_id !== question_id
// 	);
// };
