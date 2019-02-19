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
    var GameView = (function (_super) {
        __extends(GameView, _super);
        function GameView() {
            return _super.call(this, "GameScene") || this;
        }
        GameView.prototype.adjustComponent = function () {
            _super.prototype.adjustComponent.call(this);
        };
        /**
         * 游戏开始动作
         * @param data 游戏开始数据
         * */
        GameView.prototype.startGameBegin = function (data, callBack) {
            callBack && callBack();
        };
        /**
         * 游戏开始结束
         * */
        GameView.prototype.finishGameBegin = function (data) {
        };
        //释放内存
        GameView.prototype.dealloc = function () {
        };
        return GameView;
    }(base.BaseScene));
    game.GameView = GameView;
    __reflect(GameView.prototype, "game.GameView");
})(game || (game = {}));
