Polymer({

  is: "project-item",

  number_minify(number) {
    if (9999 < number) {
      return Math.round(number / 1000) + 'K';
    }

    return number;
  },

});
