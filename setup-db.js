'use strict';

const pg = require('pg');

// create client for the database
const createClient = async () => {
    const pgOptions = {
        user: 'postgres',
        host: 'postgresql',
        port: 5432,
        password: 'secretpassword',
        database: 'postgres'
    };
    const client = new pg.Client(pgOptions);
    await client.connect();
    return client;
}

// check if the table exists
const tableExists = async () => {
    const c = await createClient();

    const q = await c.query('SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = \'issposition\');'); 
    await c.end();

    return !!(Array.isArray(q.rows) && q.rows[0].exists);
}

// create table
const createTable = async () => {
    const client = await createClient();

    const query = await client.query('CREATE TABLE issposition(id SERIAL PRIMARY KEY, latitude decimal, longitude decimal);');

    await client.end();
};

tableExists().then(async (exists) => {
    if (exists) {
        await createTable();
    }

    console.log('all setup');
}).catch(err => console.log(`An error occured while setting up the DB: ${db}`));
