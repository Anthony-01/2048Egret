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
var component;
(function (component) {
    component.PIECE_WIDTH = 111;
    component.TILE_LENGTH = 5;
    component.SIZE = 5;
    var GridHandle = (function (_super) {
        __extends(GridHandle, _super);
        function GridHandle() {
            var _this = _super.call(this) || this;
            _this._tileAry = [];
            _this._tiles = {};
            return _this;
        }
        GridHandle.prototype.init = function () {
        };
        GridHandle.prototype.initTable = function () {
            for (var n = 0; n < component.TILE_LENGTH; n++) {
                this._tileAry[n] = [];
                for (var m = 0; m < component.TILE_LENGTH; m++) {
                    this._tileAry[n].push(0);
                }
            }
            this.c_grid = new game.Grid(this);
            console.log("grid:", this._tileAry);
        };
        GridHandle.prototype.addTile = function (x, y, value) {
            var tile = new game.Tile(x, y, value);
            this._tiles["" + x + y] = tile;
            this.addChild(tile);
        };
        GridHandle.prototype.addRandomTile = function () {
            var vacancies = this.getVacancyPositions();
            if (vacancies.length) {
                var position = vacancies[Math.floor(Math.random() * vacancies.length)];
                var value = Math.random() < 0.9 ? 1 : 2;
                this.addTile(position.x, position.y, value);
            }
            else {
                console.log("无空位可添加棋子");
            }
        };
        GridHandle.prototype.getVacancyPositions = function () {
            var back = [];
            //遍历整个棋盘
            for (var n = 0; n < 5; n++) {
                for (var m = 0; m < 5; m++) {
                    if (this.isVacancy(n, m) == false) {
                        back.push(new egret.Point(n, m));
                    }
                }
            }
            return back;
        };
        GridHandle.prototype.isVacancy = function (x, y) {
            return this._tileAry[x][y] != 0;
        };
        GridHandle.prototype.clearMerge = function () {
            for (var tile in this._tiles) {
                this._tiles[tile].savePosition();
            }
        };
        GridHandle.prototype.moveTile = function (direction) {
            return;
        };
        GridHandle.prototype.moveAllTile = function (direction) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.clearMerge();
                _this.getConfig(direction); //将所有
                var promiseVec = [];
                //@version 1.0
                for (var index in _this._tiles) {
                    var tile = _this._tiles[index];
                    if (tile.wishPoint) {
                        promiseVec.push(_this.asyncMove(tile));
                    }
                }
                Promise.all(promiseVec).then(function () {
                    resolve();
                });
            });
        };
        GridHandle.prototype.mergeTiles = function (direction) {
            //检测是否能够合并
            this.adjustMerge(direction); //合并一次
            //再移动一次
            return this.moveAllTile(direction);
        };
        GridHandle.prototype.adjustMerge = function (direction) {
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
                        // this.m_Tiles.push(merge);
                        _this._tiles["" + tile.Point.x + tile.Point.y] = merge;
                        _this.addChild(merge);
                        _this._tileAry[tile.Point.x][tile.Point.y] = tile.value + 1;
                        _this._tileAry[next.Point.x][next.Point.y] = 0;
                        _this.removeTile(tile);
                        _this.removeTile(next);
                    }
                });
            });
            return back;
        };
        GridHandle.prototype.removeTile = function (tile) {
            delete this._tiles[tile.point.x][tile.point.y];
            // let index;
            // index = this.m_Tiles.indexOf(tile);
            // if (index >= 0) {
            //     this.removeChild(this.m_Tiles.splice(index, 1)[0]);
            //     return true;
            // } else {
            //     return false;
            // }
        };
        GridHandle.prototype.getVector = function (direction) {
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
        GridHandle.prototype.buildTraversals = function (vector) {
            var traversals = { x: [], y: [] };
            for (var pos = 0; pos < component.SIZE; pos++) {
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
        GridHandle.prototype.getConfig = function (direction) {
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
        GridHandle.prototype.getTile = function (x, y) {
            var need = null;
            for (var index in this._tiles) {
                var myTile = this._tiles[index];
                if (myTile.Point.x == x && myTile.Point.y == y) {
                    need = myTile;
                }
            }
            // this.m_Tiles.forEach(myTile => {
            //     if (myTile.Point.x == x && myTile.Point.y == y) {
            //         need = myTile;
            //     }
            // });
            return need;
        };
        GridHandle.prototype.asyncMove = function (tile) {
        };
        GridHandle.prototype.changeData = function (row, forward) {
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
                        if (this._tileAry[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._tileAry[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (var index in this._tiles) {
                                var tile = this._tiles[index];
                                var point = tile.Point;
                                if (point.x == n && point.y == m && tile.wishPoint == null) {
                                    tile.wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._tileAry[leftTile.x][leftTile.y] = this._tileAry[point.x][point.y];
                                    this._tileAry[point.x][point.y] = 0;
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
                        if (this._tileAry[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._tileAry[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (var index in this._tiles) {
                                var tile = this._tiles[index];
                                var point = tile.Point;
                                if (point.x == n && point.y == m && tile.wishPoint == null) {
                                    tile.wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._tileAry[leftTile.x][leftTile.y] = this._tileAry[point.x][point.y];
                                    this._tileAry[point.x][point.y] = 0;
                                    n = leftTile.x;
                                    // m = leftTile.y;
                                    leftTile = null;
                                    break;
                                }
                            }
                            // for (let j = 0; j < this.m_Tiles.length; j++) {
                            //     let point = this.m_Tiles[j].Point;
                            //     if (point.x == n && point.y == m && this.m_Tiles[j].wishPoint == null) {
                            //         this.m_Tiles[j].wishPoint = new egret.Point(leftTile.x, leftTile.y);
                            //         this._tileAry[leftTile.x][leftTile.y] = this._tileAry[point.x][point.y];
                            //         this._tileAry[point.x][point.y] = 0;
                            //         n = leftTile.x;
                            //         // m = leftTile.y;
                            //         leftTile = null;
                            //         break;
                            //     }
                            // }
                            // }
                        }
                    }
                }
            }
            // //消除以及合并
        };
        return GridHandle;
    }(base.BaseComponent));
    component.GridHandle = GridHandle;
    __reflect(GridHandle.prototype, "component.GridHandle");
})(component || (component = {}));
