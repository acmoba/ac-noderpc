/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

var events = require('events');
var util = require('util');

function _EventEmitter() {
    events.EventEmitter.call(this);
};
util.inherits(_EventEmitter, events.EventEmitter);

module.exports = _EventEmitter;
