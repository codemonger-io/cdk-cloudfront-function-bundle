import * as path from 'path';
import { BundledCode } from '../src/bundled-code';

describe('BundledCode', () => {
  it('render() should combine handler functions', () => {
    const expected =
`// NOTE: this code is supposed to be substituted with \`python-format-js\`.
//       \`python-format-js\` does not correctly handle double curly braces \`{{\`
//       and \`}}\`. however, a pair of curly braces containing multiple lines
//       are not substituted.

function handler(event) {
  var eventType = event.context.eventType;
  var functions = [addDate,supplementIndex];

  var isRequest = eventType === 'viewer-request';
  for (var i = 0; i < functions.length; ++i) {
    var fn = functions[i];
    var results = fn(event);
    if (isRequest) {
      event.request = results;
    } else {
      event.response = results;
    }
    if (shouldTerminate(results, isRequest)) {
      break;
    }
  }

  if (isRequest) {
    return event.request;
  } else {
    return event.response;
  }
}

// CloudFront function may return a response object in a viewer request event,
// and processing should be halted in that case.
function shouldTerminate(results, isRequest) {
  var returnedResponse = results.statusCode != null;
  return isRequest && returnedResponse;
}

function addDate(event) {
  var request = event.request;
  var header = request.header;
  var date = header.date;
  if (date == null) {
    header.date = {
      value: new Date().toUTCString().split(', ')[1],
    };
  }
  return request;
}
function supplementIndex(event) {
  var request = event.request;
  if (request.uri.endsWith('/')) {
    request.uri += '/index.html';
  }
  return request;
}

`;
    const code = new BundledCode(
      {
        filePath: path.resolve(__dirname, 'handlers/add-date.js'),
        handler: 'addDate',
      },
      {
        filePath: path.resolve(__dirname, 'handlers/supplement-index.js'),
        handler: 'supplementIndex',
      },
    )
    expect(code.render()).toEqual(expected);
  });

  it('constructor should throw RangeError if handler names duplicate', () => {
    expect(() => new BundledCode(
      {
        filePath: 'handlers/add-date.js',
        handler: 'addDate',
      },
      {
        filePath: 'handlers/supplement-index.js',
        handler: 'addDate',
      },
    )).toThrow(RangeError);
  });

  it('constructor should throw RangeError if no handlers are given', () => {
    expect(() => new BundledCode()).toThrow(RangeError);
  });

  it('render() should throw Error if a handler function is not found', () => {
    const code = new BundledCode({
      filePath: 'non-existing-handler.js',
      handler: 'nonExisting',
    });
    expect(() => code.render()).toThrow();
  });
});
