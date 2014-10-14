define(["ChromeWrapper", "Squire", "jquery"], function(ChromeWrapper, Squire, $) {
    var injector = new Squire(),
        mockChromeWrapper = sinon.stub(ChromeWrapper),
        msg1 = { sender: "Joe", subject: "Message 1" },
        msg2 = { sender: "Sally", subject: "Message 2" },
        msg3 = { sender: "Jeff", subject: "Message 3" };

    injector.mock("ChromeWrapper", mockChromeWrapper);
    $("<img id='notificationImage' src='src/images/office365_128.png' style='display:none'></img>").appendTo("body");

    describe("NotifierTest", function() {
        function assertCallCount(clear, update, create) {
            assert.equal(mockChromeWrapper.clearNotification.callCount, clear);
            assert.equal(mockChromeWrapper.updateNotification.callCount, update);
            assert.equal(mockChromeWrapper.createNotification.callCount, create);
        }

        beforeEach(injector.run(["Notifier"], function(Notifier) {
            Notifier.notify(0);
            mockChromeWrapper.clearNotification.reset();
            mockChromeWrapper.updateNotification.reset();
            mockChromeWrapper.createNotification.reset();
            assertCallCount(0, 0, 0);
        }));

        it("links notification clicks to browserAction clicks", injector.run(["Notifier"], function(Notifier) {
            assert.equal(mockChromeWrapper.onNotificationClick.callCount, 1);
            assert.isTrue(mockChromeWrapper.onNotificationClick.calledWith(mockChromeWrapper.browserActionClick));
        }));

        it("non-numbers clear notifications", injector.run(["Notifier"], function(Notifier) {
            assertCallCount(0, 0, 0);

            Notifier.notify("");
            assertCallCount(1, 0, 0);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));

            Notifier.notify("asdf");
            assertCallCount(2, 0, 0);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));

            Notifier.notify("123");
            assertCallCount(3, 0, 0);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));

            Notifier.notify(parseInt("s123", 10));
            assertCallCount(4, 0, 0);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));
        }));

        it("unreadCount without unreadMessages", injector.run(["Notifier"], function(Notifier) {
            assertCallCount(0, 0, 0);

            Notifier.notify(123);
            assertCallCount(1, 0, 1);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));
            assert.isTrue(mockChromeWrapper.createNotification.lastCall.calledWithMatch(Notifier.notificationId, { type: "basic", iconUrl: "src/images/office365_128.png", title: "New Office365 Mail", message: "You have 123 unread messages" }));

            Notifier.notify(123);
            assertCallCount(1, 1, 1);
            assert.isTrue(mockChromeWrapper.updateNotification.lastCall.calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 123 unread messages" }));

            Notifier.notify(123);
            assertCallCount(1, 2, 1);
            assert.isTrue(mockChromeWrapper.updateNotification.lastCall.calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 123 unread messages" }));

            Notifier.notify(120);
            assertCallCount(1, 3, 1);
            assert.isTrue(mockChromeWrapper.updateNotification.lastCall.calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 120 unread messages" }));

            Notifier.notify(125);
            assertCallCount(2, 3, 2);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));
            assert.isTrue(mockChromeWrapper.createNotification.lastCall.calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 125 unread messages" }));
        }));

        it("unreadCount with unreadMessages", injector.run(["Notifier"], function(Notifier) {
            assertCallCount(0, 0, 0);

            Notifier.notify(3, [msg1, msg2, msg3]);
            assertCallCount(1, 0, 1);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));
            assert.isTrue(mockChromeWrapper.createNotification.lastCall.calledWithMatch(Notifier.notificationId, {
                        type: "list",
                        title: "3 new messages",
                        message: "You have 3 unread messages",
                        items: [{title: "Joe", message: "Message 1"}, {title: "Sally", message: "Message 2"}, {title: "Jeff", message: "Message 3"}]
                    }));

            Notifier.notify(3, [msg1, msg2, msg3]);
            assertCallCount(1, 1, 1);
            assert.isTrue(mockChromeWrapper.updateNotification.lastCall.calledWithMatch(Notifier.notificationId, {
                        type: "list",
                        title: "3 new messages",
                        message: "You have 3 unread messages",
                        items: [{title: "Joe", message: "Message 1"}, {title: "Sally", message: "Message 2"}, {title: "Jeff", message: "Message 3"}]
                    }));

            Notifier.notify(2, [msg1, msg3]);
            assertCallCount(1, 2, 1);
            assert.isTrue(mockChromeWrapper.updateNotification.lastCall.calledWithMatch(Notifier.notificationId, {
                        type: "list",
                        title: "2 new messages",
                        message: "You have 2 unread messages",
                        items: [{title: "Joe", message: "Message 1"}, {title: "Jeff", message: "Message 3"}]
                    }));

            Notifier.notify(3, [msg1, msg2, msg3]);
            assertCallCount(2, 2, 2);
            assert.isTrue(mockChromeWrapper.clearNotification.lastCall.calledWithMatch(Notifier.notificationId));
            assert.isTrue(mockChromeWrapper.createNotification.lastCall.calledWithMatch(Notifier.notificationId, {
                        type: "list",
                        title: "3 new messages",
                        message: "You have 3 unread messages",
                        items: [{title: "Joe", message: "Message 1"}, {title: "Sally", message: "Message 2"}, {title: "Jeff", message: "Message 3"}]
                    }));
        }));
    });
});
