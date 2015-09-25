var urlParser = require('url');
var Browser = require('zombie');

module.exports = {

  /*
   * Jump into URL without authentication
   */ 
  discover: function(siteUrl, optionsMap) {
    var browser = new Browser();
    siteUrl = urlParser.parse(siteUrl);

    
    Browser.localhost(siteUrl.hostname, siteUrl.port? siteUrl.port : '80');
  },

  /*
   * Hard authenticate into DVWA with hard coded cridentials.
   * Returns an instance of the browser at the main index page.
   */ 
  authIntoDVWA: function(callback) {
    Browser.localhost('0.0.0.0');
    var browser = new Browser();
    
    browser.visit('/dvwa/login.php', function() {
      browser
     .fill('input[name="username"]', "admin")
     .fill('input[name="password"]', "password")
     .pressButton('input[name="Login"]', function(res) {
        callback(browser);
      }); 
    });
  }
}

function done(browser) {

}
