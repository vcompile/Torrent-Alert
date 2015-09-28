polymer_color_class = ["red-500", "pink-500", "purple-500", "deep-purple-500", "indigo-500", "blue-500", "light-blue-500", "cyan-500", /* "teal-500", */ "green-500", "light-green-500", "lime-500", "yellow-500", "amber-500", "orange-500", "deep-orange-500", "brown-500", /* "grey-500", */ "blue-grey-500"];

polymer_color_db = {};
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
