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

  console.log('please specify option -u -p');
  process.exit(1);

} else {
  var net = require('net');
  var NodeRSA = require('node-rsa');
  var key_master = new NodeRSA({
    b: 512
  });
  var public_key_master = key_master.exportKey('public');
  var client = new net.Socket();

  client.connect(1337, program.ip, function() {
    console.log('CONNECTED: ' + client.remoteAddress + ':' + client.remotePort);
    client.write('ok');


  });
  /*client.write(key_master.exportKey('pkcs8-public'));*/


  client.on('data', function(public_key_server_buffer) {

    if (key_master.isEmpty(public_key_server_buffer) != true && key_master.isPrivate(public_key_server_buffer) != true && key_master.getMaxMessageSize(public_key_server_buffer) === 22) {

      var public_key_server = new NodeRSA(public_key_server_buffer);
      console.log(public_key_server_buffer);
      var header = 'GLADOS protrocol';
      var version = '1.0.0'
      var encrypted_data = public_key_server.encrypt({
        "header": header,
        "type": 'master',
        "version": version,
        "username": program.username,
        "password": program.password,
        "command": Valuecommand,
        "public_key_master_buffer": public_key_master
      }, 'base64');

      var public_key_server_sign = key_master.sign(public_key_server_buffer);
      console.log(public_key_server_sign);
      if (key_master.verify(public_key_server_buffer, public_key_server_sign)) {
        console.log(public_key_server_sign);
      }
      var encrypted_data_buffer = new Buffer.from(JSON.stringify({
        "encrypted_data": encrypted_data,
        "public_key_server_sign": public_key_server_sign.toString('base64')
      }));
      console.log(public_key_server_sign.toString('base64'));
      client.write(encrypted_data_buffer);
      /*console.log(encrypted_data_buffer);*/

    }

    client.destroy();

  });


}
