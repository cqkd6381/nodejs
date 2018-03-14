var millis = 1520407457269;
var goEasy_V = '0.16.5';
!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("JSON")) : "function" == typeof define && define.amd ? define(["JSON"], e) : "object" == typeof exports ? exports.GoEasy = e(require("JSON")) : t.GoEasy = e(t.JSON)
}(this, function(t) {
    return function(t) {
        function e(o) {
            if (n[o])
                return n[o].exports;
            var i = n[o] = {
                exports: {},
                id: o,
                loaded: !1
            };
            return t[o].call(i.exports, i, i.exports, e),
            i.loaded = !0,
            i.exports
        }
        var n = {};
        return e.m = t,
        e.c = n,
        e.p = "",
        e(0)
    }([function(t, e, n) {
        "use strict";
        function o(t) {
            if (f) {
                var e = (new Date).formatDate("yy-MM-dd hh:mm:ss.S");
                p.push(e + " " + t + "\n")
            }
        }
        function i(t) {
            var e, n = new RegExp("(^| )" + t + "=([^;]*)(;|$)");
            return (e = document.cookie.match(n)) ? unescape(e[2]) : null
        }
        function r(t, e) {
            var n = 30
              , o = new Date;
            o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3),
            document.cookie = t + "=" + escape(e) + ";expires=" + o.toGMTString()
        }
        function s() {
            Array.apply(this)
        }
        function c(t) {
            if (o("GoEasy() Create GoEasy object:" + h.stringify(t)),
            this._isEmpty(t.appkey))
                return void ("undefined" != typeof t.onConnectFailed && t.onConnectFailed({
                    code: 400,
                    content: "appkey is required"
                }));
            this._copyConfig(t);
            var e = this._subServerHost.replace("://", "://" + y.number())
              , n = e + ":" + this._subServerPort;
            this.socket = a.connect(n),
            this._callbackEvents(t)
        }
        var a = n(1)
          , u = n(34)
          , h = n(37)
          , p = []
          , f = !1;
        Date.prototype.formatDate = function(t) {
            var e = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                S: this.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (var n in e)
                e.hasOwnProperty(n) && new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[n] : ("00" + e[n]).substr(("" + e[n]).length)));
            return t
        }
        ;
        var l, d = function() {
            l = this.initialCurrentNumber()
        };
        d.prototype = {
            maxNumber: 10,
            number: function() {
                return l
            },
            initialCurrentNumber: function() {
                return l = parseInt(i("goeasyNode")),
                l > 0 && l < this.maxNumber ? l += 1 : l = Math.floor(10 * Math.random() + 1),
                r("goeasyNode", l),
                l
            }
        };
        var y = new d;
        s.prototype = new Array,
        s.prototype.indexOfGuid = function(t) {
            for (var e = 0; e < this.length; e++)
                if (this[e] == t)
                    return e;
            return -1
        }
        ,
        s.prototype.unshiftGuid = function(t) {
            var e = !1
              , n = this.indexOfGuid(t);
            for (n > -1 && (e = !0,
            this.splice(n, 1)),
            this.unshift(t); this.length > 100; )
                this.pop();
            return e
        }
        ,
        c.prototype = {
            debug: !1,
            socket: null,
            authorizeResult: null,
            channels: [],
            _subServerHost: "http://hangzhou.goeasy.io",
            _subServerPort: "80",
            networkStatus: "initial",
            subscribeBuffer: [],
            maxRetries: 3,
            _manualConnect: !1,
            _manualDisconnectStatus: "initial",
            authorizeStatus: "initial",
            receivedGuids: new s,
            _copyConfig: function(t) {
                this._appkey = t.appkey,
                this._otp = t.otp,
                this._isEmpty(t.userId) ? (this._userId = "anonymous-" + Math.floor(1e5 * Math.random() + 1),
                t.userId = this._userId) : this._userId = this._trim(t.userId),
                this._isEmpty(t.username) ? (this._username = "",
                t.username = "") : this._username = this._trim(t.username),
                this._isEmpty(t.userData) ? this._userData = "" : this._userData = this._trim(t.userData),
                1 == t.debug && (this.debug = !0)
            },
            subscribe: function(t) {
                if (o("subscribe() subscribe:" + h.stringify(t)),
                this._isEmpty(t.channel))
                    return o("subscribe() 'channel' is required."),
                    void ("undefined" != typeof t.onFailed && t.onFailed({
                        code: 400,
                        content: "channel is required"
                    }));
                this.subscribeBuffer[t.channel] = t,
                o("subscribe() add subscription into subscribeBuffer:" + h.stringify(this.subscribeBuffer[t.channel]));
                var e = this;
                null != e.authorizeResult && "connected" == e.networkStatus && (t.checking = !0,
                e.doSubscribeAndCheckAck(t))
            },
            doSubscribe: function(t) {
                o("doSubscribe() with subscription:" + h.stringify(t));
                var e = this;
                if (200 == e.authorizeResult.code)
                    if (this._isEmpty(t.channel))
                        o("doSubscribe() subscribe failed with empty channel"),
                        e.sendlogs(),
                        t.finish = !0;
                    else {
                        var n = {
                            channel: t.channel,
                            sid: e.authorizeResult.sid
                        };
                        o("doSubscribe() emit subscribe params:" + h.stringify(n)),
                        e.socket.emit("subscribe", n, function(n) {
                            o("doSubscribe() receive subscribe ack:" + h.stringify(n)),
                            1 != t.finish && (t.finish = !0,
                            delete e.subscribeBuffer[t.channel],
                            o("doSubscribe() delete subscription from subscribeBuffer:" + h.stringify(t)),
                            200 == n.resultCode ? (e.channels[t.channel] = t,
                            "undefined" != typeof t.onSuccess && t.onSuccess()) : "undefined" != typeof t.onFailed && t.onFailed({
                                code: n.resultCode,
                                content: n.content
                            }))
                        })
                    }
                else
                    o("doSubscribe() return with authorize code:" + e.authorizeResult.code)
            },
            doSubscribeAndCheckAck: function(t) {
                o("doSubscribeAndCheckAck():" + h.stringify(t)),
                t.finish = !1;
                var e = this;
                e.doSubscribe(t);
                var n = window.setInterval(function() {
                    t.finish || "connected" != e.networkStatus ? (o("doSubscribeAndCheckAck() clean doSubscribeAndCheckAck:" + h.stringify(t)),
                    t.checking = !1,
                    window.clearInterval(n)) : (o("doSubscribeAndCheckAck() retry doSubscribe:" + h.stringify(t)),
                    e.doSubscribe(t))
                }, 1300)
            },
            subscribePresence: function(t) {
                return this._isEmpty(t.channel) ? void ("undefined" != typeof t.onFailed && t.onFailed({
                    code: 400,
                    content: "channel is required"
                })) : (t.channel = t.channel + "_presence",
                void this.subscribe(t))
            },
            unsubscribe: function(t) {
                function e() {
                    200 == i.authorizeResult.code ? i.socket.emit("unsubscribe", {
                        sid: i.authorizeResult.sid,
                        channel: t.channel
                    }, function(e) {
                        r = !0,
                        200 == e.resultCode ? (delete i.channels[t.channel],
                        o("doUnsubscribe() delete from channels:" + h.stringify(t)),
                        "undefined" != typeof t.onSuccess && t.onSuccess()) : "undefined" != typeof t.onFailed && t.onFailed({
                            code: e.resultCode,
                            content: e.content
                        })
                    }) : (r = !0,
                    "undefined" != typeof t.onFailed && t.onFailed({
                        code: i.authorizeResult.code,
                        content: i.authorizeResult.content
                    }))
                }
                function n() {
                    e();
                    var n = window.setInterval(function() {
                        !r && "connected" == i.networkStatus && s < 0 ? (s++,
                        e()) : s == i.maxRetries ? (window.clearInterval(n),
                        "undefined" != typeof t.onFailed && t.onFailed({
                            code: 408,
                            content: "Server unreachable or timeout"
                        })) : window.clearInterval(n)
                    }, 1e3)
                }
                if (this._isEmpty(t.channel))
                    return this.log("'channel' is required."),
                    void ("undefined" != typeof t.onFailed && t.onFailed({
                        code: 400,
                        content: "channel is required"
                    }));
                if ("undefined" == typeof this.channels[t.channel])
                    return this.log("'channel' is not subscribed."),
                    void ("undefined" != typeof t.onFailed && t.onFailed({
                        code: 400,
                        content: "channel[" + t.channel + "] is not subscribed"
                    }));
                var i = this
                  , r = !1
                  , s = 0;
                if (null != this.authorizeResult && "connected" == i.networkStatus)
                    n();
                else
                    var c = window.setInterval(function() {
                        null != i.authorizeResult && "connected" == i.networkStatus ? (window.clearInterval(c),
                        n()) : (s++,
                        s == i.maxRetries && (window.clearInterval(c),
                        "undefined" != typeof t.onFailed && t.onFailed({
                            code: 408,
                            content: "Server unreachable or timeout"
                        })))
                    }, 1e3)
            },
            unsubscribePresence: function(t) {
                return this._isEmpty(t.channel) ? void ("undefined" != typeof t.onFailed && t.onFailed({
                    code: 400,
                    content: "channel is required"
                })) : (t.channel = t.channel + "_presence",
                void this.unsubscribe(t))
            },
            publish: function(t) {
                function e(e) {
                    200 == o.authorizeResult.code ? o.socket.emit("publish", {
                        sid: o.authorizeResult.sid,
                        channel: t.channel,
                        content: t.message,
                        guid: e,
                        retried: r
                    }, function(e) {
                        i = !0,
                        200 == e.resultCode ? "undefined" != typeof t.onSuccess && t.onSuccess() : "undefined" != typeof t.onFailed && t.onFailed({
                            code: e.resultCode,
                            content: e.content
                        })
                    }) : (i = !0,
                    "undefined" != typeof t.onFailed && t.onFailed({
                        code: o.authorizeResult.code,
                        content: o.authorizeResult.content
                    }))
                }
                function n() {
                    var n = o.uuid_goeasy();
                    e(n);
                    var s = window.setInterval(function() {
                        !i && r < o.maxRetries ? (r++,
                        e(n)) : r == o.maxRetries ? (window.clearInterval(s),
                        "undefined" != typeof t.onFailed && t.onFailed({
                            code: 408,
                            content: "Server unreachable or timeout"
                        })) : window.clearInterval(s)
                    }, 1e3)
                }
                if (this._isEmpty(t.channel))
                    return this.log("'channel' is required."),
                    void ("undefined" != typeof t.onFailed && t.onFailed({
                        code: 400,
                        content: "channel is required"
                    }));
                if (this._isEmpty(t.message))
                    return this.log("'message' is required."),
                    void ("undefined" != typeof t.onFailed && t.onFailed({
                        code: 400,
                        content: "message is required"
                    }));
                var o = this
                  , i = !1
                  , r = 0;
                if (null != this.authorizeResult && "connected" == o.networkStatus)
                    n();
                else
                    var s = window.setInterval(function() {
                        null != o.authorizeResult && "connected" == o.networkStatus ? (window.clearInterval(s),
                        n()) : (r++,
                        r == o.maxRetries && (window.clearInterval(s),
                        "undefined" != typeof t.onFailed && t.onFailed({
                            code: 408,
                            content: "Server unreachable or timeout"
                        })))
                    }, 1e3)
            },
            hereNow: function(t, e) {
                var n = {
                    channels: [],
                    includeUsers: !1,
                    distinct: !1
                };
                "undefined" !== t.channels && (n.channels = t.channels),
                1 == t.includeUsers && (n.includeUsers = !0),
                1 == t.distinct && (n.distinct = !0),
                this.socket.emit("hereNow", n, function(t) {
                    "undefined" != typeof e && e(t)
                })
            },
            disconnect: function() {
                var t = this;
                if (this._manualDisconnectStatus = "disconnecting",
                "connected" === this.networkStatus && "authorized" === this.authorizeStatus && 200 === this.authorizeResult.code) {
                    var e = function() {
                        t.socket.disconnect()
                    }
                      , n = function() {
                        t._manualDisconnectStatus = "disconnected"
                    };
                    t.tryEmit("manualDisconnect", null, e, n)
                } else
                    this.socket.disconnect()
            },
            reconnect: function() {
                this._manualConnect = !0,
                this.socket.connect()
            },
            tryEmit: function(t, e, n, o) {
                function i() {
                    r.socket.emit(t, e, function(t) {
                        s = !0,
                        "undefined" != typeof o && o(t)
                    })
                }
                var r = this
                  , s = !1
                  , c = 0;
                i();
                var a = window.setInterval(function() {
                    var t = c === r.maxRetries;
                    s || t ? (window.clearInterval(a),
                    t && "undefined" != typeof n && n()) : (c++,
                    i())
                }, 1e3)
            },
            _callbackEvents: function(t) {
                var e = this;
                this.socket.on("message", function(t, n) {
                    e.receivedGuids.unshiftGuid(t.i) || (t.a && e.socket.emit("ack", {
                        publishGuid: t.i
                    }),
                    e._endWith(t.n, "presence") ? "undefined" != typeof e.channels[t.n].onPresence && e.channels[t.n].onPresence(h.parse(t.c)) : "undefined" != typeof e.channels[t.n].onMessage && e.channels[t.n].onMessage({
                        channel: t.n,
                        content: t.c
                    }))
                }),
                this.socket.on("connect", function() {
                    function n() {
                        o("doAuthorize() emit authorize params:" + h.stringify(i)),
                        e._isEmpty(i.artifactVersion) && e.sendlogs(),
                        e.socket.emit("authorize", i, function(n) {
                            if (o("doAuthorize() received authorize ack:" + h.stringify(n)),
                            !r)
                                if (r = !0,
                                e.authorizeStatus = "authorized",
                                e._manualDisconnectStatus = "initial",
                                null == e.authorizeResult && (e.authorizeResult = {}),
                                e.authorizeResult.code = n.resultCode,
                                e.authorizeResult.content = n.content,
                                200 == n.resultCode) {
                                    if (null == e.authorizeResult.sid)
                                        e.authorizeResult.sid = n.sid;
                                    else if (e.authorizeResult.sid != n.sid) {
                                        e.authorizeResult.sid = n.sid;
                                        for (var i in e.channels)
                                            e.channels.hasOwnProperty(i) && (o("doAuthorize() sid expired and will call doSubscribeAndCheckAck from channels:" + h.stringify(e.channels[i])),
                                            e.doSubscribeAndCheckAck(e.channels[i]))
                                    }
                                    for (var s in e.subscribeBuffer)
                                        e.subscribeBuffer.hasOwnProperty(s) && (o("doAuthorize() will doSubscribeAndCheckAck from subscribeBuffer:" + h.stringify(e.subscribeBuffer[s])),
                                        e.doSubscribeAndCheckAck(e.subscribeBuffer[s]));
                                    "undefined" != typeof t.onConnected && t.onConnected()
                                } else
                                    "undefined" != typeof t.onConnectFailed && t.onConnectFailed({
                                        code: n.resultCode,
                                        content: n.content
                                    })
                        })
                    }
                    if ("disconnecting" !== e._manualDisconnectStatus && "disconnected" !== e._manualDisconnectStatus || e._manualConnect) {
                        e.authorizeStatus = "authorizing",
                        e.networkStatus = "connected";
                        var i = {
                            appkey: e._appkey,
                            userId: e._userId,
                            username: e._username,
                            userData: e._userData,
                            startMillis: millis,
                            artifactVersion: goEasy_V,
                            otp: e._otp,
                            manual: e._manualConnect
                        };
                        null != e.authorizeResult && (i.sid = e.authorizeResult.sid);
                        var r = !1;
                        n();
                        var s = window.setInterval(function() {
                            r || "connected" != e.networkStatus ? window.clearInterval(s) : n()
                        }, 1300)
                    }
                }),
                this.socket.on("connect_error", function(e) {
                    "undefined" != typeof t.onConnectFailed && t.onConnectFailed({
                        code: 408,
                        content: e
                    })
                }),
                this.socket.on("disconnect", function() {
                    e.networkStatus = "disconnected",
                    e.authorizeStatus = "initial",
                    e._manualConnect = !1,
                    null == e.authorizeResult && (e.authorizeResult = {}),
                    e.authorizeResult.code = 408,
                    e.authorizeResult.content = "Server unreachable or timeout",
                    "undefined" != typeof t.onDisconnected && t.onDisconnected()
                })
            },
            _isEmpty: function(t) {
                return "undefined" == typeof t || null == t || 0 == this._trim(t).length
            },
            _trim: function(t) {
                return t.replace(/(^\s*)|(\s*$)/g, "")
            },
            _endWith: function(t, e) {
                var n = new RegExp(e + "$");
                return n.test(t)
            },
            log: function(t) {
                window.console && this.debug && console.log(t)
            },
            uuid_goeasy: function() {
                return u()
            },
            sendlogs: function() {
                f && this.socket.emit("log", {
                    logs: p
                })
            }
        },
        t.exports = c
    }
    , function(t, e, n) {
        "use strict";
        function o(t, e) {
            "object" === ("undefined" == typeof t ? "undefined" : i(t)) && (e = t,
            t = void 0),
            e = e || {};
            var n, o = r(t), s = o.source, u = o.id, h = o.path, p = a[u] && h in a[u].nsps, f = e.forceNew || e["force new connection"] || !1 === e.multiplex || p;
            return f ? n = c(s, e) : (a[u] || (a[u] = c(s, e)),
            n = a[u]),
            o.query && !e.query && (e.query = o.query),
            n.socket(o.path, e)
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
          , r = n(2)
          , s = n(5)
          , c = n(7);
        n(4)("socket.io-client");
        t.exports = e = o;
        var a = e.managers = {};
        e.protocol = s.protocol,
        e.connect = o,
        e.Manager = n(7),
        e.Socket = n(29)
    }
    , function(t, e, n) {
        (function(e) {
            "use strict";
            function o(t, n) {
                var o = t;
                n = n || e.location,
                null == t && (t = n.protocol + "//" + n.host),
                "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t),
                /^(https?|wss?):\/\//.test(t) || (t = "undefined" != typeof n ? n.protocol + "//" + t : "https://" + t),
                o = i(t)),
                o.port || (/^(http|ws)$/.test(o.protocol) ? o.port = "80" : /^(http|ws)s$/.test(o.protocol) && (o.port = "443")),
                o.path = o.path || "/";
                var r = o.host.indexOf(":") !== -1
                  , s = r ? "[" + o.host + "]" : o.host;
                return o.id = o.protocol + "://" + s + ":" + o.port,
                o.href = o.protocol + "://" + s + (n && n.port === o.port ? "" : ":" + o.port),
                o
            }
            var i = n(3);
            n(4)("socket.io-client:url");
            t.exports = o
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e) {
        var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
          , o = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        t.exports = function(t) {
            var e = t
              , i = t.indexOf("[")
              , r = t.indexOf("]");
            i != -1 && r != -1 && (t = t.substring(0, i) + t.substring(i, r).replace(/:/g, ";") + t.substring(r, t.length));
            for (var s = n.exec(t || ""), c = {}, a = 14; a--; )
                c[o[a]] = s[a] || "";
            return i != -1 && r != -1 && (c.source = e,
            c.host = c.host.substring(1, c.host.length - 1).replace(/;/g, ":"),
            c.authority = c.authority.replace("[", "").replace("]", "").replace(/;/g, ":"),
            c.ipv6uri = !0),
            c
        }
    }
    , function(t, e) {
        "use strict";
        t.exports = function() {
            return function() {}
        }
    }
    , function(t, e, n) {
        "use strict";
        function o() {}
        function i(t) {
            var n = "" + t.type;
            return e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (n += t.attachments + "-"),
            t.nsp && "/" !== t.nsp && (n += t.nsp + ","),
            null != t.id && (n += t.id),
            null != t.data && (n += JSON.stringify(t.data)),
            n
        }
        function r() {
            this.reconstructor = null
        }
        function s(t) {
            var n = 0
              , o = {
                type: Number(t.charAt(0))
            };
            if (null == e.types[o.type])
                return u();
            if (e.BINARY_EVENT === o.type || e.BINARY_ACK === o.type) {
                for (var i = ""; "-" !== t.charAt(++n) && (i += t.charAt(n),
                n != t.length); )
                    ;
                if (i != Number(i) || "-" !== t.charAt(n))
                    throw new Error("Illegal attachments");
                o.attachments = Number(i)
            }
            if ("/" === t.charAt(n + 1))
                for (o.nsp = ""; ++n; ) {
                    var r = t.charAt(n);
                    if ("," === r)
                        break;
                    if (o.nsp += r,
                    n === t.length)
                        break
                }
            else
                o.nsp = "/";
            var s = t.charAt(n + 1);
            if ("" !== s && Number(s) == s) {
                for (o.id = ""; ++n; ) {
                    var r = t.charAt(n);
                    if (null == r || Number(r) != r) {
                        --n;
                        break
                    }
                    if (o.id += t.charAt(n),
                    n === t.length)
                        break
                }
                o.id = Number(o.id)
            }
            return t.charAt(++n) && (o = c(o, t.substr(n))),
            o
        }
        function c(t, e) {
            try {
                t.data = JSON.parse(e)
            } catch (n) {
                return u()
            }
            return t
        }
        function a(t) {
            this.reconPack = t,
            this.buffers = []
        }
        function u() {
            return {
                type: e.ERROR,
                data: "parser error"
            }
        }
        var h = (n(4)("socket.io-parser"),
        n(6));
        e.protocol = 4,
        e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"],
        e.CONNECT = 0,
        e.DISCONNECT = 1,
        e.EVENT = 2,
        e.ACK = 3,
        e.ERROR = 4,
        e.BINARY_EVENT = 5,
        e.BINARY_ACK = 6,
        e.Encoder = o,
        e.Decoder = r,
        o.prototype.encode = function(t, e) {
            var n = i(t);
            e([n])
        }
        ,
        h(r.prototype),
        r.prototype.add = function(t) {
            var e;
            if ("string" != typeof t)
                throw new Error("Unknown type: " + t);
            e = s(t),
            this.emit("decoded", e)
        }
        ,
        r.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction()
        }
        ,
        a.prototype.takeBinaryData = function(t) {
            if (this.buffers.push(t),
            this.buffers.length === this.reconPack.attachments) {
                var e = binary.reconstructPacket(this.reconPack, this.buffers);
                return this.finishedReconstruction(),
                e
            }
            return null
        }
        ,
        a.prototype.finishedReconstruction = function() {
            this.reconPack = null,
            this.buffers = []
        }
    }
    , function(t, e, n) {
        function o(t) {
            if (t)
                return i(t)
        }
        function i(t) {
            for (var e in o.prototype)
                t[e] = o.prototype[e];
            return t
        }
        t.exports = o,
        o.prototype.on = o.prototype.addEventListener = function(t, e) {
            return this._callbacks = this._callbacks || {},
            (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
            this
        }
        ,
        o.prototype.once = function(t, e) {
            function n() {
                this.off(t, n),
                e.apply(this, arguments)
            }
            return n.fn = e,
            this.on(t, n),
            this
        }
        ,
        o.prototype.off = o.prototype.removeListener = o.prototype.removeAllListeners = o.prototype.removeEventListener = function(t, e) {
            if (this._callbacks = this._callbacks || {},
            0 == arguments.length)
                return this._callbacks = {},
                this;
            var n = this._callbacks["$" + t];
            if (!n)
                return this;
            if (1 == arguments.length)
                return delete this._callbacks["$" + t],
                this;
            for (var o, i = 0; i < n.length; i++)
                if (o = n[i],
                o === e || o.fn === e) {
                    n.splice(i, 1);
                    break
                }
            return this
        }
        ,
        o.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1)
              , n = this._callbacks["$" + t];
            if (n) {
                n = n.slice(0);
                for (var o = 0, i = n.length; o < i; ++o)
                    n[o].apply(this, e)
            }
            return this
        }
        ,
        o.prototype.listeners = function(t) {
            return this._callbacks = this._callbacks || {},
            this._callbacks["$" + t] || []
        }
        ,
        o.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length
        }
    }
    , function(t, e, n) {
        "use strict";
        function o(t, e) {
            if (!(this instanceof o))
                return new o(t,e);
            t && "object" === ("undefined" == typeof t ? "undefined" : i(t)) && (e = t,
            t = void 0),
            e = e || {},
            e.path = e.path || "/socket.io",
            this.nsps = {},
            this.subs = [],
            this.opts = e,
            this.reconnection(e.reconnection !== !1),
            this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(e.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
            this.randomizationFactor(e.randomizationFactor || .5),
            this.backoff = new f({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
            }),
            this.timeout(null == e.timeout ? 2e4 : e.timeout),
            this.readyState = "closed",
            this.uri = t,
            this.connecting = [],
            this.lastPing = null,
            this.encoding = !1,
            this.packetBuffer = [];
            var n = e.parser || a;
            this.encoder = new n.Encoder,
            this.decoder = new n.Decoder,
            this.autoConnect = e.autoConnect !== !1,
            this.autoConnect && this.open()
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
          , r = n(8)
          , s = n(29)
          , c = n(6)
          , a = n(5)
          , u = n(31)
          , h = n(32)
          , p = (n(4)("socket.io-client:manager"),
        n(28))
          , f = n(33)
          , l = Object.prototype.hasOwnProperty;
        t.exports = o,
        o.prototype.emitAll = function() {
            this.emit.apply(this, arguments);
            for (var t in this.nsps)
                l.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
        }
        ,
        o.prototype.updateSocketIds = function() {
            for (var t in this.nsps)
                l.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t))
        }
        ,
        o.prototype.generateId = function(t) {
            return ("/" === t ? "" : t + "#") + this.engine.id
        }
        ,
        c(o.prototype),
        o.prototype.reconnection = function(t) {
            return arguments.length ? (this._reconnection = !!t,
            this) : this._reconnection
        }
        ,
        o.prototype.reconnectionAttempts = function(t) {
            return arguments.length ? (this._reconnectionAttempts = t,
            this) : this._reconnectionAttempts
        }
        ,
        o.prototype.reconnectionDelay = function(t) {
            return arguments.length ? (this._reconnectionDelay = t,
            this.backoff && this.backoff.setMin(t),
            this) : this._reconnectionDelay
        }
        ,
        o.prototype.randomizationFactor = function(t) {
            return arguments.length ? (this._randomizationFactor = t,
            this.backoff && this.backoff.setJitter(t),
            this) : this._randomizationFactor
        }
        ,
        o.prototype.reconnectionDelayMax = function(t) {
            return arguments.length ? (this._reconnectionDelayMax = t,
            this.backoff && this.backoff.setMax(t),
            this) : this._reconnectionDelayMax
        }
        ,
        o.prototype.timeout = function(t) {
            return arguments.length ? (this._timeout = t,
            this) : this._timeout
        }
        ,
        o.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
        }
        ,
        o.prototype.open = o.prototype.connect = function(t, e) {
            if (~this.readyState.indexOf("open"))
                return this;
            this.engine = r(this.uri, this.opts);
            var n = this.engine
              , o = this;
            this.readyState = "opening",
            this.skipReconnect = !1;
            var i = u(n, "open", function() {
                o.onopen(),
                t && t()
            })
              , s = u(n, "error", function(e) {
                if (o.cleanup(),
                o.readyState = "closed",
                o.emitAll("connect_error", e),
                t) {
                    var n = new Error("Connection error");
                    n.data = e,
                    t(n)
                } else
                    o.maybeReconnectOnOpen()
            });
            if (!1 !== this._timeout) {
                var c = this._timeout
                  , a = setTimeout(function() {
                    i.destroy(),
                    n.close(),
                    n.emit("error", "timeout"),
                    o.emitAll("connect_timeout", c)
                }, c);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(a)
                    }
                })
            }
            return this.subs.push(i),
            this.subs.push(s),
            this
        }
        ,
        o.prototype.onopen = function() {
            this.cleanup(),
            this.readyState = "open",
            this.emit("open");
            var t = this.engine;
            this.subs.push(u(t, "data", h(this, "ondata"))),
            this.subs.push(u(t, "ping", h(this, "onping"))),
            this.subs.push(u(t, "pong", h(this, "onpong"))),
            this.subs.push(u(t, "error", h(this, "onerror"))),
            this.subs.push(u(t, "close", h(this, "onclose"))),
            this.subs.push(u(this.decoder, "decoded", h(this, "ondecoded")))
        }
        ,
        o.prototype.onping = function() {
            this.lastPing = new Date,
            this.emitAll("ping")
        }
        ,
        o.prototype.onpong = function() {
            this.emitAll("pong", new Date - this.lastPing)
        }
        ,
        o.prototype.ondata = function(t) {
            this.decoder.add(t)
        }
        ,
        o.prototype.ondecoded = function(t) {
            this.emit("packet", t)
        }
        ,
        o.prototype.onerror = function(t) {
            this.emitAll("error", t)
        }
        ,
        o.prototype.socket = function(t, e) {
            function n() {
                ~p(i.connecting, o) || i.connecting.push(o)
            }
            var o = this.nsps[t];
            if (!o) {
                o = new s(this,t,e),
                this.nsps[t] = o;
                var i = this;
                o.on("connecting", n),
                o.on("connect", function() {
                    o.id = i.generateId(t)
                }),
                this.autoConnect && n()
            }
            return o
        }
        ,
        o.prototype.destroy = function(t) {
            var e = p(this.connecting, t);
            ~e && this.connecting.splice(e, 1),
            this.connecting.length || this.close()
        }
        ,
        o.prototype.packet = function(t) {
            var e = this;
            t.query && 0 === t.type && (t.nsp += "?" + t.query),
            e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0,
            this.encoder.encode(t, function(n) {
                for (var o = 0; o < n.length; o++)
                    e.engine.write(n[o], t.options);
                e.encoding = !1,
                e.processPacketQueue()
            }))
        }
        ,
        o.prototype.processPacketQueue = function() {
            if (this.packetBuffer.length > 0 && !this.encoding) {
                var t = this.packetBuffer.shift();
                this.packet(t)
            }
        }
        ,
        o.prototype.cleanup = function() {
            for (var t = this.subs.length, e = 0; e < t; e++) {
                var n = this.subs.shift();
                n.destroy()
            }
            this.packetBuffer = [],
            this.encoding = !1,
            this.lastPing = null,
            this.decoder.destroy()
        }
        ,
        o.prototype.close = o.prototype.disconnect = function() {
            this.skipReconnect = !0,
            this.reconnecting = !1,
            "opening" === this.readyState && this.cleanup(),
            this.backoff.reset(),
            this.readyState = "closed",
            this.engine && this.engine.close()
        }
        ,
        o.prototype.onclose = function(t) {
            this.cleanup(),
            this.backoff.reset(),
            this.readyState = "closed",
            this.emit("close", t),
            this._reconnection && !this.skipReconnect && this.reconnect()
        }
        ,
        o.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect)
                return this;
            var t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts)
                this.backoff.reset(),
                this.emitAll("reconnect_failed"),
                this.reconnecting = !1;
            else {
                var e = this.backoff.duration();
                this.reconnecting = !0;
                var n = setTimeout(function() {
                    t.skipReconnect || (t.emitAll("reconnect_attempt", t.backoff.attempts),
                    t.emitAll("reconnecting", t.backoff.attempts),
                    t.skipReconnect || t.open(function(e) {
                        e ? (t.reconnecting = !1,
                        t.reconnect(),
                        t.emitAll("reconnect_error", e.data)) : t.onreconnect()
                    }))
                }, e);
                this.subs.push({
                    destroy: function() {
                        clearTimeout(n)
                    }
                })
            }
        }
        ,
        o.prototype.onreconnect = function() {
            var t = this.backoff.attempts;
            this.reconnecting = !1,
            this.backoff.reset(),
            this.updateSocketIds(),
            this.emitAll("reconnect", t)
        }
    }
    , function(t, e, n) {
        "use strict";
        t.exports = n(9)
    }
    , function(t, e, n) {
        "use strict";
        t.exports = n(10),
        t.exports.parser = n(15)
    }
    , function(t, e, n) {
        (function(e) {
            "use strict";
            function o(t, n) {
                if (!(this instanceof o))
                    return new o(t,n);
                n = n || {},
                t && "object" === ("undefined" == typeof t ? "undefined" : r(t)) && (n = t,
                t = null),
                t ? (t = h(t),
                n.hostname = t.host,
                n.secure = "https" === t.protocol || "wss" === t.protocol,
                n.port = t.port,
                t.query && (n.query = t.query)) : n.host && (n.hostname = h(n.host).host),
                this.secure = null != n.secure ? n.secure : e.location && "https:" === location.protocol,
                n.hostname && !n.port && (n.port = this.secure ? "443" : "80"),
                this.agent = n.agent || !1,
                this.hostname = n.hostname || (e.location ? location.hostname : "localhost"),
                this.port = n.port || (e.location && location.port ? location.port : this.secure ? 443 : 80),
                this.query = n.query || {},
                "string" == typeof this.query && (this.query = p.decode(this.query)),
                this.upgrade = !1 !== n.upgrade,
                this.path = (n.path || "/engine.io").replace(/\/$/, "") + "/",
                this.forceJSONP = !!n.forceJSONP,
                this.jsonp = !1 !== n.jsonp,
                this.forceBase64 = !!n.forceBase64,
                this.enablesXDR = !!n.enablesXDR,
                this.timestampParam = n.timestampParam || "t",
                this.timestampRequests = n.timestampRequests,
                this.transports = n.transports || ["polling", "websocket"],
                this.transportOptions = n.transportOptions || {},
                this.readyState = "",
                this.writeBuffer = [],
                this.prevBufferLen = 0,
                this.policyPort = n.policyPort || 843,
                this.rememberUpgrade = n.rememberUpgrade || !1,
                this.binaryType = null,
                this.onlyBinaryUpgrades = n.onlyBinaryUpgrades,
                this.perMessageDeflate = !1 !== n.perMessageDeflate && (n.perMessageDeflate || {}),
                !0 === this.perMessageDeflate && (this.perMessageDeflate = {}),
                this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024),
                this.pfx = n.pfx || null,
                this.key = n.key || null,
                this.passphrase = n.passphrase || null,
                this.cert = n.cert || null,
                this.ca = n.ca || null,
                this.ciphers = n.ciphers || null,
                this.rejectUnauthorized = void 0 === n.rejectUnauthorized || n.rejectUnauthorized,
                this.forceNode = !!n.forceNode;
                var i = "object" === ("undefined" == typeof e ? "undefined" : r(e)) && e;
                i.global === i && (n.extraHeaders && Object.keys(n.extraHeaders).length > 0 && (this.extraHeaders = n.extraHeaders),
                n.localAddress && (this.localAddress = n.localAddress)),
                this.id = null,
                this.upgrades = null,
                this.pingInterval = null,
                this.pingTimeout = null,
                this.pingIntervalTimer = null,
                this.pingTimeoutTimer = null,
                this.open()
            }
            function i(t) {
                var e = {};
                for (var n in t)
                    t.hasOwnProperty(n) && (e[n] = t[n]);
                return e
            }
            var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
              , s = n(11)
              , c = n(6)
              , a = (n(4)("engine.io-client:socket"),
            n(28))
              , u = n(15)
              , h = n(3)
              , p = n(21);
            t.exports = o,
            o.priorWebsocketSuccess = !1,
            c(o.prototype),
            o.protocol = u.protocol,
            o.Socket = o,
            o.Transport = n(14),
            o.transports = n(11),
            o.parser = n(15),
            o.prototype.createTransport = function(t) {
                var e = i(this.query);
                e.EIO = u.protocol,
                e.transport = t;
                var n = this.transportOptions[t] || {};
                this.id && (e.sid = this.id);
                var o = new s[t]({
                    query: e,
                    socket: this,
                    agent: n.agent || this.agent,
                    hostname: n.hostname || this.hostname,
                    port: n.port || this.port,
                    secure: n.secure || this.secure,
                    path: n.path || this.path,
                    forceJSONP: n.forceJSONP || this.forceJSONP,
                    jsonp: n.jsonp || this.jsonp,
                    forceBase64: n.forceBase64 || this.forceBase64,
                    enablesXDR: n.enablesXDR || this.enablesXDR,
                    timestampRequests: n.timestampRequests || this.timestampRequests,
                    timestampParam: n.timestampParam || this.timestampParam,
                    policyPort: n.policyPort || this.policyPort,
                    pfx: n.pfx || this.pfx,
                    key: n.key || this.key,
                    passphrase: n.passphrase || this.passphrase,
                    cert: n.cert || this.cert,
                    ca: n.ca || this.ca,
                    ciphers: n.ciphers || this.ciphers,
                    rejectUnauthorized: n.rejectUnauthorized || this.rejectUnauthorized,
                    perMessageDeflate: n.perMessageDeflate || this.perMessageDeflate,
                    extraHeaders: n.extraHeaders || this.extraHeaders,
                    forceNode: n.forceNode || this.forceNode,
                    localAddress: n.localAddress || this.localAddress,
                    requestTimeout: n.requestTimeout || this.requestTimeout,
                    protocols: n.protocols || void 0
                });
                return o
            }
            ,
            o.prototype.open = function() {
                var t;
                if (this.rememberUpgrade && o.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1)
                    t = "websocket";
                else {
                    if (0 === this.transports.length) {
                        var e = this;
                        return void setTimeout(function() {
                            e.emit("error", "No transports available")
                        }, 0)
                    }
                    t = this.transports[0]
                }
                this.readyState = "opening";
                try {
                    t = this.createTransport(t)
                } catch (n) {
                    return this.transports.shift(),
                    void this.open()
                }
                t.open(),
                this.setTransport(t)
            }
            ,
            o.prototype.setTransport = function(t) {
                var e = this;
                this.transport && this.transport.removeAllListeners(),
                this.transport = t,
                t.on("drain", function() {
                    e.onDrain()
                }).on("packet", function(t) {
                    e.onPacket(t)
                }).on("error", function(t) {
                    e.onError(t)
                }).on("close", function() {
                    e.onClose("transport close")
                })
            }
            ,
            o.prototype.probe = function(t) {
                function e() {
                    if (p.onlyBinaryUpgrades) {
                        var t = !this.supportsBinary && p.transport.supportsBinary;
                        h = h || t
                    }
                    h || (u.send([{
                        type: "ping",
                        data: "probe"
                    }]),
                    u.once("packet", function(t) {
                        if (!h)
                            if ("pong" === t.type && "probe" === t.data) {
                                if (p.upgrading = !0,
                                p.emit("upgrading", u),
                                !u)
                                    return;
                                o.priorWebsocketSuccess = "websocket" === u.name,
                                p.transport.pause(function() {
                                    h || "closed" !== p.readyState && (a(),
                                    p.setTransport(u),
                                    u.send([{
                                        type: "upgrade"
                                    }]),
                                    p.emit("upgrade", u),
                                    u = null,
                                    p.upgrading = !1,
                                    p.flush())
                                })
                            } else {
                                var e = new Error("probe error");
                                e.transport = u.name,
                                p.emit("upgradeError", e)
                            }
                    }))
                }
                function n() {
                    h || (h = !0,
                    a(),
                    u.close(),
                    u = null)
                }
                function i(t) {
                    var e = new Error("probe error: " + t);
                    e.transport = u.name,
                    n(),
                    p.emit("upgradeError", e)
                }
                function r() {
                    i("transport closed")
                }
                function s() {
                    i("socket closed")
                }
                function c(t) {
                    u && t.name !== u.name && n()
                }
                function a() {
                    u.removeListener("open", e),
                    u.removeListener("error", i),
                    u.removeListener("close", r),
                    p.removeListener("close", s),
                    p.removeListener("upgrading", c)
                }
                var u = this.createTransport(t, {
                    probe: 1
                })
                  , h = !1
                  , p = this;
                o.priorWebsocketSuccess = !1,
                u.once("open", e),
                u.once("error", i),
                u.once("close", r),
                this.once("close", s),
                this.once("upgrading", c),
                u.open()
            }
            ,
            o.prototype.onOpen = function() {
                if (this.readyState = "open",
                o.priorWebsocketSuccess = "websocket" === this.transport.name,
                this.emit("open"),
                this.flush(),
                "open" === this.readyState && this.upgrade && this.transport.pause)
                    for (var t = 0, e = this.upgrades.length; t < e; t++)
                        this.probe(this.upgrades[t])
            }
            ,
            o.prototype.onPacket = function(t) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState)
                    switch (this.emit("packet", t),
                    this.emit("heartbeat"),
                    t.type) {
                    case "open":
                        this.onHandshake(JSON.parse(t.data));
                        break;
                    case "pong":
                        this.setPing(),
                        this.emit("pong");
                        break;
                    case "error":
                        var e = new Error("server error");
                        e.code = t.data,
                        this.onError(e);
                        break;
                    case "message":
                        this.emit("data", t.data),
                        this.emit("message", t.data)
                    }
            }
            ,
            o.prototype.onHandshake = function(t) {
                this.emit("handshake", t),
                this.id = t.sid,
                this.transport.query.sid = t.sid,
                this.upgrades = this.filterUpgrades(t.upgrades),
                this.pingInterval = t.pingInterval,
                this.pingTimeout = t.pingTimeout,
                this.onOpen(),
                "closed" !== this.readyState && (this.setPing(),
                this.removeListener("heartbeat", this.onHeartbeat),
                this.on("heartbeat", this.onHeartbeat))
            }
            ,
            o.prototype.onHeartbeat = function(t) {
                clearTimeout(this.pingTimeoutTimer);
                var e = this;
                e.pingTimeoutTimer = setTimeout(function() {
                    "closed" !== e.readyState && e.onClose("ping timeout")
                }, t || e.pingInterval + e.pingTimeout)
            }
            ,
            o.prototype.setPing = function() {
                var t = this;
                clearTimeout(t.pingIntervalTimer),
                t.pingIntervalTimer = setTimeout(function() {
                    t.ping(),
                    t.onHeartbeat(t.pingTimeout)
                }, t.pingInterval)
            }
            ,
            o.prototype.ping = function() {
                var t = this;
                this.sendPacket("ping", function() {
                    t.emit("ping")
                })
            }
            ,
            o.prototype.onDrain = function() {
                this.writeBuffer.splice(0, this.prevBufferLen),
                this.prevBufferLen = 0,
                0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
            }
            ,
            o.prototype.flush = function() {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (this.transport.send(this.writeBuffer),
                this.prevBufferLen = this.writeBuffer.length,
                this.emit("flush"))
            }
            ,
            o.prototype.write = o.prototype.send = function(t, e, n) {
                return this.sendPacket("message", t, e, n),
                this
            }
            ,
            o.prototype.sendPacket = function(t, e, n, o) {
                if ("function" == typeof e && (o = e,
                e = void 0),
                "function" == typeof n && (o = n,
                n = null),
                "closing" !== this.readyState && "closed" !== this.readyState) {
                    n = n || {},
                    n.compress = !1 !== n.compress;
                    var i = {
                        type: t,
                        data: e,
                        options: n
                    };
                    this.emit("packetCreate", i),
                    this.writeBuffer.push(i),
                    o && this.once("flush", o),
                    this.flush()
                }
            }
            ,
            o.prototype.close = function() {
                function t() {
                    o.onClose("forced close"),
                    o.transport.close()
                }
                function e() {
                    o.removeListener("upgrade", e),
                    o.removeListener("upgradeError", e),
                    t()
                }
                function n() {
                    o.once("upgrade", e),
                    o.once("upgradeError", e)
                }
                if ("opening" === this.readyState || "open" === this.readyState) {
                    this.readyState = "closing";
                    var o = this;
                    this.writeBuffer.length ? this.once("drain", function() {
                        this.upgrading ? n() : t()
                    }) : this.upgrading ? n() : t()
                }
                return this
            }
            ,
            o.prototype.onError = function(t) {
                o.priorWebsocketSuccess = !1,
                this.emit("error", t),
                this.onClose("transport error", t);
            }
            ,
            o.prototype.onClose = function(t, e) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                    var n = this;
                    clearTimeout(this.pingIntervalTimer),
                    clearTimeout(this.pingTimeoutTimer),
                    this.transport.removeAllListeners("close"),
                    this.transport.close(),
                    this.transport.removeAllListeners(),
                    this.readyState = "closed",
                    this.id = null,
                    this.emit("close", t, e),
                    n.writeBuffer = [],
                    n.prevBufferLen = 0
                }
            }
            ,
            o.prototype.filterUpgrades = function(t) {
                for (var e = [], n = 0, o = t.length; n < o; n++)
                    ~a(this.transports, t[n]) && e.push(t[n]);
                return e
            }
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e, n) {
        (function(t) {
            "use strict";
            function o(e) {
                var n = !1
                  , o = !1;
                !1 !== e.jsonp;
                if (t.location) {
                    var r = "https:" === location.protocol
                      , s = location.port;
                    s || (s = r ? 443 : 80),
                    n = e.hostname !== location.hostname || s !== e.port,
                    o = e.secure !== r
                }
                return e.xdomain = n,
                e.xscheme = o,
                new i(e)
            }
            var i = n(12)
              , r = n(26);
            e.polling = o,
            e.websocket = r
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e, n) {
        (function(e) {
            "use strict";
            function o() {}
            function i(t) {
                r.call(this, t),
                this.query = this.query || {},
                c || (e.___eio || (e.___eio = []),
                c = e.___eio),
                this.index = c.length;
                var n = this;
                c.push(function(t) {
                    n.onData(t)
                }),
                this.query.j = this.index,
                e.document && e.addEventListener && e.addEventListener("beforeunload", function() {
                    n.script && (n.script.onerror = o)
                }, !1)
            }
            var r = n(13)
              , s = n(22);
            t.exports = i;
            var c, a = /\n/g, u = /\\n/g;
            s(i, r),
            i.prototype.supportsBinary = !1,
            i.prototype.doClose = function() {
                this.script && (this.script.parentNode.removeChild(this.script),
                this.script = null),
                this.form && (this.form.parentNode.removeChild(this.form),
                this.form = null,
                this.iframe = null),
                r.prototype.doClose.call(this)
            }
            ,
            i.prototype.doPoll = function() {
                var t = this
                  , e = document.createElement("script");
                this.script && (this.script.parentNode.removeChild(this.script),
                this.script = null),
                e.async = !0,
                e.src = this.uri(),
                e.onerror = function(e) {
                    t.onError("jsonp poll error", e)
                }
                ;
                var n = document.getElementsByTagName("script")[0];
                n ? n.parentNode.insertBefore(e, n) : (document.head || document.body).appendChild(e),
                this.script = e;
                var o = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                o && setTimeout(function() {
                    var t = document.createElement("iframe");
                    document.body.appendChild(t),
                    document.body.removeChild(t)
                }, 100)
            }
            ,
            i.prototype.doWrite = function(t, e) {
                function n() {
                    o(),
                    e()
                }
                function o() {
                    if (i.iframe)
                        try {
                            i.form.removeChild(i.iframe)
                        } catch (t) {
                            i.onError("jsonp polling iframe removal error", t)
                        }
                    try {
                        var e = '<iframe src="javascript:0" name="' + i.iframeId + '">';
                        r = document.createElement(e)
                    } catch (t) {
                        r = document.createElement("iframe"),
                        r.name = i.iframeId,
                        r.src = "javascript:0"
                    }
                    r.id = i.iframeId,
                    i.form.appendChild(r),
                    i.iframe = r
                }
                var i = this;
                if (!this.form) {
                    var r, s = document.createElement("form"), c = document.createElement("textarea"), h = this.iframeId = "eio_iframe_" + this.index;
                    s.className = "socketio",
                    s.style.position = "absolute",
                    s.style.top = "-1000px",
                    s.style.left = "-1000px",
                    s.target = h,
                    s.method = "POST",
                    s.setAttribute("accept-charset", "utf-8"),
                    c.name = "d",
                    s.appendChild(c),
                    document.body.appendChild(s),
                    this.form = s,
                    this.area = c
                }
                this.form.action = this.uri(),
                o(),
                t = t.replace(u, "\\\n"),
                this.area.value = t.replace(a, "\\n");
                try {
                    this.form.submit()
                } catch (p) {}
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                    "complete" === i.iframe.readyState && n()
                }
                : this.iframe.onload = n
            }
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e, n) {
        "use strict";
        function o(t) {
            var e = t && t.forceBase64;
            u && !e || (this.supportsBinary = !1),
            i.call(this, t)
        }
        var i = n(14)
          , r = n(21)
          , s = n(15)
          , c = n(22)
          , a = n(23);
        n(4)("engine.io-client:polling");
        t.exports = o;
        var u = function() {
            var t = n(24)
              , e = new t({
                xdomain: !1
            });
            return null != e.responseType
        }();
        c(o, i),
        o.prototype.name = "polling",
        o.prototype.doOpen = function() {
            this.poll()
        }
        ,
        o.prototype.pause = function(t) {
            function e() {
                n.readyState = "paused",
                t()
            }
            var n = this;
            if (this.readyState = "pausing",
            this.polling || !this.writable) {
                var o = 0;
                this.polling && (o++,
                this.once("pollComplete", function() {
                    --o || e()
                })),
                this.writable || (o++,
                this.once("drain", function() {
                    --o || e()
                }))
            } else
                e()
        }
        ,
        o.prototype.poll = function() {
            this.polling = !0,
            this.doPoll(),
            this.emit("poll")
        }
        ,
        o.prototype.onData = function(t) {
            var e = this
              , n = function(t, n, o) {
                return "opening" === e.readyState && e.onOpen(),
                "close" === t.type ? (e.onClose(),
                !1) : void e.onPacket(t)
            };
            s.decodePayload(t, this.socket.binaryType, n),
            "closed" !== this.readyState && (this.polling = !1,
            this.emit("pollComplete"),
            "open" === this.readyState && this.poll())
        }
        ,
        o.prototype.doClose = function() {
            function t() {
                e.write([{
                    type: "close"
                }])
            }
            var e = this;
            "open" === this.readyState ? t() : this.once("open", t)
        }
        ,
        o.prototype.write = function(t) {
            var e = this;
            this.writable = !1;
            var n = function() {
                e.writable = !0,
                e.emit("drain")
            };
            s.encodePayload(t, this.supportsBinary, function(t) {
                e.doWrite(t, n)
            })
        }
        ,
        o.prototype.uri = function() {
            var t = this.query || {}
              , e = this.secure ? "https" : "http"
              , n = "";
            !1 !== this.timestampRequests && (t[this.timestampParam] = a()),
            this.supportsBinary || t.sid || (t.b64 = 1),
            t = r.encode(t),
            this.port && ("https" === e && 443 !== Number(this.port) || "http" === e && 80 !== Number(this.port)) && (n = ":" + this.port),
            t.length && (t = "?" + t);
            var o = this.hostname.indexOf(":") !== -1;
            return e + "://" + (o ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t
        }
    }
    , function(t, e, n) {
        "use strict";
        function o(t) {
            this.path = t.path,
            this.hostname = t.hostname,
            this.port = t.port,
            this.secure = t.secure,
            this.query = t.query,
            this.timestampParam = t.timestampParam,
            this.timestampRequests = t.timestampRequests,
            this.readyState = "",
            this.agent = t.agent || !1,
            this.socket = t.socket,
            this.enablesXDR = t.enablesXDR,
            this.pfx = t.pfx,
            this.key = t.key,
            this.passphrase = t.passphrase,
            this.cert = t.cert,
            this.ca = t.ca,
            this.ciphers = t.ciphers,
            this.rejectUnauthorized = t.rejectUnauthorized,
            this.forceNode = t.forceNode,
            this.extraHeaders = t.extraHeaders,
            this.localAddress = t.localAddress
        }
        var i = n(15)
          , r = n(6);
        t.exports = o,
        r(o.prototype),
        o.prototype.onError = function(t, e) {
            var n = new Error(t);
            return n.type = "TransportError",
            n.description = e,
            this.emit("error", n),
            this
        }
        ,
        o.prototype.open = function() {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening",
            this.doOpen()),
            this
        }
        ,
        o.prototype.close = function() {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(),
            this.onClose()),
            this
        }
        ,
        o.prototype.send = function(t) {
            if ("open" !== this.readyState)
                throw new Error("Transport not open");
            this.write(t)
        }
        ,
        o.prototype.onOpen = function() {
            this.readyState = "open",
            this.writable = !0,
            this.emit("open")
        }
        ,
        o.prototype.onData = function(t) {
            var e = i.decodePacket(t, this.socket.binaryType);
            this.onPacket(e)
        }
        ,
        o.prototype.onPacket = function(t) {
            this.emit("packet", t)
        }
        ,
        o.prototype.onClose = function() {
            this.readyState = "closed",
            this.emit("close")
        }
    }
    , function(t, e, n) {
        "use strict";
        function o(t) {
            try {
                t = c.decode(t, {
                    strict: !1
                })
            } catch (e) {
                return !1
            }
            return t
        }
        function i(t, e, n) {
            for (var o = new Array(t.length), i = s(t.length, n), r = function(t, n, i) {
                e(n, function(e, n) {
                    o[t] = n,
                    i(e, o)
                })
            }, c = 0; c < t.length; c++)
                r(c, t[c], i)
        }
        var r = n(16)
          , s = n(17)
          , c = n(18);
        "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
        "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent);
        e.protocol = 3;
        var a = e.packets = {
            open: 0,
            close: 1,
            ping: 2,
            pong: 3,
            message: 4,
            upgrade: 5,
            noop: 6
        }
          , u = r(a)
          , h = {
            type: "error",
            data: "parser error"
        };
        e.encodePacket = function(t, e, n, o) {
            "function" == typeof e && (o = e,
            e = !1),
            "function" == typeof n && (o = n,
            n = null);
            var i = (void 0 === t.data ? void 0 : t.data.buffer || t.data,
            a[t.type]);
            return void 0 !== t.data && (i += n ? c.encode(String(t.data), {
                strict: !1
            }) : String(t.data)),
            o("" + i)
        }
        ,
        e.decodePacket = function(t, e, n) {
            if (void 0 === t)
                return h;
            if ("string" == typeof t) {
                if (n && (t = o(t),
                t === !1))
                    return h;
                var i = t.charAt(0);
                return Number(i) == i && u[i] ? t.length > 1 ? {
                    type: u[i],
                    data: t.substring(1)
                } : {
                    type: u[i]
                } : h
            }
            var r = new Uint8Array(t)
              , i = r[0]
              , s = sliceBuffer(t, 1);
            return Blob && "blob" === e && (s = new Blob([s])),
            {
                type: u[i],
                data: s
            }
        }
        ,
        e.encodePayload = function(t, n, o) {
            function r(t) {
                return t.length + ":" + t
            }
            function s(t, n) {
                e.encodePacket(t, !1, !0, function(t) {
                    n(null, r(t))
                })
            }
            return "function" == typeof n && (o = n,
            n = null),
            t.length ? void i(t, s, function(t, e) {
                return o(e.join(""))
            }) : o("0:")
        }
        ,
        e.decodePayload = function(t, n, o) {
            "function" == typeof n && (o = n,
            n = null);
            var i;
            if ("" === t)
                return o(h, 0, 1);
            for (var r, s, c = "", a = 0, u = t.length; a < u; a++) {
                var p = t.charAt(a);
                if (":" === p) {
                    if ("" === c || c != (r = Number(c)))
                        return o(h, 0, 1);
                    if (s = t.substr(a + 1, r),
                    c != s.length)
                        return o(h, 0, 1);
                    if (s.length) {
                        if (i = e.decodePacket(s, n, !0),
                        h.type === i.type && h.data === i.data)
                            return o(h, 0, 1);
                        var f = o(i, a + r, u);
                        if (!1 === f)
                            return
                    }
                    a += r,
                    c = ""
                } else
                    c += p
            }
            return "" !== c ? o(h, 0, 1) : void 0
        }
    }
    , function(t, e) {
        "use strict";
        t.exports = Object.keys || function(t) {
            var e = []
              , n = Object.prototype.hasOwnProperty;
            for (var o in t)
                n.call(t, o) && e.push(o);
            return e
        }
    }
    , function(t, e) {
        function n(t, e, n) {
            function i(t, o) {
                if (i.count <= 0)
                    throw new Error("after called too many times");
                --i.count,
                t ? (r = !0,
                e(t),
                e = n) : 0 !== i.count || r || e(null, o)
            }
            var r = !1;
            return n = n || o,
            i.count = t,
            0 === t ? e() : i
        }
        function o() {}
        t.exports = n
    }
    , function(t, e, n) {
        var o;
        (function(t, i) {
            "use strict";
            var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
            ;
            !function(s) {
                function c(t) {
                    for (var e, n, o = [], i = 0, r = t.length; i < r; )
                        e = t.charCodeAt(i++),
                        e >= 55296 && e <= 56319 && i < r ? (n = t.charCodeAt(i++),
                        56320 == (64512 & n) ? o.push(((1023 & e) << 10) + (1023 & n) + 65536) : (o.push(e),
                        i--)) : o.push(e);
                    return o
                }
                function a(t) {
                    for (var e, n = t.length, o = -1, i = ""; ++o < n; )
                        e = t[o],
                        e > 65535 && (e -= 65536,
                        i += S(e >>> 10 & 1023 | 55296),
                        e = 56320 | 1023 & e),
                        i += S(e);
                    return i
                }
                function u(t, e) {
                    if (t >= 55296 && t <= 57343) {
                        if (e)
                            throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value");
                        return !1
                    }
                    return !0
                }
                function h(t, e) {
                    return S(t >> e & 63 | 128)
                }
                function p(t, e) {
                    if (0 == (4294967168 & t))
                        return S(t);
                    var n = "";
                    return 0 == (4294965248 & t) ? n = S(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (u(t, e) || (t = 65533),
                    n = S(t >> 12 & 15 | 224),
                    n += h(t, 6)) : 0 == (4292870144 & t) && (n = S(t >> 18 & 7 | 240),
                    n += h(t, 12),
                    n += h(t, 6)),
                    n += S(63 & t | 128)
                }
                function f(t, e) {
                    e = e || {};
                    for (var n, o = !1 !== e.strict, i = c(t), r = i.length, s = -1, a = ""; ++s < r; )
                        n = i[s],
                        a += p(n, o);
                    return a
                }
                function l() {
                    if (w >= k)
                        throw Error("Invalid byte index");
                    var t = 255 & v[w];
                    if (w++,
                    128 == (192 & t))
                        return 63 & t;
                    throw Error("Invalid continuation byte")
                }
                function d(t) {
                    var e, n, o, i, r;
                    if (w > k)
                        throw Error("Invalid byte index");
                    if (w == k)
                        return !1;
                    if (e = 255 & v[w],
                    w++,
                    0 == (128 & e))
                        return e;
                    if (192 == (224 & e)) {
                        if (n = l(),
                        r = (31 & e) << 6 | n,
                        r >= 128)
                            return r;
                        throw Error("Invalid continuation byte")
                    }
                    if (224 == (240 & e)) {
                        if (n = l(),
                        o = l(),
                        r = (15 & e) << 12 | n << 6 | o,
                        r >= 2048)
                            return u(r, t) ? r : 65533;
                        throw Error("Invalid continuation byte")
                    }
                    if (240 == (248 & e) && (n = l(),
                    o = l(),
                    i = l(),
                    r = (7 & e) << 18 | n << 12 | o << 6 | i,
                    r >= 65536 && r <= 1114111))
                        return r;
                    throw Error("Invalid UTF-8 detected")
                }
                function y(t, e) {
                    e = e || {};
                    var n = !1 !== e.strict;
                    v = c(t),
                    k = v.length,
                    w = 0;
                    for (var o, i = []; (o = d(n)) !== !1; )
                        i.push(o);
                    return a(i)
                }
                var m = "object" == r(e) && e
                  , g = "object" == r(t) && t && t.exports == m && t
                  , b = "object" == ("undefined" == typeof i ? "undefined" : r(i)) && i;
                b.global !== b && b.window !== b || (s = b);
                var v, k, w, S = String.fromCharCode, _ = {
                    version: "2.1.2",
                    encode: f,
                    decode: y
                };
                if ("object" == r(n(20)) && n(20))
                    o = function() {
                        return _
                    }
                    .call(e, n, e, t),
                    !(void 0 !== o && (t.exports = o));
                else if (m && !m.nodeType)
                    if (g)
                        g.exports = _;
                    else {
                        var x = {}
                          , C = x.hasOwnProperty;
                        for (var E in _)
                            C.call(_, E) && (m[E] = _[E])
                    }
                else
                    s.utf8 = _
            }(void 0)
        }
        ).call(e, n(19)(t), function() {
            return this
        }())
    }
    , function(t, e) {
        t.exports = function(t) {
            return t.webpackPolyfill || (t.deprecate = function() {}
            ,
            t.paths = [],
            t.children = [],
            t.webpackPolyfill = 1),
            t
        }
    }
    , function(t, e) {
        (function(e) {
            t.exports = e
        }
        ).call(e, {})
    }
    , function(t, e) {
        e.encode = function(t) {
            var e = "";
            for (var n in t)
                t.hasOwnProperty(n) && (e.length && (e += "&"),
                e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
            return e
        }
        ,
        e.decode = function(t) {
            for (var e = {}, n = t.split("&"), o = 0, i = n.length; o < i; o++) {
                var r = n[o].split("=");
                e[decodeURIComponent(r[0])] = decodeURIComponent(r[1])
            }
            return e
        }
    }
    , function(t, e) {
        t.exports = function(t, e) {
            var n = function() {};
            n.prototype = e.prototype,
            t.prototype = new n,
            t.prototype.constructor = t
        }
    }
    , function(t, e) {
        "use strict";
        function n(t) {
            var e = "";
            do
                e = s[t % c] + e,
                t = Math.floor(t / c);
            while (t > 0);return e
        }
        function o(t) {
            var e = 0;
            for (h = 0; h < t.length; h++)
                e = e * c + a[t.charAt(h)];
            return e
        }
        function i() {
            var t = n(+new Date);
            return t !== r ? (u = 0,
            r = t) : t + "." + n(u++)
        }
        for (var r, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), c = 64, a = {}, u = 0, h = 0; h < c; h++)
            a[s[h]] = h;
        i.encode = n,
        i.decode = o,
        t.exports = i
    }
    , function(t, e, n) {
        (function(e) {
            "use strict";
            var o = n(25);
            t.exports = function(t) {
                var n = t.xdomain
                  , i = t.xscheme
                  , r = t.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!n || o))
                        return new XMLHttpRequest
                } catch (s) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !i && r)
                        return new XDomainRequest
                } catch (s) {}
                if (!n)
                    try {
                        return new (e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                    } catch (s) {}
            }
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e) {
        try {
            t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest
        } catch (n) {
            t.exports = !1
        }
    }
    , function(t, e, n) {
        (function(e) {
            "use strict";
            function o(t) {
                var e = t && t.forceBase64;
                e && (this.supportsBinary = !1),
                this.perMessageDeflate = t.perMessageDeflate,
                this.usingBrowserWebSocket = h && !t.forceNode,
                this.protocols = t.protocols,
                this.usingBrowserWebSocket || (f = i),
                r.call(this, t)
            }
            var i, r = n(14), s = n(15), c = n(21), a = n(22), u = n(23), h = (n(4)("engine.io-client:websocket"),
            e.WebSocket || e.MozWebSocket);
            if ("undefined" == typeof window)
                try {
                    i = n(27)
                } catch (p) {}
            var f = h;
            f || "undefined" != typeof window || (f = i),
            t.exports = o,
            a(o, r),
            o.prototype.name = "websocket",
            o.prototype.supportsBinary = !0,
            o.prototype.doOpen = function() {
                if (this.check()) {
                    var t = this.uri()
                      , e = this.protocols
                      , n = {
                        agent: this.agent,
                        perMessageDeflate: this.perMessageDeflate
                    };
                    n.pfx = this.pfx,
                    n.key = this.key,
                    n.passphrase = this.passphrase,
                    n.cert = this.cert,
                    n.ca = this.ca,
                    n.ciphers = this.ciphers,
                    n.rejectUnauthorized = this.rejectUnauthorized,
                    this.extraHeaders && (n.headers = this.extraHeaders),
                    this.localAddress && (n.localAddress = this.localAddress);
                    try {
                        this.ws = this.usingBrowserWebSocket ? e ? new f(t,e) : new f(t) : new f(t,e,n)
                    } catch (o) {
                        return this.emit("error", o)
                    }
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1),
                    this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0,
                    this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer",
                    this.addEventListeners()
                }
            }
            ,
            o.prototype.addEventListeners = function() {
                var t = this;
                this.ws.onopen = function() {
                    t.onOpen()
                }
                ,
                this.ws.onclose = function() {
                    t.onClose()
                }
                ,
                this.ws.onmessage = function(e) {
                    t.onData(e.data)
                }
                ,
                this.ws.onerror = function(e) {
                    t.onError("websocket error", e)
                }
            }
            ,
            o.prototype.write = function(t) {
                function n() {
                    o.emit("flush"),
                    setTimeout(function() {
                        o.writable = !0,
                        o.emit("drain")
                    }, 0)
                }
                var o = this;
                this.writable = !1;
                for (var i = t.length, r = 0, c = i; r < c; r++)
                    !function(t) {
                        s.encodePacket(t, o.supportsBinary, function(r) {
                            if (!o.usingBrowserWebSocket) {
                                var s = {};
                                if (t.options && (s.compress = t.options.compress),
                                o.perMessageDeflate) {
                                    var c = "string" == typeof r ? e.Buffer.byteLength(r) : r.length;
                                    c < o.perMessageDeflate.threshold && (s.compress = !1)
                                }
                            }
                            try {
                                o.usingBrowserWebSocket ? o.ws.send(r) : o.ws.send(r, s)
                            } catch (a) {}
                            --i || n()
                        })
                    }(t[r])
            }
            ,
            o.prototype.onClose = function() {
                r.prototype.onClose.call(this)
            }
            ,
            o.prototype.doClose = function() {
                "undefined" != typeof this.ws && this.ws.close()
            }
            ,
            o.prototype.uri = function() {
                var t = this.query || {}
                  , e = this.secure ? "wss" : "ws"
                  , n = "";
                this.port && ("wss" === e && 443 !== Number(this.port) || "ws" === e && 80 !== Number(this.port)) && (n = ":" + this.port),
                this.timestampRequests && (t[this.timestampParam] = u()),
                this.supportsBinary || (t.b64 = 1),
                t = c.encode(t),
                t.length && (t = "?" + t);
                var o = this.hostname.indexOf(":") !== -1;
                return e + "://" + (o ? "[" + this.hostname + "]" : this.hostname) + n + this.path + t
            }
            ,
            o.prototype.check = function() {
                return !(!f || "__initialize"in f && this.name === o.prototype.name)
            }
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e) {}
    , function(t, e) {
        var n = [].indexOf;
        t.exports = function(t, e) {
            if (n)
                return t.indexOf(e);
            for (var o = 0; o < t.length; ++o)
                if (t[o] === e)
                    return o;
            return -1
        }
    }
    , function(t, e, n) {
        "use strict";
        function o(t, e, n) {
            this.io = t,
            this.nsp = e,
            this.json = this,
            this.ids = 0,
            this.acks = {},
            this.receiveBuffer = [],
            this.sendBuffer = [],
            this.connected = !1,
            this.disconnected = !0,
            n && n.query && (this.query = n.query),
            this.io.autoConnect && this.open()
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
          , r = n(5)
          , s = n(6)
          , c = n(30)
          , a = n(31)
          , u = n(32)
          , h = (n(4)("socket.io-client:socket"),
        n(21));
        t.exports = e = o;
        var p = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
        }
          , f = s.prototype.emit;
        s(o.prototype),
        o.prototype.subEvents = function() {
            if (!this.subs) {
                var t = this.io;
                this.subs = [a(t, "open", u(this, "onopen")), a(t, "packet", u(this, "onpacket")), a(t, "close", u(this, "onclose"))]
            }
        }
        ,
        o.prototype.open = o.prototype.connect = function() {
            return this.connected ? this : (this.subEvents(),
            this.io.open(),
            "open" === this.io.readyState && this.onopen(),
            this.emit("connecting"),
            this)
        }
        ,
        o.prototype.send = function() {
            var t = c(arguments);
            return t.unshift("message"),
            this.emit.apply(this, t),
            this
        }
        ,
        o.prototype.emit = function(t) {
            if (p.hasOwnProperty(t))
                return f.apply(this, arguments),
                this;
            var e = c(arguments)
              , n = {
                type: r.EVENT,
                data: e
            };
            return n.options = {},
            n.options.compress = !this.flags || !1 !== this.flags.compress,
            "function" == typeof e[e.length - 1] && (this.acks[this.ids] = e.pop(),
            n.id = this.ids++),
            this.connected ? this.packet(n) : this.sendBuffer.push(n),
            delete this.flags,
            this
        }
        ,
        o.prototype.packet = function(t) {
            t.nsp = this.nsp,
            this.io.packet(t)
        }
        ,
        o.prototype.onopen = function() {
            if ("/" !== this.nsp)
                if (this.query) {
                    var t = "object" === i(this.query) ? h.encode(this.query) : this.query;
                    this.packet({
                        type: r.CONNECT,
                        query: t
                    })
                } else
                    this.packet({
                        type: r.CONNECT
                    })
        }
        ,
        o.prototype.onclose = function(t) {
            this.connected = !1,
            this.disconnected = !0,
            delete this.id,
            this.emit("disconnect", t)
        }
        ,
        o.prototype.onpacket = function(t) {
            if (t.nsp === this.nsp)
                switch (t.type) {
                case r.CONNECT:
                    this.onconnect();
                    break;
                case r.EVENT:
                    this.onevent(t);
                    break;
                case r.BINARY_EVENT:
                    this.onevent(t);
                    break;
                case r.ACK:
                    this.onack(t);
                    break;
                case r.BINARY_ACK:
                    this.onack(t);
                    break;
                case r.DISCONNECT:
                    this.ondisconnect();
                    break;
                case r.ERROR:
                    this.emit("error", t.data)
                }
        }
        ,
        o.prototype.onevent = function(t) {
            var e = t.data || [];
            null != t.id && e.push(this.ack(t.id)),
            this.connected ? f.apply(this, e) : this.receiveBuffer.push(e)
        }
        ,
        o.prototype.ack = function(t) {
            var e = this
              , n = !1;
            return function() {
                if (!n) {
                    n = !0;
                    var o = c(arguments);
                    e.packet({
                        type: r.ACK,
                        id: t,
                        data: o
                    })
                }
            }
        }
        ,
        o.prototype.onack = function(t) {
            var e = this.acks[t.id];
            "function" == typeof e && (e.apply(this, t.data),
            delete this.acks[t.id])
        }
        ,
        o.prototype.onconnect = function() {
            this.connected = !0,
            this.disconnected = !1,
            this.emit("connect"),
            this.emitBuffered()
        }
        ,
        o.prototype.emitBuffered = function() {
            var t;
            for (t = 0; t < this.receiveBuffer.length; t++)
                f.apply(this, this.receiveBuffer[t]);
            for (this.receiveBuffer = [],
            t = 0; t < this.sendBuffer.length; t++)
                this.packet(this.sendBuffer[t]);
            this.sendBuffer = []
        }
        ,
        o.prototype.ondisconnect = function() {
            this.destroy(),
            this.onclose("io server disconnect")
        }
        ,
        o.prototype.destroy = function() {
            if (this.subs) {
                for (var t = 0; t < this.subs.length; t++)
                    this.subs[t].destroy();
                this.subs = null
            }
            this.io.destroy(this)
        }
        ,
        o.prototype.close = o.prototype.disconnect = function() {
            return this.connected && this.packet({
                type: r.DISCONNECT
            }),
            this.destroy(),
            this.connected && this.onclose("io client disconnect"),
            this
        }
        ,
        o.prototype.compress = function(t) {
            return this.flags = this.flags || {},
            this.flags.compress = t,
            this
        }
    }
    , function(t, e) {
        function n(t, e) {
            var n = [];
            e = e || 0;
            for (var o = e || 0; o < t.length; o++)
                n[o - e] = t[o];
            return n
        }
        t.exports = n
    }
    , function(t, e) {
        "use strict";
        function n(t, e, n) {
            return t.on(e, n),
            {
                destroy: function() {
                    t.removeListener(e, n)
                }
            }
        }
        t.exports = n
    }
    , function(t, e) {
        var n = [].slice;
        t.exports = function(t, e) {
            if ("string" == typeof e && (e = t[e]),
            "function" != typeof e)
                throw new Error("bind() requires a function");
            var o = n.call(arguments, 2);
            return function() {
                return e.apply(t, o.concat(n.call(arguments)))
            }
        }
    }
    , function(t, e) {
        function n(t) {
            t = t || {},
            this.ms = t.min || 100,
            this.max = t.max || 1e4,
            this.factor = t.factor || 2,
            this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0,
            this.attempts = 0
        }
        t.exports = n,
        n.prototype.duration = function() {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
                var e = Math.random()
                  , n = Math.floor(e * this.jitter * t);
                t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n
            }
            return 0 | Math.min(t, this.max)
        }
        ,
        n.prototype.reset = function() {
            this.attempts = 0
        }
        ,
        n.prototype.setMin = function(t) {
            this.ms = t
        }
        ,
        n.prototype.setMax = function(t) {
            this.max = t
        }
        ,
        n.prototype.setJitter = function(t) {
            this.jitter = t
        }
    }
    , function(t, e, n) {
        function o(t, e, n) {
            var o = e && n || 0
              , i = e || [];
            t = t || {};
            var s = void 0 !== t.clockseq ? t.clockseq : a
              , p = void 0 !== t.msecs ? t.msecs : (new Date).getTime()
              , f = void 0 !== t.nsecs ? t.nsecs : h + 1
              , l = p - u + (f - h) / 1e4;
            if (l < 0 && void 0 === t.clockseq && (s = s + 1 & 16383),
            (l < 0 || p > u) && void 0 === t.nsecs && (f = 0),
            f >= 1e4)
                throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
            u = p,
            h = f,
            a = s,
            p += 122192928e5;
            var d = (1e4 * (268435455 & p) + f) % 4294967296;
            i[o++] = d >>> 24 & 255,
            i[o++] = d >>> 16 & 255,
            i[o++] = d >>> 8 & 255,
            i[o++] = 255 & d;
            var y = p / 4294967296 * 1e4 & 268435455;
            i[o++] = y >>> 8 & 255,
            i[o++] = 255 & y,
            i[o++] = y >>> 24 & 15 | 16,
            i[o++] = y >>> 16 & 255,
            i[o++] = s >>> 8 | 128,
            i[o++] = 255 & s;
            for (var m = t.node || c, g = 0; g < 6; ++g)
                i[o + g] = m[g];
            return e ? e : r(i)
        }
        var i = n(35)
          , r = n(36)
          , s = i()
          , c = [1 | s[0], s[1], s[2], s[3], s[4], s[5]]
          , a = 16383 & (s[6] << 8 | s[7])
          , u = 0
          , h = 0;
        t.exports = o
    }
    , function(t, e) {
        (function(e) {
            var n, o = e.crypto || e.msCrypto;
            if (o && o.getRandomValues) {
                var i = new Uint8Array(16);
                n = function() {
                    return o.getRandomValues(i),
                    i
                }
            }
            if (!n) {
                var r = new Array(16);
                n = function() {
                    for (var t, e = 0; e < 16; e++)
                        0 === (3 & e) && (t = 4294967296 * Math.random()),
                        r[e] = t >>> ((3 & e) << 3) & 255;
                    return r
                }
            }
            t.exports = n
        }
        ).call(e, function() {
            return this
        }())
    }
    , function(t, e) {
        function n(t, e) {
            var n = e || 0
              , i = o;
            return i[t[n++]] + i[t[n++]] + i[t[n++]] + i[t[n++]] + "-" + i[t[n++]] + i[t[n++]] + "-" + i[t[n++]] + i[t[n++]] + "-" + i[t[n++]] + i[t[n++]] + "-" + i[t[n++]] + i[t[n++]] + i[t[n++]] + i[t[n++]] + i[t[n++]] + i[t[n++]]
        }
        for (var o = [], i = 0; i < 256; ++i)
            o[i] = (i + 256).toString(16).substr(1);
        t.exports = n
    }
    , function(e, n) {
        e.exports = t
    }
    ])
});
