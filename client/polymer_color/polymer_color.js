polymer_color_class = [{
  class: "red-500",
  count: 0,
  hex: "#F44336"
}, {
  class: "pink-500",
  count: 0,
  hex: "#E91E63"
}, {
  class: "purple-500",
  count: 0,
  hex: "#9C27B0"
}, {
  class: "deep-purple-500",
  count: 0,
  hex: "#673AB7"
}, {
  class: "indigo-500",
  count: 0,
  hex: "#3F51B5"
}, {
  class: "blue-500",
  count: 0,
  hex: "#2196F3"
}, {
  class: "light-blue-500",
  count: 0,
  hex: "#03A9F4"
}, {
  class: "cyan-500",
  count: 0,
  hex: "#00BCD4"
}, {
  class: "teal-500",
  count: 0,
  hex: "#009688"
}, {
  class: "green-500",
  count: 0,
  hex: "#4CAF50"
}, {
  class: "light-green-500",
  count: 0,
  hex: "#8BC34A"
}, {
  class: "lime-500",
  count: 0,
  hex: "#CDDC39"
}, {
  class: "yellow-500",
  count: 0,
  hex: "#FFEB3B"
}, {
  class: "amber-500",
  count: 0,
  hex: "#FFC107"
}, {
  class: "orange-500",
  count: 0,
  hex: "#FF9800"
}, {
  class: "deep-orange-500",
  count: 0,
  hex: "#FF5722"
}, {
  class: "brown-500",
  count: 0,
  hex: "#795548"
}, {
  class: "grey-500",
  count: 0,
  hex: "#9E9E9E"
}, {
  class: "blue-grey-500",
  count: 0,
  hex: "#607D8B"
}];

polymer_color_db = {};

polymer_color = function(key) {
  if (key) {
    key = key.replace(/[^0-9a-zA-Z]/g, "");

    if (key.length) {
      if (polymer_color_db[key]) {
        return polymer_color_db[key];
      } else {
        polymer_color_class = _.sortBy(polymer_color_class, "count");

        polymer_color_db[key] = polymer_color_class[0].class;
        polymer_color_class[0].count += 1;

        return polymer_color_db[key];
      }
    } else {
      return "";
    }
  } else {
    return "";
  }
};
