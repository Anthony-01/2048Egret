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
var model;
(function (model) {
    var GameModel = (function (_super) {
        __extends(GameModel, _super);
        function GameModel() {
            var _this = _super.call(this) || this;
            _this.onInitEngine();
            //倒计时定时器
            manager.TimerCtrl.getInstance().createTimer(_this, 1000, 0, _this.onClockUpdateEvent, "clock");
            //帧率刷新
            manager.TimerCtrl.getInstance().createTimer(_this, 1000 / 60, 0, _this.onUpdate, "update");
            return _this;
        }
        /**
         * 初始化
         * 各游戏子类覆盖此方法
         */
        GameModel.prototype.onInitEngine = function (view) {
            view && this.setGameView(view);
            // this._gameFrame = manager.TcpServiceCtrl.getInstance().getDelegate();//获取游戏引擎
        };
        GameModel.prototype.onResetEngine = function () {
        };
        GameModel.prototype.setGameView = function (view) {
            this._gameView = view;
        };
        GameModel.prototype.setGameFrame = function (frame) {
            this._gameFrame = frame;
        };
        /**倒计时刷新
         * 各游戏子类覆盖此方法
         */
        GameModel.prototype.onClockUpdateEvent = function () {
        };
        /**帧率刷新
         * 各游戏子类覆盖此方法
         */
        GameModel.prototype.onUpdate = function () {
        };
        return GameModel;
    }(eui.UILayer));
    model.GameModel = GameModel;
    __reflect(GameModel.prototype, "model.GameModel");
})(model || (model = {}));
