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
var game;
(function (game) {
    var StartScene = (function (_super) {
        __extends(StartScene, _super);
        // public btn_start: myComponent.MyButton;
        function StartScene() {
            return _super.call(this, "StartScene") || this;
        }
        StartScene.prototype.initBtn = function () {
            this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        };
        StartScene.prototype.init = function () {
        };
        StartScene.prototype.startGame = function () {
            //开始游戏
            // GameEngine.getIns().startGame();
            this.dispatchEventWith(customEvent.ViewEvent.EVENT_GAME_START);
        };
        return StartScene;
    }(base.BaseScene));
    game.StartScene = StartScene;
    __reflect(StartScene.prototype, "game.StartScene");
})(game || (game = {}));
