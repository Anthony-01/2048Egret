var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    game.SIZE = 5;
    var Grid = (function () {
        function Grid(main, grid) {
            this.m_main = main;
            grid ? this.fromState(grid) : this.empty();
        }
        /**
         * 根据配置文件生成棋盘
         * */
        Grid.prototype.fromState = function (grid) {
            var cells = [];
            for (var x = 0; x < game.SIZE; x++) {
                var row = cells[x] = [];
                for (var y = 0; y < game.SIZE; y++) {
                    var tile = grid[x][y];
                    row.push(tile ? new game.Tile(tile.position.x, tile.position.y, tile.value) : null);
                }
            }
            this.cells = cells;
            return cells;
        };
        /**
         * 随机生成新的棋盘
         * */
        Grid.prototype.empty = function () {
            var cells = [];
            for (var x = 0; x < game.SIZE; x++) {
                var row = cells[x] = [];
                for (var y = 0; y < game.SIZE; y++) {
                    row.push(null);
                }
            }
            this.cells = cells;
            return cells;
        };
        Grid.prototype.serialize = function () {
            var cellState = [];
            for (var x = 0; x < game.SIZE; x++) {
                var row = cellState[x] = [];
                for (var y = 0; y < game.SIZE; y++) {
                    row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
                }
            }
            return {
                size: game.SIZE,
                cells: cellState
            };
        };
        //移动之前棋子状态标记
        Grid.prototype.eachCell = function (callBack) {
            for (var x = 0; x < game.SIZE; x++) {
                for (var y = 0; y < game.SIZE; y++) {
                    callBack(x, y, this.cells[x][y]);
                }
            }
        };
        //得到棋盘中cell位置的棋子
        Grid.prototype.cellContent = function (cell) {
            if (this.withinBounds(cell)) {
                return this.cells[cell.x][cell.y];
            }
            else {
                return null;
            }
        };
        //坐标是否越界
        Grid.prototype.withinBounds = function (position) {
            return position.x >= 0 && position.x < game.SIZE &&
                position.y >= 0 && position.y < game.SIZE;
        };
        Grid.prototype.cellAvailable = function (cell) {
            return !this.cellOccupied(cell);
        };
        Grid.prototype.cellOccupied = function (cell) {
            return !!this.cellContent(cell);
        };
        /**
         * 插入棋子
         * */
        Grid.prototype.insertTile = function (x, y, tile) {
            this.cells[x][y] = tile;
        };
        Grid.prototype.removeTile = function (x, y) {
            console.log("\u79FB\u9664" + (x + "," + y));
            this.cells[x][y] = null;
        };
        Grid.prototype.cellsAvailable = function () {
            return !!this.availableCells().length;
        };
        Grid.prototype.availableCells = function () {
            var cells = [];
            this.eachCell(function (x, y, tile) {
                if (!tile) {
                    cells.push({ x: x, y: y });
                }
            });
            return cells;
        };
        Grid.prototype.randomAvailableCell = function () {
            var cells = this.availableCells();
            if (cells.length) {
                return cells[Math.floor(Math.random() * cells.length)];
            }
        };
        //移动棋子
        Grid.prototype.moveTile = function (tile, cell) {
            var temp = this.cells[tile.x][tile.y];
            this.cells[tile.x][tile.y] = null;
            this.cells[cell.x][cell.y] = temp;
            // let newCell = new egret.Point(cell.x, cell.y);
            // tile.updatePosition(newCell);
        };
        return Grid;
    }());
    game.Grid = Grid;
    __reflect(Grid.prototype, "game.Grid");
})(game || (game = {}));
