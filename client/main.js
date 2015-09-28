save = function() {
    $("#opt").val({
        polymer_color_db: polymer_color_db,
        toolBar: (document.querySelector("html /deep/ layout-inbox") ? document.querySelector("html /deep/ layout-inbox").toolBar : null),
        proxy: (document.querySelector("html /deep/ layout-inbox") ? document.querySelector("html /deep/ layout-inbox").proxy : true)
    });
};
