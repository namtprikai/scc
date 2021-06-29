export let questionProducts = [
	{
		id:0,
		question_id:0,
		product_id:0
	}
];

export const deleteQuestionProductsByQuestionId = (question_id: number) => {
	questionProducts = questionProducts.filter(p => p.question_id !== question_id);
}
