# Anser API

## 処理概要

ユーザー画面から、タグを選択させることで質問に対する回答を絞り込むということを想定した機能です。
以下の情報により、システムが扱いやすいデータを作成する関数を作成してください。

※「タグ」は、画面に表示されるボタンのような UI をしたキーワードのことを指すものとします

## 前提

- このシステムには一つの質問に対して複数の回答が紐付けられています。（１対多）
- 一つの回答には、複数のコンディションが多対多で紐付けられています。
- コンディションは、必ず一つのコンディショングループに属しています。（１対多）

※「コンディション」とは、回答に紐付けられた情報で、UI 上では、タグとして表示して、ユーザーに選択させることができます。

## 例

### 質問 A

- タイトル：私におすすめの車を教えて下さい。

#### 質問 A に対する回答群

#### 回答 A

- 回答文：それはプリウスです
- コンディション一覧:
- - 男　年収４００万円台　独身　２〜５人

#### 回答 B

- 回答文：それはヴィッツです
- コンディション一覧:
- - 女　４００万円台　独身　２〜５人

#### 回答 C

- 回答文：それはランドクルーザーです
- コンディション一覧:
- - 男　女　５００万円以上　独身　５人以上

### コンディショングループとそれに属するコンディション

#### コンディショングループ A

- タイトル：性別
- 優先度:1

#### コンディショングループ A に対するコンディション群

#### コンディション A

- 男

#### コンディション B

- 女

#### コンディショングループ B

- タイトル:年収
- 優先度:2

#### コンディショングループ B に対するコンディション群

#### コンディション C

- ４００万円台

#### コンディション D

- ５００万円以上

#### コンディショングループ C

- タイトル:家族構成
- 優先度:３

#### コンディショングループ C に対するコンディション群

#### コンディション E

- 独身

#### コンディション F

- ２〜５人

#### コンディション G

- ５人以上

## 引数と戻り値

実際の情報は、以下のような JSON データを引数で与えられます。

### 引数１(コンディションとコンディショングループを持つ回答のリスト)

```
[
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
```

### 引数２(コンディショングループとそれに紐づくコンディションのリスト)

```
[
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
```

### 戻り値

```
{
    "conditionGroup": {
        "id": 0,
        "label": "sex",
        "is_setting": true,
        "level": 1
    },
    "conditions": [
        {
            "condition": {
                "id": 0,
                "label": "男",
                "conditiongroup_id": 0
            },
            "next": {
                "conditionGroup": {
                    "id": 1,
                    "label": "収入",
                    "is_setting": true,
                    "level": 2
                },
                "conditions": [
                    {
                        "condition": {
                            "id": 2,
                            "label": "500万円未満",
                            "conditiongroup_id": 1
                        },
                        "next": {

                            "anserIds": [
                                0
                            ]
                        }
                    },
                    {
                        "condition": {
                            "id": 3,
                            "label": "500万円以上",
                            "conditiongroup_id": 1
                        },
                        "next": {

                            "anserIds": [
                                1
                            ]
                        }
                    }
                ],

                "anserIds": [
                    0,
                    1
                ]
            }
        },
        {
            "condition": {
                "id": 1,
                "label": "女",
                "conditiongroup_id": 0
            },
            "next": {
                "conditionGroup": {
                    "id": 1,
                    "label": "収入",
                    "is_setting": true,
                    "level": 2
                },
                "conditions": [
                    {
                        "condition": {
                            "id": 2,
                            "label": "500万円未満",
                            "conditiongroup_id": 1
                        },
                        "next": {

                            "anserIds": [
                                2
                            ]
                        }
                    },
                    {
                        "condition": {
                            "id": 3,
                            "label": "500万円以上",
                            "conditiongroup_id": 1
                        },
                        "next": {

                            "anserIds": [
                                1
                            ]
                        }
                    }
                ],

                "anserIds": [
                    1,
                    2
                ]
            }
        }
    ],

    "anserIds": [
        0,
        1,
        2
    ]
}
```

### 戻り値の解説

階層 n には、以下の要素を含みます。

conditions

提示するべきコンディションの集合、next という要素を持ち、それは階層 n+1 です。
既に回答が一つに絞られている。もしくは回答を絞り込むコンディションがない場合はこの要素自体ありません。

conditionGroup

提示するべきコンディションの集合に紐付いているコンディショングループです。
既に回答が一つに絞られている。もしくは回答を絞り込むコンディションがない場合はこの要素自体ありません。

anserIds

その時点で絞り込まれているアンサーの ID のリストです。

### ロジックの解説

- あるコンディショングループに属するコンディションでユーザーがどのコンディションを選択しても回答を全く絞り込めない場合。そのコンディションはスキップします。
- 回答候補が複数ある場合でも、回答を絞り込むコンディションがない場合はそこで終了です。
