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
    var ModelEvent = (function (_super) {
        __extends(ModelEvent, _super);
        /**
         * 构造方法
         */
        function ModelEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        /**
         * 动作完成
         */
        ModelEvent.EVENT_ACTION_COMPLETE = "actionComplete";
        return ModelEvent;
    }(egret.Event));
    customEvent.ModelEvent = ModelEvent;
    __reflect(ModelEvent.prototype, "customEvent.ModelEvent");
})(customEvent || (customEvent = {}));
