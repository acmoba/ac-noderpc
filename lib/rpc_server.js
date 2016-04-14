/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var _Transport = require('./transport');
var _Identifier = require('./identifier');

/**
 * @class
 */
function ServerRPC() {
    this.client_list = {};
    this.methods = {};

    var _this = this;

    this._callback = function(trans, req) {
        if ( req ) {
            switch ( req.message_type ) {
                case trans._protocol._proto.MessageType.REQUEST_LOGIN:
                {
                    var login_req = trans._protocol._proto.LoginRequest.decode(req.message_body);

                    var login_ret = (_this.auth && login_req.auth == _this.auth) ? true : false;

                    trans.session_id = _Identifier.generator();

                    _this.client_list[trans.session_id] = {
                        session_id: trans.session_id,
                        keepalive: _Identifier.timestamp() + (login_ret ? 5000 : 0),
                        connection: trans,
                        login_status: login_ret
                    };

                    var methods_list = [];
                    for ( var k in _this.methods ) {
                        methods_list.push(k);
                    }

                    var login_resp = trans._protocol._proto.LoginResponse.encode({
                        result: (login_ret ? trans._protocol._proto.LoginResultType.LOGIN_SUCCESS : trans._protocol._proto.LoginResultType.LOGIN_AUTH_FAILED),
                        session_id: trans.session_id,
                        methods: methods_list
                    });
                    trans.write(trans._protocol._proto.MessageType.RESPONSE_LOGIN, login_resp);

                    break;
                }
                case trans._protocol._proto.MessageType.REQUEST_KEEPALIVE:
                {
                    if ( trans.session_id && _this.client_list[trans.session_id].login_status ) {
                        var keepalive_req = trans._protocol._proto.KeepAliveRequest.decode(req.message_body);

                        _this.client_list[trans.session_id].keepalive = _Identifier.timestamp() + 5000;

                        var keepalive_resp = trans._protocol._proto.KeepAliveResponse.encode({});
                        trans.write(trans._protocol._proto.MessageType.RESPONSE_KEEPALIVE, keepalive_resp);
                    }
                    break;
                }
                case trans._protocol._proto.MessageType.REQUEST_CALL:
                {
                    var call_resp = null;
                    if ( trans.session_id && _this.client_list[trans.session_id].login_status ) {
                        var call_req = trans._protocol._proto.CallRequest.decode(req.message_body);

                        if ( _this.methods.hasOwnProperty(call_req.method) ) {
                            var args = JSON.parse(call_req.arguments);
                            var result = _this.methods[call_req.method].apply(_this, args);

                            call_resp = trans._protocol._proto.CallResponse.encode({
                                call_id: call_req.call_id,
                                result: trans._protocol._proto.CallResultType.CALL_SUCCESS,
                                method: call_req.method,
                                returns: JSON.stringify(result)
                            });
                        }
                        else
                        {
                            call_resp = trans._protocol._proto.CallResponse.encode({
                                call_id: call_req.call_id,
                                result: trans._protocol._proto.CallResultType.CALL_NO_METHOD,
                                method: call_req.method
                            });
                        }
                    }
                    else
                    {
                        call_resp = trans._protocol._proto.CallResponse.encode({
                            call_id: call_req.call_id,
                            result: trans._protocol._proto.CallResultType.CALL_AUTH_FAILED,
                            method: call_req.method
                        });
                    }
                    trans.write(trans._protocol._proto.MessageType.RESPONSE_CALL, call_resp);
                    break;
                }
            }
        }
    };

    this._onTick = function() {
        for ( var k  in _this.client_list ) {
            if ( _Identifier.timestamp() > _this.client_list[k].keepalive ) {
                console.log('client_list key = ' + k);
                _this.client_list[k].connection.close();
                delete _this.client_list[k];
            }
        }
    };

    this.publish = function(name, fn) {
        if ( typeof(name) === 'function' ) {
            fn = name;
            name = null;
        }
        if ( name || fn.name ) {
            this.methods[name || fn.name] = fn;
        }
    }

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
