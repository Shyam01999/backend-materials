const lodash = require('lodash');

const arr = ["shyam", "liku", "asish", "santosh", "ramyak"];

const nameCapitalize = lodash.map(arr , (arr) => {
    return lodash.capitalize(arr);
}
);

console.log("Capitalized names:", nameCapitalize);