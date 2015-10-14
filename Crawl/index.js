var urlParser = require('url');

module.exports = {
  findPageLinks: function(siteUrl, auth, callback) {
    var mapping = {};
    var discoveredLinks = [];
    var stillLooking = 0;

    function crawl(url) {
      auth(siteUrl, function(browser) {
        browser.visit(url, function() {
          stillLooking++;
          var foundPage = false;
          findInputs(url, browser.document.forms);
          for (var i = 0; i < browser.document.links.length; i++) {
            if (inSameDomain(browser.document.links[i])) {
              var link = browser.document.links[i].href;
              if (discoveredLinks.indexOf(link) == -1) {
                foundPage = true;
                discoveredLinks.push(link);
                crawl(link);
              }
            }
          }
          stillLooking--;
          if (stillLooking == 0 && !foundPage) {
            callback(mapping);
          }
        });
      });
    }

    function findInputs(url, forms) {
      var urlObj = urlParser.parse(url);
      var queryParams = urlObj.query == null ? [] : urlObj.query.split('&');
      for (var i = 0; i < queryParams.length; i++) {
        queryParams[i] = queryParams[i].split('=')[0];
      }

      var formParams = {};
      for (var i = 0; i < forms.length; i++) {
        var inputs = forms[i].getElementsByTagName('input');
        formParams[i] = [];
        for (var j = 0; j < inputs.length; j++) {
          formParams[i].push(inputs[j].getAttribute('name'));
        }
      }
      var key = removeQueryParams(url);
      if (mapping[key] == undefined) {
        mapping[key] =  {
          "query-params": queryParams,
          "form-params": formParams
        };
      } else {
        mapping[key]['query-params'] = mapping[key]['query-params'].concat(queryParams).unique();
        mapping[key]['form-params'] = formParams;
      }
    }

    function inSameDomain(link) {
      var parsedLink = urlParser.parse(link.href);
      var parsedBase = urlParser.parse(siteUrl);
      var baseEndpoint = parsedBase.path.split('/')[1];
      var linkEndpoint = parsedLink.path.split('/')[1];
      return parsedLink.hostname == parsedBase.hostname && baseEndpoint == linkEndpoint;
    }

    Array.prototype.unique = function() {
      var a = this.concat();
      for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
            a.splice(j--, 1);
        }
      }

      return a;
    };

    crawl(siteUrl);
    function isSensitive(){
      var fs = require('fs');
      var wordlist = fs.readFileSync('sensitivewords.txt').toString().split("\n");
      for(i in wordlist) {

      }
    }
  }
}