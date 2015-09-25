var Discover = require('./Discover');

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
    Discover.authIntoDVWA(url, function (browser) {
      console.log(browser.html());
    }); 
  }

  else if(optionsMap['custom-auth'] === 'bodgeit') {
    Discover.authIntoBodgeit(url, function(browser) {
      console.log(browser.html()); 
    });
  }

  else {
    console.log("Custom-auth site was either not dvwa or bodgeit, or was not provided.");
    console.log("Moving forward without custom authentication...");
    Discover.discover(url, function(browser) {
      console.log(browser.html());
    });
  }
}
else if(mode === "test") {
  //Test mode to be implemented in R2  
}
else {
  console.error('unrecognized mode: ' + mode);
}
