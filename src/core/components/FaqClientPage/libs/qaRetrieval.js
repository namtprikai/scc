/* eslint-disable */

'use strict'
import tinySegmenter from './tinySegmenter'
const defaultEstimatorWeightNormalizationFactor = {
	tmss: 0.1,
	edss: 30,
	tiss: 2.73,
	ngss: 0.38,
}
class BaseScriptSearch {
	constructor(scriptData) {
		this.scriptData = scriptData
		this.stopWords = [
			'　',
			' ',
			'の',
			'が',
			'れ',
			'なっ',
			'しまっ',
			'すれ',
			'い',
			'なら',
			'どう',
			'せる',
			'する',
			'こと',
			'でき',
			'はいつ',
			'ため',
			'時',
			'なり',
			'かけ',
			'すぐ',
			'し',
			'する',
			'できる',
			'いる',
			'した',
			'ある',
			'さ',
			'はどこか',
			'場合',
			'？',
			'?',
		]
		this.search = (query = '') => {}
		this.createModel = (sentences, labels) => {}
		this.saveModel = () => {}
		this._sortScore = (scores) => {
			return scores
				.filter((o, i, a) => {
					let max = 0
					let maxI = 0
					a.forEach((_o, _i, _a) => {
						if (o.id == _o.id) {
							max = Math.max(max, _o.weight)
							if (max <= _o.weight) {
								maxI = _i
							}
						}
					})
					return max == o.weight && maxI == i
				})
				.sort((a, b) => {
					if (a.weight > b.weight) {
						return -1
					} else if (a.weight == b.weight) {
						return 0
					}
					return 1
				})
		}
		try {
			this.sortedKeywordVariationsDict = Object.keys(
				this.scriptData.synonymDict || {},
			)
				.filter((k) => {
					return !!(k && this.scriptData.synonymDict[k])
				})
				.map((k) => {
					return { key: k, value: this.scriptData.synonymDict[k] }
				})
				.sort((a, b) => {
					return b.key.length - a.key.length
				})
		} catch (e) {
			console.log(e)
		}
	}
}
class TextMatchScriptSearch extends BaseScriptSearch {
	constructor(scriptData) {
		super(scriptData)
		this.scriptData = scriptData
		this.search = (query = '') => {
			let score = []

			if (query.length <= 1) {
				return score
			}

			if (this.scriptData.categoryData) {
				score = this.scriptData.categoryData
					.filter(
						(script) => script.type === 'leaf' && script.text.indexOf(query) !== -1,
					)
					.map((script) => {
						return { id: script.id, weight: 1 / script.text.length }
					})
			}

			// const scores = []
			// for (let sidx in tempScores) {
			//   scores.push({ id: sidx, weight: tempScores[sidx] })
			// }
			const result = this._sortScore(score)
			const filteredResult = result.slice(0, 10)
			return filteredResult
			// return scoreArray.filter(o=>o.weight>0);
		}
	}
	// _checkStopWords(word = '') {
	//   if (this.stopWords.indexOf(word) != -1) {
	//     return true
	//   }
	//   return false
	// }
}
class TFIDFScriptSearch extends BaseScriptSearch {
	constructor(scriptData) {
		super(scriptData)
		this.scriptData = scriptData
		this._formVocabulary = (text = '') => {
			const vocabulary = []
			for (let word in this.scriptData.synonymDict) {
				if (text.indexOf(word.toLowerCase()) != -1) {
					vocabulary.push(this.scriptData.synonymDict[word].toLowerCase())
				}
			}
			for (let word in this.scriptData.invertedIndex) {
				if (text.indexOf(word) != -1) {
					vocabulary.push(word)
				}
			}
			return [...new Set(vocabulary)]
		}
		this.search = (query = '') => {
			const vocabulary = this._formVocabulary(query)
			const tempScores = {}
			for (let i = 0; i < vocabulary.length; i++) {
				if (vocabulary[i] in this.scriptData.invertedIndex) {
					const key = vocabulary[i]
					try {
						for (
							let j = 0;
							j < this.scriptData.invertedIndex[key].scripts.length;
							j++
						) {
							const matched_script_idx = this.scriptData.invertedIndex[key].scripts[
								j
							][0]
							tempScores[matched_script_idx] =
								(tempScores[matched_script_idx] || 0) +
								this.scriptData.invertedIndex[key].weight
						}
					} catch (e) {
						console.log(e)
						continue
					}
				}
			}
			const scores = []
			for (let sidx in tempScores) {
				const numOfKeywords = this.scriptData.matchingScript[sidx].num_of_keywords
				const normalizedScore = tempScores[sidx] / numOfKeywords
				scores.push({
					id: this.scriptData.matchingScript[sidx].id,
					weight: normalizedScore,
				})
			}
			// result = this._sortScore(score)
			const result = this._sortScore(scores)
			return result
		}
	}
}
class EditDistanceScriptSearch extends BaseScriptSearch {
	constructor(scriptData) {
		super(scriptData)
		this.scriptData = scriptData
		this.search = (query = '') => {
			const tempScores = {}
			if (this.scriptData.categoryData) {
				for (let i = 0; i < this.scriptData.categoryData.length; i++) {
					if (this.scriptData.categoryData[i].type != 'leaf') {
						continue
					}

					const distanceSimilarity =
						(1 -
							this._levenshteinDistance(
								query,
								this.scriptData.categoryData[i].text.toLowerCase(),
							) /
								Math.max(this.scriptData.categoryData[i].text.length, query.length)) *
						100
					if (distanceSimilarity > 50) {
						if (
							!(
								this.scriptData.categoryData[i].id in tempScores &&
								distanceSimilarity > tempScores[this.scriptData.categoryData[i].id]
							)
						) {
							tempScores[
								this.scriptData.categoryData[i].id
							] = this.scriptData.categoryData[i].weight = distanceSimilarity
						}
					}
				}
			}
			const scores = Object.keys(tempScores) //.filter(sid=>tempScores[sid] > 30)
				.map((sid) => {
					return { id: sid, weight: tempScores[sid] }
				})

			const result = this._sortScore(scores)
			return result
		}
	}
	_levenshteinDistance(str1 = '', str2 = '') {
		const x = str1.length
		const y = str2.length
		const d = []
		for (let i = 0; i <= x; i++) {
			d[i] = []
			d[i][0] = i
		}
		for (let i = 0; i <= y; i++) {
			d[0][i] = i
		}
		let cost = 0
		for (let i = 1; i <= x; i++) {
			for (let j = 1; j <= y; j++) {
				cost = str1[i - 1] == str2[j - 1] ? 0 : 1
				d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
			}
		}
		return d[x][y]
	}
}
class NGramScriptSearch extends BaseScriptSearch {
	constructor(scriptData) {
		super(scriptData)
		this.scriptData = scriptData
		this.scriptTitleNgram = []
		this._replaceWithRepresentativeWords = (words = []) => {
			return words
				.map((w) => {
					const lowerW = w.toLowerCase()
					return this.scriptData.synonymDict && lowerW in this.scriptData.synonymDict
						? this.scriptData.synonymDict[lowerW]
						: lowerW
				})
				.filter((w) => {
					return this.stopWords.indexOf(w) == -1
				})
		}
		this._agglomerateWordList = (words, start = 0, end = 5) => {
			const output = []
			for (let n = start; n < words.length; n++) {
				if (n >= end) {
					break
				}
				for (let start_index = 0; start_index < words.length - n; start_index++) {
					output.push(words.slice(start_index, start_index + n + 1).join(''))
				}
			}
			return output
		}
		this.search = (query = '') => {
			const queryWakati = this.segmenter.segment(query)
			const filteredQueryWakati = queryWakati.filter(
				(w) => this.stopWords.indexOf(w) !== -1,
			)
			const queryNgram = new Set(
				this._replaceWithRepresentativeWords(filteredQueryWakati),
			)
			// let queryNgram = new Set(queryWakati);
			const tempScores = {}
			for (let i = 0; i < this.scriptTitleNgram.length; i++) {
				const currentScriptNgram = this.scriptTitleNgram[i].ngram
				// console.log(currentScriptNgram);
				const intersect = new Set(
					[...currentScriptNgram].filter((i) => queryNgram.has(i)),
				)
				const score =
					(intersect.size * 2) / (queryNgram.size + currentScriptNgram.size)
				if (score > 0) {
					tempScores[this.scriptTitleNgram[i].id] =
						(intersect.size * 2) / (queryNgram.size + currentScriptNgram.size)
				}
			}
			const scores = []
			for (let sid in tempScores) {
				scores.push({ id: sid, weight: tempScores[sid] })
			}
			const result = this._sortScore(scores)
			return result
		}
		this.segmenter = tinySegmenter
		if (this.scriptData.categoryData) {
			for (let i = 0; i < this.scriptData.categoryData.length; i++) {
				if (this.scriptData.categoryData[i].type != 'leaf') {
					continue
				}
				const textWakati = this.segmenter.segment(
					this.scriptData.categoryData[i].text,
				)
				// let ngram = new Set( this._agglomerateWordList(this._replaceWithRepresentativeWords(textWakati)));
				try {
					const ngram = new Set(this._replaceWithRepresentativeWords(textWakati))
					this.scriptTitleNgram.push({
						id: this.scriptData.categoryData[i].id,
						ngram: ngram,
					})
				} catch (e) {
					console.log(e)
				}
			}
		}
	}
}
export class ScriptMatchingManager {
	constructor(scriptData) {
		this.scriptData = scriptData
		this.threshold = 0
		this.getSearchResult = (query) => {
			return this.search(query).map((q) => q.id)
		}

		this._aggregateScores = (scores) => {
			const estimatorWeightNormalizationFactor = defaultEstimatorWeightNormalizationFactor
			const aggregatedScore = {}
			for (const key in scores) {
				for (let i = 0; i < scores[key].length; i++) {
					aggregatedScore[scores[key][i].id] =
						(aggregatedScore[scores[key][i].id] || 0) +
						scores[key][i].weight / estimatorWeightNormalizationFactor[key]
				}
			}
			const finalScores = []
			for (const sid in aggregatedScore) {
				finalScores.push({ id: sid, weight: aggregatedScore[sid] })
			}

			return finalScores.sort((a, b) => {
				if (a.weight > b.weight) {
					return -1
				} else if (a.weight == b.weight) {
					return 0
				}
				return 1
			})
		}
		this.testSearch = (testQueries = []) => {
			// testQueries = ["カメラが欲しい","スクリーンショットのとり方","バーコードエラーになるのですが","PCが重いです","電話機のディスプレイ","i-Tab","タブレットのアップデートが","カメラ","彦根","boss つながらない","pdf 開けない","ネット つながらない","boss モニター","土浦","総務部","一条ムービーズ","見積","加工依頼　ロック","ネットに","パソコン","パソコンの画面","ネット 開かない","ブラウザに関する","ネット　つながらない","インターネットに繋がらない","タブレットの充電","印刷機が","連絡先","Ieがうまく開かない","カメラ","ブラウザに関する質","ブラウザに関する","ネットが","ブラウザに関す","タブレットのロック","pcの移行","タブレットの充電器","パソコンが立ち上がらない","カメラが欲しい","スクリーンショットのとり方","pcが暗い","ｐｃ暗い","印刷できない"];
			let start_ms = new Date().getTime()
			const testReuslt = {}
			for (const tq of testQueries) {
				start_ms = new Date().getTime()
				const tmssScore = this.tmss.search(tq)
				console.log('tmss:' + (new Date().getTime() - start_ms).toString())
				start_ms = new Date().getTime()
				const edssScore = this.edss.search(tq)
				console.log('edss:' + (new Date().getTime() - start_ms).toString())
				start_ms = new Date().getTime()
				const tissScore = this.tiss.search(tq)
				console.log('tiss:' + (new Date().getTime() - start_ms).toString())
				start_ms = new Date().getTime()
				const ngssScore = this.ngss.search(tq)
				console.log('ngss:' + (new Date().getTime() - start_ms).toString())
				const scores = {
					tmss: tmssScore,
					edss: edssScore,
					tiss: tissScore,
					ngss: ngssScore,
				}
				testReuslt[tq] = scores
			}
			return testReuslt
		}
		this.tmss = new TextMatchScriptSearch(scriptData)
		this.edss = new EditDistanceScriptSearch(scriptData)
		this.tiss = new TFIDFScriptSearch(scriptData)
		this.ngss = new NGramScriptSearch(scriptData)
	}
	search(query) {
		query = query.replace(/[\!！\?？、。・\.\,♪\:\;＾\^]+$/, '')
		// var start_ms = new Date().getTime();
		const tmssScore = this.tmss.search(query)
		// console.info("tmss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const edssScore = this.edss.search(query)
		// console.info("edss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const tissScore = this.tiss.search(query)
		// console.info("tiss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const ngssScore = this.ngss.search(query)
		// console.info("ngss:"+ (new Date().getTime() - start_ms).toString());
		// let ngssScore={}
		const scores = {
			tmss: tmssScore,
			edss: edssScore,
			tiss: tissScore,
			ngss: ngssScore,
		}
		//console.info(scores);
		const rankResult = this._aggregateScores(scores)
		const filteredResult = rankResult.filter((o) => {
			const maxWeight = rankResult[0].weight
			return o.weight > this.threshold && o.weight > maxWeight / 2
		})

		return filteredResult
	}
}
