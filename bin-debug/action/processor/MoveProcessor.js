var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var MoveProcessor = (function () {
        function MoveProcessor() {
        }
        MoveProcessor.prototype.assertAction = function (command, host) {
            return;
        };
        MoveProcessor.prototype.applyAction = function (command, host) {
            host.m_grid;
        };
        return MoveProcessor;
    }());
    game.MoveProcessor = MoveProcessor;
    __reflect(MoveProcessor.prototype, "game.MoveProcessor", ["game.IActionProcessor"]);
})(game || (game = {}));
