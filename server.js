/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
server, but for some reason omit a client connecting to it.  I added an
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');

const server = net.createServer((socket) => {
  socket.write('Echo server\r\n');
	socket.on('data', function(data) {
		console.log('DATA :' + data);
		/* client.destroy(); // kill client after server's response */
	});
}).on('error', (err) => {
  // handle errors here
  throw err;
});



// grab a random port.

server.listen(1337, "localhost",() => {
  console.log('opened server on', server.address());
});
/*
And connect with a tcp client from the command line using netcat, the *nix
utility for reading and writing across tcp/udp network connections.  I've only
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/

/* Or use this example tcp client written in node.js.  (Originated with
example code from
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */
