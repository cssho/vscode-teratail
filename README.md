# vscode-tertail
teratail Client for Visual Studio Code
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items/cssho.vscode-teratail)

## Usage 
0. コマンドパレットを表示し、入力欄に"ext install"と入力してEnter
0. "teratail Client"を選択し、インストール
0. ステータスバーの`teratail`をクリック、またはコマンドパレットより`teratail: Display Questions`を選択

## Setting

`File` => `Preferences` => `User Settings`を選択し、以下追記

```json
{
	~~~
	
	// teratailで発行されるアクセストークン (https://teratail.com/users/setting/tokens)
	"teratail.accesstoken": "xxxxxxxxxxxxxxxxxxxxxx",

	// 取得するteratailの質問数
	"teratail.getQuestionsCount": 30
}
```