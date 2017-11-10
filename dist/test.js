"use strict";

var thing = function thing(arr, y) {
    var obj = {};
    var firstNum = y - arr[0];
    obj[firstNum] = 0;
    for (var i = 1; i < arr.length; i++) {
        if (obj.hasOwnProperty(arr[i])) {
            return obj[arr[i]] + " and " + i;
        } else {
            var nextNum = y - arr[i];
            obj[nextNum] = i;
        }
    }
};

var arr = [8, 5, 7, 0, 2, 6, 8, 1, 7, 2, 4, 0, 3, 5];

console.log(thing(arr, 8));
//# sourceMappingURL=test.js.map