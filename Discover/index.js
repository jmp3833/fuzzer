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
        console.log('Verifying authentication into DVWA...');
        verifyAuth(browser, "DVWA", callback);
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
                console.log('Verifying authentication into Bodgeit...');
                verifyAuth(browser, "Bodgeit", callback);
              });
          });
        });
    });
  },

  parseCommonWords: function(siteUrl, browser, words) {
    siteUrl = urlParser.parse(siteUrl);

    for(var i = 0; i < words.length; i++) {
      console.log(siteUrl.path + '/' + words[i]);
      browser.visit(siteUrl.path + '/' + words[i], function() {
        if(browser.html().indexOf('404') > -1) {
          console.log('Page found for common-words entry');
        }
        else {
          console.log("No page found for common-words entry");
        }
      });  
    }
  },

  showCookie: function(browser) {
    console.log("Searching for cookies!");
    console.log("==============================");
    for(var i = 0; i < browser.cookies.length; i++) {
      console.log(browser.cookies[i]);
      console.log("==============================");
    }
  }
}

function verifyAuth(browser, appString, callback) {
  if(browser.response.status == '200') {
    console.log("Successful login into " + appString + "!");
    console.log("Status Code: " + browser.response.status);
  }
  else {
    console.log("Login error into " + appString + "!!"); 
  }
  callback(browser); 
}
