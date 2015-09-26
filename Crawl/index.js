var normalizeUrl = require('normalizeurl');
var urlParser = require('url');

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
}