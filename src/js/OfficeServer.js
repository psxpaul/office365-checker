define(["jquery", "ChromeWrapper"], function($, ChromeWrapper) {
    var office365Url = "https://outlook.office365.com/",
        feedUrl = office365Url + "api/v1.0/Me/Folders/Inbox/",
        unreadCountUrl = feedUrl + "Messages?$filter=IsRead%20eq%20false&$select=IsRead,Sender,Subject",
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
                var unreadCount = 0;
	            var unreadMessages = [];
                needsAuthentication = false;

	            $.each(data.value, function(i, msg) {
		            if (!msg.IsRead) {
			            ++unreadCount;
			            unreadMessages.push({ sender: msg.Sender.EmailAddress.Name, subject: msg.Subject });
		            }
	            });
	            opts.success(unreadCount, unreadMessages);
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
