# TwilioとGoogle アシスタントをつなげていろいろやったやつ 
全体的にごちゃごちゃしてます。未完成に近い。

## デモ


## 動作させるには
### 必要なもの
* Twilioアカウント(トライアルでOK)
* Googleアカウント
* 諦めない心
```
$ cat /etc/lsb-release 
DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=22.04
DISTRIB_CODENAME=jammy
DISTRIB_DESCRIPTION="Ubuntu 22.04.1 LTS"
```

### Twilio側の準備
[これ](https://github.com/TwilioDevEd/voice-javascript-sdk-quickstart-node#gather-config-values)を参考に.envを作る
API Keyはコンソール右上の「Account」→「API keys & tokens」から

### Google Assistant側の準備

1. [これ](https://developers.google.com/assistant/sdk/guides/service/python/embed/config-dev-project-and-account)を参考にプロジェクトを作り、OAuth同意画面を設定する
テストユーザーに自分を追加しておく
2. [認証情報](https://console.cloud.google.com/apis/credentials)のタブで認証情報を作成する
「+認証情報の作成」→「OAuth クライアント ID」

| 項目名 | 値 |  |
| -------- | -------- | -------- |
| アプリケーションの種類 | ウェブアプリケーション | |
| 名前 | (お好きに) | |
| 承認済みのリダイレクト URI | 適当なURL | 入力しないと認証に失敗します |

3. jsonファイルをkey.jsonという名前でmic-speaker.jsと同じ場所に保存する
この場合はsrc/

### い　つ　も　の
```
$ npm install
$ npm start
```

### TwiML appの設定
1. なんらかの方法で3000番ポートを公開する
後で使うのでブラウザで開いておく(Chrome推奨)
2. 作成したTwiMLの設定画面を開き、「Voice Configuration」→「Request URL」をhttps://example.com/voiceのように/voiceをつけて入力し、保存する
※「Save」ボタンを押さないと保存されないので注意！
3. 着信に使いたい番号の設定画面を開く
左メニュー 「リージョン」→「Phone Numbers」→「Manage」→「Active Numbers」から使いたい番号を選択
4. 「Voice & Fax」を下記のように設定する

| 項目名 | 値 |
| -------- | -------- |
| CONFIGURE WITH | TwiML App |
| TWIML APP | (作成したTwiML Appを選択) |

※「Save」ボタンを押さな(ry

詳しくは[ここ](https://github.com/TwilioDevEd/voice-javascript-sdk-quickstart-node#local-development)の7番以降を参考に

### 仮想オーディオの設定
PalseAudio 音量調節がインストールされていない場合はインストールする
```
$ sudo apt install pavucontrol
```
仮想オーディオデバイスを作る
```
$ npm run-script make-vas
```
※仮想オーディオデバイスの削除はnpm run-script remove-vas

頑張って下記のように設定する
| ソース | デバイス | 設定場所 |
| -------- | -------- | -------- |
| このプログラムの入力(マイク) | Monitor of VoiceOutput | pavucontrolの録音タブ | 
| このプログラムの出力 | AssistantOutput | OSの設定 |
| ブラウザの入力(マイク) | Monitor of AssistantOutput | pavucontrolの録音タブ |
| ブラウザの出力 | VoiceOutput | ブラウザ上で(Speaker Devicesを変更) | 

※pavucontrolの録音タブは実行中のプログラムしか表示されないので注意

## リスペクトさせていただいたもの
[TwilioDevEd/voice-javascript-sdk-quickstart-node](https://github.com/TwilioDevEd/voice-javascript-sdk-quickstart-node#local-development)
全部というか(ほぼ)そのまま使ってます。

[endoplasmic/google-assistant](https://github.com/endoplasmic/google-assistant)
examples/mic-speaker.jsとライブラリ本体を使ってます。

## ライセンス
[MIT](http://www.opensource.org/licenses/mit-license.html)
