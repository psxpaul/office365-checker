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
            Squire: "/test/js/util/Squire-0.2.0",
            test: "/test"
        }
    };

    if(typeof require === "undefined") {
        require = requireConfig;
    } else {
        require.config = requireConfig;
    }
}());
