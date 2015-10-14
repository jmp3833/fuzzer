module.exports = {
  findVulnerabilities: function(siteUrl, auth, vectors, mapping, callback) {
    console.log('in here');
    var vulns = [];
    var keys = Object.keys(mapping);
    var stillLooking = 0;

    if (keys.length == 0) {
      callback(vulns);
    }

    for (var i = 0; i < keys.length; i++) {
      var formParams = mapping[keys[i]]['form-params'];
      if (formParams.length != 0) {
        stillLooking++;

        var formParams = mapping[keys[i]]['form-params'];

        for (var j = 0; j < vectors.length; j++) {
          for (var k = 0; k < formParams.length; k++) {
            auth(keys[i], function(browser) {
              browser.fill('input[name="'+formParams[k]+'"]', vectors[j]);
              browser.pressButton('input[name="Submit"]', function(res) { // TODO what input should we hit?
                vulns.push(res);
                console.log(res);
                stillLooking--;
                if (i == keys.length - 1 && stillLooking == 0) {
                  callback(vulns);
                }
              });
            });
          }
        }
      }
    }
  }
}