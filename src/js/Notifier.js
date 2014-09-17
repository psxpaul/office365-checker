define(["jquery"], function($) {
    var notificationImage = $("#notificationImage"),
        iconUrl = notificationImage.attr("src"),
        notificationId = "office365_checker_notification";

    chrome.notifications.onClicked.addListener(function() {
        chrome.browserAction.onClicked.dispatch();  //do the same thing as clicking on the badge when clicking the notification
    });

    return {
        notify: function(unreadCount, unreadMessages) {
            chrome.notifications.clear(notificationId, function(){});

            if(typeof unreadCount !== "number" || unreadCount === 0) {
                //don't do any notification if there's no unreadCount
            } else if(typeof unreadMessages === 'undefined') {
                 chrome.notifications.create(notificationId, {
                    type: "basic",
                    title: "New Office365 Mail",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl
                }, function() {});
            } else {
                var items = [];
                $.each(unreadMessages, function(i, msg) {
                    items.push({ title: msg.sender, message: msg.subject });
                });

                chrome.notifications.create(notificationId, {
                    type: "list",
                    title: unreadCount + " new messages",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl,
                    items: items
                }, function() {});
            }
        }
    };
});
