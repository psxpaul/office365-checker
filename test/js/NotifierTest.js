define(["ChromeWrapper", "Squire", "jquery"], function(RealChromeWrapper, Squire, $) {
    var injector = new Squire(),
        mockChromeWrapper = sinon.stub(RealChromeWrapper),
        msg1 = { sender: "Joe", subject: "Message 1" },
        msg2 = { sender: "Sally", subject: "Message 2" },
        msg3 = { sender: "Jeff", subject: "Message 3" };

    injector.mock("ChromeWrapper", mockChromeWrapper);
    //window.mockChromeWrapper = mockChromeWrapper;

    beforeEach(injector.run(["Notifier"], function(Notifier) {
        Notifier.notify(0);
        mockChromeWrapper.clearNotification.reset();
        mockChromeWrapper.updateNotification.reset();
        mockChromeWrapper.createNotification.reset();
    }));

    it("links notification clicks to browserAction clicks", injector.run(["Notifier"], function(Notifier) {
        assert.equal(mockChromeWrapper.onNotificationClick.callCount, 1);
        assert.isTrue(mockChromeWrapper.onNotificationClick.calledWith(mockChromeWrapper.browserActionClick));
    }));

    it("non-numbers clear notifications", injector.run(["Notifier"], function(Notifier) {
        assert.equal(mockChromeWrapper.clearNotification.callCount, 0);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);

        Notifier.notify("");
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(0).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);

        Notifier.notify("asdf");
        assert.equal(mockChromeWrapper.clearNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(1).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);

        Notifier.notify("123");
        assert.equal(mockChromeWrapper.clearNotification.callCount, 3);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(2).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);

        Notifier.notify(parseInt("s123", 10));
        assert.equal(mockChromeWrapper.clearNotification.callCount, 4);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(3).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);
    }));

    it("unreadCount without unreadMessages", injector.run(["Notifier"], function(Notifier) {
        assert.equal(mockChromeWrapper.clearNotification.callCount, 0);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);

        Notifier.notify(123);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(0).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.createNotification.getCall(0).calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 123 unread messages" }));

        Notifier.notify(123);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.updateNotification.getCall(0).calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 123 unread messages" }));
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);

        Notifier.notify(123);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.updateNotification.getCall(1).calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 123 unread messages" }));
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);

        Notifier.notify(120);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 3);
        assert.isTrue(mockChromeWrapper.updateNotification.getCall(2).calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 120 unread messages" }));
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);

        Notifier.notify(125);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(1).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 3);
        assert.equal(mockChromeWrapper.createNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.createNotification.getCall(1).calledWithMatch(Notifier.notificationId, { type: "basic", title: "New Office365 Mail", message: "You have 125 unread messages" }));
    }));

    it("unreadCount with unreadMessages", injector.run(["Notifier"], function(Notifier) {
        assert.equal(mockChromeWrapper.clearNotification.callCount, 0);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 0);

        Notifier.notify(3, [msg1, msg2, msg3]);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(0).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 0);
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.createNotification.getCall(0).calledWithMatch(Notifier.notificationId, {
                    type: "list",
                    title: "3 new messages",
                    message: "You have 3 unread messages",
                    items: [{title: "Joe", message: "Message 1"}, {title: "Sally", message: "Message 2"}, {title: "Jeff", message: "Message 3"}]
                }));

        Notifier.notify(3, [msg1, msg2, msg3]);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 1);
        assert.isTrue(mockChromeWrapper.updateNotification.getCall(0).calledWithMatch(Notifier.notificationId, {
                    type: "list",
                    title: "3 new messages",
                    message: "You have 3 unread messages",
                    items: [{title: "Joe", message: "Message 1"}, {title: "Sally", message: "Message 2"}, {title: "Jeff", message: "Message 3"}]
                }));
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);

        Notifier.notify(2, [msg1, msg3]);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 1);
        assert.equal(mockChromeWrapper.updateNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.updateNotification.getCall(1).calledWithMatch(Notifier.notificationId, {
                    type: "list",
                    title: "2 new messages",
                    message: "You have 2 unread messages",
                    items: [{title: "Joe", message: "Message 1"}, {title: "Jeff", message: "Message 3"}]
                }));
        assert.equal(mockChromeWrapper.createNotification.callCount, 1);

        Notifier.notify(3, [msg1, msg2, msg3]);
        assert.equal(mockChromeWrapper.clearNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.clearNotification.getCall(1).calledWithMatch(Notifier.notificationId));
        assert.equal(mockChromeWrapper.updateNotification.callCount, 2);
        assert.equal(mockChromeWrapper.createNotification.callCount, 2);
        assert.isTrue(mockChromeWrapper.createNotification.getCall(1).calledWithMatch(Notifier.notificationId, {
                    type: "list",
                    title: "3 new messages",
                    message: "You have 3 unread messages",
                    items: [{title: "Joe", message: "Message 1"}, {title: "Sally", message: "Message 2"}, {title: "Jeff", message: "Message 3"}]
                }));
    }));
});
