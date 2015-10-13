var normalizeUrl = require('normalizeurl');
var urlParser = require('url');

module.exports = {
  findPageLinks: function(browser, baseUrl, callback) {
    var stillLooking = 0;
    function crawl(baseUrl, discoveredUrls, mapping, url, document, callback) {
      console.log('Crawling ' + url);
      findInputs(url, document.forms, mapping);
      var links = [];
      for (var i = 0; i < document.links.length; i++) {
        links.push(document.links[i]);
      }

      if (links.length > 0) {
        visitLinks(links, baseUrl, discoveredUrls, mapping, callback, 0);
      } else if (stillLooking == 0) {
        callback(mapping);
      }
    }

    function visitLinks(links, baseUrl, discoveredUrls, mapping, callback, i) {
      if (inSameDomain(links[i], baseUrl)) {
        var link = links[i].href;
        if (discoveredUrls.indexOf(link) == -1) {
          stillLooking++;
          discoveredUrls.push(link);

          browser.visit(links[i].href, function () {
            crawl(baseUrl, discoveredUrls, mapping, browser.url, browser.document, callback);
            stillLooking--;
            if (i < links.length - 1) {
              visitLinks(links, baseUrl, discoveredUrls, mapping, callback, i + 1);
            } else if (stillLooking == 0) {
              callback(mapping);
            }
          });
        } else if (i < links.length - 1) {
          visitLinks(links, baseUrl, discoveredUrls, mapping, callback, i + 1);
        }
      } else if ( i < links.length - 1) {
        visitLinks(links, baseUrl, discoveredUrls, mapping, callback, i + 1);
      }
      if (stillLooking == 0) {
        callback(mapping);
      }
    }

    function removeQueryParams(url) {
      return url.split(/[?#]/)[0];
    }

    function findInputs(url, forms, mapping) {
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

    function inSameDomain(link, baseUrl) {
      var parsedLink = urlParser.parse(link.href);
      var parsedBase = urlParser.parse(baseUrl);
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

    crawl(baseUrl, [], {}, browser.url, browser.document, callback);
  }
}