#!/usr/bin/env node

var app = require('node-nerve'),
    server,
    options = require('commander')
        .option('-p, --port <port>', 'port to listen on')
        .parse(process.argv);

app.route(require('../src/routes'));

server = app.listen(options.port || 3000, function () {
    var host = server.address().address,
        port = server.address().port;

  console.log('Nerve app listening at http://%s:%s', host, port);

});