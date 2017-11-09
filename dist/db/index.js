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

// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 62280, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 22410, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 22455, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 22411, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'PHYS', 1927, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'MATH', 22925, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, class_num, phone, carrier) VALUES ('QNS01', '1182', 'MATH', 22919, '3475276604', '@smtext.com')");

// pool.query("SELECT * FROM classes");

// pool.query("DELETE FROM classes");

module.exports = {
    query: function query(text, params, callback) {
        return pool.query(text, params, callback);
    }
};
//# sourceMappingURL=index.js.map