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

var opt = {
    type    :   'tcp',
    port    :   12345,
    auth    :   'abcdef'
};
rpc_server.run(opt);
