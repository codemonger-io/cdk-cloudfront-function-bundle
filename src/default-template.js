// NOTE: this code is supposed to be substituted with `python-format-js`.
//       `python-format-js` does not correctly handle double curly braces `{{`
//       and `}}`. however, a pair of curly braces containing multiple lines
//       are not substituted.

function handler(event) {
  var eventType = event.context.eventType;
  var functions = [{FUNCTION_LIST}];

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

{FUNCTION_CODE}
