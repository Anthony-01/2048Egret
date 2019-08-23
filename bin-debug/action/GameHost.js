var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var EGameStatus;
    (function (EGameStatus) {
        EGameStatus[EGameStatus["ready"] = 0] = "ready";
        EGameStatus[EGameStatus["on"] = 1] = "on";
        EGameStatus[EGameStatus["over"] = 2] = "over"; //计分等环节
    })(EGameStatus = game.EGameStatus || (game.EGameStatus = {}));
    //动作封装成命令
    var EActionStatus;
    (function (EActionStatus) {
        EActionStatus[EActionStatus["ready"] = 0] = "ready";
        EActionStatus[EActionStatus["on"] = 1] = "on"; //动作进行环节
    })(EActionStatus = game.EActionStatus || (game.EActionStatus = {}));
    /**
     * 是否将游戏数据和游戏动作区分开来?
     */
    var GameHost = (function () {
        function GameHost() {
            //游戏的状态管理
            this._gameStatus = EGameStatus.ready;
            //使用代理来过滤游戏动作过程中的其他动作
            //实现后撤功能
            this._commandStack = [];
            this._actionMaster = new game.ActionExecutor();
            this._actionMaster.host = this;
        }
        GameHost.prototype.startGame = function () {
            this._gameStatus = EGameStatus.on;
            this._actionStatus = EActionStatus.ready;
            // this._grid = new Grid();
        };
        GameHost.prototype.assertAction = function (command) {
            //动作使用策略模式
            //首先处于准备状态
            return this._actionStatus == EActionStatus.ready;
        };
        GameHost.prototype.applyAction = function (command) {
            this._actionStatus = EActionStatus.on;
            command.addListener(game.ActionCommand.EVENT_COMPLETE, this.onComplete, this);
            command.execute();
            this._commandStack.push(command);
        };
        GameHost.prototype.onComplete = function () {
            this._actionStatus = EActionStatus.ready;
        };
        GameHost.prototype.setView = function (view) {
            this.gameView = view;
        };
        return GameHost;
    }());
    game.GameHost = GameHost;
    __reflect(GameHost.prototype, "game.GameHost", ["game.IGameHost"]);
})(game || (game = {}));
