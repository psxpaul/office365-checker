define(["jquery", "ChromeWrapper"], function($, ChromeWrapper) {
    var office365Url = "https://outlook.office365.com/",
        feedUrl = office365Url + "ews/odata/Me/Folders/Inbox/",
        unreadCountUrl = feedUrl + "Messages/$count?$filter=IsRead%20eq%20false",
        newestMessagesUrl = feedUrl + "Messages?$filter=IsRead%20eq%20false&%24top=3",
        needsAuthentication = false;

    function isOffice365Url(url) {
        return url.indexOf(office365Url) === 0 || url.indexOf(".outlook.com/owa") !== -1;
    }

    function getUnreadCount(opts) {
        if(needsAuthentication) {
            console.log("skipping updating unread count, as authentication is still needed");
            return;
        }

        $.support.cors = true;
        $.ajax({
            url: unreadCountUrl,
            beforeSend: opts.before,
            statusCode: {
                401: function() {
                    needsAuthentication = true;
                }
            },
            success: function(data) {
                var unreadCount = parseInt(data, 10);
                needsAuthentication = false;

                if(isNaN(unreadCount)) {
                    opts.error();
                } else if(unreadCount === 0) {
                    opts.success(unreadCount, []);
                } else {
                    $.ajax({
                        url: newestMessagesUrl,
                        success: function(messages) {
                            var unreadMessages = [];

                            $.each(messages.value, function(i, msg) {
                                unreadMessages.push({ sender: msg.Sender.EmailAddress.Name, subject: msg.Subject });
                            });

                            opts.success(unreadCount, unreadMessages);
                        },
                        error: function() {
                            opts.success(unreadCount);

                            console.log("error: ");
                            console.dir(arguments);
                        }
                    });
                }
            },
            error: opts.error
        });
    }

    ChromeWrapper.onDOMContentLoaded(function() {
        needsAuthentication = false;
    }, { url: [{urlEquals: unreadCountUrl}] });

    ChromeWrapper.onBrowserActionClick(function() {
        if(needsAuthentication) {
            ChromeWrapper.createTab({url: unreadCountUrl, active: true}, function(tab) {
                ChromeWrapper.executeInTab(tab.id, {code: "window.close();"});
            });
        }

        ChromeWrapper.getAllTabs(undefined, function(tabs) {
            var foundTab = false;

            $.each(tabs, function(i, tab) {
                if(tab.url && isOffice365Url(tab.url)) {
                    foundTab = foundTab || (tab.url !== unreadCountUrl);

                    if(!needsAuthentication) {
                        ChromeWrapper.updateTab(tab.id, {active: true});
                        foundTab = true;
                    }
                }
            });

            if(!foundTab) {
                ChromeWrapper.createTab({url: office365Url, active: !needsAuthentication});
            }
        });
    });

    return {
        office365Url: office365Url,
        unreadCountUrl: unreadCountUrl,
        getUnreadCount: getUnreadCount,
        chromeUrlFilter: { url: [{urlContains: office365Url}] }
    };
});
