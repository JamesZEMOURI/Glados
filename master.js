#!/usr/bin/env node

var program = require('commander');

program
  .arguments('<command>')
  .version('1.0.0')
  .option('-a --ip <ip>', 'The server ip to connect, blank = localhost')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')

  .action(function(command) {
    Valuecommand = command;
  })
  .parse(process.argv);


if (typeof program.password === 'undefined' || typeof program.username === 'undefined' || typeof Valuecommand === 'undefined') {

  console.log('please specify username and password and command');
  process.exit(1);

} else {
  var net = require('net');
  var NodeRSA = require('node-rsa');
  var key = new NodeRSA({
    b: 512
  });
  var client = new net.Socket();

  client.connect(1337, program.ip, function() {
    console.log('CONNECTED: ' + client.remoteAddress + ':' + client.remotePort);
    var header = '|GLADOS protrocol version 1.0.0|';
    var body = key.encrypt(program.username + '|' + program.password + '|' + Valuecommand + '|', 'base64');
    console.log(key.public);
    client.write(header + body);
    client.destroy();
  });

}

/*
  client.on('data', function(data) {
  console.log('Received: ' + data);
  client.destroy();
  });
*/
