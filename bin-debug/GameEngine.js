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
    var EActionType;
    (function (EActionType) {
        EActionType[EActionType["AK_GAME_BEGIN"] = 0] = "AK_GAME_BEGIN";
        EActionType[EActionType["AK_APPEAR_TILE"] = 1] = "AK_APPEAR_TILE";
        EActionType[EActionType["AK_PIECE_MOVE"] = 2] = "AK_PIECE_MOVE";
    })(EActionType = game.EActionType || (game.EActionType = {}));
    var GameEngine = (function (_super) {
        __extends(GameEngine, _super);
        function GameEngine() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //动作队列
            _this._actionList = [];
            //
            _this._actionQueqe = [];
            return _this;
        }
        /**
         * 游戏引擎单例
         * */
        GameEngine.getIns = function () {
            if (null == this.m_Instance) {
                this.m_Instance = new GameEngine();
                this.m_Instance.init();
            }
            return this.m_Instance;
        };
        /**，sawn， you are my baby as y
         * 游戏引擎初始化
         * */
        GameEngine.prototype.init = function () {
            this._gameHost = new game.GameHost();
        };
        // private _actionList: any[] = [];
        GameEngine.prototype.runGame = function () {
            this._gameView ? this._gameHost.setView(this._gameView) : console.warn("未初始化游戏视图");
            this._gameHost.addEventListener(customEvent.ModelEvent.EVENT_ACTION_COMPLETE, this.actionComplete, this);
            this._gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            this._gameHost.startGame();
            var command = new game.ActionCommand(this, function () {
                return new Promise(function (resolve) {
                    console.log("游戏开始");
                });
            });
            command.actionType = EActionType.start;
            this._gameHost.applyAction(command);
            //构造开始游戏的命令
            // let command = new ActionCommand(this._gameView, this._gameView.startGame)构造命令时，不能绕过数据
            // this._gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            //游戏网络部分的
            manager.TimerCtrl.getInstance().createTimer(this, 1000 / 60, 0, this.onUpdate, "gameUpdate");
        };
        GameEngine.prototype.actionComplete = function () {
            var command = this._actionQueqe.shift();
            if (command) {
                this._gameHost.applyAction(command);
            }
        };
        //gameEngine的游戏职能，是否需要将动作队列移动至gamehost
        GameEngine.prototype.move = function (event) {
            //游戏移动,命令模式
            var data = event.data;
            // console.log(data);
            // data.addListener(ActionCommand.EVENT_COMPLETE, this.onMoveComplete, this);
            // data.execute();
            //host验证动作=>执行
            //通过host验证后上传服务器
            this._actionQueqe.push(data);
            if (this._gameHost.status == game.EActionStatus.ready) {
                var command = this._actionQueqe.shift();
                this._gameHost.applyAction(command);
            }
            // this._gameHost.applyAction(data);
        };
        GameEngine.prototype.onMoveComplete = function () {
            console.log("事件完成!");
        };
        GameEngine.prototype.onResetEngine = function () {
            this._gameHost.removeEventListener(customEvent.ModelEvent.EVENT_ACTION_COMPLETE, this.actionComplete, this);
            this._gameView.removeEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            manager.TimerCtrl.getInstance().killTimer(this, "gameUpdate");
        };
        return GameEngine;
    }(model.GameModel));
    game.GameEngine = GameEngine;
    __reflect(GameEngine.prototype, "game.GameEngine");
})(game || (game = {}));
