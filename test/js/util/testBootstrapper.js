(function () {
    var modules = document.body.getAttribute("data-modules").split(",");

    require(modules, function () {
        mocha.run();
    });
}());
