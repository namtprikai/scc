# sAIConsoleAllInOne


## Screenshots

![demo](./demo/demo.gif)


## Project setup

### Enviroment

- nodejs v14


### Compiles and hot-reloads for development

```bash
yarn
yarn serve

http://localhost:9527
```

### Compiles and minifies for production

```bash
yarn run build
```

### Lints and fixes files

```bash
NODE_ENV=development yarn lint
```

### Run your unit tests

```bash
NODE_ENV=development npm run test:unit
```


## Browsers support

Modern browsers

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chrome                                                                                                                                                                                                          | last 2                                                                                                                                                                                                            |

## Contributing

See [CONTRIBUTING.md](https://github.com/Armour/vue-typescript-admin-template/blob/master/.github/CONTRIBUTING.md)

## License

[MIT License](https://github.com/Armour/vue-typescript-admin-template/blob/master/LICENSE)

# エンクリプタートークン発行

- 有効期限のないトークンである。
- ユーザーデータをエンクリプトし、ユーザーデータトークンを生成するための権限
## エンクリプタートークンを発行する

### HTTPリクエスト

```
curl -X POST https://xxxxxx.jp/xxxxx/api/encryptor_token/
```

### リクエストヘッダー

- Authorization : `Bearer {access_token}`
- Content-Type : application/json
  
### リクエストボディ

- product_id: Array<number> | 発行されたエンクリプタートークンで生成できるユーザーデータトークンが扱うプロダクトの範囲である。

### レスポンス

- encryptor_token: 

例(json)

```json
{
  "data":{
    "encryptor_token":"eyOiennDiWOuz...",
  },
  "type":"Object",
  "is_error":false,
  "message":"Sucess"
}
```

### 成功条件

- adminユーザーがサインアップトークン生成権限トークン発行ポリシーを持っている。またはマスター権限であること

## サインアップトークン生成権限トークンを無効にする

### HTTPリクエスト

```shell
curl -X DELETE https://xxxxxx.jp/xxxxx/api/encryptor_token/<token_id>/
```

### リクエストヘッダー

- Authorization : `Bearer {access_token}`
- Content-Type : application/json
  
### リクエストボディ

### レスポンス

空のオブジェクト

例(json)

```json
{
  "data":{},
  "type":"Object",
  "is_error":false,
  "message":"Sucess"
}
```

## すべての有効なサインアップトークン生成権限トークンを取得する

### HTTPリクエスト

```shell
curl -X GET https://xxxxxx.jp/xxxxx/api/encryptor_token/
```

### リクエストヘッダー

- Authorization : `Bearer {access_token}`
- Content-Type : application/json
  
### リクエストボディ

### レスポンス

- encryptor_token_list: 有効なエンクリプタートークンとIDのオブジェクトのリスト
  
例(json)

```json
{
  "data":{
    "encryptor_token_list":["KeifnSDIw...","eyFEF..."],
  },
  "type":"Object",
  "is_error":false,
  "message":"Sucess"
}
```




# データトークンapi

- 任意のデータをエンクリプトして保持するためのトークン
- 例えば、サインアップの場合はrolesが含まれる
  
## データトークンを発行する

### HTTPリクエスト

```
curl -X POST https://xxxxxx.jp/xxxxx/api/data_token/
```

### リクエストヘッダー

- Content-Type : application/json
  
### リクエストボディ
- encriptor_token　(ヘッダーのほうが良い？)
- data: {
     url: "https://{APIのURL}",
    //例 roles: roles: Array<number> | サインインすると付与されるロール
  } | エンクリプションされるデータ
- product_id: Array<number> | 対象プロダクトID
- expires_in: nat1 | 有効時間(min) 上限60分。下限1分。自然数で指定できる。
- user_id?: String | (任意) 指定した場合、特定のnameのエンドユーザーのみサインアップ可能なURLが発行される。顧客のサービスのユーザーIDと整合性を保つ場合などに使用される。

### レスポンス

- data_token: Sign upなどのときにリクエストボディに付与するtoken
- key_id: encryptor_tokenを識別するための一意のキー
- <strike>url: Sign upのAPIのURL</strike> Web　API のurlなどの情報はdata_tokenに含まれるので削除

例(json)

```json
{
  "data":{
    "data_token":"eyOiennDiWOuz...",
    "key_id":"sDienSKWxxOeiuAw"
  },
  "type":"Object",
  "is_error":false,
  "message":"Sucess"
}
```
## データトークンを無効にする

### HTTPリクエスト

```shell
curl -X DELETE https://xxxxxx.jp/xxxxx/api/data_token/
```

### リクエストヘッダー
- Content-Type : application/json
  
### リクエストボディ
- encriptor_token
- key_id: String | signup_tokenを識別するための一意のキー

### レスポンス

空のオブジェクト

例(json)

```json
{
  "data":{},
  "type":"Object",
  "is_error":false,
  "message":"Sucess"
}
```


## すべての有効なデータトークンを取得する

### HTTPリクエスト

```shell
curl -X GET https://xxxxxx.jp/xxxxx/api/data_token/
```

### リクエストヘッダー

- Content-Type : application/json
  
### リクエストボディ
- encriptor_token
  
### レスポンス

- data_token_list: 有効なエンドユーザーサインアップトークンとIDのオブジェクトのリスト
- url: Sign upのAPIのURL
  
例(json)

```json
{
  "data":{
    "data_token_list":[{"key_id":"aeiefnei...","data_token":"KeifnSDIw..."}],
    "url":"https://xxxxxxxxxx"
  },
  "type":"Object",
  "is_error":false,
  "message":"Sucess"
}
```
