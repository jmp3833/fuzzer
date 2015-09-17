var urlParser = require('url');

module.exports = {
  discover: function(url, optionsMap) {
    console.log(urlParser.parse(url), " ", optionsMap);
  }
}
