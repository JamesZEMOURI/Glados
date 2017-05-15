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
  if (net.isIP(program.ip) === 0) {} else {
    var net = require('net');
    var client = new net.Socket();
    client.connect(1337, program.ip, function() {
      console.log('CONNECTED: ' + client.remoteAddress + ':' + client.remotePort);
      var header = "GLADOS protrocol version 1.0.0"
      client.write('|' + header + '|' + program.username + '|' + program.password + '|' + Valuecommand + '|');
      client.destroy();
    });
  }
}

/*
  client.on('data', function(data) {
  console.log('Received: ' + data);
  client.destroy();
  });
*/
