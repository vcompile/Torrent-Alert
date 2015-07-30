polymer_color_class = ["_red", "_pink", "_purple", "_deep_purple", "_indigo", "_blue", "_light_blue", "_cyan", "_teal", "_green", "_light_green", "_lime", "_yellow", "_amber", "_orange", "_deep_orange", "_brown", "_grey", "_blue_grey"];
polymer_color_local = {};

polymer_color = function(key, save) {
    if (key) {
        key = key.replace(/[^0-9a-zA-Z]/g, "");

        if (key.length) {
            if (polymer_color_db[key]) {
                return polymer_color_db[key];
            } else {
                if (polymer_color_local[key]) {
                    return polymer_color_local[key];
                } else {
                    var A = polymer_color_class[Math.floor(Math.random() * polymer_color_class.length)];

                    if (save) {
                        polymer_color_db[key] = A;
                    } else {
                        polymer_color_local[key] = A;
                    }

                    return A;
                }
            }
        } else return "";
    } else return "";
};
