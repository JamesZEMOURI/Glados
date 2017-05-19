/*
Glados V1.0.0 server
*/

console.log("              .,-:;//;:=,")
console.log("          . :H@@@MM@M#H/.,+%;,")
console.log("       ,/X+ +M@@M@MM%=,-%HMMM@X/,")
console.log("     -+@MM; $M@@MH+-,;XMMMM@MMMM@+-")
console.log("    ;@M@@M- XM@X;. -+XXXXXHHH@M@M#@/.")
console.log("  ,%MM@@MH ,@%=             .---=-=:=,.")
console.log("  =@#@@@MX.,                -%HX$$%%%:;")
console.log(" =-./@M@M$                   .;@MMMM@MM:")
console.log(" X@/ -$MM/                    . +MM@@@M$")
console.log(",@M@H: :@:                    . =X#@@@@-")
console.log(",@@@MMX, .                    /H- ;@M@M=")
console.log(".H@@@@M@+,                    %MM+..%#$.")
console.log(" /MMMM@MMH/.                  XM@MH; =;")
console.log("  /%+%$XHH@$=              , .H@@@@MX,")
console.log("   .=--------.           -%H.,@@@@@MX,")
console.log("   .%MM@@@HHHXX$$$%+- .:$MMX =M@@MM%.")
console.log("     =XMMM@MM@MM#H;,-+HMM@M+ /MMMX=")
console.log("       =%@M@M#@$-.=$@MM@@@M; %M%=")
console.log("         ,:+$+-,/H#MMMMMMM@= =,")
console.log("              =++%%%%+/:-.")
var net = require('net');
var NodeRSA = require('node-rsa');


function parse_json_data(data) {
  try {
    return JSON.parse(data);
  } catch (ex) {
    return undefined;
  }
}

function decrypt(key, data) {
  try {
    return key.decrypt(data);
  } catch (ex) {
    return undefined;
  }
}

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


/*creation du server*/
const server = net.createServer((socket) => {
  /*création de la clé RSA server*/
  var key_server = new NodeRSA({
    b: 512
  });
  msg = [];
  /*data*/
  socket.on('data', function(data) {

    msg.push(data);
    var comunication_key_msg = decrypt(global.comunication_key, msg[0]);
    if (comunication_key_msg == 'da39a3ee5e6b4b0d3255bfef95601890afd80709') {
      var public_key_server_buffer = key_server.exportKey('public');
      if (msg[1] == undefined) { /* si le deuxieme message na pas était resus alors*/

        var public_key_server_buffer_crypted = global.comunication_key.encrypt(public_key_server_buffer);

        socket.write(public_key_server_buffer_crypted);
      } /* si le deuxieme message na pas était resus alors*/

      if (msg[1] != undefined) { /* si le deuxieme message n'est pas vide alors*/

        var encrypted_data_buffer = msg[1];

        var json_content = parse_json_data(encrypted_data_buffer);

        if (json_content != undefined) { /*si il contient des donnée au format json alors */
          var public_key_server_sign = json_content.public_key_server_sign;
          console.log(public_key_server_sign);

          console.log(public_key_server_buffer);
          if (key_server.verify(public_key_server_buffer, public_key_server_sign, 'base64') == false) { /*vérification de la signiature de la clé public server envoier a master*/

            var encrypted_data = json_content.encrypted_data;

            var decrypted_data = decrypt(key_server, encrypted_data);

            if (decrypted_data != undefined) { /*si les donnée on était décrypter alors */

              var json_content = parse_json_data(decrypted_data);

              if (json_content.type === 'master') {
                if (json_content.username === 'ok') {
                  if (json_content.password === 'ok') {

                    var public_key_master_buffer = json_content.public_key_master_buffer;

                    if (key_server.isEmpty(public_key_master_buffer) != true && key_server.getMaxMessageSize(public_key_master_buffer) === 22) {

                      var public_key_master = new NodeRSA(public_key_master_buffer);

                      var encrypted_data = public_key_master.encrypt({
                        "responce": 'Hello Master'
                      }, 'base64');
                      console.log(json_content.header+'|'+json_content.version+'|'+json_content.command);

                    } /*  on vérifie si la clé est conforme et alors */
                  } /*  password  */
                } /*  username  */
              } /*  master  */
            } /*si les donnée on était décrypter alors */
          }else{
            console.log("wtf");
          }/*vérification de la signiature de la clé public server envoier a master*/
        }/*si il contient des donnée au format json alors */
      }/* si le deuxieme message n'est pas vide alors*/
    } /*si la clé de communication est valide alors*/
    console.log('==================================================');
  }); /* a la reception de donner faire*/


}).on('error', (err) => {

  throw err;
});




server.listen(1337, "localhost", () => {
  console.log('opened server on', server.address());
});
