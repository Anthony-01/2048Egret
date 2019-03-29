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

    export const PIECE_WIDTH = 111;

    const TILE_SOURCE = "tile_json";

    export class Tile extends base.BaseComponent {
        public _gameValue: GameValue;

        constructor(x: number, y: number, value: GameValue) {
            super();
            this.point = new egret.Point(x, y);
            this.wishPoint = null;
            this.gameView = value;
            this.drawPiece();
        }

        private _backImage: eui.Image;

        set gameView(value) {
            this._backImage && this.removeChild(this._backImage);
            this._backImage = null;
            this._gameValue = value;
            this._backImage = new eui.Image();
            this._backImage.width = this._backImage.height = PIECE_WIDTH;
            this._backImage.source = RES.getRes(`tile_${value}`);
            this.addChild(this._backImage);
        }

        //得到棋子的值
        get value() {
            return this._gameValue;
        }

        private cachePoint: egret.Point;

        set point(point: egret.Point){
            this.cachePoint = point;
            this.x = this.Point.x * PIECE_WIDTH + 42;
            this.y = this.Point.y * PIECE_WIDTH + 120;
        }

        get Point():egret.Point{
            return this.cachePoint;
        }

        private drawPiece() {
            // this.x = this.Point.x * PIECE_WIDTH + 42;
            // this.y = this.Point.y * PIECE_WIDTH + 120;
        }

        private _wishPoint: egret.Point;

        set wishPoint(point: egret.Point) {
            this._wishPoint = point;
        }

        get wishPoint() {
            return this._wishPoint;
        }

        public serialize() {
            return {
                position: {
                    x: this.cachePoint.x,
                    y: this.cachePoint.y
                },
                value: this._gameValue
            };
        }

        private previousPosition: egret.Point;
        public mergedFrom: any;//合并前的棋子信息
        //保存移动之前的坐标并且设置mergedFrom为null
        public savePosition() {
            this.mergedFrom = null;
            this.previousPosition = this.cachePoint;
        }

        public updatePosition(cell: egret.Point) {
            this.point = cell;
        }

        public moveTo(position: any): egret.Tween {
            let wish = {
                x : position.x * PIECE_WIDTH + 42,
                y : position.y * PIECE_WIDTH + 120
            };
            return egret.Tween.get(this).to(wish, 1000, egret.Ease.quartInOut).call(() => {
                this.point = new egret.Point(position.x, position.y);
            })
        }
    }
}