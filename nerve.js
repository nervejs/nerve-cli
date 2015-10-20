#!/usr/bin/env node

var templates = require('./src/templates'),
    create = require('./src/create'),
    options = require('commander')
        .parse(process.argv);

switch (options.args[0]) {
    case 'create':
        create.apply(this, options.args.slice(1));
        break;
    case 'templates':
        templates.apply(this, options.args.slice(1));
        break;
}