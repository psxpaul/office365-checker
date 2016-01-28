define(["jquery", "ChromeWrapper", "Options"], function($, ChromeWrapper, Options) {
    var notificationImage = $("#notificationImage"),
        iconUrl = notificationImage.attr("src"),
        notificationId = "office365_checker_notification",
        notificationsDisabled = false,
        oldNotificationCount = 0;

    ChromeWrapper.onNotificationClick(ChromeWrapper.browserActionClick);

    Options.getDisableNotifications(function(disabledSetting){
        notificationsDisabled = disabledSetting;
    });

    function updateNotification(unreadCount, notificationOptions) {
        if (!notificationsDisabled){
           if(unreadCount === 0) {
                ChromeWrapper.clearNotification(notificationId, $.noop);
            } else if(unreadCount > oldNotificationCount || typeof unreadCount !== "number" || isNaN(unreadCount)) {
                ChromeWrapper.clearNotification(notificationId, $.noop);
                ChromeWrapper.createNotification(notificationId, notificationOptions, $.noop);
            } else {
                ChromeWrapper.updateNotification(notificationId, notificationOptions, $.noop);
            }

            oldNotificationCount = unreadCount;
        }
    }

    return {
        notificationId: notificationId,
        notify: function(unreadCount, unreadMessages) {
            var notificationOptions = {};

            if(typeof unreadCount !== "number" || isNaN(unreadCount)) {
                unreadCount = 0;
            }

            if(typeof unreadMessages === "undefined") {
                notificationOptions = {
                    type: "basic",
                    title: "New Office365 Mail",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl
                };
            } else {
                notificationOptions = {
                    type: "list",
                    title: unreadCount + " new messages",
                    message: "You have " + unreadCount + " unread messages",
                    iconUrl: iconUrl,
                    items: $.map(unreadMessages, function(msg, i) {
                        return { title: msg.sender, message: msg.subject };
                    })
                };
            }

            updateNotification(unreadCount, notificationOptions);
        },
        error: function(title, message) {
            updateNotification(undefined, {
                type: "basic",
                title: title,
                message: message,
                iconUrl: iconUrl
            });
        }
    };
});
