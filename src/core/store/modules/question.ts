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
import {Question} from "@/api/question";
@Module({ dynamic: true, store, name: "question" })
class QuestionStore extends VuexModule {
	questions: Array<IQuestionData> = [];
	get Questions() {
		return this.questions;
	}
	@Mutation
	public async GetQuestions() {
		const data : any = await Question.getList();
		this.questions = data;
	}
}
export const QuestionModule = getModule(QuestionStore);
