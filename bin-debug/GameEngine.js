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
        /**
         * 游戏引擎初始化
         * */
        GameEngine.prototype.init = function () {
            // this.setGameView(new GameView());
            this.m_StartScene = new game.StartScene();
            this._gameView = new game.GameView();
        };
        /**
         * 初始化游戏,将开始界面替换进舞台
         * */
        GameEngine.prototype.initGame = function () {
            manager.FrameManager.getInstance().setCurrentScene(this.m_StartScene);
        };
        /**
         * 开始游戏
         * */
        GameEngine.prototype.startGame = function () {
            manager.FrameManager.getInstance().replaceScene(this._gameView, true);
            //将开始游戏动作导入动作队列
            //游戏开始动作
            this.pushAction(EActionType.AK_GAME_BEGIN);
            //生成随机棋子的动作
            this.pushAction(EActionType.AK_APPEAR_TILE);
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
