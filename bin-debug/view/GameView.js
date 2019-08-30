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
    //统筹各组件
    var GameView = (function (_super) {
        __extends(GameView, _super);
        function GameView() {
            var _this = _super.call(this, "GameScene") || this;
            _this.m_Tiles = [];
            // private _pieceContainer: eui.Group;
            /**
             * 棋盘数组
             * 0 - 无棋子
             * 1 - 有棋子
             * 42\120
             * */
            _this._pieceContainer = [];
            _this._readyToRemove = [];
            return _this;
        }
        GameView.prototype.onComplete = function () {
            _super.prototype.onComplete.call(this);
        };
        GameView.prototype.initBtn = function () {
            this.btn_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_down.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_letf.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
        };
        GameView.prototype.removeBtn = function () {
            this.btn_up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_down.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_letf.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_right.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_return.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
        };
        GameView.prototype.updateView = function () {
        };
        /**
         * 初始化组件,各部分handle
         */
        GameView.prototype.init = function () {
            console.log("gameView初始化!");
            console.log(this.gameTime);
            console.log(this.gridHandle);
            //如何做动画模块
            //生成各个子部件
            // GameEngine.getIns().pushAction(EActionType.AK_GAME_BEGIN);
            //生成随机棋子的动作
            // GameEngine.getIns().pushAction(EActionType.AK_APPEAR_TILE);
        };
        GameView.prototype.moveTiles = function (data) {
            var _this = this;
            //播放音效、移动滑块等
            //Lee
            console.warn(data);
            var self = this;
            return new Promise(function (resolve, reject) {
                var promiseVec = [];
                promiseVec.push(_this.gridHandle.moveTiles(data));
                Promise.all(promiseVec).then(function () {
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        GameView.prototype.onMove = function (e) {
            var command = new game.ActionCommand(this.bg, function () {
                return new Promise(function (resolve, reject) {
                    console.log("命令一");
                    resolve();
                });
            });
            command.actionType = game.EActionType.move;
            var name = e.currentTarget;
            switch (name.label) {
                case "上": {
                    command.actionData = game.EMoveDirection.up;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "up"});
                    break;
                }
                case "下": {
                    command.actionData = game.EMoveDirection.down;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "down"});
                    break;
                }
                case "左": {
                    command.actionData = game.EMoveDirection.left;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "left"});
                    break;
                }
                case "右": {
                    command.actionData = game.EMoveDirection.right;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "right"});
                    break;
                }
            }
            this.dispatchEventWith(customEvent.ViewEvent.EVENT_MOVE_EVENT, false, command);
        };
        GameView.prototype.onReturn = function () {
            this.dispatchEventWith(customEvent.ViewEvent.EVENT_RETURN_EVENT);
        };
        GameView.prototype.startGame = function (tile) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.gridHandle.addTile(tile.x, tile.y, tile.value);
                resolve();
            });
            // grid.forEach((ary, row) => {
            // ary.forEach((value, col) => {
            // })
            // } )
        };
        /**
         * 游戏开始动作,使用回调函数的形式进行动作队列
         * @param data 游戏开始数据
         * */
        GameView.prototype.startGameBegin = function (data, callBack) {
            //初始化棋盘
            // this.initTable();
            this.gridHandle.initTable();
            callBack && callBack();
        };
        GameView.prototype.startAppearTile = function (callBack) {
            this.gridHandle.addRandomTile();
            //从棋盘中没有棋子的位置随机生成一个棋子
            var positions = this.getPositions();
            var position = positions[Math.floor(Math.random() * positions.length)];
            this.appearOneTile(position);
            // this.addRandomTile();
            callBack && callBack();
        };
        GameView.prototype.addRandomTile = function () {
            if (this.c_grid.cellsAvailable()) {
                var value = Math.random() < 0.9 ? 1 : 2;
                var point = this.c_grid.randomAvailableCell();
                var tile = new game.Tile(point.x, point.y, value);
                // this.addChild(tile);
                this.c_grid.insertTile(point.x, point.y, value); //数据
                this.m_Tiles.push(tile);
                this.addChild(tile);
            }
        };
        GameView.prototype.appearOneTile = function (point) {
            var value = Math.random() < 0.9 ? 1 : 2;
            this._pieceContainer[point.x][point.y] = value;
            var tile = new game.Tile(point.x, point.y, value);
            this.m_Tiles.push(tile);
            this.addChild(tile);
        };
        GameView.prototype.getPositions = function () {
            var back = [];
            //遍历整个棋盘
            for (var n = 0; n < 5; n++) {
                for (var m = 0; m < 5; m++) {
                    if (this.isTile(n, m) == false) {
                        back.push(new egret.Point(n, m));
                    }
                }
            }
            return back;
        };
        GameView.prototype.isTile = function (x, y) {
            return this._pieceContainer[x][y] != 0;
        };
        /**
         * 初始化棋盘
         * */
        // private initTable() {
        //     for (let n = 0; n < 5; n++) {
        //         this._pieceContainer[n] = [];
        //         for (let m = 0; m < 5; m++) {
        //             this._pieceContainer[n][m] = 0;
        //         }
        //     }
        //     // console.log(this._pieceContainer);
        //     this.c_grid = new Grid(this);//初始化棋盘
        //     // this.addTestTile(3,4,2);
        //     // this.addTestTile(4,4,4);
        //     // this.addTestTile(2,4,1);
        // }
        GameView.prototype.startMoveTile = function (data, callBack) {
            var _this = this;
            //异步的移动动作
            this.disabledBtn();
            this.clearMerge();
            this.gridHandle.moveTile(data.direction).then(function () {
                _this.activeBtn();
                callBack && callBack();
            });
            this.moveAllTile(data.direction).then(function () {
                _this.mergeTiles(data.direction).then(function () {
                });
            });
            // Promise.all(promiseVec).then(() => {
            //     callBack && callBack();
            // });
        };
        GameView.prototype.finishMoveTile = function (data) {
            this.activeBtn();
        };
        GameView.prototype.clearMerge = function () {
            this.m_Tiles.forEach(function (tile) {
                tile.savePosition();
            });
        };
        GameView.prototype.moveAllTile = function (direction) {
            var _this = this;
            var self = this;
            return new Promise(function (resolve, reject) {
                _this.getConfig(direction); //将所有
                var promiseVec = [];
                //@version 1.0
                _this.m_Tiles.forEach(function (tile) {
                    if (tile.wishPoint) {
                        promiseVec.push(_this.asyncMove(tile));
                    }
                });
                Promise.all(promiseVec).then(function () {
                    resolve();
                    // this.clearRemove();
                    // this.active
                    // this.mergeTiles(direction);
                    _this.activeBtn();
                });
            });
        };
        GameView.prototype.removeTile = function (tile) {
            var index;
            index = this.m_Tiles.indexOf(tile);
            if (index >= 0) {
                this.removeChild(this.m_Tiles.splice(index, 1)[0]);
                return true;
            }
            else {
                return false;
            }
        };
        GameView.prototype.getTile = function (x, y) {
            var self = this;
            var need = null;
            this.m_Tiles.forEach(function (myTile) {
                if (myTile.Point.x == x && myTile.Point.y == y) {
                    need = myTile;
                }
            });
            return need;
        };
        GameView.prototype.findFarthestPosition = function (cell, vector) {
            var previous;
            // Progress towards the vector direction until an obstacle is found
            do {
                previous = cell;
                cell = { x: previous.x + vector.x, y: previous.y + vector.y };
            } while (this.c_grid.withinBounds(cell) && this.c_grid.cellAvailable(cell)); //下一步不越界并且没有被占用
            return {
                farthest: previous,
                next: cell // Used to check if a merge is required(检测是否需要合并)
            };
        };
        GameView.prototype.getVector = function (direction) {
            // Vectors representing tile movement
            // 0: up, 1: right, 2: down, 3: left
            var index;
            switch (direction) {
                case "up": {
                    index = 3;
                    break;
                }
                case "right": {
                    index = 2;
                    break;
                }
                case "down": {
                    index = 1;
                    break;
                }
                case "left": {
                    index = 0;
                    break;
                }
            }
            var map = {
                0: { x: 0, y: -1 },
                1: { x: 1, y: 0 },
                2: { x: 0, y: 1 },
                3: { x: -1, y: 0 } // Left
            };
            return map[index];
        };
        GameView.prototype.buildTraversals = function (vector) {
            var traversals = { x: [], y: [] };
            for (var pos = 0; pos < game.SIZE; pos++) {
                traversals.x.push(pos);
                traversals.y.push(pos);
            }
            // Always traverse from the farthest cell in the chosen direction
            if (vector.x === 1)
                traversals.x = traversals.x.reverse();
            if (vector.y === 1)
                traversals.y = traversals.y.reverse();
            return traversals;
        };
        GameView.prototype.prepareTiles = function () {
            var self = this;
            this.c_grid.eachCell(function (x, y, tile) {
                if (tile) {
                }
            });
        };
        /**
         * 合并拼图
         * */
        GameView.prototype.mergeTiles = function (direction) {
            //检测是否能够合并
            this.adjustMerge(direction); //合并一次
            //再移动一次
            return this.moveAllTile(direction);
        };
        GameView.prototype.adjustMerge = function (direction) {
            var _this = this;
            var back = false;
            var vector = this.getVector(direction);
            var build = this.buildTraversals(vector);
            //右边，x 从大到小，y
            //此时已经全部归于一个方向
            build.x.forEach(function (x) {
                build.y.forEach(function (y) {
                    //如果有tile，并且下一个tile的值相等，进行合并
                    var tile = _this.getTile(x, y);
                    var next = _this.getTile(x - vector.x, y - vector.y);
                    if (tile && next && tile.value == next.value && !tile.mergedFrom) {
                        var merge = new game.Tile(tile.Point.x, tile.Point.y, tile.value + 1);
                        merge.mergedFrom = [tile, next];
                        _this.m_Tiles.push(merge);
                        _this.addChild(merge);
                        _this._pieceContainer[tile.Point.x][tile.Point.y] = tile.value + 1;
                        _this._pieceContainer[next.Point.x][next.Point.y] = 0;
                        //将merge插入tile位置并且将next删除
                        // this.c_grid.insertTile(tile.x, tile.y, tile.value * 2);
                        // this.c_grid.removeTile(next.x, next.y);
                        _this.removeTile(tile);
                        _this.removeTile(next);
                    }
                });
            });
            return back;
        };
        GameView.prototype.clearRemove = function () {
            var _this = this;
            this._readyToRemove.forEach(function (tile) {
                _this.removeTile(tile);
            });
        };
        GameView.prototype.asyncMove = function (tile) {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (tile.wishPoint) {
                    egret.Tween.get(tile).to({ x: tile.wishPoint.y * game.PIECE_WIDTH + 42, y: tile.wishPoint.x * game.PIECE_WIDTH + 120 }, 300, egret.Ease.backOut).call(function () {
                        //@version 1.0
                        tile.point = tile.wishPoint;
                        tile.wishPoint = null;
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            });
        };
        GameView.prototype.getAllConfigs = function (direction) {
            var _this = this;
            var self = this;
            var vector = this.getVector(direction);
            var build = this.buildTraversals(vector);
            this.m_Tiles.forEach(function (tile) {
                tile.savePosition();
            }); //思考，中途新加的点该如何
            build.x.forEach(function (x) {
                build.y.forEach(function (y) {
                    var cell = _this.getTile(x, y); //get现在位置
                    if (cell) {
                        //传入位置以及方向
                        var position = {
                            x: x, y: y
                        };
                        var farthest = _this.findFarthestPosition(position, vector);
                        //将棋子移动到最远的距离
                        //数据
                        var origin = {
                            x: x,
                            y: y
                        };
                        _this.c_grid.moveTile(origin, farthest.farthest);
                        cell.point = new egret.Point(farthest.farthest.x, farthest.farthest.y);
                        cell.wishPoint = new egret.Point(farthest.farthest.x, farthest.farthest.y);
                        //检测是否需要合并
                        var next = _this.getTile(farthest.next.x, farthest.next.y);
                        if (next && next.value === cell.value && !next.mergedFrom) {
                            var merged = new game.Tile(farthest.next.x, farthest.next.y, cell.value * 2);
                            merged.mergedFrom = [cell, next];
                            self.c_grid.insertTile(farthest.next.x, farthest.next.y, cell.value * 2);
                            self.m_Tiles.push(merged);
                            self.addChild(merged);
                            //消除next
                            self.removeTile(next);
                            // this.c_grid.removeTile(next.Point.x, next.Point.y);//被占用，不用消除
                            //等待动画播放完全以后再消除
                            _this.c_grid.removeTile(cell.Point.x, cell.Point.y);
                            // cell.wishPoint = new egret.Point(farthest.farthest.x, farthest.farthest.y);
                            cell.m_readyToRemove = true;
                        }
                    }
                });
            });
        };
        GameView.prototype.getConfig = function (direction) {
            var back = [];
            //行标识
            var row = false;
            //左标识
            var forward = false;
            //将所有能够移动的全部移动到一侧
            switch (direction) {
                case "up": {
                    row = false;
                    forward = false;
                    break;
                }
                case "down": {
                    row = false;
                    forward = true;
                    break;
                }
                case "left": {
                    row = true;
                    forward = false;
                    break;
                }
                case "right": {
                    row = true;
                    forward = true;
                    break;
                }
            }
            this.changeData(row, forward);
            return back;
        };
        GameView.prototype.changeData = function (row, forward) {
            var right;
            if (forward) {
                right = -1;
            }
            else {
                right = 1;
            }
            if (row) {
                for (var n = 0; n < 5; n++) {
                    var leftTile = null;
                    for (var m = forward ? 4 : 0; m >= 0 && m <= 4; m = m + right) {
                        if (this._pieceContainer[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._pieceContainer[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (var j = 0; j < this.m_Tiles.length; j++) {
                                var point = this.m_Tiles[j].Point;
                                if (point.x == n && point.y == m && this.m_Tiles[j].wishPoint == null) {
                                    this.m_Tiles[j].wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._pieceContainer[leftTile.x][leftTile.y] = this._pieceContainer[point.x][point.y];
                                    this._pieceContainer[point.x][point.y] = 0;
                                    // n = leftTile.x;
                                    m = leftTile.y;
                                    leftTile = null;
                                    break;
                                }
                            }
                            // }
                        }
                    }
                }
            }
            else {
                //如何处理上下
                for (var m = 0; m < 5; m++) {
                    var leftTile = null;
                    for (var n = forward ? 4 : 0; n >= 0 && n <= 4; n = n + right) {
                        if (this._pieceContainer[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._pieceContainer[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (var j = 0; j < this.m_Tiles.length; j++) {
                                var point = this.m_Tiles[j].Point;
                                if (point.x == n && point.y == m && this.m_Tiles[j].wishPoint == null) {
                                    this.m_Tiles[j].wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._pieceContainer[leftTile.x][leftTile.y] = this._pieceContainer[point.x][point.y];
                                    this._pieceContainer[point.x][point.y] = 0;
                                    n = leftTile.x;
                                    // m = leftTile.y;
                                    leftTile = null;
                                    break;
                                }
                            }
                            // }
                        }
                    }
                }
            }
            // //消除以及合并
        };
        GameView.prototype.activeBtn = function () {
            this.btn_up.enabled = true;
            this.btn_down.enabled = true;
            this.btn_letf.enabled = true;
            this.btn_right.enabled = true;
        };
        GameView.prototype.disabledBtn = function () {
            this.btn_up.enabled = false;
            this.btn_down.enabled = false;
            this.btn_letf.enabled = false;
            this.btn_right.enabled = false;
        };
        /**
         * 游戏开始结束
         * */
        GameView.prototype.finishGameBegin = function (data) {
        };
        GameView.prototype.dealloc = function () {
            //移除所有监听事件
            this.removeBtn();
            _super.prototype.dealloc.call(this);
        };
        return GameView;
    }(base.BaseScene));
    game.GameView = GameView;
    __reflect(GameView.prototype, "game.GameView");
})(game || (game = {}));
