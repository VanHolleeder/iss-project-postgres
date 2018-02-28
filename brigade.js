'use strict';

const { events, Job } = require('brigade');

const promisify = require('util').promisify;
const fs = require('fs');

const asyncMkdir = promisify(fs.mkdir);
const asyncCopyFile = promisify(fs.copyFile);

const path = require('path');

events.on('exec', async (e, p) => {
    const postgresUpdate = new Job('setup-db', 'node:8.9.4-alpine');

    postgresUpdate.storage.enabled = false;

    await fs.asyncMkdir('/var/app');
    await fs.asyncCopyFile(path.resolve(__dirname, 'setup-db.js'), '/var/app/setup-db.js');
    await fs.asyncCopyFile(path.resolve(__dirname, 'package.json'), '/var/app/package.json');
    await fs.asyncCopyFile(path.resolve(__dirname, 'package-lock.json'), '/var/app/package-lock.json');

    postgresUpdate.mountPath = '/var/app';


    postgresUpdate.tasks = [
        'cd /var/app',
        'npm i',
        'node /var/app/setup-db.js',
    ];

    const res = await postgresUpdate.run();

    console.log(res);
});
