// var isAndroid = /Android/i.test(navigator.userAgent);
var isChrome = /Chrome/.test(navigator.userAgent);
// var isFireFox = /Firefox/.test(navigator.userAgent);

if (!isChrome) {
    alert("google chrome browser is required");
}

$(window).on("beforeunload", function() {
    save();

    // return "Are you sure you want to exit ?";
});
