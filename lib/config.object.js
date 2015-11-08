_key = function (object, _key) {
    for (var A = 0; A < _key.length - 1; A++) {
        if (!(_key[A] in object)) {
            object[_key[A]] = {};
        }

        object = object[_key[A]];
    }

    if (_key[_key.length - 1] in object) {
        object[_key[_key.length - 1]] += 1;
    } else {
        object[_key[_key.length - 1]] = 1;
    }
};

_key_value = function (object, _key, value) {
    for (var A = 0; A < _key.length - 1; A++) {
        if (!(_key[A] in object)) {
            object[_key[A]] = {};
        }

        object = object[_key[A]];
    }

    object[_key[_key.length - 1]] = value;
};
