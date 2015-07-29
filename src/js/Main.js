require(["Options", "OfficeServer", "Alarm"], function(Options, OfficeServer, Alarm) {
    Options.getSavedCredentials(function(username, password) {
        OfficeServer.setCredentials(username, password);
        Options.getRefreshInterval(Alarm.init);
    });

    Options.onSavedCredentialsChange(OfficeServer.setCredentials);
    Options.onRefreshIntervalChange(Alarm.init);
});
