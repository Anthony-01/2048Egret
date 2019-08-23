var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var Tiles = (function () {
        function Tiles(main) {
            this.m_myTiles = [];
        }
        Tiles.prototype.getPositionTile = function (point) {
            this.m_myTiles.forEach(function (tile, index) {
                if (point == tile.Point) {
                    return {
                        tile: tile, index: index
                    };
                }
            });
        };
        Tiles.prototype.push = function (tile) {
            this.m_myTiles.push(tile);
            this.m_main.addChild(tile);
        };
        Tiles.prototype.remove = function (point) {
            var info = this.getPositionTile(point).tile;
            this.m_main.removeChild(info.tile);
            this.m_myTiles.splice(info.index);
        };
        return Tiles;
    }());
    game.Tiles = Tiles;
    __reflect(Tiles.prototype, "game.Tiles");
})(game || (game = {}));
