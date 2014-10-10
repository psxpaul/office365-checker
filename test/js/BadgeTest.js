define(["ChromeWrapper", "Squire", "jquery"], function(ChromeWrapper, Squire, $) {
    var injector = new Squire(),
        mockChromeWrapper = sinon.stub(ChromeWrapper);

    injector.mock("ChromeWrapper", mockChromeWrapper);
    $("<img id='loggedInImage' src='src/images/office365_logged_in.png' style='display:none'></img>").appendTo("body");
    $("<img id='notLoggedInImage' src='src/images/office365_not_logged_in.png' style='display:none'></img>").appendTo("body");
    $("<canvas id='badgeCanvas' style='display:none'></canvas>").appendTo("body");

    describe("BadgeTest", function() {
        function assertCallCount(bgColor, icon, text) {
            assert.equal(mockChromeWrapper.setBadgeBgColor.callCount, bgColor);
            assert.equal(mockChromeWrapper.setBadgeIcon.callCount, icon);
            assert.equal(mockChromeWrapper.setBadgeText.callCount, text);
        }

        beforeEach(function() {
            mockChromeWrapper.setBadgeBgColor.reset();
            mockChromeWrapper.setBadgeIcon.reset();
            mockChromeWrapper.setBadgeText.reset();
            assertCallCount(0, 0, 0);
        });

        it("animation is beautiful!", injector.run(["Badge"], function(Badge) {
            var clock = sinon.useFakeTimers();

            Badge.startLoadingAnimation();
            assertCallCount(0, 0, 0);
            clock.tick(100);
            assertCallCount(1, 0, 1);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: ".   "}));

            clock.tick(100);
            assertCallCount(2, 0, 2);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: " .  "}));

            clock.tick(100);
            assertCallCount(3, 0, 3);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "  . "}));

            clock.tick(100);
            assertCallCount(4, 0, 4);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "   ."}));

            clock.tick(100);
            assertCallCount(5, 0, 5);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: ".   "}));

            clock.tick(100);
            assertCallCount(6, 0, 6);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: " .  "}));

            clock.tick(100);
            assertCallCount(7, 0, 7);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "  . "}));

            clock.tick(100);
            assertCallCount(8, 0, 8);
            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "   ."}));

            Badge.stopLoadingAnimation();
            assertCallCount(8, 0, 8);
            clock.tick(10000);
            assertCallCount(8, 0, 8);

            clock.restore();
        }));

        it("setting unread count to nothing makes badge grey and ?", injector.run(["Badge"], function(Badge) {
            assertCallCount(0, 0, 0);

            Badge.setUnreadCount();
            assertCallCount(1, 1, 1);

            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[190, 190, 190, 230]}));
            assert.isTrue(mockChromeWrapper.setBadgeIcon.lastCall.calledWithMatch({path: "src/images/office365_not_logged_in.png"}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "?"}));
        }));

        it("setting unread count to a number", injector.run(["Badge"], function(Badge) {
            var clock = sinon.useFakeTimers();
            assertCallCount(0, 0, 0);

            Badge.setUnreadCount(3);

            //TODO: figure out why PhantomJs throws an error when loading an image into the canvas
            if(typeof _phantom === "object") {
                assertCallCount(1, 1, 1);

                assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
                assert.isTrue(mockChromeWrapper.setBadgeIcon.lastCall.calledWithMatch({path: "src/images/office365_logged_in.png"}));
                assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "3"}));

                clock.restore();
                return;
            }

            assertCallCount(1, 2, 1);

            assert.isTrue(mockChromeWrapper.setBadgeBgColor.lastCall.calledWithMatch({color:[255, 140, 0, 255]}));
            assert.isTrue(mockChromeWrapper.setBadgeIcon.getCall(0).calledWithMatch({path: "src/images/office365_logged_in.png"}));
            assert.isTrue(mockChromeWrapper.setBadgeIcon.getCall(1).calledWithMatch({imageData: {}}));
            assert.isTrue(mockChromeWrapper.setBadgeText.lastCall.calledWithMatch({text: "3"}));

            clock.tick(350);
            assertCallCount(1, 37, 1);

            for(var i=2; i<37; i+=1) {
                assert.isTrue(mockChromeWrapper.setBadgeIcon.getCall(i).calledWithMatch({imageData: {}}));
            }

            clock.restore();
        }));
    });
});
