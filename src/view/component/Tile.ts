namespace game {

    export enum GameValue {
        one = 1,
        two = 2,
        three = 4,
        four = 8,
        five = 16,
        six = 32,
        seven = 64,
        eight = 128,
        nine = 256,
        ten = 512,
        eleven = 1024
    }

    const PIECE_WIDTH = 111;

    const TILE_SOURCE = "tile_json";

    export class Tile extends base.BaseComponent {
        public _gameValue: GameView;

        constructor(x: number, y: number, value: GameView) {
            super();
            this.point = new egret.Point(x, y);
            this.gameView = value;
            this.drawPiece();
        }

        private _backImage: eui.Image;

        set gameView(value) {
            this._gameValue = value;
            this._backImage.width = this._backImage.height = PIECE_WIDTH;
            this._backImage.source = RES.getRes(`${TILE_SOURCE}.${value}`);
            this.addChild(this._backImage);
        }

        private cachePoint: egret.Point;

        set point(point: egret.Point){
            this.cachePoint = point;
            this.x = point.x * PIECE_WIDTH - PIECE_WIDTH / 2;
            this.y = point.y * PIECE_WIDTH - PIECE_WIDTH / 2;
        }

        get Point():egret.Point{
            return this.cachePoint;
        }

        private drawPiece() {

        }
    }
}