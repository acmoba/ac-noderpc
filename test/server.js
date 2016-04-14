/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var noderpc = require('../')

var rpc_server = new noderpc.ServerRPC();

function sum() {
    var s = 0;
    for ( var i = 0; i < arguments.length; i++) {
        s += arguments[i];
    }
    return s;
};
function test() {
    console.log('Just test, no return.');
};
rpc_server.publish(sum);
rpc_server.publish(test);
rpc_server.publish('add', function(a, b) {
    return a + b;
});
rpc_server.publish('getobj', function() {
    return {
        a : 'abc',
        d : 'cde',
        c : [1, 2, 3]
    };
});

rpc_server.run({
    type    :   'tcp',
    port    :   12345,
    auth    :   'abcdef'
});
