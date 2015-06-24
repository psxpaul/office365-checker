define(["OfficeServer", "Badge", "Notifier", "ChromeWrapper"], function(OfficeServer, Badge, Notifier, ChromeWrapper) {
    var alarmName = "office365-checker-alarm";

    function updateInboxCount() {
        OfficeServer.getUnreadCount({
            before: function() {
                Badge.startLoadingAnimation();
                console.log(new Date().toLocaleTimeString() + " - updating unread count...");
            },
            success: function(unreadCount, unreadMessages) {
                Badge.stopLoadingAnimation();
                Badge.setUnreadCount(unreadCount);
                Notifier.notify(unreadCount, unreadMessages);
            },
            error: function() {
                Badge.stopLoadingAnimation();
                Badge.setUnreadCount();

                console.log("error: ");
                console.dir(arguments);
            }
        });
    }

    function setInterval(interval) {
      ChromeWrapper.clearAlarm(alarmName);
      ChromeWrapper.createAlarm(alarmName, { periodInMinutes: interval });
      ChromeWrapper.onAlarm(function(alarm) {
          if (alarm.name === alarmName) {
              updateInboxCount();
          }
      });
    }

    ChromeWrapper.onDOMContentLoaded(updateInboxCount, OfficeServer.chromeUrlFilter);
    ChromeWrapper.onReferenceFragmentUpdated(updateInboxCount, OfficeServer.chromeUrlFilter);
    updateInboxCount();
    ChromeWrapper.onBrowserActionClick(updateInboxCount);


    return {
        setInterval: setInterval
    };
});
