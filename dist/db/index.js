'use strict';

require('dotenv').config();

var _require = require('pg'),
    Pool = _require.Pool;

var pool = new Pool({
    user: process.env.POOL_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.POOL_PASSWORD,
    port: process.env.PORT
});

// pool.query("INSERT INTO classes(phone, institution, term, subject, class_num) VALUES ('3475276604@smtext.com', 'QNS01', '1182', 'PHYS', 1927)", (err, res) => {
//     console.log(err, res);
// });

// pool.query("SELECT * FROM classes", (err, res) => {
//     console.log(err, res);
// });

// pool.query("DELETE FROM classes", (err, res) => {
//     console.log(err, res);
// });

module.exports = {
    query: function query(text, params, callback) {
        return pool.query(text, params, callback);
    }
};
//# sourceMappingURL=index.js.map