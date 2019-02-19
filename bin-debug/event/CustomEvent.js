var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var customEvent;
(function (customEvent) {
    var CustomEvent = (function (_super) {
        __extends(CustomEvent, _super);
        /**
         * 构造方法
         */
        function CustomEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        /**
         * 连接完成
         */
        CustomEvent.EVENT_CONNECT_COMPLETE = "connectComplete";
        /**
         * 消息分发
         */
        CustomEvent.EVENT_MESSAGE_DISPATCH = "messageDispatch";
        /**
         * 连接失败
         */
        CustomEvent.EVENT_CONNECT_FAIlURE = "connectFailure";
        return CustomEvent;
    }(egret.Event));
    customEvent.CustomEvent = CustomEvent;
    __reflect(CustomEvent.prototype, "customEvent.CustomEvent");
})(customEvent || (customEvent = {}));
