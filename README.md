office365-checker
=================

Displays the number of unread messages in your Office365 Mail inbox. You can also click the button to open your inbox.

Installing via Chrome Web Store
-------------------------------
1. Click [here](https://chrome.google.com/webstore/detail/office365-mail-checker/cbefiefjdpebjofikekaolbbninhoeba) to go to the Office365 Chrome Web Store page
2. Click the *Add to Chrome* button
 
Installing Unpacked (best for local development)
------------------------------------------------
1. Clone this repo
2. Run the command from the project root
    npm install
    grunt manifest copy
3. Go to the [Chrome Extension Config page](chrome://extensions/) chrome://extensions/
4. Click the *Load unpacked extension...* button
5. Select the *dist/unpacked* directory inside the project root
6. (Optionally) run
    grunt watch
This will automatically re-run jshint, all unit tests, and rebuild the *dist/unpacked* directory. (note: you will still have to refresh the extension in Chrome to see any changes take effect)

Other useful grunt commands:
- grunt (will build and run all unit tests)
- grunt js-test-server (will start http server hosting test files, allowing you to run tests in your browser at localhost:8981)
