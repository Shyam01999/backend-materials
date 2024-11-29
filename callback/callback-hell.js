const fs = require('fs');

fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(`Error in read file`, err)
    }

    const modifyData = data.toUpperCase();

    fs.writeFile('output.txt', modifyData, (err) => {
        if (err) {
            console.log(`Error in write file`, err);
            return;
        }

        console.log(`data written inside output file`);

        fs.readFile('output.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(`Error in read file`, err);
                return;
            }

            console.log("output file data", data);
        })
    })

})