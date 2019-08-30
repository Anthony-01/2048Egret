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
    var GameHost = (function (_super) {
        __extends(GameHost, _super);
        function GameHost() {
            var _this = _super.call(this) || this;
            //游戏的状态管理
            _this._gameStatus = EGameStatus.ready;
            //动作队列
            _this._actionList = [];
            //使用代理来过滤游戏动作过程中的其他动作,已经实施的动作
            //实现后撤功能
            _this.m_commandStack = [];
            _this._actionMaster = new game.ActionExecutor();
            _this._actionMaster.host = _this;
            _this._gameLogic = new game.GameLogic();
            return _this;
        }
        Object.defineProperty(GameHost.prototype, "status", {
            get: function () {
                return this._actionStatus;
            },
            enumerable: true,
            configurable: true
        });
        GameHost.prototype.startGame = function () {
            if (!this.gameView)
                return console.error("开始游戏失败,未设置游戏视图");
            this._gameStatus = EGameStatus.on;
            this._actionStatus = EActionStatus.ready;
            this.m_grid = new game.Grid();
            // this.updateView();
            // this.gameView.startGame(this.m_grid.getGrid());
            //封装一个命令，pushAction中
            // manager.TimerCtrl.getInstance().createTimer(this, 1000 / 60, 0, this.onUpdate, "gameUpdate");
            // let start = new ActionCommand(this, this.subStartGame);
        };
        /**
         * 外部传入游戏命令
         * @param command 游戏命令
         */
        GameHost.prototype.onGameMessage = function (command) {
            this._actionList.push(command);
            if (this._actionStatus == EActionStatus.ready) {
                this.applyAction(this._actionList[0]);
            }
        };
        GameHost.prototype.move = function (event) {
            //游戏移动,命令模式
            var data = event.data;
            console.log(data);
            this._actionList.push(data);
        };
        GameHost.prototype.assertAction = function (command) {
            //动作使用策略模式
            //首先处于准备状态
            return this._actionStatus == EActionStatus.ready;
        };
        GameHost.prototype.applyAction = function (command) {
            var _this = this;
            this._actionStatus = EActionStatus.on;
            command.addListener(game.ActionCommand.EVENT_COMPLETE, this.onComplete, this);
            this._currentCommand = command;
            // this._actionMaster.applyAction(command, this);
            // command.execute();
            var promise;
            switch (command.actionType) {
                case game.EActionType.start: {
                    promise = this.subStartGame;
                    break;
                }
                case game.EActionType.move: {
                    promise = this.subMoveTile;
                }
            }
            promise.call(this, command.actionData).then(function () {
                command.trigger(game.ActionCommand.EVENT_COMPLETE);
                _this.m_commandStack.push(command);
            }).catch(function (err) {
                console.log(err);
                command.trigger(game.ActionCommand.EVENT_COMPLETE);
            });
            //grid的改变
        };
        GameHost.prototype.onComplete = function () {
            var command = this._currentCommand;
            command.removeListener(game.ActionCommand.EVENT_COMPLETE, this.onComplete, this);
            this._actionStatus = EActionStatus.ready;
            this.dispatchEventWith(customEvent.ModelEvent.EVENT_ACTION_COMPLETE);
            this._currentCommand = null;
        };
        GameHost.prototype.subStartGame = function () {
            var tile = this.m_grid.addRandomTile();
            return this.gameView.startGame(tile);
        };
        GameHost.prototype.subMoveTile = function (direction) {
            var grid = this.m_grid.getGrid();
            var moves = this._gameLogic.getBoard(direction, grid);
            return this.gameView.moveTiles(moves);
        };
        GameHost.prototype.setView = function (view) {
            this.gameView = view;
            // this.gameView.addEventListener()
            // this.gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            // this.updateView();
        };
        //移除host监听的游戏View事件
        GameHost.prototype.removeView = function () {
            // this.gameView.removeEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            // manager.TimerCtrl.getInstance().killTimer(this, "gameUpdate");
        };
        GameHost.prototype.updateView = function () {
            // let grid = this.m_grid.getGrid();
            this.gameView.updateView();
            if (this._actionStatus == EActionStatus.ready) {
                var command = this._actionList[0];
                command && this.applyAction(command);
            }
        };
        //执行动作队列
        GameHost.prototype.onUpdate = function () {
            this.updateView();
        };
        //重置gameHost
        GameHost.prototype.reset = function () {
        };
        return GameHost;
    }(egret.DisplayObject));
    game.GameHost = GameHost;
    __reflect(GameHost.prototype, "game.GameHost", ["game.IGameHost"]);
})(game || (game = {}));
