import axios from "axios";
const MOCK_URL = "http://127.0.0.1:9528/api/";
const API_SERVER_URL = "";
// import {Login} from "../../../api/login";
// API　サーバーテスト
/**
	*
	前提条件
	is_masterがtrueのID,PWが固定のadminuserが各々に一つ存在する。
	*/
const targets = [
	{
		url: "http://127.0.0.1:9528/api",
		admin_name: "Xeiefh",
		password: "Anyany",
		token: "",
	},
	// {
	// 	url: "API_SERVER_URL",
	// 	admin_name: "amfief",
	// 	password: "efefe",
	// 	token:'',
	// },
];
describe("APItest1", () => {
	/**
	 * 各テーブルの初期化
	 */
	beforeAll(async () => {
		/**
		*
		masteでログインし、それぞれのtokenを取得。
		*/
		for (const target of targets) {
			console.log("target.url");
			const { data } = await axios({
				// baseURL: `${target.url}`,
				url: `${target.url}/admin/login`,
				method: "post",
				data: {
					name: target.admin_name,
					password: target.password,
				},
			});
			console.log(data.data);
			target.token = data.data.token;
		}
		/**
		 * 初期化処理
		 */
		for (const target of targets) {
			const { data } = await axios({
				baseURL: `${target.url}`,
				url: `products`,
				method: "get",
				headers: {
					Authorization: target.token,
				},
			});
			const productList = data.data.products;
			console.log(productList);
			for (const product of productList) {
				await axios({
					baseURL: `${target.url}`,
					url: `product/${product.id}`,
					method: "delete",
					headers: {
						Authorization: target.token,
					},
				});
			}
		}
	});
	test("add Product", async () => {
		console.log("asdf");

		/**
	* productの登録、紐付け

	*/
		for (const target of targets) {
			const testData = {
				name: "テストプロダクト",
				config: { data1: "data1value" },
			};
			const { data } = await axios({
				baseURL: `${target.url}`,
				url: `product`,
				method: "post",
				headers: {
					Authorization: target.token,
				},
				data: testData,
			});
			console.log(data.data);
			const addProduct = data.data;
			expect(addProduct).toMatchObject(testData);
			// for (const product of productList) {
			// 	await axios({
			// 		baseURL: `${target.url}`,
			// 		url: `product/${product.id}`,
			// 		method: "get",
			// 		headers:{
			// 			Authorization:target.token
			// 		}
			// 	});
			// }
		}
		//　テーブルをすべて削除したあと、アドミン、プロダクト、ロールなど、各項目の登録、紐付けを行い、各項目のgetAPI、patchを行い、モックと同等の結果が得られるかをテストする。
		// expect(scenario).toEqual(scenarioBot);
	});
});
