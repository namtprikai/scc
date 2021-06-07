def make_flow(_condition_list,_ansers):
	st = {
		"ansers":_ansers,
		"anser_ids":map(lambda a:a.id,_ansers),
		"condition_index":0
	}
	que = [st]
	condition_list = _condition_list
	while len(que)>0:
		s= que.pop(0)
		if s and s.ansers and s.condition_index:
			condition_index = s.condition_index
			conditionObj = condition_list[condition_index]
			ansers = s.ansers
			condition_index = s.condition_index
			if len(ansers)>1:
				sym_diff = {}
				for index,anser in enumerate(ansers):
					sym_diff = sym_diff^anser.anserConditionMap[conditionObj.conditionGroup.id]
				print(sym_diff)
def test():
	anser_list = [
		{
			"id": 0,
			"question_id": 0,
			"text": "それはプリウスです。何故ならば・・・",
			"is_public": True,
			"anserConditionMap":{
				0, {
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
				1, {
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
				2, {
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
				0, {
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
				1, {
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
				2, {
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
				0, {
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
				1, {
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
				2, {
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
	make_flow(condition_list,set(anser_list))
test()
