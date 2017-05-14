#!/usr/bin/env node

var program = require('commander');

program
  .arguments('<command>')
  .option('-h, --hostname <hostname>', 'The server hostname to connect')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')

  .action(function(command) {

    var net = require('net');

    var client = new net.Socket();
    client.connect(1337, program.hostname, function() {
      console.log('CONNECTED: ' + client.remoteAddress + ':' + client.remotePort);
      client.write('|' + program.username + '|' + program.password + '|' + command + '|');
      client.destroy();
    });

  })
  .parse(process.argv);
