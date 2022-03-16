export default {
  labelText: {
    id: 'ID',
    modified: '更新日',
    created: '作成日',
    config: '設定',
    isLock: 'ロック',
    isEnabled: '有効',
    isMasterAdmin: 'マスター管理者',
    loginName: 'ログイン名',
    email: 'メールアドレス',
    isMailauthCompleted: 'メール認証済み',
    currentPassword: '現在パスワード',
    newPassword: '新しいパスワード',
    confirmPassword: '確認パスワード',
    username: 'ユーザー名',
    password: 'パスワード',
    action: '操作',
    product: 'プロダクト',
    productName: 'プロダクト名',
    policyGroup: 'ポリシーグループ',
    policyGroupName: 'ポリシーグループ名',
    maxFailureCountUser: 'ユーザのログイン失敗の制限回数',
    maxFailureTimeUser: 'ユーザのログイン失敗の制限時間',
    memo: 'メモ',
    roleLabel: 'ロール名',
    roleIsLogin: 'ログイン必要',
    categoryLabel: 'カテゴリ名',
    categoryText: 'テキスト',
    questionTitle: 'タイトル',
    questionLabel: 'ラベル',
    questionIsPublic: '公開',
    validationTableName: 'テーブル名',
    validationColumnName: 'カラム名',
    validationType: 'データ型',
    validationPattern: '正規表現',
    validationSystemMaximum: 'カラムのサイズ',
    validationMax: '入力最大値',
    validationMin: '入力最小値',
    policyLabel: 'ラベル',
    policyDescription: '説明',
    policyMethod: 'メソッド',
    policyUri: 'URI',
    policyIsActive: '有効フラグ',
    policyGroupLabel: 'ラベル',
    policyGroupDescription: '説明',
    policyGroupConfig: 'メモ',
    userName: '名前',
    userEmail: 'メールアドレス',
    userConfig: 'メモ',
    userIsAuto: '自動生成ユーザー',
    conditionLabel: 'ラベル',
    conditionConditionGroup: '条件グループ'
  },
  validError: {
    exists: '存在していません',
    role: '権限が必要です',
    mismatch: '入力したデータが不一致です',
    limit: 'システムの限界を超えています',
    unique: 'データが重複されています',
    lock: 'ロックがかかっています',
    hierarchy: '階層エラーが発生しました',
    alpha: '{_field_}はアルファベットのみ使用できます',
    alphaNum: '{_field_}は英数字のみ使用できます',
    alphaDash: '{_field_}は英数字とハイフン、アンダースコアのみ使用できます',
    alphaSpaces: '{_field_}はアルファベットと空白のみ使用できます',
    between: '{_field_}は{min}から{max}の間でなければなりません',
    confirmed: '{_field_}が一致しません',
    digits: '{_field_}は{length}桁の数字でなければなりません',
    dimensions: '{_field_}は幅{width}px、高さ{height}px以内でなければなりません',
    email: '{_field_}は有効なメールアドレスではありません',
    excluded: '{_field_}は不正な値です',
    ext: '{_field_}は有効なファイル形式ではありません',
    image: '{_field_}は有効な画像形式ではありません',
    integer: '{_field_}は整数のみ使用できます',
    is: '{_field_}が一致しません',
    isNot: '{_field_}は無効です',
    length: '{_field_}は{length}文字でなければなりません',
    maxValue: '{_field_}は{max}以下でなければなりません',
    max: '{_field_}は{length}文字以内にしてください',
    mimes: '{_field_}は有効なファイル形式ではありません',
    minValue: '{_field_}は{min}以上でなければなりません',
    min: '{_field_}は{length}文字以上でなければなりません',
    numeric: '{_field_}は数字のみ使用できます',
    oneOf: '{_field_}は有効な値ではありません',
    regex: '{_field_}のフォーマットが正しくありません',
    required: '{_field_}は必須項目です',
    requiredIf: '{_field_}は必須項目です',
    size: '{_field_}は{size}KB以内でなければなりません',
    double: '{_field_}フィールドは有効な10進数である必要があります',
    maxLength: '{_field_}の長さが長過ぎです',
    minLength: '{_field_}の長さが短過ぎです'
  },
  message: {
    serverConnectError: 'サーバーとの通信中にエラーが発生しました',
    forbiddenError: 'アクセス権限が必要です',
    notFoundError: 'データが存在していません',
    lockedError: 'ロックがかかってています',
    internalServerError: 'サーバでエラーが発生しました',
    adminCreateSuccess: '新しい管理者を作成しました',
    adminModifySuccess: '管理者の情報を更新しました',
    adminActivating: '認証処理中・・・',
    adminActiveError: '認証処理が失敗しました',
    adminActiveSuccess: '認証処理が成功しました',
    adminProductModifySuccess: '管理者のプロジェクト情報の更新が成功しました',
    adminPolicyGroupModifySuccess: '管理者のポリシーグループ情報の更新が成功しました',
    passwordResetSuccess: 'パスワード再設定しました',
    pleaseCheckEmail: 'ご登録のメールアドレスをご確認し、次の行動をお行いください',
    productCreateSuccess: 'プロダクトを作成しました',
    productModifySuccess: 'プロダクトを更新しました',
    productDeleteSuccess: 'プロダクトを削除しました',
    roleCreateSuccess: 'ロールを作成しました',
    roleModifySuccess: 'ロールを更新しました',
    validationModifySuccess: 'バリデートを更新しました',
    policyModifySuccess: 'ポリシーを更新しました',
    policyGroupCreateSuccess: 'ポリシーグループを作成しました',
    policyGroupModifySuccess: 'ポリシーグループを更新しました',
    userCreateSuccess: 'ユーザーを作成しました',
    userModifySuccess: 'ユーザーを更新しました',
    userConditionModifySuccess: 'ユーザー条件を更新しました',
    userProductModifySuccess: 'ユーザープロダクトを更新しました',
    userRoleModifySuccess: 'ユーザーロールを更新しました',
    loginError: 'ログイン情報が間違っています'
  },
  screenTitle: {
    error404: 'エラー404',
    activeAdmin: 'アカウントのメール認証',
    login: '管理者ログイン',
    resetPassword: 'パスワード再設定',
    top: 'トップ',
    adminCreate: '管理者作成',
    adminDetail: '管理者詳細・編集',
    adminList: '管理者のリスト',
    productCreate: 'プロダクト作成',
    productDetail: 'プロダクト詳細・編集',
    productList: 'プロダクトのリスト',
    roleCreate: 'ロール作成',
    roleDetail: 'ロール詳細・編集',
    roleList: 'ロールのリスト',
    validationDetail: 'バリデート詳細・編集',
    validationSearch: 'バリデートの検索',
    policyDetail: 'ポリシー詳細・編集',
    policyList: 'ポリシーのリスト',
    policyGroupCreate: 'ポリシーグループ作成',
    policyGroupDetail: 'ポリシーグループ詳細・編集',
    policyGroupList: 'ポリシーグループのリスト',
    userCreate: 'ユーザー作成',
    userDetail: 'ユーザー詳細・編集',
    userList: 'ユーザーのリスト',
    categoryCreate: 'カテゴリ作成',
    categoryDetail: 'カテゴリ詳細・編集',
    categoryList: 'カテゴリのリスト',
    conditionCreate: '条件作成',
    conditionDetail: '条件詳細・編集',
    conditionList: '条件のリスト',
    conditionGroupCreate: '条件グループ作成',
    conditionGroupDetail: '条件グループ詳細・編集',
    conditionGroupList: '条件グループのリスト',
    keywordCreate: 'キーワード作成',
    keywordList: 'キーワードリスト',
    questionCreate: '質問作成',
    questionDetail: '質問詳細・編集',
    questionList: '質問のリスト',
    mediaDetail: 'メディア詳細・編集',
    mediaList: 'メディアのリスト',
    logSearch: 'ログの検索'
  },
  text: {
    appName: 'Sai Console',
    update: '更新',
    submit: '登録',
    logout: 'ログアウト',
    back: '戻る',
    login: 'ログイン',
    resetPasswordRequest: 'パスワード再設定リクエスト',
    add: '追加',
    addNew: '新規追加',
    unlock: '解錠',
    enable: '有効',
    disable: '無効',
    modify: '編集',
    detail: '詳細',
    delete: '削除',
    ok: 'OK',
    cancel: 'キャンセル',
    passwordModify: 'パスワード変更',
    passwordReset: 'パスワード再設定',
    adminProductModify: '管理者プロダクト変更',
    adminPolicyGroupModify: '管理者ポリシーグループ変更',
    loggedInAdminMenu: 'アカウント',
    loggedInAdminSetting: 'アカウント設定',
    testPage: 'テストページ',
    productionPage: '本番ページ',
    menuTop: 'トップ',
    menuAppList: 'アプリケーション一覧',
    menuAdminList: '管理者一覧',
    menuPolicySetting: '権限設定',
    menuUserList: 'ユーザー一覧',
    menuUserRole: 'ユーザー属性管理',
    menuKeywordList: 'キーワード設定',
    menuMediaList: 'メディア一覧',
    menuLogSearch: '利用履歴',
    menuValidateList: 'バリデーション一覧',
    menuGeneralSettingFrame: '基本設定',
    menuAdminSettingFrame: '管理者設定',
    menuFaqFrame: 'FAQ',
    menuFaqSettingFrame: 'FAQ設定',
    menuResourceFrame: 'リソース',
    menuPresentAnalysis: '現状分析',
    menuProviderSetting: 'プロバイダ用設定',
    menuCsvModify: 'CSV編集',
    menuDirectEdit: '直接編集',
    gotoLoginScreen: 'ログイン画面へ',
    adminIsMasterYes: 'マスター管理者',
    adminIsMasterNo: '非マスター管理者',
    adminIsMailauthCompletedYes: '認証済み',
    adminIsMailauthCompletedNo: '未認証',
    adminIsEnabledYes: '有効',
    adminIsEnabledNo: '無効',
    adminIsLockYes: 'ロック',
    adminIsLockNo: 'ロックなし',
    adminProductIsEnabledYes: '有効',
    adminProductIsEnabledNo: '無効',
    adminPolicyGroupIsEnabledYes: '有効',
    adminPolicyGroupIsEnabledNo: '無効',
    roleIsLoginYes: '必要',
    roleIsLoginNo: '不要',
    policyIsActiveYes: '有効',
    policyIsActiveNo: '無効',
    policyGroupPolicyAddYes: '追加',
    policyGroupPolicyAddNo: '削除',
    policyGroupInfo: 'ポリシーグループ情報',
    policyGroupPolicyAdd: 'ポリシーグループのポリシー追加',
    policyGroupPolicyAddDelete: 'ポリシーグループのポリシー追加・削除',
    gotoScreenPolicyList: 'ポリシー一覧',
    userProductModify: 'ユーザープロダクト変更',
    userRoleModify: 'ユーザーロール変更',
    userIsEnabledYes: '有効',
    userIsEnabledNo: '無効',
    userIsLockYes: 'ロック',
    userIsLockNo: 'ロックなし',
    userIsMailauthCompletedYes: '認証済み',
    userIsMailauthCompletedNo: '未認証',
    userConditionEnableYes: '有効',
    userConditionEnableNo: '無効',
    userProductEnableYes: '有効',
    userProductEnableNo: '無効',
    userRoleEnableYes: '有効',
    userRoleEnableNo: '無効',
    userIsAutoYes: 'ログイン必要',
    userIsAutoNo: '自動生成',
    createScreenModalConfirmTitle: '入力内容確認',
    modifyScreenModalConfirmTitle: '変更項目内容確認'
  },
  helpText: {
    screenItemNothingChanged: '変更項目がありません',
    forgotPassword: 'パスワードを忘れた方',
    inputAccountEmail: 'アカウントのメールアドレスを記入してください',
    adminEnableAsk: 'アカウントを有効化に変更しますか？',
    adminDisableAsk: 'アカウントを無効化に変更しますか？',
    userEnableAsk: 'ユーザーを有効化に変更しますか？',
    userDisableAsk: 'ユーザーを無効化に変更しますか？',
    productDelete: 'プロダクトを削除しますか？',
    roleDelete: 'ロールを削除しますか？'
  }

}
