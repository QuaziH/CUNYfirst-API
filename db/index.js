require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POOL_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.POOL_PASSWORD,
    port: process.env.DBPORT,
});

// pool.query("SELECT * FROM classes");

// pool.query("DELETE FROM classes");

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
};




