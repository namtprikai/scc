import { AjaxService } from "@/services/ajax";
import { AxiosResponse } from "axios";
export namespace Product {
	export const getList = async () => {
		const { data }: AxiosResponse<any> = await AjaxService.ajax.http({
			url: `/products`,
			method: "get",
			params: {},
		});
		return data;
	};
}
