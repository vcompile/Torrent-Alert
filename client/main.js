save = function() {
    $("#opt").val({
        polymer_color_db: polymer_color_db,

        list: (document.querySelector("html /deep/ layout-inbox") ? document.querySelector("html /deep/ layout-inbox").list : []),
        toolBar: (document.querySelector("html /deep/ layout-inbox") ? document.querySelector("html /deep/ layout-inbox").toolBar : {
            class: "teal-500",
            text: "Torrent Alert"
        }),
        proxy: (document.querySelector("html /deep/ layout-inbox") ? document.querySelector("html /deep/ layout-inbox").proxy : true)
    });
};
