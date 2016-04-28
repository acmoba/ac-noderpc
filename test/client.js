/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var noderpc = require('../')
var rpc_client = new noderpc.ClientRPC();

rpc_client.event.on('error', function(err) {
    console.log(err);
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

    rpc_client.getobj(function(err, result) {
        console.log('getobj: ' + err);
        console.log('getobj: ' + JSON.stringify(result));
    });
});

rpc_client.event.on('connected', function() {
    console.log('connected');
});

rpc_client.event.on('disconnected', function() {
    console.log('disconnected');
});

rpc_client.tryConnect({
    type    :   'tcp',
    host    :   '127.0.0.1',
    port    :   12345,
    auth    :   'abcdef'
});
