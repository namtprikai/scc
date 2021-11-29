
import { Ajax } from "@/utils/parts";

export namespace AjaxService {
	let ajax:Ajax|null = null;
	export const getInstance=()=>{
		if(ajax===null){
			ajax = new Ajax();
		}
		return ajax;
	}
}
