require(["jquery", "ChromeWrapper", "Options", "Alarm"], function($, ChromeWrapper, Options, Alarm) {
    var refreshIntervalInput = $("#refreshInterval");

    $("#refreshIntervalLabel").text(ChromeWrapper.getMessage("office365check_refreshIntervalLabel"));
    $("#refreshIntervalUnits").text(ChromeWrapper.getMessage("office365check_refreshIntervalUnits"));

    Options.getRefreshInterval(function(interval) {
        refreshIntervalInput.val(interval);
    });

    refreshIntervalInput.bind("propertychange change click keyup input paste", function() {
        $(this).val(parseInt($(this).val(), 10));
        Options.setRefreshInterval($(this).val());
        Alarm.setInterval($(this).val());
    });
});
