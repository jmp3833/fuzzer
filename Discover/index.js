var urlParser = require('url');
var browser = require('zombie');

browser.localhost('127.0.0.1', 8080);
browser.visit('/')

module.exports = {
  discover: function(url, optionsMap) {
    console.log(urlParser.parse(url), " ", optionsMap);
  }
}
