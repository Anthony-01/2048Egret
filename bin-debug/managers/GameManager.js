var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var manager;
(function (manager) {
    var GameManager = (function () {
        function GameManager() {
        }
        GameManager.prototype.init = function () {
            this.m_storageManager = new manager.StorageManager();
            //
            this.c_grid = new game.Grid(new game.GameView());
            this.setup();
        };
        GameManager.prototype.setup = function () {
        };
        GameManager.prototype.findFarthestPosition = function (cell, vector) {
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
        //将tile移动至指定方位
        GameManager.prototype.moveTile = function (tile, cell) {
            this.c_grid.cells[tile.x][tile.y] = null;
            this.c_grid.cells[cell.x][cell.y] = tile;
            tile.updatePosition();
        };
        GameManager.prototype.positionsEqual = function (first, second) {
            return first.x === second.x && first.y === second.y;
        };
        return GameManager;
    }());
    manager.GameManager = GameManager;
    __reflect(GameManager.prototype, "manager.GameManager");
})(manager || (manager = {}));
