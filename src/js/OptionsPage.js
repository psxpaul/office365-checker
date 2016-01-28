require(["jquery", "ChromeWrapper", "Options"], function($, ChromeWrapper, Options) {
    var refreshIntervalInput = $("#refreshInterval"),
        saveCredentialsCheckbox = $("#saveCredentialsCheckbox"),
        saveCredentialsInputs = $("#saveCredentialsInputs").hide(),
        disableNotificationsCheckbox = $("#disableNotificationsCheckbox"),
        usernameInput = $("#usernameInput"),
        passwordInput = $("#passwordInput"),
        cancelButton = $("#cancelButton"),
        saveButton = $("#saveButton"),
        form = $("#optionsForm");

    $("#refreshIntervalLabel").text(ChromeWrapper.getMessage("office365check_refreshIntervalLabel"));
    $("#refreshIntervalUnits").text(ChromeWrapper.getMessage("office365check_refreshIntervalUnits"));
    $("#disableNotificationsLabel").text(ChromeWrapper.getMessage("office365check_disableNotificationsLabel"));

    $("#saveCredentialsLabel").text(ChromeWrapper.getMessage("office365check_saveCredentialsLabel"));
    $("#usernameLabel").text(ChromeWrapper.getMessage("office365check_usernameLabel"));
    $("#passwordLabel").text(ChromeWrapper.getMessage("office365check_passwordLabel"));

    Options.getRefreshInterval(function(interval) {
        refreshIntervalInput.val(interval);
    });

    Options.getDisableNotifications(function(disableSetting) {
        disableNotificationsCheckbox.prop('checked', disableSetting)
    });

    Options.getSavedCredentials(function(username, password) {
        var credentialsSaved = false;
        if (typeof username === "string" && username !== "") {
            credentialsSaved = true;
            usernameInput.val(username);
        }

        if (typeof password === "string" && password !== "") {
            credentialsSaved = true;
            passwordInput.val(password);
        }
        saveCredentialsCheckbox.prop("checked", credentialsSaved).trigger("change");
    });

    saveButton.click(function() {
        var newInterval = parseInt(refreshIntervalInput.val(), 10);
        refreshIntervalInput.val(newInterval);
        Options.setRefreshInterval(newInterval, function() {
            Options.setDisableNotifications(disableNotificationsCheckbox.is(":checked"), function(){
                Options.setSavedCredentials(usernameInput.val(), passwordInput.val(), function() {
                    window.close();
                });
            });
        });
    });

    cancelButton.click(function() {
        window.close();
    });

    form.submit(function(e) {
        e.preventDefault();
        return false;
    });

    saveCredentialsCheckbox.change(function() {
      var checked = saveCredentialsCheckbox.is(":checked");
      saveCredentialsInputs.toggle(checked);

      if (checked !== true) {
          usernameInput.val("").trigger("change");
          passwordInput.val("").trigger("change");
      }
    }).change();
});
