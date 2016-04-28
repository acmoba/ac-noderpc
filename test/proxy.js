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

rpc_proxy.event.on('proxy_valid', function() {
    console.log('Proxy Valid.');
    try {
        rpc_proxy.sum(function(err, result) {
            if ( err ) {
                console.log(err);
            } else {
                console.log(result);
            }
        }, 1, 2, 3);
    } catch ( e ) {
        console.log('Exception: ' + e);
    }
});

rpc_proxy.event.on('proxy_invalid', function() {
    console.log('Proxy Invalid.');
});
