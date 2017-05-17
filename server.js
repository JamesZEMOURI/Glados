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

function parse_json_data(encrypted_data) {
  try {
    return JSON.parse(encrypted_data);
  } catch (ex) {
    return null;
  }
}
var key_server = new NodeRSA({
  b: 512
});

/* create server here*/
const server = net.createServer((socket) => {
  var public_key_server = key_server.exportKey('public');

  var public_key_server_buffer = Buffer.from(public_key_server, 'ascii');
  socket.write(public_key_server_buffer);
  console.log(public_key_server_buffer);

  /*when master send crypted msg*/
  socket.on('data', function(encrypted_data) {
    /*check if it is realy master*/
    var json_content = parse_json_data(encrypted_data);
    if (json_content != null) {
      var public_key_server_sign = json_content.public_key_server_sign;
      console.log(json_content.public_key_server_sign);
      if (key_server.verify(public_key_server_buffer, public_key_server_sign), 'base64') {




        var encrypted_data = json_content.encrypted_data;

        /*decrypt master msg*/
        var decrypted_data = key_server.decrypt(encrypted_data, 'utf8');

        /*parse data*/
        var json_content = parse_json_data(decrypted_data);
        /*check if it is realy master*/
        if (json_content.type === 'master') {
          /*check if it is realy master*/
          if (json_content.password === 'ok') {

            var public_key_master_buffer = json_content.public_key_master_buffer;
            /*check if it is a real key*/
            if (key_server.isEmpty(public_key_master_buffer) != true && key_server.getMaxMessageSize(public_key_master_buffer) === 22) {

              var public_key_master = new NodeRSA(public_key_master_buffer);

              /*crypt responce msg for master*/
              var encrypted_data = public_key_master.encrypt({
                "responce": 'Hello Master'
              });
              console.log(encrypted_data);

            }
          }
        }

        /*socket.remoteAddress l'ip d'ou vien la socket*/

      }
    }
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});




server.listen(1337, "localhost", () => {
  console.log('opened server on', server.address());
  console.log('==================================================');
});
