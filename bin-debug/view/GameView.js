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
        };
        GameView.prototype.onMove = function (e) {
            var name = e.currentTarget;
            // console.log(name);
            switch (name.label) {
                case "上": {
                    game.GameEngine.getIns().pushAction(game.EActionType.AK_PIECE_MOVE, { direction: "up" });
                    break;
                }
                case "下": {
                    game.GameEngine.getIns().pushAction(game.EActionType.AK_PIECE_MOVE, { direction: "down" });
                    break;
                }
                case "左": {
                    game.GameEngine.getIns().pushAction(game.EActionType.AK_PIECE_MOVE, { direction: "left" });
                    break;
                }
                case "右": {
                    game.GameEngine.getIns().pushAction(game.EActionType.AK_PIECE_MOVE, { direction: "right" });
                    break;
                }
            }
        };
        /**
         * 游戏开始动作
         * @param data 游戏开始数据
         * */
        GameView.prototype.startGameBegin = function (data, callBack) {
            this.initTable();
            callBack && callBack();
        };
        GameView.prototype.startAppearTile = function (callBack) {
            //从棋盘中没有棋子的位置随机生成一个棋子
            // let positions = this.getPositions();
            // let position = positions[Math.floor(Math.random() * positions.length)];
            // this.appearOneTile(position);
            this.addRandomTile();
            callBack && callBack();
        };
        GameView.prototype.addRandomTile = function () {
            if (this.c_grid.cellsAvailable()) {
                var value = Math.random() < 0.9 ? 1 : 2;
                var point = this.c_grid.randomAvailableCell();
                var tile = new game.Tile(point.x, point.y, value);
                // this.addChild(tile);
                this.c_grid.insertTile(tile);
            }
        };
        GameView.prototype.appearOneTile = function (point) {
            this._pieceContainer[point.x][point.y] = 1;
            var tile = new game.Tile(point.x, point.y, 1);
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
            return this._pieceContainer[x][y] == 1;
        };
        /**
         * 初始化棋盘
         * */
        GameView.prototype.initTable = function () {
            // for (let n = 0; n < 5; n++) {
            //     this._pieceContainer[n] = [];
            //     for (let m = 0; m < 5; m++) {
            //         this._pieceContainer[n][m] = 0;
            //     }
            // }
            //
            // console.log(this._pieceContainer);
            this.c_grid = new game.Grid(this); //初始化棋盘
        };
        GameView.prototype.startMoveTile = function (data, callBack) {
            //异步的移动动作
            this.disAbleBtn();
            var promiseVec = [];
            promiseVec.push(this.moveAllTile(data.direction));
            Promise.all(promiseVec).then(function () {
                callBack && callBack();
            });
        };
        GameView.prototype.finishMoveTile = function (data) {
            this.activeBtn();
        };
        GameView.prototype.disAbleBtn = function () {
            this.btn_up.enabled = false;
            this.btn_down.enabled = false;
            this.btn_letf.enabled = false;
            this.btn_right.enabled = false;
        };
        GameView.prototype.moveAllTile = function (direction) {
            var _this = this;
            var self = this;
            var cell, tile;
            return new Promise(function (resolve, reject) {
                // this.getConfig(direction);
                var promiseVec = [];
                var vector = _this.getVector(direction); //方向
                var traversals = _this.buildTraversals(vector);
                var moved = false;
                _this.prepareTiles(); //移动之前的状态标记
                traversals.x.forEach(function (x) {
                    traversals.y.forEach(function (y) {
                        cell = { x: x, y: y };
                        tile = self.c_grid.cellContent(cell);
                        if (tile) {
                            var positions = self.findFarthestPosition(cell, vector);
                            var next = self.c_grid.cellContent(positions.next);
                            // Only one merger per row traversal?
                            if (next && next.value === tile.value && !next.mergedFrom) {
                                var merged = new game.Tile(positions.next.x, positions.next.y, tile.value * 2);
                                merged.mergedFrom = [tile, next];
                                self.c_grid.insertTile(merged);
                                self.c_grid.removeTile(tile);
                                // Converge the two tiles' positions
                                // tile.updatePosition(positions.next);
                                // Update the score
                                // self.score += merged.value;
                                // The mighty 2048 tile
                                // if (merged.value === 2048) self.won = true;
                            }
                            else {
                                promiseVec.push(self.moveTile(tile, positions.farthest));
                            }
                            // if (!self.positionsEqual(cell, tile)) {
                            //     moved = true; // The tile moved from its original cell!
                            // }
                        }
                    });
                });
                //@version 1.0
                // this.m_Tiles.forEach(tile => {
                //     if (tile.wishPoint) {
                //         promiseVec.push(this.asyncMove(tile));
                //     }
                // });
                Promise.all(promiseVec).then(function () {
                    resolve();
                    // this.active
                    // this.mergeTiles(direction);
                    _this.activeBtn();
                });
            });
        };
        GameView.prototype.moveTile = function (tile, farthest) {
            return new Promise(function (resolve) {
                tile.moveTo(farthest).call(function () {
                    resolve();
                });
            });
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
                    index = 0;
                    break;
                }
                case "right": {
                    index = 1;
                    break;
                }
                case "down": {
                    index = 2;
                    break;
                }
                case "left": {
                    index = 3;
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
                traversals.x = traversals.x.reverse(); //倒装？
            if (vector.y === 1)
                traversals.y = traversals.y.reverse();
            return traversals;
        };
        GameView.prototype.prepareTiles = function () {
            this.c_grid.eachCell(function (x, y, tile) {
                if (tile) {
                    tile.mergedFrom = null;
                    tile.savePosition();
                }
            });
        };
        /**
         * 合并拼图
         * */
        GameView.prototype.mergeTiles = function (direction) {
            //检测是否能够合并
            while (this.adjustMerge(direction)) {
            }
        };
        GameView.prototype.adjustMerge = function (direction) {
            var back = false;
            //也要分辨方向
            return back;
        };
        GameView.prototype.asyncMove = function (tile) {
            return new Promise(function (resolve, reject) {
                if (tile.wishPoint) {
                    egret.Tween.get(tile).to({ x: tile.wishPoint.y * game.PIECE_WIDTH + 42, y: tile.wishPoint.x * game.PIECE_WIDTH + 120 }, 100).call(function () {
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
            //消除以及合并
        };
        GameView.prototype.activeBtn = function () {
            this.btn_up.enabled = true;
            this.btn_down.enabled = true;
            this.btn_letf.enabled = true;
            this.btn_right.enabled = true;
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
