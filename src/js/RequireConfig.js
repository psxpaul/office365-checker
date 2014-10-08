(function() {
    var requireConfig = {
        baseUrl: "/src/js",
        shim: {
            jquery: {
                exports: "$"
            }
        },
        paths: {
            jquery: "lib/jquery-2.1.1.min",
            test: "/test"
        }
    };

    if(typeof require === "undefined") {
        require = requireConfig;
    } else {
        require.config = requireConfig;
    }
}());
