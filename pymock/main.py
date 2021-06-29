import json
def make_flow(_condition_list,_ansers):
	st = {
		"ansers":_ansers,
		"anser_ids":map(lambda a:a['id'],_ansers),
		"condition_index":0
	}
	que = [st]
	condition_list = sorted(_condition_list,key=c['conditionGroup']['level'])
	while len(que)>0:
		s= que.pop(0)
		if 'ansers' in s and 'condition_index' in s:
			condition_index = s['condition_index']
			conditionObj = condition_list[condition_index]
			ansers = s['ansers']
			condition_index = s['condition_index']
			if len(ansers)>1:
				sym_diff = set()
				for anser in ansers:
					print(list(map(lambda a:a['id'],anser['anserConditionMap'][conditionObj['conditionGroup']['id']]['conditions'])))
					sym_diff = sym_diff^set(list(map(lambda a:a['id'],anser['anserConditionMap'][conditionObj['conditionGroup']['id']]['conditions'])))
				print(sym_diff)
def make_flow2(_condition_list,_answer):
	def _make_flow2(_condition_list,_answer):
		if len(_answer) <= 1 or len(_condition_list)<1:
			return {'answerIds':list(map(lambda x:x['id'],_answer))}
		condition_list = sorted(_condition_list,key=lambda c:c['conditionGroup']['level'],reverse = True)
		condition_obj = condition_list.pop()
		conditions = []
		flg = False
		while flg==False and len(condition_list)>=0:
			for answer in _answer:
				if condition_obj['conditionGroup']['id'] in answer['anserConditionMap']:
					if len(answer['anserConditionMap'][condition_obj['conditionGroup']['id']]['conditions'])!=len(condition_obj['conditions']):
						flg = True
			if flg==False:
				if len(condition_list)>0:
					condition_obj = condition_list.pop()
				else:
					return {'answerIds':list(map(lambda x:x['id'],_answer))}
		for condition in condition_obj['conditions']:
			answers = list(filter(lambda a: (condition_obj['conditionGroup']['id'] not in a['anserConditionMap']) or (condition['id'] in map(lambda c:c['id'],a['anserConditionMap'][condition_obj['conditionGroup']['id']]['conditions'])),_answer))
			condition['next'] = _make_flow2(condition_list,answers)
			if len(condition['next'])>=1:
				conditions.append(condition)
		return {
			'conditionGroup': condition_obj['conditionGroup'],
			'conditions': conditions,
			'answerIds': list(map(lambda x:x['id'],_answer))
		}
	return json.dumps(_make_flow2(_condition_list,_answer), indent=4, ensure_ascii=False)
def test():
	anser_list = [
		{
			"id": 0,
			"question_id": 0,
			"text": "それはプリウスです。何故ならば・・・",
			"is_public": True,
			"anserConditionMap":{
				0: {
					"conditionGroup": {
						"id": 0,
						"label": "sex",
						"is_setting": True,
						"level": 1,
					},
					"conditions": [
						{
							"id": 1,
							"label": "女",
							"conditiongroup_id": 0,
						},
					]
				}
				,
				1: {
					"conditionGroup": {
						"id": 1,
						"label": "収入",
						"is_setting": True,
						"level": 2,
					},
					"conditions": [
						{
							"id": 2,
							"label": "500万円未満",
							"conditiongroup_id": 1,
						}
					],
				}
				,
				2: {
					"conditionGroup": {
						"id": 2,
						"label": "家族構成",
						"is_setting": True,
						"level": 3,
					},
					"conditions": [
						{
							"id": 4,
							"label": "独身",
							"conditiongroup_id": 2,
						},
						{
							"id": 5,
							"label": "二人〜５",
							"conditiongroup_id": 1,
						},
					],
				}
			}
		},
		{
			"id": 1,
			"question_id": 0,
			"text": "それはランクルです。何故ならば・・・",
			"is_public": True,
			"anserConditionMap": {
				0: {
					"conditionGroup": {
						"id": 0,
						"label": "sex",
						"is_setting": True,
						"level": 1,
					},
					"conditions": [
						{
							"id": 0,
							"label": "男",
							"conditiongroup_id": 0,
						},{
							"id": 1,
							"label": "女",
							"conditiongroup_id": 0,
						},
					]
				}
				,
				1: {
					"conditionGroup": {
						"id": 1,
						"label": "収入",
						"is_setting": True,
						"level": 3,
					},
					"conditions": [
						{
							"id": 3,
							"label": "500万円以上",
							"conditiongroup_id": 1,
						}
					],
				}
				,
				2: {
					"conditionGroup": {
						"id": 2,
						"label": "家族構成",
						"is_setting": True,
						"level": 2,
					},
					"conditions": [
						{
							"id": 4,
							"label": "独身",
							"conditiongroup_id": 2,
						},
						{
							"id": 5,
							"label": "二人〜５",
							"conditiongroup_id": 2,
						},
						{
							"id": 6,
							"label": "5人以上",
							"conditiongroup_id": 2,
						}
					],
				}
				}
		},
		{
			"id": 2,
			"question_id": 0,
			"text": "それはヴィッツです。何故ならば・・・",
			"is_public": True,
			"anserConditionMap": {
				0: {
					"conditionGroup": {
						"id": 0,
						"label": "sex",
						"is_setting": True,
						"level": 1,
					},
					"conditions": [
						{
							"id": 1,
							"label": "女",
							"conditiongroup_id": 0,
						},
					]
				}
				,
				1: {
					"conditionGroup": {
						"id": 1,
						"label": "収入",
						"is_setting": True,
						"level": 3,
					},
					"conditions": [
						{
							"id": 2,
							"label": "500万円未満",
							"conditiongroup_id": 1,
						}
					],
				}
				,
				2: {
					"conditionGroup": {
						"id": 2,
						"label": "家族構成",
						"is_setting": True,
						"level": 2,
					},
					"conditions": [
						{
							"id": 4,
							"label": "独身",
							"conditiongroup_id": 2,
						},
						{
							"id": 5,
							"label": "二人〜５",
							"conditiongroup_id": 2,
						},
					],
				}

		}
		}
	]
	condition_list = [
		{
			"conditionGroup": {
				"id": 0,
				"label": "sex",
				"is_setting": True,
				"level": 1,
			},
			"conditions": [
				{
					"id": 0,
					"label": "男",
					"conditiongroup_id": 0,
				},
				{
					"id": 1,
					"label": "女",
					"conditiongroup_id": 0,
				},
			]
		},
		{
			"conditionGroup": {
				"id": 1,
				"label": "収入",
				"is_setting": True,
				"level": 2,
			},
			"conditions": [
				{
					"id": 2,
					"label": "500万円未満",
					"conditiongroup_id": 1,
				},
				{
					"id": 3,
					"label": "500万円以上",
					"conditiongroup_id": 1,
				}
			]
		},
		{
			"conditionGroup": {
				"id": 2,
				"label": "家族構成",
				"is_setting": True,
				"level": 2,
			},
			"conditions": [
				{
					"id": 4,
					"label": "独身",
					"conditiongroup_id": 2,
				},
				{
					"id": 5,
					"label": "二人〜５",
					"conditiongroup_id": 2,
				},
				{
					"id": 6,
					"label": "5人以上",
					"conditiongroup_id": 2,
				}
			]
		},
	]
	flow = make_flow2(condition_list,anser_list)
	print(flow)
test()
