import faker from 'faker'
import { Response, Request } from 'express'
import { IAnswerData, IConditionData, IConditionGroupData, IScenarioTree, IScenarioTreeCondition } from '../src/core/api/types'
import { IAPIResponce } from '../src/core/api/types'
import { getConditionListByUserToken, getConditionListByAnserId, getConditionList,getConditionListByConditionGroupId } from "./condition";
import { getConditionGroupById } from "./conditionGroup";
import { getUserByToken } from 'users';
import { auth } from 'security';
import { getAnswerRolesByAnswerId } from 'answer_roles';
interface IConditionMap extends Map<number, { conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> {

}
export interface IAnswerDataCondition extends IAnswerData {
	anserConditionMap?: IConditionMap;
}
interface IAnserAPIResponce extends Response {
	json: (args: {
		status: number;
		data: {
			ansers: Array<IAnswerData>;
			flow?: IScenarioTree;
		};
	}) => any;
}
export const answers: Array<IAnswerData> = [
	{
		id: 0,
		question_id: 0,
		text: "それはプリウスです。何故ならば・・・",
		is_public: true,
		created: new Date(),
		modified: new Date(),
	},
	{
		id: 1,
		question_id: 0,
		text: "それはランクルです。何故ならば・・・",
		is_public: true,
		created: new Date(),
		modified: new Date(),
	}
];
export const getAnsers = (req: Request, res: IAPIResponce): IAnserAPIResponce => {
	const { question_id } = req.params;
	const accessToken = req.header('Authorization')||"";

	let conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> = [];
	const conditionGroupKeyConditionMap:Map<number,{conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> = new Map();
	const user = getUserByToken(accessToken);
	if (accessToken&&user) {

		let anserList: Array<IAnswerDataCondition> = answers
		.filter(a => {
			if(String(a.question_id) === question_id){
				const aRoles = getAnswerRolesByAnswerId(a.id);
				return auth(user,aRoles);
			}
			return false;
		});
		if (anserList.length === 1) {
			return res.json({
				status: 20000,
				data: { ansers: anserList }
			})
		}
		const userConditionList = getConditionListByUserToken(accessToken);
		const userConditionMap: IConditionMap = new Map();
		//userConditionMap作成開始
		for (const userCondition of userConditionList) {
			const userConditionGroup = getConditionGroupById(userCondition.conditiongroup_id);
			if (userConditionGroup) {
				if (!userConditionMap.has(userConditionGroup.id)) {
					userConditionMap.set(userConditionGroup.id, { conditionGroup: userConditionGroup, conditions: [] });
				}
				const conditionObj = userConditionMap.get(userConditionGroup.id);
				if (conditionObj) {
					const { conditionGroup, conditions } = conditionObj;
					conditions.push(userCondition);
				}
			}
		}
		//userConditionMap作成完了
		anserList = anserList.filter((anser: IAnswerDataCondition) => {
			const conditions = getConditionListByAnserId(anser.id);
			console.log('conditions',conditions);
			const anserConditionMap: IConditionMap = new Map();
			//anserConditionMap作成開始
			for (const condition of conditions) {
				const anserConditionGroup = getConditionGroupById(condition.conditiongroup_id);
				if (anserConditionGroup) {
					if (!anserConditionMap.has(anserConditionGroup.id)) {
						anserConditionMap.set(anserConditionGroup.id, { conditionGroup: anserConditionGroup, conditions: [] });

					}
					const conditionObj = anserConditionMap.get(anserConditionGroup.id);
					if (conditionObj) {
						const { conditionGroup, conditions } = conditionObj;
						conditions.push(condition);
					}
					if(!conditionGroupKeyConditionMap.has(condition.conditiongroup_id)){
						conditionGroupKeyConditionMap.set(condition.conditiongroup_id, { conditionGroup:anserConditionGroup,conditions: getConditionListByConditionGroupId(condition.conditiongroup_id) });
					}
				}

			}
			//anserConditionMap作成完了

			for (const anserCGroupId of anserConditionMap.keys()) {
				if (userConditionMap.has(anserCGroupId)) {
					//共通のconditionGroupだということ
					const anserConditions = anserConditionMap.get(anserCGroupId)?.conditions;
					const userConditions = userConditionMap.get(anserCGroupId)?.conditions;
					if (anserConditions && userConditions) {
						//共通のコンディショングループのコンディションを保持していながら、積集合が空集合だということは対象のアンサーではないので除外
						const intersectionAUCondition = anserConditions.filter(ac => !new Set([...userConditions.map(u => u.id)]).has(ac.id));
						if (intersectionAUCondition.length === 0) {
							return false;
						}
					}
				}
			}
			anser.anserConditionMap = anserConditionMap;
			return true;
		});
	//ここまででユーザーに対して可能性のあるアンサーの絞り込み。
	//この時点で可能性のあるアンサーが一つに絞り込まれたならそれを返す。
	if (anserList.length === 1) {
		anserList.map(a=>{
			const o:any = {};
			if(a.anserConditionMap){
				for(const [k,v] of a.anserConditionMap){
					o[k] = v;
				}
			}
			a.anserConditionMap=o;
			return a;
		});
		return res.json({
			status: 20000,
			data: { ansers: anserList }
		})
	}
	//絞り込まれていないアンサーを絞り込むのに必要なコンディションを作る処理
	for(const [gid,conditionObj] of conditionGroupKeyConditionMap.entries()) {
		getConditionGroupById(gid);
		conditionList.push({ conditionGroup:conditionObj.conditionGroup, conditions: conditionObj.conditions });
	}
	// ここから複数アンサーをコンディションで絞り込むためのツリー構造JSONを作成する処理に入る
	conditionList = conditionList.sort((a, b) => {
		if (a.conditionGroup.level > b.conditionGroup.level) {
			return 1;
		}
		if (a.conditionGroup.level < b.conditionGroup.level) {
			return -1;
		}
		return 0;
	});

	// let anserSet: Set<IAnswerDataCondition> = new Set([...anserList]);
	// const scenarioTree: IScenarioTree = MakeFlow3(conditionList, anserSet);
	anserList.map(a=>{
		const o:any = {};
		if(a.anserConditionMap){
			for(const [k,v] of a.anserConditionMap){
				o[k] = v;
			}
		}
		a.anserConditionMap=o;
		return a;
	});

	return res.json({
		status: 20000,
		data: {
			ansers: anserList,
			conditionList
		}
	})
}
return res.status(400).json({
	status: 50004,
	data:{
		errors:[
			{status: 'forbidden_error'}
		]
	}
})
}

export const test = () => {
	console.log("TEST");
	let conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> = [
		{
			conditionGroup: {
				id: 0,
				label: "sex",
				is_setting: true,
				level: 1,
			},
			conditions: [
				{
					id: 0,
					label: "男",
					conditiongroup_id: 0,
				},
				{
					id: 1,
					label: "女",
					conditiongroup_id: 0,
				},
			]
		},
		{
			conditionGroup: {
				id: 1,
				label: "収入",
				is_setting: true,
				level: 2,
			},
			conditions: [
				{
					id: 2,
					label: "500万円未満",
					conditiongroup_id: 1,
				},
				{
					id: 3,
					label: "500万円以上",
					conditiongroup_id: 1,
				}
			]
		},
		{
			conditionGroup: {
				id: 2,
				label: "家族構成",
				is_setting: true,
				level: 2,
			},
			conditions: [
				{
					id: 4,
					label: "独身",
					conditiongroup_id: 2,
				},
				{
					id: 5,
					label: "二人〜５",
					conditiongroup_id: 2,
				},
				{
					id: 6,
					label: "5人以上",
					conditiongroup_id: 2,
				}
			]
		},
	];
	const anserList = [
		{
			id: 0,
			question_id: 0,
			text: "それはプリウスです。何故ならば・・・",
			is_public: true,
			created: new Date(),
			modified: new Date(),
			anserConditionMap: new Map([
				[0, {
					conditionGroup: {
						id: 0,
						label: "sex",
						is_setting: true,
						level: 1,
					},
					conditions: [
						{
					id: 0,
					label: "男",
					conditiongroup_id: 0,
				},
					]
				}
				],
				[1, {
					conditionGroup: {
						id: 1,
						label: "収入",
						is_setting: true,
						level: 2,
					},
					conditions: [
						{
							id: 2,
							label: "500万円未満",
							conditiongroup_id: 1,
						}
					],
				}
				],
				[2, {
					conditionGroup: {
						id: 2,
						label: "家族構成",
						is_setting: true,
						level: 3,
					},
					conditions: [
						{
							id: 4,
							label: "独身",
							conditiongroup_id: 2,
						},
						{
							id: 5,
							label: "二人〜５",
							conditiongroup_id: 1,
						},
					],
				}
				]
			])
		},
		{
			id: 1,
			question_id: 0,
			text: "それはランクルです。何故ならば・・・",
			is_public: true,
			created: new Date(),
			modified: new Date(),
			anserConditionMap: new Map([
				[0, {
					conditionGroup: {
						id: 0,
						label: "sex",
						is_setting: true,
						level: 1,
					},
					conditions: [
						{
							id: 0,
							label: "男",
							conditiongroup_id: 0,
						}, {
							id: 1,
							label: "女",
							conditiongroup_id: 0,
						},
					]
				}
				],
				[1, {
					conditionGroup: {
						id: 1,
						label: "収入",
						is_setting: true,
						level: 3,
					},
					conditions: [
						{
							id: 3,
							label: "500万円以上",
							conditiongroup_id: 1,
						}
					],
				}
				],
				[2, {
					conditionGroup: {
						id: 2,
						label: "家族構成",
						is_setting: true,
						level: 2,
					},
					conditions: [
						{
							id: 4,
							label: "独身",
							conditiongroup_id: 2,
						},
						{
							id: 5,
							label: "二人〜５",
							conditiongroup_id: 2,
						},
						{
							id: 6,
							label: "5人以上",
							conditiongroup_id: 2,
						}
					],
				}
				]
			])
		},
		{
			id: 2,
			question_id: 0,
			text: "それはヴィッツです。何故ならば・・・",
			is_public: true,
			created: new Date(),
			modified: new Date(),
			anserConditionMap: new Map([
				[0, {
					conditionGroup: {
						id: 0,
						label: "sex",
						is_setting: true,
						level: 1,
					},
					conditions: [
						{
							id: 1,
							label: "女",
							conditiongroup_id: 0,
						},
					]
				}
				],
				[1, {
					conditionGroup: {
						id: 1,
						label: "収入",
						is_setting: true,
						level: 3,
					},
					conditions: [
						{
							id: 2,
							label: "500万円未満",
							conditiongroup_id: 1,
						}
					],
				}
				],
				[2, {
					conditionGroup: {
						id: 2,
						label: "家族構成",
						is_setting: true,
						level: 2,
					},
					conditions: [
						{
							id: 4,
							label: "独身",
							conditiongroup_id: 2,
						},
						{
							id: 5,
							label: "二人〜５",
							conditiongroup_id: 2,
						},
					],
				}
				]
			])
		}
	]

	let anserSet: Set<IAnswerDataCondition> = new Set([...anserList]);
	const scenarioTree: IScenarioTree = MakeFlow(conditionList, anserSet);
	console.log(JSON.stringify(scenarioTree));
		console.log("-------------------");
	const scenarioTree2: IScenarioTree | undefined = MakeFlow2(conditionList, anserSet);

	console.log(JSON.stringify(scenarioTree2));
		console.log("-------------------");
		const scenarioTree3: IScenarioTree | undefined = MakeFlow3(conditionList, anserSet);
	console.log(JSON.stringify(scenarioTree3));
		console.log("-------------------");
}
function MakeFlow(_conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }>, ansers: Set<IAnswerDataCondition>, conditionHistory: Array<IConditionData> = []): IScenarioTree {
	const conditionList = [..._conditionList];
	console.log("ansers", ansers);
	let conditionObj = conditionList.shift();
	if (ansers.size > 1) {
		loop1: while (conditionObj) {
			let beforeCons = null;
			for (const anser of ansers) {
				// if(conditionObj.conditionGroup.id){
				const aCon = anser.anserConditionMap?.get(conditionObj.conditionGroup.id);
				const conditions = aCon?.conditions;
				if (conditions) {
					console.log("conditions", conditions);
					const conditionIds = conditions.map(c => c.id);
					if (beforeCons) {
						const bSize = beforeCons.size;
						if (bSize !== conditionIds.length) {
							break loop1;
						}
						for (const c of conditionIds) {
							beforeCons.add(c);
						}
						if (bSize !== beforeCons.size) {
							break loop1;
						}
					}
					beforeCons = new Set(conditionIds);
				} else {
					break;
				}
				// }
			}
			conditionObj = conditionList.shift();
		}
		console.log("asdf", conditionObj);
		if (conditionObj) {
			// data.next = {conditionGroup:condition?.conditionGroup,conditions:[]};
			return {
				conditionGroup: conditionObj.conditionGroup,
				conditions: conditionObj.conditions.map(c => {
					const _ansers: Set<IAnswerDataCondition> = new Set();
					for (const anser of ansers) {
						const _cObj = anser.anserConditionMap?.get(c.conditiongroup_id);
						if (_cObj !== undefined && !_cObj.conditions.find(d => d.id === c.id)) {
							console.log(_cObj.conditions);
							continue;
						}
						_ansers.add(anser);
					}
					console.log(_ansers);
					return {
						condition: c,
						next: MakeFlow(conditionList, _ansers)
					}
				}).filter(c => c.next.anserIds.length > 0),
				conditionHistory: [...conditionHistory],
				anserIds: [...ansers.values()].map(a => a.id)
			};
		}
	}
	return {
		conditionHistory: [...conditionHistory],
		anserIds: [...ansers.values()].map(a => a.id)
	};
}
function MakeFlow2(_conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }>, _ansers: Set<IAnswerDataCondition>): IScenarioTree | undefined {
	interface IM extends IScenarioTree {
		ansers?: Set<IAnswerDataCondition>;
		conditionIndex?: number;
		conditions?: Array<IMCon>;
	}
	interface IMCon extends IScenarioTreeCondition {
		next?: IM;
	}

	const st: IM = {
		ansers: new Set(_ansers),
		anserIds: [..._ansers.values()].map(a => a.id),
		conditionHistory: [],
		conditionIndex: 0,
	};
	const que: Array<IM> = [st];
	const conditionList = [..._conditionList];
	rootLoop:while (que.length > 0) {
		const s = que.shift();

		if (s && s.ansers && s.conditionIndex !== undefined) {
			console.log("SSSS",s);
			const { ansers } = s;
			let { conditionIndex } = s;
			let conditionObj = conditionList[conditionIndex];
			console.log(conditionIndex);
			if (ansers.size > 1) {
				loop1: while (conditionObj) {
					let beforeCons = null;
					for (const anser of ansers) {
						const aCon = anser.anserConditionMap?.get(conditionObj.conditionGroup.id);
						const conditions = aCon?.conditions;
						if (conditions) {
							console.log("conditions", conditions);
							const conditionIds = conditions.map(c => c.id);
							if (beforeCons) {
								const bSize = beforeCons.size;
								if (bSize !== conditionIds.length) {
									break loop1;
								}
								for (const c of conditionIds) {
									beforeCons.add(c);
								}
								if (bSize !== beforeCons.size) {
									break loop1;
								}
							}
							beforeCons = new Set(conditionIds);
						} else {
							// break;
						}
					}
					conditionObj = conditionList[conditionIndex++];
				}
				console.log(conditionIndex);
				if (conditionObj==undefined) {
					continue rootLoop;
				}
				s.conditions = [];
				s.conditionGroup = conditionObj.conditionGroup;
				for (const natCondition of conditionObj.conditions) {
					const newAnsers: Set<IAnswerDataCondition> = new Set();
					for (const anser of ansers) {

						const aCon = anser.anserConditionMap?.get(conditionObj.conditionGroup.id);
						const conditions = aCon?.conditions;
						if (conditions && conditions.find(c => c.id === natCondition.id)) {
							newAnsers.add(anser);
						} else if (conditions === undefined) {
							newAnsers.add(anser);
						}
					}
					if (newAnsers.size <= 0) {
						continue;
					}
					// const { conditionHistory } = s;
					console.log("anser",newAnsers);
					const next: IM = {
						conditionIndex: conditionIndex + 1,
						anserIds: [...newAnsers.values()].map(a => a.id),
						// conditionHistory: [...conditionHistory],
						ansers: newAnsers
					};
					// next.conditionHistory.push(natCondition);
					const condition = {
						condition: natCondition,
						next
					};
					s.conditions.push(condition);
					que.push(next);
				}
				// delete s.ansers;
				// delete s.conditionIndex;
			}
		}

	}
	return st;
}
function MakeFlow3(_conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData>, score?: number }>, ansers: Set<IAnswerDataCondition>,deep:number=0, conditionHistory: Array<IConditionData> = [],condition?:IConditionData): IScenarioTree {
	const conditionList = [..._conditionList];
	let maxScoreIndex = 0;
	if (ansers.size > 1&&deep<5) {
		loop1: for (let i = 0; i < conditionList.length; i++) {
			const conditionObj = conditionList[i];
			const allConditionSize = conditionObj.conditions.length;
			const anserConditionList:Array<Set<number>> = [...ansers].map(a => {
				const conditions = a.anserConditionMap?.get(conditionObj.conditionGroup.id);
				if (conditions == undefined) {
					return new Set();
				}
				return new Set(conditions.conditions.map(c => c.id));
			});
			const score = getTScore(anserConditionList, allConditionSize);
			conditionObj.score = score;
			if ((conditionList[maxScoreIndex].score||0)<score) {
				maxScoreIndex = i;
			}
			if(score>0.9){
				break loop1;
			}
		}
		const maxScore = conditionList[maxScoreIndex]?.score || -1;
		const [conditionObj] = conditionList.splice(maxScoreIndex, 1);
		// if (condition) {
		// 	conditionHistory.push(condition);
		// }
		if (conditionObj&&maxScore>0.3) {
			// data.next = {conditionGroup:condition?.conditionGroup,conditions:[]};
			return {
				conditionGroup: conditionObj.conditionGroup,
				conditions: conditionObj.conditions.map(c => {
					const _ansers: Set<IAnswerDataCondition> = new Set();
					for (const anser of ansers) {
						const _cObj = anser.anserConditionMap?.get(c.conditiongroup_id);
						if (_cObj !== undefined && !_cObj.conditions.find(d => d.id === c.id)) {
							console.log(_cObj.conditions);
							continue;
						}
						_ansers.add(anser);
					}
					if(_ansers.size===0){
						return {
							condition: c,
						}
					}
					return {
						condition: c,
						next: MakeFlow3(conditionList, _ansers,deep+1,conditionHistory,c)
					}
				}).filter(c => c.next&&c.next.anserIds.length > 0),
				// conditionHistory: [...conditionHistory],
				anserIds: [...ansers.values()].map(a => a.id)
			};
		}
	}
	return {
		// conditionHistory: [...conditionHistory],
		anserIds: [...ansers.values()].map(a => a.id)
	};
	function getTScore(conditionSetList: Array<Set<number>>, allConditionSize: number): number {
		const coeff = 10;
		let countA = 0, countB = 0;
		let beforeSet: Set<number> = new Set(conditionSetList[conditionSetList.length-1]);
		for (const conditionSet of conditionSetList) {
			if (conditionSet.size > 0) {
				countA += conditionSet.size;
			}else{
				countA += allConditionSize;
			}
			for (const b of beforeSet) {
				if (conditionSet.has(b)) {
					countB++;
				}
			}
			beforeSet = conditionSet;
		}
		console.log(countA ,countB);
		if ((countA - countB) === 0) {
			return -1;
		}
		return ((countA - countB) / countA) * ((1-coeff*0.0001) ** conditionSetList.length);
	}
}
function AnserRefinedSearch(ansers: Set<IAnswerDataCondition>, conditionList: Array<IConditionData>): Set<IAnswerDataCondition> {
	const anserSet: Set<IAnswerDataCondition> = new Set();
	loop1: for (const anser of ansers) {
		if (anser.anserConditionMap) {
			for (const [key, value] of anser.anserConditionMap.entries()) {
				const condition = conditionList.find(c => c.conditiongroup_id === key);
				if (condition) {
					if (value.conditions.find(c => c.id === condition.id)) {
					} else {
						continue loop1;
					}
				}
			}
		}
		anserSet.add(anser);
	}
	return anserSet;
}

