/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var _EventEmitter = require('./eventemitter')
var _ClientRPC = require('./rpc_client');

function ProxyRPC() {
    this.event = new _EventEmitter();

    this.host_list = [];
    this.methods = {};
    this.valid_num = 0;

    this._invoker = function(method_name) {
        var client_conn = null;
        var args = null;

        if ( this.methods.hasOwnProperty(method_name) ) {
            for ( var c in this.methods[method_name] ) {
                if ( client_conn ) {
                    if ( this.methods[method_name][c].priority < client_conn.priority ) {
                        client_conn = this.methods[method_name][c];
                    }
                } else {
                    client_conn = this.methods[method_name][c];
                }
            }
        }

        if ( client_conn ) {
            args = client_conn.client._toArray(arguments).slice(1);
            return client_conn.client[method_name].apply(client_conn.client, args);
        }

        this.event.emit('error', 'have no valid connection.');
    };

    this.isValid = function() {
        return this.valid_num > 0;
    };

    this.addHost = function(opt) {
        var _this = this;

        var conn = {
            option : opt,
            client : new _ClientRPC()
        };
        conn.client.event.on('ready', function() {
            for ( var i = 0; i < conn.client.methods.length; ++i ) {
                if ( !_this.hasOwnProperty(conn.client.methods[i]) ) {
                    _this[conn.client.methods[i]] = _this._invoker.bind(_this, conn.client.methods[i]);
                }
                if ( !_this.methods.hasOwnProperty(conn.client.methods[i]) ) {
                    _this.methods[conn.client.methods[i]] = [];
                }
                _this.methods[conn.client.methods[i]].push(conn);
            }
            _this.valid_num += 1;
            _this.event.emit('ready', conn);

            if ( 1 == _this.valid_num ) {
                _this.event.emit('proxy_valid');
            }
        });
        conn.client.event.on('error', function(err) {
            _this.event.emit('error', err, conn);
        });
        conn.client.event.on('connected', function() {
            _this.event.emit('connected', conn);
        });
        conn.client.event.on('disconnected', function() {
            for ( var i = 0; i < conn.client.methods.length; ++i ) {
                if ( _this.methods.hasOwnProperty(conn.client.methods[i]) ) {
                    var index = _this.methods[conn.client.methods[i]].indexOf(conn);
                    _this.methods[conn.client.methods[i]].splice(index, 1);
                }
            }
            _this.valid_num -= 1;
            _this.event.emit('disconnected', conn);

            if ( 0 == _this.valid_num ) {
                _this.event.emit('proxy_invalid');
            }
        });
        conn.client.tryConnect(opt);
        this.host_list.push(conn);
    };
}

module.exports = ProxyRPC;
