require(["jquery", "OfficeServer", "Badge", "Notifier", "ChromeWrapper"], function($, OfficeServer, Badge, Notifier, ChromeWrapper) {
    console.log(new Date().toLocaleTimeString() + " - loading everything!");

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

    ChromeWrapper.onDOMContentLoaded(updateInboxCount, OfficeServer.chromeUrlFilter);
    ChromeWrapper.onReferenceFragmentUpdated(updateInboxCount, OfficeServer.chromeUrlFilter);

    ChromeWrapper.createAlarm("office365-checker", { periodInMinutes: 1 });
    ChromeWrapper.onAlarm(function(alarm) {
        if (alarm.name === "office365-checker") {
            updateInboxCount();
        }
    });

    updateInboxCount();
    ChromeWrapper.onBrowserActionClick(updateInboxCount);
});
