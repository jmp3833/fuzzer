var urlParser = require('url');
var Browser = require('zombie');

module.exports = {

  /*
   * Jump into URL without authentication
   */ 
  discover: function(siteUrl, callback) {
    siteUrl = urlParser.parse(siteUrl);
    Browser.localhost(siteUrl.hostname, siteUrl.port? siteUrl.port : '80');
    var browser = new Browser();

    browser.visit(siteUrl.path, function() {
      callback(browser);
    });

  },

  /*
   * Hard authenticate into DVWA with hard coded cridentials.
   * Returns an instance of the browser at the main index page.
   */ 
  authIntoDVWA: function(siteUrl, callback) {
    siteUrl = urlParser.parse(siteUrl);
    Browser.localhost(siteUrl.hostname, siteUrl.port? siteUrl.port : '80');
    var browser = new Browser();
    
    browser.visit('/dvwa/login.php', function() {
      browser
     .fill('input[name="username"]', "admin")
     .fill('input[name="password"]', "password")
     .pressButton('input[name="Login"]', function(res) {
        callback(browser);
      }); 
    });
  },
  
  /*
   * Hard auth into bodgeit store
   */ 
  authIntoBodgeit: function(siteUrl, callback) {
    siteUrl = urlParser.parse(siteUrl);
    Browser.localhost(siteUrl.hostname, siteUrl.port? siteUrl.port : '80');

    var browser = new Browser();
    browser.visit('/bodgeit/register.jsp', function() {
      browser
        .fill('input[name="username"]', 'example@email.com' )
        .fill('input[name="password1"]', 'password' )
        .fill('input[name="password2"]', 'password' )
        .pressButton('input[value="Register"]', function(res) {
          browser.visit('/bodgeit/login.jsp', function() {
 	    browser
              .fill('input[name="username"]', 'example@email.com' )
              .fill('input[name="password"]', 'password' )
              .pressButton('input[value="Login"]', function(res) {
                callback(browser); 
              });
          });
        });
    });
  },

  parseCommonWords: function(words) {
             
  }
}
