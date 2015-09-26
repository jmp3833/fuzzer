var normalizeUrl = require('normalizeurl');

module.exports = {
  findPageLinks: function (browser, baseUrl, callback) {
    var numPagesStillChecking = 0;
    baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf(':')); // Remove the port.

    function crawl(endpoint, discoveredUrls, baseUrl, callback) {
      browser.visit(endpoint, function () {
        numPagesStillChecking++;
        var foundPage = false;
        for (var i = 0; i < browser.document.links.length; i++) {
          var url = normalizeUrl(browser.document.links[i].href).split(/[?#]/)[0]; // Remove query params and # indexes
          if (discoveredUrls.indexOf(url) == -1 && url.startsWith(baseUrl)) {
            foundPage = true;
            discoveredUrls.push(url);
            crawl(url.replace(baseUrl, ''), discoveredUrls, baseUrl, callback);
          }
        }
        numPagesStillChecking--;
        if (!foundPage && numPagesStillChecking == 0) { // if we are on a leaf and there are no threads still checking for new pages asynchronously.
          callback(discoveredUrls);
        }
      });
    }
    crawl('/', [], baseUrl, callback);
  }
}