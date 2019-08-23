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
        GameEngine.prototype.runGame = function () {
            this._gameView ? this._gameHost.setView(this._gameView) : console.warn("未初始化游戏视图");
            this._gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            //游戏网络部分的
        };
        GameEngine.prototype.move = function (event) {
            //游戏移动,命令模式
            var data = event.data;
            console.log(data);
            data.addListener(game.ActionCommand.EVENT_COMPLETE, this.onMoveComplete, this);
            data.execute();
            //host验证动作=>执行
            //通过host验证后上传服务器
        };
        GameEngine.prototype.onMoveComplete = function () {
            console.log("事件完成!");
        };
        /**
         * 添加游戏动作
         * */
        GameEngine.prototype.pushAction = function (kind, data) {
            var myData = {};
            if (data) {
                myData = data;
            }
            var action = {
                bLock: false,
                nKind: kind,
                data: data,
                start: Date.now()
            };
            this._actionList.push(action);
            this.beginGameAction();
            /**
             * 1、生成动作对象
             * 2、动作对象包含执行动作的对象、对象可以是组合对象，可以包含叶节点
             */
        };
        /**
         * 执行动作队列
         * */
        GameEngine.prototype.beginGameAction = function () {
            var action = this._actionList[0];
            if (null == action || action.bLock) {
                console.log("%c当前动作:", "color: red; font-size: 1.5em");
                console.log(action);
                var now = Date.now();
                var time = now - action.start;
                console.log("持续时间:", time / 1000);
                if (time > 5000) {
                    this._actionList.splice(0, 1);
                    this.beginGameAction();
                }
                return; //bLock动作锁(表示该动作正在执行)
            }
            action.bLock = true;
            switch (action.nKind) {
                case EActionType.AK_GAME_BEGIN: {
                    this.startGameBegin(action);
                    break;
                }
                case EActionType.AK_APPEAR_TILE: {
                    this.startAppearTile(action);
                    break;
                }
                case EActionType.AK_PIECE_MOVE: {
                    this.startMoveTiles(action);
                    break;
                }
            }
        };
        GameEngine.prototype.removeGameAction = function (bContinue) {
            var action = this._actionList[0];
            if (null == action || !action.bLock)
                return;
            var nkind = action.nKind;
            switch (nkind) {
                case EActionType.AK_GAME_BEGIN: {
                    this.finishGameBegin(action);
                    break;
                }
                case EActionType.AK_PIECE_MOVE: {
                    this.finishMoveTile(action);
                    break;
                }
            }
            //移除队列
            this._actionList.splice(0, 1);
            //下一动作
            if (bContinue == true && this._actionList.length > 0) {
                this.beginGameAction();
            }
        };
        GameEngine.prototype.startGameBegin = function (action) {
            var _this = this;
            var callBack = function () {
                _this.removeGameAction(true);
            };
            this._gameView && this._gameView.startGameBegin(action.data, callBack);
        };
        GameEngine.prototype.finishGameBegin = function (action) {
            this._gameView && this._gameView.finishGameBegin(action.data);
        };
        GameEngine.prototype.startAppearTile = function (action) {
            var _this = this;
            var callBack = function () {
                _this.removeGameAction(true);
            };
            this._gameView && this._gameView.startAppearTile(callBack);
        };
        GameEngine.prototype.startMoveTiles = function (action) {
            var _this = this;
            var callBack = function () {
                _this.removeGameAction(true);
                _this.pushAction(EActionType.AK_APPEAR_TILE);
            };
            this._gameView && this._gameView.startMoveTile(action.data, callBack);
        };
        GameEngine.prototype.finishMoveTile = function (action) {
            this._gameView && this._gameView.finishMoveTile(action.data);
        };
        return GameEngine;
    }(model.GameModel));
    game.GameEngine = GameEngine;
    __reflect(GameEngine.prototype, "game.GameEngine");
})(game || (game = {}));
