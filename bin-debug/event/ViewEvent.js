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
    var ViewEvent = (function (_super) {
        __extends(ViewEvent, _super);
        /**
         * 构造方法
         */
        function ViewEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        //返回视图
        ViewEvent.EVENT_RETURN_EVENT = "returnEvent";
        //游戏界面
        ViewEvent.EVENT_GAME_START = "gameStart";
        //移动动作
        ViewEvent.EVENT_MOVE_EVENT = "moveEvent";
        return ViewEvent;
    }(egret.Event));
    customEvent.ViewEvent = ViewEvent;
    __reflect(ViewEvent.prototype, "customEvent.ViewEvent");
})(customEvent || (customEvent = {}));
