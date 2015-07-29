(function() {
    var requireConfig = {
        baseUrl: "/src/js",
        shim: {
            jquery: {
                exports: "$"
            },
            sjcl: {
                exports: "sjcl"
            }
        },
        paths: {
            jquery: "lib/jquery-2.1.1.min",
            sjcl: "lib/sjcl-1.0.3.min",
            Squire: "/test/js/util/Squire-0.2.0",
            test: "/test"
        }
    };

    /* istanbul ignore else */
    if(typeof require === "undefined") {
        require = requireConfig;
    } else {
        require.config = requireConfig;
    }
}());
