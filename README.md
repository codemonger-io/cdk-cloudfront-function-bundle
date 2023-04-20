English / [日本語](./README.ja.md)

# CDK CloudFront Function Bundle

`cdk-cloudfront-function-bundle` is a library that helps you compose a handler function for [Amazon CloudFront Functions (CloudFront Functions)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html) by chaining multiple smaller handler functions.

This library is supposed to be used with the [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) version 2.

## Installing `cdk-cloudfront-function-bundle`

```sh
npm install https://github.com/codemonger-io/cdk-cloudfront-function-bundle.git#v0.1.0
```

## Example

As the main class [`BundledCode`](./api-docs/markdown/cdk-cloudfront-function-bundle.bundledcode.md) defined in this library is a subclass of [`aws-cdk-lib.aws_cloudfront.FunctionCode`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.FunctionCode.html), you can specify an instance of [`BundledCode`](./api-docs/markdown/cdk-cloudfront-function-bundle.bundledcode.md) to `code` property of [`aws-cdk-lib.aws_cloudfront.Function`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.Function.html):

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

You can find an example that creates a [`BundledCode`](./api-docs/markdown/cdk-cloudfront-function-bundle.bundledcode.md) in [`test/bundled-code.test.ts`](./test/bundled-code.test.ts).

## Motivation

I think a CloudFront Functions handler may often be decomposed into independent smaller units of handlers; for instance, the following manipulations can be separate units:
- adding `Date` header
- supplementing trailing `/index.html` to the URI

However, we can assign only one script as CloudFront Functions per event type (viewer request or response).
This restriction makes it hard to reuse or turn on/off part of features because we have to put everything in one file.
It would be nice if we could compose a script by chaining independent handlers described in individual files.

This library was inspired by [`aws-samples/amazon-cloudfront-multi-function-packager`](https://github.com/aws-samples/amazon-cloudfront-multi-function-packager), and I borrowed some code from it.
Their library could do what I wanted to do, however, I had to deploy and invoke a [Lambda](https://aws.amazon.com/lambda/) function on AWS to use it.
This was overkill for me.
I needed something that can build a handler during the deployment phase of the CDK.

So `cdk-cloudfront-function-bundle` comes in.

## API Documentation

You can find the API documentation in [`api-docs/markdown`](./api-docs/markdown/index.md).

## Development

### Resolving dependencies

```sh
npm ci
```

### Building

```sh
npm run build
```

### Generating documentation

```sh
npm run build:doc
```