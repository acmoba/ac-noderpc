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

rpc_client.event.on('err', function(err) {
    console.log(err);
});

var opt = {
    type    :   'tcp',
    host    :   '127.0.0.1',
    port    :   12345,
    auth    :   '12345'
};
rpc_client.tryConnect(opt);
