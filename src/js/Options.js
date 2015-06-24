define(["ChromeWrapper"], function(ChromeWrapper) {
  var refreshIntervalKey = "office365-checker-interval";

  function getRefreshInterval(callback) {
      ChromeWrapper.getFromStorage(refreshIntervalKey, function(intervalStr) {
          if(typeof intervalStr === "undefined" || isNaN(intervalStr)) {
              callback(1);
          } else {
              callback(parseInt(intervalStr, 10));
          }
      });
  }

  function setRefreshInterval(interval) {
      ChromeWrapper.setInStorage(refreshIntervalKey, interval);
  }

  return {
    getRefreshInterval: getRefreshInterval,
    setRefreshInterval: setRefreshInterval
  };
});
