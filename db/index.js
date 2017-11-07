//not in here we will loop through the table and text a person if class is open and if not continue onto the next person
//inserting will be done in another page or can it be done here?
require('dotenv').config();
// const { Client } = require('pg');

const database_url = process.env.DATABASE_url;

// const client = new Client(database_url);

// client.connect();

// client.query("INSERT INTO classes(phone, institution, term, subject, class_num) VALUES ('3475276604@smtext.com', 'QNS01', '1182', 'CSCI', 1927)", (err, res) => {
//     console.log(err, res);
//     client.end()
// });

// client.query("SELECT * FROM classes", (err, res) => {
//     console.log(err, res);
//     client.end()
// });

const { Pool } = require('pg');

const pool = new Pool(database_url);

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
};