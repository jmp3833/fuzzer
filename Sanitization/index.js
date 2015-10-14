module.exports = {
  findVulnerabilities: function(siteUrl, auth, vectors, mapping, callback) {
    console.log('Checking for lack of sanitization.');
    var vulns = [];
    var keys = Object.keys(mapping);
    var stillLooking = 0;

    if (keys.length == 0) {
      callback(vulns);
    }

    for (var i = 0; i < keys.length; i++) {
      visitLink(keys, i);
    }

    function visitLink(keys, i) {
      var formParams = mapping[keys[i]]['form-params'];
      if (formParams[0] != undefined && formParams[0].length != 0) {
        stillLooking++;

        for (var j = 0; j < vectors.length; j++) {
          var url = keys[i];
          auth(siteUrl, function(browser) {
            browser.visit(url, function() {
              var submitName = '';
              var foundText = false;
              for (var k = 0; k < formParams[0].length; k++) {
                if (formParams[0][k][0] == 'submit') {
                  submitName = formParams[0][k][1];
                }
                if (formParams[0][k][1] != null && formParams[0][k][0] == 'text') {
                  foundText = true;
                  browser.fill('input[name="'+formParams[0][k][1]+'"]', vectors[j]);
                }
              }
              if (submitName != '' && foundText) {
                browser.pressButton('input[type="submit"]', function() {
                  vulns.push(browser.response);
                  stillLooking--;
                  console.log('Checking form on '+url);
                  if (i == keys.length - 1 && stillLooking == 0) {
                    callback(vulns);
                  }
                });
              }
            });
          });
        }
      }
    }
  }
}