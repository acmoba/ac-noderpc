/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var noderpc = require('../')
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

