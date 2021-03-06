define(["jquery", "ChromeWrapper"], function($, ChromeWrapper) {
    var loggedInImage = $("#loggedInImage"),
        loggedInImageRetina = $("#loggedInImageRetina"),
        notLoggedInImage = $("#notLoggedInImage"),
        notLoggedInImageRetina = $("#notLoggedInImageRetina"),
        oldUnreadCount,
        loadingTimer = 0,
        loadingFrames = [".   ", " .  ", "  . ", "   ."];

    function paintLoadingFrame() {
        ChromeWrapper.setBadgeBgColor({color:[0, 113, 197, 255]});
        ChromeWrapper.setBadgeText({text:loadingFrames[0]});
        loadingFrames.push(loadingFrames.shift());
    }

    function animateFlip() {
        var animationFrames = 36,
            animationSpeed = 10,
            rotation = 0,
            doFlip;

        doFlip = function() {
            var canvas = $("#badgeCanvas")[0],
                canvasContext = canvas.getContext("2d"),
                img = new Image();

            img.crossOrigin = "Anonymous";
            img.src = loggedInImage.attr("src");

            try {
                rotation += 1/animationFrames;
                canvasContext.save();
                canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                canvasContext.translate(Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
                canvasContext.rotate(2 * Math.PI * ((1 - Math.sin(Math.PI / 2 + rotation * Math.PI)) / 2));
                canvasContext.drawImage(img, -Math.ceil(canvas.width / 2), -Math.ceil(canvas.height / 2));
                canvasContext.restore();

                ChromeWrapper.setBadgeIcon({imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)});
            } catch(e) {
                //console.dir(e);
                ChromeWrapper.setBadgeIcon({
                    path: {
                        "19": notLoggedInImage.attr("src"),
                        "38": notLoggedInImageRetina.attr("src")
                    }
                });
            }

            if (rotation <= 1) {
                setTimeout(doFlip, animationSpeed);
            } else {
                ChromeWrapper.setBadgeIcon({
                    path: {
                        "19": loggedInImage.attr("src"),
                        "38": loggedInImageRetina.attr("src")
                    }
                });
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
                ChromeWrapper.setBadgeIcon({
                    path: {
                        "19": loggedInImage.attr("src"),
                        "38": loggedInImageRetina.attr("src")
                    }
                });
                ChromeWrapper.setBadgeBgColor({color:[0, 113, 197, 255]});
                ChromeWrapper.setBadgeText({
                    text: unreadCount === 0 ? "" : unreadCount.toString()
                });
            } else {
                ChromeWrapper.setBadgeIcon({
                    path: {
                        "19": notLoggedInImage.attr("src"),
                        "38": notLoggedInImageRetina.attr("src")
                    }
                });
                ChromeWrapper.setBadgeBgColor({color:[190, 190, 190, 230]});
                ChromeWrapper.setBadgeText({text:"?"});
            }

            if(oldUnreadCount !== unreadCount) {
                console.log(new Date().toLocaleTimeString() + " - flipping badge   oldUnreadCount: " + oldUnreadCount + "    unreadCount: " + unreadCount);
                animateFlip();
            }
            oldUnreadCount = unreadCount;
        }
    };
});
