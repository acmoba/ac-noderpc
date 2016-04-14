# ac-noderpc
A simple, fast RPC for Node.JS

### Install

npm install ac-noderpc

### Server

Create RPC server:

	var noderpc = require('ac-noderpc')
	var rpc_server = new noderpc.ServerRPC();

Methods:

* publish([name,] function) -  Publish a function to be exposed over RPC.
* run(opt) -  Run RPC server.

		opt {
			type    :   'tcp',
			host	:   '0.0.0.0',
    		port    :   12345,
    		auth    :   'your password'
		}

Full example:

	var noderpc = require('ac-noderpc')
	var rpc_server = new noderpc.ServerRPC();

	function sum() {
	    var s = 0;
	    for ( var i = 0; i < arguments.length; i++) {
	        s += arguments[i];
	    }
	    return s;
	};
	rpc_server.publish(sum);
	rpc_server.publish('add', function(a, b) {
	    return a + b;
	});

	rpc_server.run({
	    type    :   'tcp',
	    port    :   12345,
	    auth    :   'abcdef'
	});

### Client


Create RPC client

	var noderpc = require('ac-noderpc')
	var rpc_client = new noderpc.ClientRPC();

Events:

* error - When an error occurs.
* connected - When the socket has connected to the RPC server.
* disconnected - When disconnected from the server.
* ready - When all the remote functions has been loaded.

Properties:

* event - The event listener.
* timeout - The timeout for RPC wait. default: 5000

Methods:

* tryConnect(opt) - Try to connect to the RPC server, it will automatically reconnect to the RPC server when the RPC server is unavailable.

		opt {
				type    :   'tcp',
				host	:   '0.0.0.0',
	    		port    :   12345,
	    		auth    :   'your password'
		}


Full example:

	var noderpc = require('ac-noderpc')
	var rpc_client = new noderpc.ClientRPC();

	rpc_client.event.on('error', function(err) {
	    console.log(err);
	});
	rpc_client.event.on('connected', function() {
	    console.log('connected');
	});
	rpc_client.event.on('disconnected', function() {
	    console.log('disconnected');
	});
	rpc_client.event.on('ready', function() {
	    rpc_client.sum(function(err, result) {
	        if ( err ) {
	            console.log(err);
	        } else {
	            console.log(result);
	        }
	    }, 1, 2, 3, 4);
	
	    rpc_client.add(function(err, result) {
	        if ( err ) {
	            console.log(err);
	        } else {
	            console.log(result);
	        }
	    }, 5, 7);
	
	});

	rpc_client.tryConnect({
	    type    :   'tcp',
	    host    :   '127.0.0.1',
	    port    :   12345,
	    auth    :   'abcdef'
	});

### Todo

* Benchmark
* Transport - Redis
* Transport - UDP
