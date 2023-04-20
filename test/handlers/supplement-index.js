function supplementIndex(event) {
  var request = event.request;
  if (request.uri.endsWith('/')) {
    request.uri += '/index.html';
  }
  return request;
}
