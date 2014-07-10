var office365Url = "https://outlook.office365.com/",
    feedUrl = office365Url + "ews/odata/Me/Inbox/Messages?$filter=IsRead%20eq%20false",
    needsAuthentication = false,
    badge = new Badge();

function isOffice365Url(url) {
    return url.indexOf(office365Url) === 0 || url.indexOf(".outlook.com/owa") !== -1;
}

function updateInboxCount() {
    if(needsAuthentication) {
        console.log("skipping updating unread count, as authentication is still needed");
        return;
    }

    console.log("updating unread count");
    badge.startLoadingAnimation();
    $.ajax({
        url: feedUrl,
        statusCode: {
            401: function() {
                needsAuthentication = true;
            }
        },
        success: function(data) {
            needsAuthentication = false;
            badge.stopLoadingAnimation();

            var unreadCount = data.value.length;
            badge.setUnreadCount(unreadCount);
        },
        error: function() {
            badge.stopLoadingAnimation();
            badge.setUnreadCount();
            console.log("error: ");
            console.dir(arguments);
        }
    });
}

chrome.webNavigation.onDOMContentLoaded.addListener(updateInboxCount, { url: [{urlContains: office365Url}] });
chrome.webNavigation.onReferenceFragmentUpdated.addListener(updateInboxCount, { url: [{urlContains: office365Url}] });

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
                chrome.tabs.update(tab.id, {selected: true});
                updateInboxCount();
                foundTab = true;
            }
        });

        if(!foundTab)
            chrome.tabs.create({url: office365Url});
    });
});

updateInboxCount();
setInterval(updateInboxCount, 1000 * 60);
