var Discover = require('./Discover');
var fs = require('fs');
var Crawl = require('./Crawl');
var Sanitization = require('./Sanitization');

//Mode. Either discover or test
var mode = process.argv[2];
var url = process.argv[3];

var options = [];

var optionsMap = {
  "custom-auth": 0,
  "common-words": 0,
  "vectors": 0,
  "sensitive": 0,
  "random": 0,
  "slow": 0
}

if(process.argv.length < 4){
  console.log("usage: node app.js [discover/test] url --options");
}

for(var i = 4; i < process.argv.length; i++) {
  var argument = process.argv[i].split("=");
  argument[0] = argument[0].slice(2);
  if(optionsMap[argument[0]] == null) {
    console.error('System does not recognize argument: ' + argument[0]);
  }

  optionsMap[argument[0]] = argument[1];
}

if(mode === "discover") {
  if(optionsMap['custom-auth'] === 'dvwa') {
    Crawl.findPageLinks(url, Discover.authIntoDVWA, discoverAfterCrawl);
  }

  else if(optionsMap['custom-auth'] === 'bodgeit') {
    Crawl.findPageLinks(url, Discover.authIntoBodgeit, discoverAfterCrawl);
  }

  else {
    console.log("Custom-auth site was either not dvwa or bodgeit, or was not provided.");
    console.log("Moving forward without custom authentication...");
    Crawl.findPageLinks(url, Discover.discover, discoverAfterCrawl());
  }
}

else if(mode === "test") {
  //Parse input vectors into the app
  console.log("parsing input vectors...");
  if(optionsMap['vectors'] == 0) {
    console.error("No vectors option was provided!");
    process.exit();
  }

  fs.readFile(optionsMap['vectors'], function (err, data) {
    if (err) throw err;
    var vectors = data.toString().split('\n');
  });
}
else {
  console.error('unrecognized mode: ' + mode);
}

function parseCommonWords(path, callback) {
  fs.readFile(path, function (err, data) {
    if (err) throw err;
    commonWords = data.toString().split('\n');
    callback(commonWords);
  });
}

/*
 * Browser has been initialized and app has been
 * authenticated if it has been requestd to do so.
 * let's discover some inputs!
 */
function discoverAfterCrawl(auth, mapping) {
  auth(url, function(browser) {
    if(optionsMap['common-words'] != 0) {
      parseCommonWords(optionsMap['common-words'], function(wordsArray) {
        console.log("Analyzing common words input for " + wordsArray.length, "words.");
        console.log("===============================");
        Discover.parseCommonWords(url, browser, wordsArray);
      });
    }

     if(optionsMap['slow'] != 0) {
        console.log('custom response time max of ' + optionsMap['slow'] + " ms was found.");
      }


    //Check cookie and show to user
    Discover.showCookie(browser);
    //Crawl pages and display all discovered links/input fields to user
    console.log("Pages and input fields discovered:");
    console.log(JSON.stringify(mapping, null, 2));
    if (optionsMap['vectors'] != 0) {
      console.log('List of vectors provided!');
      parseInputVectors(optionsMap['vectors'], function(vectors) {
        Sanitization.findVulnerabilities(url, auth, vectors, mapping, function(vulns) {
          console.log("Vulnerabilities discovered:");
          for (var i = 0; i < vulns.length; i++) {
            console.log(vulns[i]);
          }
        });
      });
    }
    if(optionsMap['sensitive'] != 0) {
          console.log('List of sensitive options provided! ');
          var path = optionsMap['sensitive'];
          fs.readFile(path, function (err, data) {
            if (err) throw err;
            sensitiveWords = data.toString().split('\n');
            console.log("Sensitive word list: ", sensitiveWords);
            console.log("========================================");
            console.log("Pages and input fields discovered:");
            Crawl.findPageLinks(browser, url, function(mapping) {
              console.log(JSON.stringify(mapping, null, 2));
            })
          });
        }
    var appString = browser.url.indexOf('dvwa') == -1 ? "Bodgeit" : "DVWA" ;
    Discover.checkResponseTimeAndCode(browser, "Login", appString, function() {

    });
  });
}

function parseInputVectors(path, callback) {
  fs.readFile(path, function (err, data) {
    if (err) throw err;
    vectors = data.toString().split('\n');
    callback(vectors);
  });
}
