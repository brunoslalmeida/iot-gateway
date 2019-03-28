const cli = require('./lib/cli');

const dotenv = require('dotenv');
dotenv.config();

let app = {};

(app.init = () => {
    cli.init();
})();

module.exports = app;
