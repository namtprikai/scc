import faker from 'faker'
import { Response, Request } from 'express'
import { IAnswerData, IConditionData,IConditionGroupData } from '../src/core/api/types'
import { IAPIResponce} from '../src/core/api/types'
import {getConditionListByUserToken,getConditionListByAnserId} from "./condition";
import {getConditionGroupById} from "./conditionGroup";
const answers:Array<IAnswerData> =[
	{
		id:0,
		question_id:0,
		text:"それはプリウスです。何故ならば・・・",
		is_public:true,
		created:new Date(),
		modified:new Date(),
	},
	{
		id:1,
		question_id:0,
		text:"それはランクルです。何故ならば・・・",
		is_public:true,
		created:new Date(),
		modified:new Date(),
	}
];
export const getAnser = (req: Request, res: IAPIResponce):Response => {
	const { question_id } = req.params;
	const accessToken = req.header('Authorization');
	let anserList = answers.filter(a=>String(a.question_id)===question_id);
	if(anserList.length===1){
		return res.json({
			status: 20000,
			data: {...anserList[0]}
		})
	}

	if(accessToken){
		const userConditionList = getConditionListByUserToken(accessToken);
		const userConditionMap:Map<number,{conditionGroup:IConditionGroupData,conditions:Array<IConditionData>}> = new Map();
		//userConditionMap作成開始
		for(const userCondition of userConditionList){
			const userConditionGroup = getConditionGroupById(userCondition.conditiongroup_id);
			if(userConditionGroup){
				if(!userConditionMap.has(userConditionGroup.id)){
					userConditionMap.set(userConditionGroup.id,{conditionGroup:userConditionGroup,conditions:[]});
				}
				const conditionObj = userConditionMap.get(userConditionGroup.id);
				if(conditionObj){
					const {conditionGroup,conditions} = conditionObj;
					conditions.push(userCondition);
				}
			}
		}
		//userConditionMap作成完了
		anserList = anserList.filter(anser=>{
			const conditions = getConditionListByAnserId(anser.id);
			const anserConditionMap:Map<number,{conditionGroup:IConditionGroupData,conditions:Array<IConditionData>}> = new Map();
			//anserConditionMap作成開始
			for(const condition of conditions){
				const anserConditionGroup = getConditionGroupById(condition.conditiongroup_id);
				if(anserConditionGroup){
					if(!anserConditionMap.has(anserConditionGroup.id)){
						anserConditionMap.set(anserConditionGroup.id,{conditionGroup:anserConditionGroup,conditions:[]});
					}
					const conditionObj = anserConditionMap.get(anserConditionGroup.id);
					if(conditionObj){
						const {conditionGroup,conditions} = conditionObj;
						conditions.push(condition);
					}
				}
			}
			//anserConditionMap作成完了


			for(const userCGroupId of userConditionMap.keys()){
				if(anserConditionMap.has(userCGroupId)){
					//共通のconditionGroupだということ
					const anserConditions = anserConditionMap.get(userCGroupId)?.conditions;
					const userConditions = userConditionMap.get(userCGroupId)?.conditions;
					if(anserConditions&&userConditions){
						//共通のコンディショングループのコンディションを保持していながら、積集合が空集合だということは対象のアンサーではないので除外
						const intersectionAUCondition = anserConditions.filter(ac=>!new Set([...userConditions.map(u=>u.id)]).has(ac.id));
						if(intersectionAUCondition.length===0){
							return false;
						}
						//対象差のコンディションをアンサーをキーに収納しておく
						const symDiffCondition = [...userConditions.filter(uc=>!new Set([...anserConditions.map(a=>a.id)]).has(uc.id)),...anserConditions.filter(ac=>!new Set([...userConditions.map(u=>u.id)]).has(ac.id))];
						//　ここに対象差のコンディションをアンサーをキーに収納しておくロジック
					}
				}
			}
		});
	}
	//ここまででユーザーに対して可能性のあるアンサーの絞り込み。
	//この時点で可能性のあるアンサーが一つに絞り込まれたならそれを返す。
	if(anserList.length===1){
		return res.json({
			status: 20000,
			data: {...anserList[0]}
		})
	}
	// ここから複数アンサーをコンディションで絞り込むためのツリー構造JSONを作成する処理に入る

	return res.json({
			status: 20000,
			data: [...answers]
	})
}
