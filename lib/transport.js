/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var net = require('net');
var _Protocol = require('./protocol');
var _EventEmitter = require('./eventemitter')

/**
 * @class
 */
function _TransportTCP(socket, cb) {
    var _this = this;

    this.event = new _EventEmitter();

    this._socket = socket;
    this._callback = cb;
    this._protocol = new _Protocol();

    this._socket.on('data', function(data) {
        var req = _this._protocol.readProto(data);
        while ( req ) {
            _this._callback(_this, req);
            req = _this._protocol.readProto(null);
        }
    });

    this._socket.on('close', function() {
        _this.event.emit('end', this);
    });
    this._socket.on('error', function(err) {
    });

    this.write = function(type, body) {
        this._socket.write(this._protocol.writeProto(type, body));
    };

    this.close = function() {
        this._socket.end();
    };
}

/**
 * @class
 */
function _Transport(cb) {
    this._transport = null;

    this.listenTCP = function(port) {
        var _this = this;

        if ( !this._transport ) {
            this.server = net.createServer(function(socket) {
                _this._transport = new _TransportTCP(socket, cb);

                _this._transport.event.on('end', function () {
                });
            });
            this.server.listen(port);

            return true;
        }
        return false;
    };

    this.connectTCP = function(host, port, auth) {
        var _this = this;

        this._host = host;
        this._port = port;
        this._auth = auth;

        var tryConnect = function () {
            _this.client = new net.Socket();
            _this._transport = new _TransportTCP(_this.client, cb);

            _this._transport.event.on('end', function () {
                setTimeout(function () {
                    tryConnect();
                }, 1000);
            });

            _this.client.connect(_this._port, _this._host, function () {
                try {
                    var login_req = _this._transport._protocol._proto.LoginRequest.encode({
                        auth: _this._auth ? _this._auth : ''
                    });
                    _this._transport.write(_this._transport._protocol._proto.MessageType.REQUEST_LOGIN, login_req);
                } catch (err) {
                    console.log(err);
                }
            });
        };

        if ( !this._transport ) {
            tryConnect();

            return true;
        }
        return false;
    };
}

module.exports = _Transport;
