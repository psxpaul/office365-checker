require(["jquery", "OfficeServer", "Badge"], function($, OfficeServer, Badge) {
    console.log(new Date().toLocaleTimeString() + " - loading everything!");

    function updateInboxCount() {
        OfficeServer.getUnreadCount({
            before: function() {
                Badge.startLoadingAnimation();
                console.log(new Date().toLocaleTimeString() + " - updating unread count...");
            },
            success: function(unreadCount) {
                Badge.stopLoadingAnimation();
                Badge.setUnreadCount(unreadCount);
            },
            error: function() {
                Badge.stopLoadingAnimation();
                console.log("error: ");
                console.dir(arguments);
            }
        });
    }

    chrome.webNavigation.onDOMContentLoaded.addListener(updateInboxCount, OfficeServer.chromeUrlFilter);
    chrome.webNavigation.onReferenceFragmentUpdated.addListener(updateInboxCount, OfficeServer.chromeUrlFilter);

    chrome.alarms.create('office365-checker', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name == 'office365-checker') {
            updateInboxCount();
        }
    });

    updateInboxCount();
    chrome.browserAction.onClicked.addListener(updateInboxCount);
});
