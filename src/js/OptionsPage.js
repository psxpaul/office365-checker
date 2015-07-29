require(["jquery", "ChromeWrapper", "Options"], function($, ChromeWrapper, Options) {
    var refreshIntervalInput = $("#refreshInterval"),
        saveCredentialsCheckbox = $("#saveCredentialsCheckbox"),
        saveCredentialsInputs = $("#saveCredentialsInputs").hide(),
        usernameInput = $("#usernameInput"),
        passwordInput = $("#passwordInput");

    $("#refreshIntervalLabel").text(ChromeWrapper.getMessage("office365check_refreshIntervalLabel"));
    $("#refreshIntervalUnits").text(ChromeWrapper.getMessage("office365check_refreshIntervalUnits"));

    $("#saveCredentialsLabel").text(ChromeWrapper.getMessage("office365check_saveCredentialsLabel"));
    $("#usernameLabel").text(ChromeWrapper.getMessage("office365check_usernameLabel"));
    $("#passwordLabel").text(ChromeWrapper.getMessage("office365check_passwordLabel"));

    Options.getRefreshInterval(function(interval) {
        refreshIntervalInput.val(interval);
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

    refreshIntervalInput.bind("propertychange change click keyup input paste", function() {
        var newValue = parseInt($(this).val(), 10);
        $(this).val(newValue);
        Options.setRefreshInterval(newValue);
    });

    usernameInput.bind("propertychange change click keyup input paste", function() {
        var newValue = $(this).val();
        Options.setSavedCredentials(newValue, passwordInput.val());
    });

    passwordInput.bind("propertychange change click keyup input paste", function() {
        var newValue = $(this).val();
        Options.setSavedCredentials(usernameInput.val(), newValue);
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
