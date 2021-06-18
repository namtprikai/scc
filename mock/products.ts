import {IProductData} from '../src/core/api/types';
export const productions:Array<IProductData> =[
	{
		id:0,
		name:"サーチタグ(自社顧客向けCPサイト埋め込み)",
		config:{},
		created:new Date(),
		modified:new Date(),
		max_failure_count_user:3,
		max_failure_time_user:5
	},
	{
		id:1,
		name:"ショッピングサイトAのチャットボット",
		config:{},
		created:new Date(),
		modified:new Date(),
		max_failure_count_user:3,
		max_failure_time_user:5
	}
];
