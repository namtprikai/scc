import * as tf from '@tensorflow/tfjs';
// @ts-ignore
import word_dict from './word_dict.js';
const emotions = ['happy', 'sad', 'disgust', 'angry', 'fear', 'surprise'];
const emotionMapper = {
	happy: '嬉しい',
	sad: '悲しい',
	disgust: 'きもい',
	angry: 'おこ',
	fear: '怖い',
	surprise: 'びっくり',
};
export namespace Saiko {
	const kanjo = (text: string, tokenizer: { [key: string]: number }, maxlen = 280) =>
		// return tf.tensor([1, 2, 3]);
		tf.tensor([
			new Array(maxlen)
				.fill(0)
				.concat([...text].map(c => tokenizer[c] || 0))
				.slice(-maxlen),
		]);

	export function KanjoStringto(obj: { [key: string]: number }, maxCoeff = 40) {
		if (Object.keys(obj).length === 0) {
			return null;
		}

		let max = 0;
		let maxKey = '';
		for (const [key, value] of Object.entries(obj)) {
			if (value > max) {
				max = value;
				maxKey = key;
			}
		}
		if (max < maxCoeff) {
			return null;
		}
		return maxKey;
	}

	let model: any = null; // tf.LayersModel | null = null;
	export const init = async () => {
		model = await tf.loadLayersModel('./models/0.3/model.json');
	};
	export const mind = async (text: string) => {
		console.log('mind');
		if (model === null) {
			await init();
		}
		const targets = kanjo(text, word_dict);
		if (model) {
			const ans = model.predict(targets);
			if (!Array.isArray(ans)) {
				const [d]: any = await ans.array();
				if (Array.isArray(d)) {
					const [happy, sad, disgust, angry, fear, surprise] = d.map(n => Math.round(n * 100));
					return { happy, sad, disgust, angry, fear, surprise };
				}
			}
		}
		return null;
		// const kanjo = ansList[0].map(d => Math.round(d * 100));
	};
	export const mindSync = (text: string) => {
		const targets = kanjo(text, word_dict);
		if (model) {
			const ans = model.predict(targets);
			if (!Array.isArray(ans)) {
				const [d]: any = ans.arraySync();
				if (Array.isArray(d)) {
					const [happy, sad, disgust, angry, fear, surprise] = d.map(n => Math.round(n * 100));
					console.table([happy, sad, disgust, angry, fear, surprise]);
					return { happy, sad, disgust, angry, fear, surprise };
				}
			}
		}
		return null;
		// const kanjo = ansList[0].map(d => Math.round(d * 100));
	};
}
