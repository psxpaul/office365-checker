define(["jquery"], function($) {
    var notificationImage = $("#notificationImage"),
        iconUrl = notificationImage.attr("src"),
        notificationId = "office365_checker_notification";

    chrome.notifications.onClicked.addListener(function() {
        chrome.browserAction.onClicked.dispatch();  //do the same thing as clicking on the badge when clicking the notification
    });

    return {
        notify: function(unreadCount) {
            if(typeof unreadCount !== "number" || unreadCount === 0) {
                chrome.notifications.clear(notificationId, function(){});
            } else {
                chrome.notifications.create(notificationId, {
                    type: "basic",
                    title: "New Office365 Mail",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl
                }, function() {});
            }
        }
    };
});
