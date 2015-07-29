define(["jquery", "sjcl", "ChromeWrapper"], function($, sjcl, ChromeWrapper) {
  var refreshIntervalKey = "office365-checker-interval",
      encryptionKey = "office365-checker-suPeRseCr3tD0nTrEadTH1$",
      credentialsKey = "office365-checker-credentials";

  function onRefreshIntervalChange(callback) {
      ChromeWrapper.onChangeInStorage(refreshIntervalKey, function(intervalStr) {
          if (typeof intervalStr === "undefined" || isNaN(intervalStr)) {
              callback(1);
          } else {
              callback(parseInt(intervalStr, 10));
          }
      });
  }

  function getRefreshInterval(callback) {
      ChromeWrapper.getFromStorage(refreshIntervalKey, function(intervalStr) {
          if (typeof intervalStr === "undefined" || isNaN(intervalStr)) {
              callback(1);
          } else {
              callback(parseInt(intervalStr, 10));
          }
      });
  }

  function setRefreshInterval(interval) {
      ChromeWrapper.setInStorage(refreshIntervalKey, interval);
  }

  function onSavedCredentialsChange(callback) {
      ChromeWrapper.onChangeInStorage(credentialsKey, function(encryptedCredentials) {
          try {
              var credentialsStr = sjcl.decrypt(encryptionKey, encryptedCredentials),
                  credentials = JSON.parse(credentialsStr);
              callback(credentials.user, credentials.pass);
          } catch (e) {
              callback(undefined, undefined);
          }
      });
  }

  function getSavedCredentials(callback) {
      ChromeWrapper.getFromStorage(credentialsKey, function(encryptedCredentials) {
          try {
              var credentialsStr = sjcl.decrypt(encryptionKey, encryptedCredentials),
                  credentials = JSON.parse(credentialsStr);
              callback(credentials.user, credentials.pass);
          } catch (e) {
              callback(undefined, undefined);
          }
      });
  }

  function setSavedCredentials(username, password) {
      var credentials = { "user": username, "pass": password },
          credentialsJson = JSON.stringify(credentials),
          encryptedCredentials = sjcl.encrypt(encryptionKey, credentialsJson);
      console.log("saving credential " + username);
      ChromeWrapper.setInStorage(credentialsKey, encryptedCredentials);
  }

  return {
      onSavedCredentialsChange: onSavedCredentialsChange,
      getSavedCredentials: getSavedCredentials,
      setSavedCredentials: setSavedCredentials,
      onRefreshIntervalChange: onRefreshIntervalChange,
      getRefreshInterval: getRefreshInterval,
      setRefreshInterval: setRefreshInterval
  };
});
