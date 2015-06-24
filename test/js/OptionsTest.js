define(["ChromeWrapper", "Squire", "jquery"], function(ChromeWrapper, Squire, $) {
    var injector = new Squire(),
        mockChromeWrapper = sinon.stub(ChromeWrapper);

    injector.mock("ChromeWrapper", mockChromeWrapper);

    describe("OptionsTest", function() {
        function assertCallCount(getCount, setCount) {
            assert.equal(mockChromeWrapper.getFromStorage.callCount, getCount, "bad getFromStorage count");
            assert.equal(mockChromeWrapper.setInStorage.callCount, setCount, "bad setInStorage count");
        }

        beforeEach(function() {
            mockChromeWrapper.getFromStorage.reset();
            mockChromeWrapper.setInStorage.reset();
            assertCallCount(0, 0);
        });

        it("getting the refresh interval from storage", injector.run(["Options"], function(Options) {
            var getCallback = sinon.stub();
            assert.equal(getCallback.callCount, 0);
            assertCallCount(0, 0);

            Options.getRefreshInterval(getCallback);
            assertCallCount(1, 0);
            mockChromeWrapper.getFromStorage.lastCall.args[1]("37");
            assert.equal(getCallback.callCount, 1);
            assert.equal(getCallback.lastCall.args, 37);
        }));

        it("getting the refresh interval from storage but finds nothing", injector.run(["Options"], function(Options) {
            var getCallback = sinon.stub();
            assert.equal(getCallback.callCount, 0);
            assertCallCount(0, 0);

            Options.getRefreshInterval(getCallback);
            assertCallCount(1, 0);
            mockChromeWrapper.getFromStorage.lastCall.args[1]();
            assert.equal(getCallback.callCount, 1);
            assert.equal(getCallback.lastCall.args, 1);
        }));

        it("setting the refresh interval in storage", injector.run(["Options"], function(Options) {
            assertCallCount(0, 0);

            Options.setRefreshInterval(34);
            assertCallCount(0, 1);
            assert.equal(mockChromeWrapper.setInStorage.lastCall.args[1], 34);
        }));
    });
});
