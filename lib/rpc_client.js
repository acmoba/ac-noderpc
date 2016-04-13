/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var _Transport = require('./transport');
var _EventEmitter = require('./eventemitter')

/**
 * @class
 */
function ClientRPC() {
    this.event = new _EventEmitter();

    this.client = {};

    var _this = this;

    this._keepalive = function() {
        var keepalive_req = _this.client.connection._protocol._proto.KeepAliveRequest.encode({});
        _this.client.connection.write(_this.client.connection._protocol._proto.MessageType.REQUEST_KEEPALIVE, keepalive_req);
    }

    this._callback = function(trans, req) {
        if ( req ) {
            switch ( req.message_type ) {
                case trans._protocol._proto.MessageType.RESPONSE_LOGIN:
                {
                    var login_resp = trans._protocol._proto.LoginResponse.decode(req.message_body);

                    if ( trans._protocol._proto.LoginResultType.LOGIN_SUCCESS == login_resp.result ) {
                        trans.session_id = login_resp.session_id;
                        _this.client.session_id = trans.session_id;
                        _this.client.connection = trans;

                        _this._tick = setTimeout(_this._keepalive, 3000);
                    }
                    else
                    {
                        _this.event.emit('err', 'Remote RPC Server auth failed.');
                    }
                    break;
                }
                case trans._protocol._proto.MessageType.RESPONSE_KEEPALIVE:
                {
                    var keepalive_resp = trans._protocol._proto.KeepAliveResponse.decode(req.message_body);
                    _this._tick = setTimeout(_this._keepalive, 3000);
                    break;
                }
                case trans._protocol._proto.MessageType.RESPONSE_CALL:
                {
                    break;
                }
            }
        }
    };

    this.tryConnect = function(opt) {
        this._transport = new _Transport(this._callback);

        if ( opt.type.toLowerCase() == "tcp" ) {
            this._transport.connectTCP(opt.host, opt.port, opt.auth);
        }
    };
}

module.exports = ClientRPC;
