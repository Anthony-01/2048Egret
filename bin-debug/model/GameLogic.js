var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    /**
     * 定义数据接口 5 X 5 的棋盘
     * 是否定义成二维数组的形式
     */
    game.C_BOARD_MAX = 5;
    var table = [];
    var EVector;
    (function (EVector) {
        EVector[EVector["negative"] = -1] = "negative";
        EVector[EVector["zero"] = 0] = "zero";
        EVector[EVector["positive"] = 1] = "positive";
    })(EVector || (EVector = {}));
    var C_VectorMap = {
        0: { x: -1, y: 0 },
        1: { x: 0, y: 1 },
        2: { x: 1, y: 0 },
        3: { x: 0, y: -1 } // Left
    };
    var C_BUILD = {
        x: [0, 1, 2, 3, 4],
        y: [0, 1, 2, 3, 4]
    };
    //需要知道那些牌合并，牌的最终位置，value, x, y;最终的board；牌是否已经进行合并
    var GameLogic = (function () {
        function GameLogic() {
        }
        /**
         * 返回所有牌的origin、last
         * @param actionType 移动的方向
         * @param grid
         */
        GameLogic.prototype.getBoard = function (actionType, grid) {
            var _this = this;
            var back = [];
            var board = this.toBoard(grid);
            if (board) {
                var vector_1 = this.getVector(actionType);
                var build_1 = this.getBuild(vector_1);
                //找到最边缘的棋子
                build_1.x.forEach(function (x) {
                    build_1.y.forEach(function (y) {
                        var tile = board[x][y];
                        var next = _this.getNext(x, y, board, vector_1);
                        if (tile.value) {
                            //方向问题，x-y方向与数组方向不同
                            //
                            //&& tile.value == next.value && !tile.mergedFrom
                            //标记移动： egret.Point: origin goal
                            //合并标记:  tile.merge: true 被合并
                            //增量标记:  next
                            var move = void 0;
                            if (tile.value == next.value && next.mergedFrom.length == 0) {
                                // tile.merge = true;
                                next.value *= 2;
                                next.mergedFrom.push(tile);
                                board[x][y] = _this.getInitTile(x, y, null);
                                move = {
                                    origin: {
                                        x: tile.x,
                                        y: tile.y
                                    },
                                    goal: {
                                        x: next.x,
                                        y: next.y
                                    },
                                    merge: true,
                                    add: true
                                };
                                // back.push(move);
                            }
                            else {
                                board[x][y] = _this.getInitTile(x, y, null);
                                var goal = {
                                    x: next.value ? next.x - vector_1.x : next.x,
                                    y: next.value ? next.y - vector_1.y : next.y
                                };
                                if (goal.x != tile.x || goal.y != tile.y) {
                                    board[goal.x][goal.y] = tile;
                                    move = {
                                        origin: {
                                            x: tile.x,
                                            y: tile.y
                                        },
                                        goal: goal,
                                        merge: false,
                                        add: false
                                    };
                                    tile.x = goal.x;
                                    tile.y = goal.y;
                                }
                            }
                            move && back.push(move);
                        }
                    });
                });
                return back;
            }
        };
        GameLogic.prototype.getNext = function (x, y, board, vector) {
            //(x + n * vector.x) < C_BOARD_MAX && (y + n * vector.y) < C_BOARD_MAX
            for (var n = 1; this.withinBounds(x + n * vector.x, y + n * vector.y); n++) {
                if (board[x + n * vector.x][y + n * vector.y].value != null)
                    return board[x + n * vector.x][y + n * vector.y];
            }
            return this.getLimit(x, y, board, vector);
        };
        //返回边界
        GameLogic.prototype.getLimit = function (x, y, board, vector) {
            var limitX = vector.x == 0 ? x : (vector.x == 1 ? game.C_BOARD_MAX - 1 : 0);
            var limitY = vector.y == 0 ? y : (vector.y == 1 ? game.C_BOARD_MAX - 1 : 0);
            return {
                x: limitX,
                y: limitY,
                value: null
            };
        };
        GameLogic.prototype.withinBounds = function (x, y) {
            return x >= 0 && x < game.SIZE &&
                y >= 0 && y < game.SIZE;
        };
        /**
         *
         * @param actionType 方向
         * @return 方向向量
         */
        GameLogic.prototype.getVector = function (actionType) {
            return C_VectorMap[actionType];
        };
        GameLogic.prototype.getBuild = function (vector) {
            // let vector = this.getVector(actionType);
            var build = {
                x: C_BUILD.x.concat(),
                y: C_BUILD.y.concat()
            };
            if (vector.x === 1)
                build.x.reverse();
            if (vector.y === 1)
                build.y.reverse();
            return build;
        };
        /**
         * 返回空缺的位置
         * @param grid
         */
        GameLogic.prototype.getVancancyPosition = function (grid) {
            var back = [];
            if (!this.checkBoard(grid)) {
                console.log("");
                return [];
            }
            var _loop_1 = function (row) {
                grid[row].forEach(function (value, col) {
                    if (value == 0) {
                        var tile = {
                            x: parseInt(row),
                            y: col,
                            value: 0
                        };
                        back.push(tile);
                    }
                });
            };
            for (var row in grid) {
                _loop_1(row);
            }
            return back;
        };
        GameLogic.prototype.toBoard = function (grid) {
            var board = [];
            if (this.checkBoard(grid)) {
                var _loop_2 = function (row) {
                    var ary = [];
                    grid[row].forEach(function (value, col) {
                        if (value !== 0) {
                            var tile = {
                                x: parseInt(row),
                                y: col,
                                value: value,
                                merge: false,
                                mergedFrom: []
                            };
                            ary[col] = tile;
                        }
                    });
                    board.push(ary);
                };
                for (var row in grid) {
                    _loop_2(row);
                }
                return board;
            }
            else {
                console.error("棋盘数据错误:", grid);
                return null;
            }
        };
        GameLogic.prototype.getInitTile = function (x, y, value) {
            return {
                x: x,
                y: y,
                value: value,
                merge: false,
                mergedFrom: []
            };
        };
        GameLogic.prototype.checkBoard = function (grid) {
            if (grid.length != game.C_BOARD_MAX) {
                console.error("棋盘数据错误:", grid);
                return false;
            }
            for (var _i = 0, grid_1 = grid; _i < grid_1.length; _i++) {
                var row = grid_1[_i];
                if (row.length != game.C_BOARD_MAX) {
                    console.error("棋盘数据错误:", grid);
                    return false;
                }
            }
            return true;
        };
        return GameLogic;
    }());
    game.GameLogic = GameLogic;
    __reflect(GameLogic.prototype, "game.GameLogic");
})(game || (game = {}));
