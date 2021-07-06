import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
	MutationAction,
} from "vuex-module-decorators";
import store from "@/store";
import { AjaxService } from "@/services/ajax";
import { IQuestionData } from "@/api/types";
@Module({ dynamic: true, store, name: "question" })
class QuestionStore extends VuexModule {
	questions: Array<IQuestionData> = [];
	get Questions() {
		return this.questions;
	}
	@Mutation
	public async GetQuestions() {
		const { data }: any = await AjaxService.ajax.http({
			url: `questions/`,
			method: "get",
			params: {},
		});
		console.log(data);
		this.questions = data;
	}
}
export const QuestionModule = getModule(QuestionStore);
