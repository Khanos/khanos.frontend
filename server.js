const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.use(express.static(__dirname + '/dist/'));
app.get(/.*/, (req, res) => {
    res.sendfile(__dirname + '/dist/index.html');
});
let server = app.listen(port, () => {
    console.log('The frontend in ON...');
    console.log(`http://${host}:${port}`);
});

module.exports = server;
