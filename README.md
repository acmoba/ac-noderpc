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
            host    :   '0.0.0.0',
            port    :   12345,
            auth    :   'your password'
        }

Full example:

    var noderpc = require('ac-noderpc')
    var rpc_server = new noderpc.ServerRPC();

    function sum() {
        var ret = arguments[0];     /* first argument is return callback. */
        var s = 0;
        for ( var i = 1; i < arguments.length; i++) {
            s += arguments[i];
        }

        ret(s);
    };
    rpc_server.publish(sum);

    function test(ret) {
        console.log('Just test, no return.');
        ret(null);        /* return callback is required otherwise client will receive a timeout error.  */
    };
    rpc_server.publish(test);

    rpc_server.publish('add', function(ret, a, b) {
        ret(a + b);
    });

    rpc_server.publish('getobj', function(ret) {
        ret({
            a : 'abc',
            d : 'cde',
            c : [1, 2, 3]
        }, 4, 5, 6);
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
                host    :   '0.0.0.0',
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

        rpc_client.test(function(err, result) {
            console.log('test: ' + err);
            console.log('test: ' + result);
        });    

        rpc_client.add(function(err, result) {
            if ( err ) {
                console.log(err);
            } else {
                console.log(result);
            }
        }, 5, 7);

        rpc_client.getobj(function(err, obj, a, b, c) {
            console.log('getobj: ' + err);
            console.log('getobj: ' + JSON.stringify(obj));
            console.log('getobj: ' + a + ', ' + b + ', ' + c);
        });
    
    });

    rpc_client.tryConnect({
        type    :   'tcp',
        host    :   '127.0.0.1',
        port    :   12345,
        auth    :   'abcdef'
    });

### Proxy

Create RPC Proxy

    var noderpc = require('ac-noderpc')
    var rpc_proxy = new noderpc.ProxyRPC();

Events:

* proxy_valid - When one of the client has connected to the RPC server.
* proxy_invalid - When all of the client has disconnected from the server.
* error - When an error occurs.
* connected - When the client has connected to the RPC server.
* disconnected - When the client has disconnected from the server.
* ready - When the client has ready.

Properties:

* event - The event listener.

Methods:

* addHost(opt) - Add RPC host to the proxy.
* 
        opt {
                type    :   'tcp',
                host    :   '0.0.0.0',
                port    :   12345,
                auth    :   'your password',
                priority : 1
        }

* isValid() - Check the proxy is valid.

Full example:

    var noderpc = require('ac-noderpc')
    var rpc_proxy = new noderpc.ProxyRPC();

    rpc_proxy.event.on('proxy_valid', function() {
        console.log('Proxy Valid.');
    
        rpc_proxy.sum(function(err, result) {
            if ( err ) {
                console.log(err);
            } else {
                console.log(result);
            }
        }, 1, 2, 3);
    });
    
    rpc_proxy.event.on('proxy_invalid', function() {
        console.log('Proxy Invalid.');
    });
    
    rpc_proxy.event.on('error', function(err, client) {
        console.log('Error: ' + err);
    });
    
    rpc_proxy.addHost({
        type    :   'tcp',
        host    :   '127.0.0.1',
        port    :   12345,
        auth    :   'abcdef',
        priority : 1
    });
    rpc_proxy.addHost({
        type    :   'tcp',
        host    :   '127.0.0.1',
        port    :   12345,
        auth    :   'abcdef',
        priority : 1
    });

### Todo

* Benchmark
* Transport - Redis
* Transport - UDP
