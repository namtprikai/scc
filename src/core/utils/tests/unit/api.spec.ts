import axios from "axios";
import faker from "faker";
type Project = {
	url: string;
	type: string;
	size: number;
};
type Data = {
	method: "post" | "get";
	url: string;
	id: number;

};
const makeModel = () => {
	const project:Array<Project> = [
		{
			url: "product/",
			type: "makeandget",
			size:8
		},

	];
  const data = [
    {

      method:"post"
    }
  ];
  function make(data:Array<Data>,project:Project) {

  }
}
const MOCK_URL = "http://127.0.0.1:9528/api/";
const API_SERVER_URL = "";
// import {Login} from "../../../api/login";
// API　サーバーテスト
/**
	*
	前提条件
	is_masterがtrueのID,PWが固定のadminuserが各々に一つ存在する。
	*/
type target = {
	url: string;
	admin_name: string;
	password: string;
	token: string;
};
const targets: [target, target] = [
	{
		url: "http://127.0.0.1:9528/api",
		admin_name: "master",
		password: "Hello123#",
		token: "",
	},
	{
		url: "http://127.0.0.1:9528/api",
		admin_name: "master",
		password: "Hello123#",
		token: "",
	},
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
		//ロールの追加
		{
			const testData = {
				name: "テストプロダクト",
				config: { data1: "data1value" },
			};
			const resdata = [];
			for (const target of targets) {
				const { data } = await axios({
					baseURL: `${target.url}`,
					url: `role`,
					method: "post",
					headers: {
						Authorization: target.token,
					},
					data: testData,
				});
				console.log(data.data);
				const addRole = data.data;
				expect(addRole).toMatchObject(testData);
				resdata.push(addRole);
			}
			expect(resdata[0]).toMatchObject(resdata[1]);
		}
	// add Question
		{
		const testData = {
				name: "テストプロダクト",
				config: { data1: "data1value" },
		};
			const resdata = [];
			for (const target of targets) {
				const res  = await axios({
					baseURL: `${target.url}`,
					url: `question`,
					method: "post",
					headers: {
						Authorization: target.token,
					},
					data: testData,
				});
				console.log(res.data.data);
				//先程追加したものを追加
				const { data } = await axios({
					baseURL: `${target.url}`,
					url: `question/${res.data.data}/`,
					method: "get",
					headers: {
						Authorization: target.token,
					},
					data: testData,
				});
				const addRole = data.data;
				expect(addRole).toMatchObject(testData);
				resdata.push(addRole);
			}
			expect(resdata[0]).toMatchObject(resdata[1]);
		}
	});
	test("add Question", async () => {
		const N = 10;
		for (let i = 0; i < N;i++) {
			const question = {
				title: faker.hacker.noun() + "ってなんですか？",
				label: faker.hacker.noun() + "ってなんですか？",
				is_public: true,
				config: {},
			};
			for (const target of targets) {
				const { data } = await axios({
					baseURL: `${target.url}`,
					url: `question`,
					method: "post",
					headers: {
						Authorization: target.token,
					},
					data: question,
				});
				console.log(data);

				/**
					* プロダクトとロールの紐付けをする。
					*/
				/**
					* ポストしたものをゲットする。モックと比較する
					*/
					/**
					* アンサーを登録し、プロダクトとロールの紐付けをする。
					*/
				/**
					* ポストしたものをゲットする。モックと比較する
					*/
				/**
					* ポストしたものをユーザー用APIでゲットする。モックと比較する
					*/
			}
		}
	});
		test("ロールの追加と、ランダムに質問へのロールの紐付け", async () => {
		const N = 10;
		for (let i = 0; i < N;i++) {
			const question = {
				title: faker.hacker.noun() + "ってなんですか？",
				label: faker.hacker.noun() + "ってなんですか？",
				is_public: true,
				config: {},
			};
			for (const target of targets) {
				const { data } = await axios({
					baseURL: `${target.url}`,
					url: `role`,
					method: "post",
					headers: {
						Authorization: target.token,
					},
					data: question,
				});
				console.log(data);

				/**
					* プロダクトとロールの紐付けをする。
					*/
				/**
					* ポストしたものをゲットする。モックと比較する
					*/
					/**
					* アンサーを登録し、プロダクトとロールの紐付けをする。
					*/
				/**
					* ポストしたものをゲットする。モックと比較する
					*/
				/**
					* ポストしたものをユーザー用APIでゲットする。モックと比較する
					*/
			}
		}
	});
});
