/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var _ServerRPC = require('./rpc_server');
var _ClientRPC = require('./rpc_client');
var _ProxyRPC = require('./rpc_proxy');

module.exports = {
	ServerRPC : _ServerRPC,
	ClientRPC : _ClientRPC,
	ProxyRPC : _ProxyRPC
};
