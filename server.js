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
/* create server here*/
const server = net.createServer((socket) => {

  socket.on('data', function(data) {
    console.log('DATA :' + data);

  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});




server.listen(1337, "localhost", () => {
  console.log('opened server on', server.address());
});
