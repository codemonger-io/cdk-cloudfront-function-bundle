[English](./README.md) / 日本語

# CDK CloudFront Function Bundle

`cdk-cloudfront-function-bundle`は[Amazon CloudFront Functions (CloudFront Functions)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)のハンドラ関数を複数の小さなハンドラ関数を連結して構成したいときに役立つライブラリです。

このライブラリは[AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)バージョン2と一緒に使う想定です。

## `cdk-cloudfront-function-bundle`をインストールする

```sh
npm install https://github.com/codemonger-io/cdk-cloudfront-function-bundle.git#v0.1.0
```

## サンプル

このライブラリが定義するメインのクラス[`BundledCode`](./api-docs/markdown/cdk-cloudfront-function-bundle.bundledcode.md)は[`aws-cdk-lib.aws_cloudfront.FunctionCode`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.FunctionCode.html)のサブクラスなので、[`BundledCode`](./api-docs/markdown/cdk-cloudfront-function-bundle.bundledcode.md)のインスタンスを[`aws-cdk-lib.aws_cloudfront.Function`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Function.html)の`code`プロパティに指定することができます。

```ts
import { aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { BundledCode } from 'cdk-cloudfront-function-bundle';

new cloudfront.Function(this, 'Function', {
    code: new BundledCode(
        {
            filePath: 'handlers/add-date.js',
            handler: 'addDate',
        },
        {
            filePath: 'handlers/supplement-index.js',
            handler: 'supplementIndex',
        },
    ),
});
```

[`BundledCode`](./api-docs/markdown/cdk-cloudfront-function-bundle.bundledcode.md)を作成する例が[`test/bundled-code.test.ts`](./test/bundled-code.test.ts)にあります。

## 動機

CloudFront Functionsのハンドラはより小さな独立したユニットに分割するできるケースが多いのではないかと思います。例えば、以下の操作は別々のユニットに分けられます。
- `Date`ヘッダを追加する
- URIに`/index.html`を付け足す

ところが、CloudFront Functionsのイベントタイプ毎(Viewer RequestかViewer Response)にひとつのスクリプトしか割り当てられません。
この制限により全部をひとつのファイルに詰め込まなければならないため、機能の一部を再利用したりオンオフしたりすることが難しくなります。
それぞれのファイルから独立したハンドラを読み込み、それらを連結してスクリプトを構成できたら素敵な気がします。

このライブラリは[`aws-samples/amazon-cloudfront-multi-function-packager`](https://github.com/aws-samples/amazon-cloudfront-multi-function-packager)にインスパイアされたもので、コードの一部を拝借しました。
先方のライブラリでも私のやりたいことはできるかもしれませんが、使用するには[Lambda](https://aws.amazon.com/lambda/)関数をAWS上にデプロイして呼び出さなければなりません。
これはちょっと(私にとっては)やり過ぎです。
CDKのデプロイメントフェーズにハンドラをビルドしてくれるような何かが欲しいところです。

そこで、`cdk-cloudfront-function-bundle`の出番です。

## APIドキュメント

APIドキュメントは[`api-docs/markdown`](./api-docs/markdown/index.md)にあります(英語版のみ)。

## 開発

### 依存関係の解決

```sh
npm ci
```

### ビルド

```sh
npm run build
```

### ドキュメントの生成

```sh
npm run build:doc
```