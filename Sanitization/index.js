module.exports = {
  checkSanity: function(browser, mapping, vectors) {
    var keys = Object.keys[mapping];
    //visitLinks(mapping, vectors, 0);

    for (var i = 0; i < keys; i++) {
      // visit this link
      // for each form param
      //  for each vector
      //   put vector in form and submit
      //    check response
      console.log(mapping[key[i]]['form-params']);
    }

    function visitLinks(mapping, vectors, i) {
      browser.visit(Object.keys(mapping)[i], function() {
        var formParams = mapping[Object.keys(mapping)[i]]['form-params'];
        for (var j = 0; j < vectors.length; j++) {
          for (var k = 0; k < formParams.length; k++) {
            browser.fill('input[name="'+formParams[k]+'"]', vectors[j]);
          }
        browser.pressButton('input[name="Submit"]', function(res) { // TODO what input should we hit?

            if (i < Object.keys(mapping).length - 1) {
              visitLinks(mapping, vectors, i + 1);
            }
          });
        }
      });
    }
  }
}