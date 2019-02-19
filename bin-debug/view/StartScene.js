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
            var _this = this;
            this.btn_start = new myComponent.MyButton();
            this.btn_start.x = 320;
            this.btn_start.y = 534;
            this.addChild(this.btn_start);
            var callBack = function () {
                _this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.startGame, _this);
            };
            this.btn_start.pushAction(callBack);
        };
        StartScene.prototype.startGame = function () {
            //开始游戏
            game.GameEngine.getIns().startGame();
        };
        return StartScene;
    }(base.BaseScene));
    game.StartScene = StartScene;
    __reflect(StartScene.prototype, "game.StartScene");
})(game || (game = {}));
