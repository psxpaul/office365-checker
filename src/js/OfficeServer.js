define(["jquery"], function($) {
    var office365Url = "https://outlook.office365.com/",
        feedUrl = office365Url + "ews/odata/Me/Inbox/Messages?$filter=IsRead%20eq%20false",
        needsAuthentication = false;

    function isOffice365Url(url) {
        return url.indexOf(office365Url) === 0 || url.indexOf(".outlook.com/owa") !== -1;
    }

    function getUnreadCount(opts) {
        if(needsAuthentication) {
            console.log("skipping updating unread count, as authentication is still needed");
            return;
        }

        $.ajax({
            url: feedUrl,
            statusCode: {
                401: function() {
                    needsAuthentication = true;
                }
            },
            success: function(data) {
                needsAuthentication = false;
                opts.success(data.value.length);
            },
            error: opts.error
        });
    }

    chrome.webNavigation.onDOMContentLoaded.addListener(function() {
        needsAuthentication = false;
    }, { url: [{urlEquals: feedUrl}] });

    chrome.browserAction.onClicked.addListener(function() {
        if(needsAuthentication) {
            chrome.tabs.create({url: feedUrl}, function(tab) {
                chrome.tabs.executeScript(tab.id, {code: "window.close();"});
            });
        }

        chrome.tabs.getAllInWindow(undefined, function(tabs) {
            var foundTab = false;

            $.each(tabs, function(i, tab) {
                if (tab.url && isOffice365Url(tab.url)) {
                    foundTab = foundTab || (tab.url !== feedUrl);

                    if(!needsAuthentication) {
                        chrome.tabs.update(tab.id, {active: true});
                        foundTab = true;
                    }
                }
            });

            if(!foundTab) {
                chrome.tabs.create({url: office365Url, active: !needsAuthentication});
            }
        });
    });

    return {
        getUnreadCount: getUnreadCount,
        chromeUrlFilter: { url: [{urlContains: office365Url}] }
    };
});
