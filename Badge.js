var Badge = function() {
    var loggedInImage = $("#loggedInImage"),
        notLoggedInImage = $("#notLoggedInImage"),
        oldUnreadCount,
        loadingTimer = 0,
        loadingFrames = [".   ", " .  ", "  . ", "   ."];

    function paintLoadingFrame() {
        chrome.browserAction.setBadgeBackgroundColor({color:[255, 140, 0, 255]});
        chrome.browserAction.setBadgeText({text:loadingFrames[0]});
        loadingFrames.push(loadingFrames.shift());
    }

    function animateFlip() {
        var animationFrames = 36,
            animationSpeed = 10,
            rotation = 0,
            doFlip;

        doFlip = function() {
            var icon = loggedInImage[0],
                canvas = $("canvas")[0],
                canvasContext = canvas.getContext('2d');

            rotation += 1/animationFrames;
            canvasContext.save();
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.translate(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
            canvasContext.rotate(2 * Math.PI * ((1 - Math.sin(Math.PI / 2 + rotation * Math.PI)) / 2));
            canvasContext.drawImage(icon, -Math.ceil(canvas.width / 2), -Math.ceil(canvas.height / 2));
            canvasContext.restore();

            chrome.browserAction.setIcon({imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)});

            if (rotation <= 1) {
                setTimeout(doFlip, animationSpeed);
            }
        };

        doFlip();
    }

    return {
        startLoadingAnimation: function() {
            if (!loadingTimer) {
                loadingTimer = window.setInterval(paintLoadingFrame, 100);
            }
        },
        stopLoadingAnimation: function() {
            if (loadingTimer) {
                clearInterval(loadingTimer);
                loadingTimer = false;
            }
        },
        setUnreadCount: function(unreadCount) {
            if (typeof unreadCount === "number") {
                chrome.browserAction.setIcon({path: loggedInImage.attr("src")});
                chrome.browserAction.setBadgeBackgroundColor({color:[255, 140, 0, 255]});
                chrome.browserAction.setBadgeText({
                    text: unreadCount === 0 ? "" : unreadCount.toString()
                });
            } else {
                chrome.browserAction.setIcon({path: notLoggedInImage.attr("src")});
                chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
                chrome.browserAction.setBadgeText({text:"?"});
            }

            if(oldUnreadCount !== unreadCount)
                animateFlip();
            oldUnreadCount = unreadCount;
        }
    };
};
