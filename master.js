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
  var master = new net.Socket();

  master.connect(1337, program.ip, function() {
    console.log('CONNECTED: ' + master.remoteAddress + ':' + master.remotePort);
    global.comunication_key = new NodeRSA(
      '-----BEGIN RSA PRIVATE KEY-----\n' +
      'MIIBFwIBAAI5AMQcSk6+233W75feGnayFbkHvU5/b6hV8p5GviuRaVibYnKIIuxu\n' +
      'l2TJmdLvcQsJw2wSsID6RZAJAgMBAAECOF9yiXQEDl4T827N6cFlcY8pxihje9vJ\n' +
      'YRlJwxolD0Sz07rzSMyBaxGH970etTrbx8N9BOxaJbP1Ah0A6fKbQtErNWu65DeK\n' +
      'sbvvwxIhV324+YutdP/k9wIdANaYond4tI346zNMLEkWRrTEWMo1VTCPV5XJ8v8C\n' +
      'HQDALM1DfuU6lctJKyLgS1xx5pPC9gCb5RRQtuATAhxqWnsqesgBFLx8T+Qi1Md2\n' +
      'D1lx3by6tE/UDKJBAh0A2Y6n7T9mILRIAu6mAeckICZpgjbWi5/W9TEhzA==\n' +
      '-----END RSA PRIVATE KEY-----\n'
    );


    random_string = global.comunication_key.encrypt('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    master.write(random_string);
  });



  master.on('data', function(public_key_server_buffer_crypted) {
    var key_master = new NodeRSA({
      b: 512
    });
    if (key_master.isEmpty(public_key_server_buffer_crypted) != true && key_master.isPrivate(public_key_server_buffer_crypted) != true && key_master.getMaxMessageSize(public_key_server_buffer_crypted) === 22) {
      var public_key_server_buffer_decrypted = global.comunication_key.decrypt(public_key_server_buffer_crypted);
      var public_key_server = new NodeRSA(public_key_server_buffer_decrypted);
      console.log("clé publique  décrypter : \n");
      console.log(public_key_server_buffer_decrypted);
      var header = 'GLADOS protrocol';
      var version = '1.0.0'
      var public_key_master = key_master.exportKey('public');
      var encrypted_data = public_key_server.encrypt({
        "header": header,
        "type": 'master',
        "version": version,
        "username": program.username,
        "password": program.password,
        "command": Valuecommand,
        "public_key_master_buffer": public_key_master,
      });

      var public_key_server_sign = key_master.sign(public_key_server_buffer_decrypted, 'base64');
      console.log("donner encrypter : \n");
      console.log(public_key_server_sign.toString('utf8'));
      console.log(public_key_server_buffer_decrypted);
      var encrypted_data_buffer = (JSON.stringify({
        "encrypted_data": encrypted_data.toString('base64'),
        "public_key_server_sign": public_key_server_sign
      }));

      master.write(encrypted_data_buffer);

      /*console.log(encrypted_data_buffer);*/

    }

    master.destroy();

  });


}
