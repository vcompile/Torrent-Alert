polymer_color_db = {};

polymer_color_opt = [{
    class: "_red",
    count: 0
}, {
    class: "_pink",
    count: 0
}, {
    class: "_purple",
    count: 0
}, {
    class: "_deep_purple",
    count: 0
}, {
    class: "_indigo",
    count: 0
}, {
    class: "_blue",
    count: 0
}, {
    class: "_light_blue",
    count: 0
}, {
    class: "_cyan",
    count: 0
}, {
    class: "_teal",
    count: 0
}, {
    class: "_green",
    count: 0
}, {
    class: "_light_green",
    count: 0
}, {
    class: "_lime",
    count: 0
}, {
    class: "_yellow",
    count: 0
}, {
    class: "_amber",
    count: 0
}, {
    class: "_orange",
    count: 0
}, {
    class: "_deep_orange",
    count: 0
}, {
    class: "_brown",
    count: 0
}, {
    class: "_grey",
    count: 0
}, {
    class: "_blue_grey",
    count: 0
}];

polymer_color = function(key) {
    if (key) {
        key = key.replace(/[^0-9a-zA-Z]/g, "");

        if (key.length) {
            if (polymer_color_db[key]) return polymer_color_db[key];
            else {
                var A = _.sortBy(polymer_color_opt, "count");

                polymer_color_db[key] = A[0].class;
                A[0].count++;

                return A[0].class;
            }
        } else return "";
    } else return "";
};
