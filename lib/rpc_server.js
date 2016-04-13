/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var _Transport = require('./transport');

/**
 * @class
 */
function ServerRPC() {
    this.identifier = Math.round(Math.random() * 1000000);
    this.client_list = {};

    var _this = this;

    this._callback = function(trans, req) {
        if ( req ) {
            switch ( req.message_type ) {
                case trans._protocol._proto.MessageType.REQUEST_LOGIN:
                {
                    var login_req = trans._protocol._proto.LoginRequest.decode(req.message_body);

                    var login_ret = (_this.auth && login_req.auth == _this.auth) ? true : false;

                    trans.session_id = _this._generatorSessionID();

                    _this.client_list[trans.session_id] = {
                        session_id: trans.session_id,
                        keepalive: _this._getTimestamp() + (login_ret ? 5000 : 0),
                        connection: trans,
                        login_status: login_ret
                    };

                    var login_resp = trans._protocol._proto.LoginResponse.encode({
                        result: (login_ret ? trans._protocol._proto.LoginResultType.LOGIN_SUCCESS : trans._protocol._proto.LoginResultType.LOGIN_AUTH_FAILED),
                        session_id: trans.session_id
                    });
                    trans.write(trans._protocol._proto.MessageType.RESPONSE_LOGIN, login_resp);

                    break;
                }
                case trans._protocol._proto.MessageType.REQUEST_KEEPALIVE:
                {
                    if ( trans.session_id && _this.client_list[trans.session_id].login_status ) {
                        var keepalive_req = trans._protocol._proto.KeepAliveRequest.decode(req.message_body);

                        _this.client_list[trans.session_id].keepalive = _this._getTimestamp() + 5000;

                        var keepalive_resp = trans._protocol._proto.KeepAliveResponse.encode({});
                        trans.write(trans._protocol._proto.MessageType.RESPONSE_KEEPALIVE, keepalive_resp);
                    }
                    break;
                }
                case trans._protocol._proto.MessageType.REQUEST_CALL:
                {
                    var call_req = trans._protocol._proto.CallRequest.decode(req.message_body);

                    break;
                }
            }
        }
    };

    this._onTick = function() {
        for ( var k  in _this.client_list ) {
            if ( _this._getTimestamp() > _this.client_list[k].keepalive ) {
                console.log('client_list key = ' + k);
                _this.client_list[k].connection.close();
                delete _this.client_list[k];
            }
        }
    };

    this._getTimestamp = function() {
        return new Date().getTime();
    };

    this._generatorSessionID = function() {
        this.identifier += 1;
        return new Date().getTime().toString(16) + this.identifier.toString(16);
    };

    this.run = function(opt) {
        if ( opt.auth ) {
            this.auth = opt.auth;
        }

        this._transport = new _Transport(this._callback);

        if ( opt.type.toLowerCase() == "tcp" ) {
            this._transport.listenTCP(opt.port);
        }

        this._tick = setInterval(this._onTick, 500);
    };
}

module.exports = ServerRPC;
