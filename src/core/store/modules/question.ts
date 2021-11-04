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
	@Mutation
	public async EditQuestion(id:number,input:IQuestionData){
		const {is_error,message,type,data} = await Question.patch(id,input);
		if(is_error){

		}else{
			for(let question of this.questions){
				if(question.id === data.id){
					question = data;
					break;
				}
			}
		}
	}
	@Mutation
	public async AddQuestion(input:IQuestionData){
		const {is_error,message,type,data} = await Question.post(input);
		if(is_error){

		}else{
			for(let question of this.questions){
				if(question.id === data.id){
					question = data;
					break;
				}
			}
		}
	}
}
export const QuestionModule = getModule(QuestionStore);
