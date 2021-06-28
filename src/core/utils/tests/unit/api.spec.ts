import axios from 'axios';
const MOCK_URL = 'http://127.0.0.1:9528/api/';
const API_SERVER_URL = '';
// API　サーバーテスト
//　各テーブルの初期化
test('DELETE ALL TABLE', async () => {
	const targets = ['MOCK_URL', 'API_SERVER_URL'];
	for (const target of targets) {
		const productsRes = await axios({
			baseURL: `${target}`,
			url: `product/`,
			method: 'get',
		})
		const productList = productsRes.data;
		for (const product_id of productList) {
			await axios({
				baseURL: `${target}`,
				url: `product/${product_id}`,
				method: 'delete',
			})
		}
	}
	//　テーブルをすべて削除したあと、アドミン、プロダクト、ロールなど、各項目の登録、紐付けを行い、各項目のgetAPI、patchを行い、モックと同等の結果が得られるかをテストする。
	// expect(scenario).toEqual(scenarioBot);
});
