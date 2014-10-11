define(["ChromeWrapper", "Squire", "jquery"], function(ChromeWrapper, Squire, $) {
    var injector = new Squire(),
        mockChromeWrapper = sinon.stub(ChromeWrapper),
        office365Url = "https://outlook.office365.com/",
        before, error, success;

    injector.mock("ChromeWrapper", mockChromeWrapper);

    describe("OfficeServerTest", function() {
        var server, requests;

        function assertCallCounts(domLoaded, actionClick, createTab, updateTab, getAllTabs, executeInTab) {
            assert.equal(mockChromeWrapper.onDOMContentLoaded.callCount, domLoaded, "param 1 domLoaded not equal");
            assert.equal(mockChromeWrapper.onBrowserActionClick.callCount, actionClick, "param 2 actionClick not equal");
            assert.equal(mockChromeWrapper.createTab.callCount, createTab, "param 3 createTab not equal");
            assert.equal(mockChromeWrapper.updateTab.callCount, updateTab, "param 4 updateTab not equal");
            assert.equal(mockChromeWrapper.getAllTabs.callCount, getAllTabs, "param 5 getAllTabs not equal");
            assert.equal(mockChromeWrapper.executeInTab.callCount, executeInTab, "param 6 executeInTab not equal");
        }

        beforeEach(function() {
            requests = [];
            server = sinon.fakeServer.create();
            server.xhr.filters = [];
            server.xhr.useFilters = true;

            server.xhr.addFilter(function(method, url, async, username, password) {
                requests.push({url: url, method: method});
                return url.indexOf("https://outlook.office365.com/") === -1;
            });

            mockChromeWrapper.onDOMContentLoaded.reset();
            mockChromeWrapper.onBrowserActionClick.reset();
            mockChromeWrapper.createTab.reset();
            mockChromeWrapper.updateTab.reset();
            mockChromeWrapper.getAllTabs.reset();
            mockChromeWrapper.executeInTab.reset();

            before = sinon.stub();
            error = sinon.stub();
            success = sinon.stub();

            injector.clean("OfficeServer");
        });

        afterEach(function() {
            server.restore();
            window.server = server;
        });

        it("clicking badge when no office tabs open", injector.run(["OfficeServer"], function(OfficeServer) {
            assert.lengthOf(requests, 0);
            assertCallCounts(1, 1, 0, 0, 0, 0);

            var actionClick = mockChromeWrapper.onBrowserActionClick.lastCall.args[0];
            actionClick();
            assertCallCounts(1, 1, 0, 0, 1, 0);

            mockChromeWrapper.getAllTabs.lastCall.args[1]([{id: 0}, {id: 1, url: "http://google.com"}]);
            assertCallCounts(1, 1, 1, 0, 1, 0);
            assert.isTrue(mockChromeWrapper.createTab.lastCall.calledWithMatch({url: office365Url, active: true}));

            //getUnreadCount returns a 401 (needs authentication)
            assert.lengthOf(requests, 0);
            OfficeServer.getUnreadCount({ before: before, error: error, success: success });
            assert.lengthOf(requests, 1);
            server.respondWith("GET", OfficeServer.unreadCountUrl, [401, {}, ""]);
            server.respond();

            assert.equal(before.callCount, 1, "before not called!");
            assert.equal(error.callCount, 1, "error not called!");
            assert.equal(success.callCount, 0, "success unexpectedly called!");

            //clicking again will cause 2 tabs to open (office365 ui, and EWS login page)
            actionClick();
            assertCallCounts(1, 1, 2, 0, 2, 0);
            assert.deepEqual(mockChromeWrapper.createTab.lastCall.args[0], {url: OfficeServer.unreadCountUrl, active: true});
            mockChromeWrapper.createTab.lastCall.args[1]({id: 7});
            assertCallCounts(1, 1, 2, 0, 2, 1);

            mockChromeWrapper.getAllTabs.lastCall.args[1]([{id: 0}, {id: 1, url: "http://google.com"}]);
            assertCallCounts(1, 1, 3, 0, 2, 1);
            assert.deepEqual(mockChromeWrapper.createTab.lastCall.args[0], {url: OfficeServer.office365Url, active: false});
        }));

        it("clicking badge when office tab is already open", injector.run(["OfficeServer"], function(OfficeServer) {
            assert.lengthOf(requests, 0);
            assertCallCounts(1, 1, 0, 0, 0, 0);

            var actionClick = mockChromeWrapper.onBrowserActionClick.lastCall.args[0];
            actionClick();
            assertCallCounts(1, 1, 0, 0, 1, 0);

            mockChromeWrapper.getAllTabs.lastCall.args[1]([{id: 0}, {id: 1, url: "http://google.com"}, {id: 2, url: office365Url + "/some/email.aspx"}]);
            assertCallCounts(1, 1, 0, 1, 1, 0);
            assert.isTrue(mockChromeWrapper.updateTab.lastCall.calledWithMatch(2, {active: true}));

            //getUnreadCount returns a 401 (needs authentication)
            assert.lengthOf(requests, 0);
            OfficeServer.getUnreadCount({ before: before, error: error, success: success });
            assert.lengthOf(requests, 1);
            server.respondWith("GET", OfficeServer.unreadCountUrl, [401, {}, ""]);
            server.respond();

            assert.equal(before.callCount, 1, "before not called!");
            assert.equal(error.callCount, 1, "error not called!");
            assert.equal(success.callCount, 0, "success unexpectedly called!");

            //clicking again will cause 1 tab to open (EWS login page)
            actionClick();
            assertCallCounts(1, 1, 1, 1, 2, 0);
            assert.deepEqual(mockChromeWrapper.createTab.lastCall.args[0], {url: OfficeServer.unreadCountUrl, active: true});
            mockChromeWrapper.createTab.lastCall.args[1]({id: 7});
            assertCallCounts(1, 1, 1, 1, 2, 1);

            mockChromeWrapper.getAllTabs.lastCall.args[1]([{id: 0}, {id: 1, url: "http://google.com"}, {id: 2, url: office365Url + "/some/email.aspx"}]);
            assertCallCounts(1, 1, 1, 1, 2, 1);
        }));
    });
});
