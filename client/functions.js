array_ascii = function(array) {
  var string = [];

  for (var i = 0; i < array.length; i++) {
    string.push(String.fromCharCode(array[i]));
  }

  return string.join('');
};

ascii_array = function(string) {
  var array = Base64.newBinary(string.length);

  for (var i = 0; i < string.length; i++) {
    var c = string.charCodeAt(i);

    if (c > 0xFF) {
      throw new Error('ascii_array', c);
    }

    array[i] = c;
  }

  return array;
};

number_minify = function(number, decimal_place) {
  var suffix = ['K', 'M', 'B'];

  decimal_place = Math.pow(10, decimal_place);

  for (var index = suffix.length - 1; index >= 0; index--) {
    var size = Math.pow(10, (index + 1) * 3);

    if (size <= number) {
      number = Math.round(number * decimal_place / size) / decimal_place;

      if ((number == 1000) && (index < suffix.length - 1)) {
        index++;

        number = 1;
      }

      number += suffix[index];

      break;
    }
  }

  return number;
};
