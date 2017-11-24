'use strict';

require('dotenv').config();

var _require = require('pg'),
    Pool = _require.Pool;

var pool = new Pool({
    user: process.env.POOL_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.POOL_PASSWORD,
    port: process.env.DBPORT
});

// pool.query("SELECT * FROM classes");

// pool.query("DELETE FROM classes");

module.exports = {
    query: function query(text, params, callback) {
        return pool.query(text, params, callback);
    }
};
//# sourceMappingURL=index.js.map