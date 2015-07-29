define(["ChromeWrapper", "sjcl", "Squire", "jquery"], function(ChromeWrapper, sjcl, Squire, $) {
    var injector = new Squire(),
        mockChromeWrapper = sinon.stub(ChromeWrapper),
        updateCallback = sinon.stub(),
        expectedCredentials = "{\"user\":\"joe\",\"pass\":\"p4ss\"}",
        encrypptionKey = "office365-checker-suPeRseCr3tD0nTrEadTH1$",
        encryptedCredentials = sjcl.encrypt(encrypptionKey, expectedCredentials);

    injector.mock("ChromeWrapper", mockChromeWrapper);

    describe("OptionsTest", function() {
        function assertCallCount(getCount, setCount, updateCallbackCount) {
            assert.equal(mockChromeWrapper.getFromStorage.callCount, getCount, "bad getFromStorage count");
            assert.equal(mockChromeWrapper.setInStorage.callCount, setCount, "bad setInStorage count");
            assert.equal(updateCallback.callCount, updateCallbackCount, "bad updateCallback.callCount");
        }

        beforeEach(function() {
            mockChromeWrapper.getFromStorage.reset();
            mockChromeWrapper.setInStorage.reset();
            updateCallback.reset();
            assertCallCount(0, 0, 0);
        });

        it("getting the refresh interval from storage", injector.run(["Options"], function(Options) {
            Options.getRefreshInterval(updateCallback);
            assertCallCount(1, 0, 0);
            mockChromeWrapper.getFromStorage.lastCall.args[1]("37");
            assert.equal(updateCallback.lastCall.args, 37);
            assertCallCount(1, 0, 1);
        }));

        it("getting the refresh interval from storage but finds nothing", injector.run(["Options"], function(Options) {
            Options.getRefreshInterval(updateCallback);
            assertCallCount(1, 0, 0);
            mockChromeWrapper.getFromStorage.lastCall.args[1]();
            assertCallCount(1, 0, 1);
            assert.equal(updateCallback.lastCall.args, 1);
        }));

        it("setting the refresh interval in storage", injector.run(["Options"], function(Options) {
            Options.setRefreshInterval(34);
            assertCallCount(0, 1, 0);
            assert.equal(mockChromeWrapper.setInStorage.lastCall.args[1], 34);
        }));

        it("getting the saved credentials", injector.run(["Options"], function(Options) {
            Options.getSavedCredentials(updateCallback);
            mockChromeWrapper.getFromStorage.lastCall.args[1](encryptedCredentials);
            assert.deepEqual(updateCallback.lastCall.args, ["joe", "p4ss"]);
            assertCallCount(1, 0, 1);
        }));

        it("setting saved credentials", injector.run(["Options"], function(Options) {
            Options.setSavedCredentials("joe", "p4ss");
            assertCallCount(0, 1, 0);
            assert.equal(sjcl.decrypt(encrypptionKey, mockChromeWrapper.setInStorage.lastCall.args[1]), expectedCredentials);
        }));
    });
});
