const fs = require('fs');
const DB = {};

function init() {
    try {
        const tsvData = fs.readFileSync(`${__dirname}/cities.tsv`, 'utf-8');
        const tsvFormatted = tsvData.split('\n').map((line) => line.split('\t'));
        const dataSet = tsvFormatted.slice(1);
        const dbColumns = tsvFormatted[0];
        DB.data = dataSet.map(item => {
            return item.reduce((newItem, currentFieldValue, currentIndex)=> {
                const fieldId = dbColumns[currentIndex];
                newItem[fieldId] = currentFieldValue;
                return newItem;
            }, {});
        })
        console.log(`Finished preparing the db...`);

    } catch (err){
        console.error(err.message);
        throw new Error('Error when preparing the DB')
    }
}

module.exports = {
    init,
    DB
}