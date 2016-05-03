/**
 * Copyright (c) 2015-2016 上海魔霸网络技术, Inc. All Rights Reserved.
 *
 * AC-NodeRPC
 *
 *  shixiongfei@7fgame.com
 *
 */

function toArray(s) {
    try {
        return Array.prototype.slice.call(s);
    } catch(e) {
        var arr = [];
        for ( var i = 0; i < s.length; ++i ) {
            arr.push(s[i]);
        }
        return arr;
    }
};

module.exports.toArray = toArray;
