var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var GameLogic = (function () {
        function GameLogic() {
        }
        return GameLogic;
    }());
    game.GameLogic = GameLogic;
    __reflect(GameLogic.prototype, "game.GameLogic");
})(game || (game = {}));
