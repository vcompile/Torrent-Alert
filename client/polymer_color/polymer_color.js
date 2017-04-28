polymer_color = (key = '') => {
  key = key.replace(/[^0-9a-z]+/gi, '');

  if (key) {
    if (polymer_color_store_local[key]) {
      return polymer_color_store_local[key];
    } else {
      polymer_color_store_local[key] = _.sample(polymer_color_store).class; return polymer_color_store_local[key];
    }
  } else {
    return '';
  }
};

polymer_color_store = [{ class: 'red-500', hex: '#F44336' }, { class: 'pink-500', hex: '#E91E63' }, { class: 'purple-500', hex: '#9C27B0' }, { class: 'deep-purple-500', hex: '#673AB7' }, { class: 'indigo-500', hex: '#3F51B5' }, { class: 'blue-500', hex: '#2196F3' }, { class: 'light-blue-500', hex: '#03A9F4' }, { class: 'cyan-500', hex: '#00BCD4' }, { class: 'teal-500', hex: '#009688' }, { class: 'green-500', hex: '#4CAF50' }, { class: 'light-green-500', hex: '#8BC34A' }, { class: 'lime-500', hex: '#CDDC39' }, { class: 'yellow-500', hex: '#FFEB3B' }, { class: 'amber-500', hex: '#FFC107' }, { class: 'orange-500', hex: '#FF9800' }, { class: 'deep-orange-500', hex: '#FF5722' }, { class: 'brown-500', hex: '#795548' }, { class: 'grey-500', hex: '#9E9E9E' }, { class: 'blue-grey-500', hex: '#607D8B' }];

polymer_color_store_local = {};
