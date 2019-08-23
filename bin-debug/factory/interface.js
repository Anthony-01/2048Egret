var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var factory;
(function (factory) {
    var TileFactory = (function () {
        function TileFactory() {
        }
        TileFactory.prototype.createTile = function (x, y, value) {
            return new game.Tile(x, y, value);
        };
        return TileFactory;
    }());
    factory.TileFactory = TileFactory;
    __reflect(TileFactory.prototype, "factory.TileFactory", ["factory.tileFactory"]);
})(factory || (factory = {}));
