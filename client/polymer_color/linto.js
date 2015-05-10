polymer_color_db = {};

polymer_color = function(key) {
    if (key && key.trim() != "") {
        if (polymer_color_db[key]) return polymer_color_db[key];
        else {
            var A = ["_red", "_pink", "_purple", "_deep_purple", "_indigo", "_blue", "_light_blue", "_cyan", "_teal", "_green", "_light_green", "_lime", "_yellow", "_amber", "_orange", "_deep_orange", "_brown", "_grey", "_blue_grey"];
            polymer_color_db[key] = A[Math.floor(Math.random() * A.length)];

            return polymer_color_db[key];
        }
    } else return "";
};
