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
