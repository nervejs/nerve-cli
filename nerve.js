#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    NerveCli,
    cli;

function install() {
    return new Promise((resolve, reject) => {
        var child = spawn('npm', ['install', 'node-nerve'], {
            cwd: process.cwd(),
            stdio: 'inherit'
        });

        child.on('exit', resolve);
        child.on('error', reject);
    });
}

function checkInstalled() {
    return new Promise((resolve, reject) => {
        if (fs.existsSync('./node_modules/node-nerve/utils/cli')) {
            resolve();
        } else {
            install()
                .then(resolve)
                .catch(reject);
        }
    });
}

checkInstalled()
    .then(() => {
        NerveCli = require(path.resolve(process.cwd(), './node_modules/node-nerve/utils/cli'));
        cli = new NerveCli();
    })
    .catch((err) => console.error(err));