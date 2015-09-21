(function getFoldersPage(link) {
    $.ajax({url: link, success: function(data) {
        var nextLink = data["@odata.nextLink"],
            childFolders = data.value;

        $.each(childFolders, function(i, folder) {
          console.log(folder.DisplayName);
        });

        if(nextLink) {
            getFoldersPage(nextLink);
        }
    }});
})("https://outlook.office365.com/ews/odata/Me/Folders/Inbox/childFolders");
