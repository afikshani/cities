const DB = require('./db');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

try {
    DB.init();
    app.use(require('./Routes'));
    app.listen(PORT, () => {
        console.log(`Cities suggestions engine service listening on port: ${PORT}`);
    });

} catch(err) {
    console.error(err.stack);
    process.exit(1);
}
