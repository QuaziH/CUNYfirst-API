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

// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 331 ', 62280, '7188696520', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 331 ', 22410, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 370 ', 22455, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 311 ', 22411, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'PHYS', 'PHYS 227 ', 1927, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'MATH', 'MATH 241 ', 22925, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'MATH', 'MATH 241 ', 22919, '3475276604', '@smtext.com')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 370 ', 22456, '3475276604', '@smtext.com')");

// pool.query("SELECT * FROM classes");

// pool.query("DELETE FROM classes");

module.exports = {
    query: function query(text, params, callback) {
        return pool.query(text, params, callback);
    }
};

//Moustafa
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 343 ', 22422, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 343 ', 22425, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'CSCI', 'CSCI 343 ', 22815, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'PHYS', 'PHYS 103 ', 1895, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'PHYS', 'PHYS 103 ', 1896, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'PHYS', 'PHYS 103 ', 1897, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'MATH', 'MATH 231 ', 22194, '9175174711', '@tmomail.net')");
// pool.query("INSERT INTO classes(institution, term, subject, topic, class_num, phone, carrier) VALUES ('QNS01', '1182', 'MATH', 'MATH 231 ', 22915, '9175174711', '@tmomail.net')");
//# sourceMappingURL=index.js.map