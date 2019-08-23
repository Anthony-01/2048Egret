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
    var GameValue;
    (function (GameValue) {
        GameValue[GameValue["one"] = 1] = "one";
        GameValue[GameValue["two"] = 2] = "two";
        GameValue[GameValue["three"] = 4] = "three";
        GameValue[GameValue["four"] = 8] = "four";
        GameValue[GameValue["five"] = 16] = "five";
        GameValue[GameValue["six"] = 32] = "six";
        GameValue[GameValue["seven"] = 64] = "seven";
        GameValue[GameValue["eight"] = 128] = "eight";
        GameValue[GameValue["nine"] = 256] = "nine";
        GameValue[GameValue["ten"] = 512] = "ten";
        GameValue[GameValue["eleven"] = 1024] = "eleven";
    })(GameValue = game.GameValue || (game.GameValue = {}));
    game.PIECE_WIDTH = 111;
    var Tile = (function (_super) {
        __extends(Tile, _super);
        function Tile(x, y, value) {
            var _this = _super.call(this) || this;
            _this.m_states = 0;
            _this.mergedFrom = null; //合并前的棋子信息
            _this.m_readyToRemove = false;
            _this.point = new egret.Point(x, y);
            // this.wishPoint = this.Point;
            _this.gameView = value;
            _this.updatePosition();
            return _this;
            // this.wishPoint = this.point;
        }
        Object.defineProperty(Tile.prototype, "gameView", {
            set: function (value) {
                this._backImage && this.removeChild(this._backImage);
                this._backImage = null;
                this._gameValue = value;
                this._backImage = new eui.Image();
                this._backImage.width = this._backImage.height = game.PIECE_WIDTH;
                this._backImage.source = RES.getRes("tile_" + value);
                this.addChild(this._backImage);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "value", {
            //得到棋子的值
            get: function () {
                return this._gameValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "point", {
            set: function (point) {
                this.cachePoint = point;
                // this.x = this.Point.x * PIECE_WIDTH + 42;
                // this.y = this.Point.y * PIECE_WIDTH + 120;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "Point", {
            get: function () {
                // if (this._wishPoint) {
                //     return this.wishPoint;
                // } else {
                return this.cachePoint;
                // }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "wishPoint", {
            get: function () {
                return this._wishPoint;
            },
            set: function (point) {
                this._wishPoint = point;
            },
            enumerable: true,
            configurable: true
        });
        Tile.prototype.serialize = function () {
            return {
                position: {
                    x: this.cachePoint.x,
                    y: this.cachePoint.y
                },
                value: this._gameValue
            };
        };
        //保存移动之前的坐标并且设置mergedFrom为null
        Tile.prototype.savePosition = function () {
            this.mergedFrom = null;
            this.previousPosition = this.cachePoint;
        };
        Tile.prototype.updatePosition = function () {
            this.x = this.Point.y * game.PIECE_WIDTH;
            this.y = this.Point.x * game.PIECE_WIDTH;
        };
        return Tile;
    }(base.BaseComponent));
    game.Tile = Tile;
    __reflect(Tile.prototype, "game.Tile");
})(game || (game = {}));
