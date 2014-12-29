TraceKit.report.subscribe(function (errorReport) {

  // reduce the error size
  for (var i = 0; i < errorReport.stack.length; i++) {
    delete errorReport.stack[i].context;
  }

  $.ajax({
    url: '/front_error',
    type: 'POST',
    data: errorReport
  });
});