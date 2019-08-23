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
var component;
(function (component) {
    var TEXT_INFO = "GameTime: ";
    var GameTimeHandle = (function (_super) {
        __extends(GameTimeHandle, _super);
        function GameTimeHandle() {
            var _this = _super.call(this) || this;
            _this.data = {
                time: 0
            };
            _this.skinName = GameTimerSkin;
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.remove, _this);
            return _this;
        }
        // public onComplete() {
        //     console.log("timeHandle:组件初始化");
        // }
        GameTimeHandle.prototype.addCurrentTime = function () {
            this.data.time += 1;
            this.gameTime.text = TEXT_INFO + this.data.time + "s";
        };
        GameTimeHandle.prototype.init = function () {
            console.log(this.gameTime);
            //不知道在哪创建了一个
            // manager.TimerCtrl.getInstance().createTimer(this, 1000, 0, this.addCurrentTime,"gameTime");
        };
        //
        GameTimeHandle.prototype.createChildren = function () {
            manager.TimerCtrl.getInstance().createTimer(this, 1000, 0, this.addCurrentTime, "gameTime");
        };
        GameTimeHandle.prototype.remove = function () {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.remove, this);
            manager.TimerCtrl.getInstance().killTimer(this, "gameTime");
        };
        return GameTimeHandle;
    }(base.BaseComponent));
    component.GameTimeHandle = GameTimeHandle;
    __reflect(GameTimeHandle.prototype, "component.GameTimeHandle");
})(component || (component = {}));
