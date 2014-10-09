/* global chrome */

define([], function() {
    return {
        onNotificationClick: function(callback) {
            chrome.notifications.onClicked.addListener(callback);
        },
        clearNotification: function(id, callback) {
            chrome.notifications.clear(id, callback);
        },
        createNotification: function(id, options, callback) {
            chrome.notifications.create(id, options, callback);
        },
        updateNotification: function(id, options, callback) {
            chrome.notifications.update(id, options, callback);
        },

        browserActionClick: function() {
            chrome.browserAction.onClicked.dispatch();
        },
        onBrowserActionClick: function(callback) {
            chrome.browserAction.onClicked.addListener(callback);
        },

        setBadgeBgColor: function(opts) {
            chrome.browserAction.setBadgeBackgroundColor(opts);
        },
        setBadgeIcon: function(opts) {
            chrome.browserAction.setIcon(opts);
        },
        setBadgeText: function(opts) {
            chrome.browserAction.setBadgeText(opts);
        },

        onDOMContentLoaded: function(callback, pattern) {
            chrome.webNavigation.onDOMContentLoaded.addListener(callback, pattern);
        },
        onReferenceFragmentUpdated: function(callback, pattern) {
            chrome.webNavigation.onReferenceFragmentUpdated.addListener(callback, pattern);
        },

        createAlarm: function(name, opts) {
            chrome.alarms.create(name, opts);
        },
        onAlarm: function(callback) {
            chrome.alarms.onAlarm.addListener(callback);
        },


        createTab: function(opts, callback) {
            chrome.tabs.create(opts, callback);
        },
        updateTab: function(id, opts) { chrome.tabs.update(id, opts); },
        executeInTab: function(id, opts) { chrome.tabs.executeScript(id, opts); },
        getAllTabs: function(id, callback) { chrome.tabs.getAllInWindow(id,callback); }
    };
});
