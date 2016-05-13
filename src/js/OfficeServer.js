define(["jquery", "ChromeWrapper"], function($, ChromeWrapper) {
    var office365Url = "https://outlook.office365.com/",
        officeUrl = "https://outlook.office.com/",
        feedUrl = office365Url + "api/v1.0/Me/Folders/Inbox",
        unreadCountUrl = feedUrl,
        newestMessagesUrl = feedUrl + "/Messages?$filter=IsRead%20eq%20false&$top=3&$select=IsRead,Sender,Subject",
        needsAuthentication = false,
        usingStoredCredentials = false,
        savedUsername, savedPassword;

    function setCredentials(username, password) {
        savedUsername = username;
        savedPassword = password;
        if (typeof savedUsername === "string" && typeof savedPassword === "string" && savedUsername !== "" && savedPassword !== "") {
            needsAuthentication = false;
            usingStoredCredentials = true;
        } else {
            usingStoredCredentials = false;
        }
    }

    function isOffice365Url(url) {
        return url.indexOf(office365Url) === 0 ||url.indexOf(officeUrl) === 0 || url.indexOf(".outlook.com/owa") !== -1;
    }

    function getUnreadCount(opts) {
        if(needsAuthentication) {
            console.log("skipping updating unread count, as authentication is still needed");
            return;
        }

        $.support.cors = true;
        $.ajax({
            url: unreadCountUrl,
            username: savedUsername,
            password: savedPassword,
            beforeSend: opts.before,
            success: function(data) {
                var unreadCount = data.UnreadItemCount;
                needsAuthentication = false;

                if(isNaN(unreadCount)) {
                    opts.error();
                } else if(unreadCount === 0) {
                    opts.success(unreadCount, []);
                } else {
                    $.ajax({
                        url: newestMessagesUrl,
                        username: savedUsername,
                        password: savedPassword,
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
            error: function(e) {
                if (e.status === 401 || e.status === 404) {
                    if (usingStoredCredentials) {
                        opts.authenticationError();
                    }
                    needsAuthentication = true;
                }
                opts.error();
            }
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
        setCredentials: setCredentials,
        chromeUrlFilter: { url: [{urlContains: office365Url}] }
    };
});
