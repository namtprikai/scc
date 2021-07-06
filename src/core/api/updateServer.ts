import request from "@/utils/request";
import { CLIENT_ID, scriptUrl } from "@consoletype/utils/configration";
import axios from "axios";
import { AjaxService } from "@/services/ajax";
export namespace UpdateServer {
	const defaultParam = {};
	export const setDefaultParam = (param: Object) => {
		Object.assign(defaultParam, param || {});
	};
	export const deployPackageFromTest = (extendPram?: Object): Promise<any> =>
		AjaxService.ajax.http({
			baseURL: `${scriptUrl}`,
			url: "deploy_package_from_test",
			method: "GET",
			params: Object.assign(
				{},
				{
					product_id: parseInt(CLIENT_ID),
					with_package: true,
					with_bot_package: true,
					with_tag_package: true,
					time: new Date().getTime(),
				},
				defaultParam,
				extendPram || {},
			),
		});
	export const deployInvertedIndex = (extendPram?: Object): Promise<any> =>
		AjaxService.ajax.http({
			baseURL: `${scriptUrl}`,
			url: "deploy_inverted_index/",
			method: "GET",
			params: Object.assign(
				{},
				{
					product_id: parseInt(CLIENT_ID),
					env: "test",
					with_package: true,
					with_bot_package: true,
					with_tag_package: true,
					time: new Date().getTime(),
				},
				defaultParam,
				extendPram || {},
			),
		});
	export const update = (param?: Object): Promise<any> =>
		new Promise(async (r: any) => {
			const sitemap: any = {};
			// if (_sitemap) {
			// 	sitemap.sitemap_url = _sitemap;
			// }
			console.log(defaultParam);
			axios({
				url: `${scriptUrl}/update_script`,
				headers: {},
				method: "get",
				data: {},
				params: Object.assign(
					{
						product_id: CLIENT_ID,
						with_bot_package: true,
						with_package: true,
						public: false,
						time: new Date().getTime(),
					},
					sitemap || {},
					param || {},
					defaultParam || {},
				),
			})
				.then((): void => {
					r();
				})
				.catch((): void => {
					r();
				});
		});
}
