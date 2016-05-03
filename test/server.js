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
    ret(null);      /* return callback is required otherwise client will receive a timeout error.  */
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
