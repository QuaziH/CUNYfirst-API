//not in here we will loop through the table and text a person if class is open and if not continue onto the next person
//inserting will be done in another page or can it be done here?
require('dotenv').config();
const { Client } = require('pg');

const database_url = process.env.DATABASE_url;

const client = new Client(database_url);

client.connect();

// client.query("INSERT INTO classes(phone, institution, term, subject, class_num) VALUES ('3475276604@smtext.com', 'QNS01', '1182', 'CSCI', 1927)", (err, res) => {
//     console.log(err, res);
//     client.end()
// });

// client.query("SELECT * FROM classes", (err, res) => {
//     console.log(err, res);
//     client.end()
// });

// client.query("DELETE FROM classes WHERE phone='3475276604'", (err, res) => {
//     console.log(err, res);
//     client.end()
// });

module.exports = {
    query: (text, params, callback) => {
        return client.query(text, params, callback)
    }
};