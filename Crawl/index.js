var normalizeUrl = require('normalizeurl');
var urlParser = require('url');

module.exports = {
  findPageLinks: function(browser, baseUrl, callback) {
    var stillLooking = 0;
    function crawl(baseUrl, discoveredUrls, mapping, url, document, callback) {
      var foundPage = false;
      mapping[removeQueryParams(url)] = findInputs(url, document.forms);
      var links = [];
      for (var i = 0; i < document.links.length; i++) {
        links.push(document.links[i]);
      }
      for (var i = 0; i < links.length; i++) {
        if (inSameDomain(links[i], baseUrl)) {
          var link = removeQueryParams(links[i].href);
          if (discoveredUrls.indexOf(link) == -1) {
            foundPage = true;
            stillLooking++;
            discoveredUrls.push(link);

            browser.visit(links[i].href, function() {
              crawl(baseUrl, discoveredUrls, mapping, browser.url, browser.document, callback);
            });
          }
        }
      }
      stillLooking--;
      if (stillLooking == 0 && !foundPage) {
        callback(mapping);
      }
    }

    function removeQueryParams(url) {
      return url.split(/[?#]/)[0];
    }

    function findInputs(url, browserForms) {
      var urlObj = urlParser.parse(url);
      var queryParams = urlObj.query == null ? [] : urlObj.query.split('&');
      for (var i = 0; i < queryParams.length; i++) {
        queryParams[i] = queryParams[i].split('=')[0];
      }

      var forms = browserForms;
      var formParams = {};
      for (var i = 0; i < forms.length; i++) {
        var inputs = forms[i].getElementsByTagName('input');
        formParams[i] = [];
        for (var j = 0; j < inputs.length; j++) {
          formParams[i].push(inputs[j].getAttribute('name'));
        }
      }
      return {
        "query-params": queryParams,
        "form-params": formParams
      };
    }

    function inSameDomain(link, baseUrl) {
      var parsedLink = urlParser.parse(link.href);
      var parsedBase = urlParser.parse(baseUrl);
      var baseEndpoint = parsedBase.path.split('/')[1];
      var linkEndpoint = parsedLink.path.split('/')[1];
      return parsedLink.hostname == parsedBase.hostname && baseEndpoint == linkEndpoint;
    }

    crawl(baseUrl, [], {}, browser.url, browser.document, callback);
  }
}
/*
 module.exports = {
 findPageLinks: function(browser, baseUrl, callback) {
 var mapping = {};

 var numPagesStillChecking = 0;
 baseUrl = baseUrl.replace('http://', '');
 if (baseUrl.indexOf(':') != -1) {
 baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf(':')); // Remove the port.
 }
 baseUrl = 'http://' + baseUrl;

 function crawl(endpoint, discoveredUrls, baseUrl, callback) {
 browser.visit(endpoint, function () {
 mapping[baseUrl + endpoint] = findInputs(browser, baseUrl + endpoint);
 numPagesStillChecking++;
 var foundPage = false;
 for (var i = 0; i< browser.document.links.length; i++) {
 console.log(browser.document.links[i].href);
 }

 for (var i = 0; i < browser.document.links.length; i++) {
 var url = urlParser.parse(normalizeUrl(browser.document.links[i].href));

 if (discoveredUrls.indexOf(removeQueryParams(url.href)) == -1 && compareDomains(url.href, baseUrl)) {
 foundPage = true;
 discoveredUrls.push(removeQueryParams(url.href));

 crawl(removeQueryParams(url.path), discoveredUrls, baseUrl, callback);
 }
 }
 numPagesStillChecking--;
 if (!foundPage && numPagesStillChecking == 0) { // if we are on a leaf and there are no threads still checking for new pages asynchronously.
 callback(mapping);
 }
 });
 }

 function compareDomains(url1, url2) {
 if (url1.startsWith('http://localhost') || url1.startsWith('http://127.0.0.1')) {
 return url2.startsWith('http://localhost') || url2.startsWith('http://127.0.0.1');
 } else if (url2.startsWith('http://localhost') || url2.startsWith('http://127.0.0.1')) {
 return url1.startsWith('http://localhost') || url1.startsWith('http://127.0.0.1');
 } else if (url1.startsWith(url2)) {
 return true;
 } else {
 return false;
 }
 }

 function removeQueryParams(url) {
 return url.split(/[?#]/)[0];
 }

 function findInputs(browser, urlObj) {
 var queryParams = urlObj.query == null ? [] : urlObj.query.split('&');
 for (var i = 0; i < queryParams.length; i++) {
 queryParams[i] = queryParams[i].split('=')[0];
 }

 var forms = browser.document.forms;
 var formParams = {};
 for (var i = 0; i < forms.length; i++) {
 var inputs = forms[i].getElementsByTagName('input');
 formParams[i] = [];
 for (var j = 0; j < inputs.length; j++) {
 formParams[i].push(inputs[j].getAttribute('name'));
 }
 }
 return {
 "query-params": queryParams,
 "form-params": formParams
 };
 }
 crawl('/', [], baseUrl, callback);
 }
 }*/