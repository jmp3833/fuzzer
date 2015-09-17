var Discover = require('./discover');

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

for(var i = 4; i < process.argv.length; i++) {
  var argument = process.argv[i].split("=");
  argument[0] = argument[0].slice(2);
  if(optionsMap[argument[0]] == null) {
    console.error('System does not recognize argument: ' + argument[0]);
  }

  optionsMap[argument[0]] = argument[1];
}

if(mode === "discover") {
  Discover.discover(url, optionsMap);
}
else if(mode === "test") {
  //Test mode to be implemented in R2  
}
else {
  console.error('unrecognized mode: ' + mode);
}
