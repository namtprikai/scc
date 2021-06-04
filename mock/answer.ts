import faker from 'faker'
import { Response, Request } from 'express'
import { IAnswerData, IConditionData, IConditionGroupData, IScenarioTree } from '../src/core/api/types'
import { IAPIResponce } from '../src/core/api/types'
import { getConditionListByUserToken, getConditionListByAnserId } from "./condition";
import { getConditionGroupById } from "./conditionGroup";
interface IConditionMap extends Map<number, { conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> {

}
interface IAnswerDataCondition extends IAnswerData {
	anserConditionMap?: IConditionMap;
}
const answers: Array<IAnswerData> = [
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
export const getAnser = (req: Request, res: IAPIResponce): Response => {
	const { question_id } = req.params;
	const accessToken = req.header('Authorization');
	let anserList: Array<IAnswerDataCondition> = answers.filter(a => String(a.question_id) === question_id);
	if (anserList.length === 1) {
		return res.json({
			status: 20000,
			data: { ...anserList[0] }
		})
	}
	let conditionList: Array<{ conditionGroup: IConditionGroupData, conditions: Array<IConditionData> }> = [];
	if (accessToken) {
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
				}
			}
			//anserConditionMap作成完了


			for (const userCGroupId of userConditionMap.keys()) {
				if (anserConditionMap.has(userCGroupId)) {
					//共通のconditionGroupだということ
					const anserConditions = anserConditionMap.get(userCGroupId)?.conditions;
					const userConditions = userConditionMap.get(userCGroupId)?.conditions;
					if (anserConditions && userConditions) {
						//共通のコンディショングループのコンディションを保持していながら、積集合が空集合だということは対象のアンサーではないので除外
						const intersectionAUCondition = anserConditions.filter(ac => !new Set([...userConditions.map(u => u.id)]).has(ac.id));
						if (intersectionAUCondition.length === 0) {
							return false;
						}
						//対象差のコンディションをアンサーをキーに収納しておく
						const symDiffCondition = [...userConditions.filter(uc => !new Set([...anserConditions.map(a => a.id)]).has(uc.id)), ...anserConditions.filter(ac => !new Set([...userConditions.map(u => u.id)]).has(ac.id))];
						//　ここに対象差のコンディションをアンサーをキーに収納しておくロジック
						const conditionGroup = userConditionMap.get(userCGroupId)?.conditionGroup;
						if (conditionGroup) {
							conditionList.push({ conditionGroup, conditions: symDiffCondition });
						}
						anser.anserConditionMap = anserConditionMap;
					}
				}
			}
			return true;
		});
	}
	//ここまででユーザーに対して可能性のあるアンサーの絞り込み。
	//この時点で可能性のあるアンサーが一つに絞り込まれたならそれを返す。
	if (anserList.length === 1) {
		return res.json({
			status: 20000,
			data: { ...anserList[0] }
		})
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
	const scenarioTree: IScenarioTree = { anserIds: anserList.map((a: any) => a.id) ,conditionList:[]};
	let nextScenarioTree = scenarioTree;
	const que: Array<IScenarioTree> = [nextScenarioTree];
	// while (que.length>0) {
	// 	const nextScenarioTree = que.shift();

	// }
	while (que.length > 0) {
		const nextScenarioTree = que.shift();
		if (nextScenarioTree == undefined) {
			break;
		}
		for (let i = 0; i < conditionList.length; i++) {
			const { conditionGroup, conditions } = conditionList[i];
			nextScenarioTree.next = { conditionGroup, conditions: [] };
			for (const condition of conditions) {
				const next = {
					condition,
					anserIds: [],
					conditionList:[]
				};
				nextScenarioTree.next.conditions.push(
					next
				);
				que.push(next);
			}
		}
	}
	return res.json({
		status: 20000,
		data: [...answers]
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
						},{
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
						},{
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
						level: 2,
					},
					conditions: [
						{
							id: 3,
							label: "500万円以上",
							conditiongroup_id: 1,
						}
					],
				}
				]
			])
		}
	]
	const scenarioTree: IScenarioTree = { anserIds: anserList.map(a => a.id) ,conditionList:[]};
	let anserSet:Set<IAnswerDataCondition> = new Set([...anserList]);
	let scenarioTreeList = [scenarioTree];
	let nextScenarioTreeList = [];
	// while (que.length>0) {
	// 	const nextScenarioTree = que.shift();

	// }

	root:for (let i = 0; i < conditionList.length; i++) {

		const { conditionGroup, conditions } = conditionList[i];
//ここでアンサーのコンディションの対照差が空集合か調べ、そうであればcontinue;
		const _conditionIdSet: Set<number> = new Set();
		let firestFlg = true;
		let breakFlg = false;
		for(const anser of anserSet){
			const cl = anser.anserConditionMap?.get(conditionGroup.id)?.conditions;
			if(firestFlg){
				if(cl){
					for(const c of cl){
					_conditionIdSet.add(c.id);
					}
				}
				firestFlg=false;
				continue;
			}
			if(cl){
				const __conditionIdSet = new Set(cl.map(c=>c.id));
				const size = __conditionIdSet.size;
				for(const c of _conditionIdSet){
					__conditionIdSet.add(c);
				}
				if(__conditionIdSet.size!==size){
					console.log("break");
					console.log(conditionGroup);
					breakFlg = true;
					break;
				}
			}
		}
		if(breakFlg===false){
			console.log("break");
			continue root;
		}
		for (const scenarioTree of scenarioTreeList) {
			scenarioTree.next = { conditionGroup, conditions: [] };
			anserSet = AnserRefinedSearch(anserSet,scenarioTree.conditionList);
			for (const condition of conditions) {
				const cList = [...scenarioTree.conditionList, condition];
				const _ansers = AnserRefinedSearch(anserSet,cList);
				const next: IScenarioTree = {
					condition,
					conditionList:cList,
					anserIds: [..._ansers.values()].map(a=>a.id)
				};


				scenarioTree.next.conditions.push(
					next
				);
								if (next.anserIds.length <= 1) {
					continue;
				}
				nextScenarioTreeList.push(next);
			}
		}
		scenarioTreeList = nextScenarioTreeList;
		nextScenarioTreeList = [];
	}
	console.log(JSON.stringify(scenarioTree));
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
