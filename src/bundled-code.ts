import * as fs from 'fs';
import * as path from 'path';
import { aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import format from 'python-format-js';

/** Path to the default template. */
const DEFAULT_TEMPLATE_PATH = path.resolve(__dirname, 'default-template.js');

/**
 * Properties of a function constituting {@link BundledCode}.
 *
 * @beta
 */
export interface FunctionProps {
  /** Path to the file containing the function code. */
  readonly filePath: string;
  /** Name of the handler function. */
  readonly handler: string;
}

/**
 * {@link https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.FunctionCode.html | FunctionCode }
 * that bundles multiple functions in a single file.
 *
 * @beta
 */
export class BundledCode extends cloudfront.FunctionCode {
  /** Functions constituting the CloudFront Function. */
  readonly functionProps: FunctionProps[];

  /**
   * Bundles given functions.
   *
   * @param functionProps -
   *
   *   Functions constituting the CloudFront Function.
   *
   * @throws RangeError
   *
   *   If `functionProps` is empty,
   *   or if there is a duplicate handler in `functionProps`.
   */
  constructor(...functionProps: FunctionProps[]) {
    super();

    this.functionProps = functionProps;
    if (functionProps.length === 0) {
      throw new RangeError('at least one function must be specified');
    }
    // checks duplicate handler names
    const handlers = new Set();
    for (const props of functionProps) {
      if (handlers.has(props.handler)) {
        throw new RangeError('duplicate handler: ' + props.handler);
      }
      handlers.add(props.handler);
    }
  }

  /**
   * Renders the bundled code.
   *
   * @returns -
   *
   *   Combined CloudFront Function.
   *
   * @throws Error
   *
   *   If a function code cannot be loaded.
   */
  render(): string {
    // loads the template
    const template = fs.readFileSync(DEFAULT_TEMPLATE_PATH, {
      encoding: 'utf-8',
    });
    // loads the function code
    let functionCode = '';
    const functionList = [];
    for (const props of this.functionProps) {
      functionCode += fs.readFileSync(props.filePath);
      functionList.push(props.handler);
    }
    // substitutes the template
    const bundledCode = format(template, {
      FUNCTION_LIST: functionList.join(','),
      FUNCTION_CODE: functionCode,
    });
    return bundledCode;
  }
}
