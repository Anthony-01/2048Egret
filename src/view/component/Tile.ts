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

    export const C_MOVE_TIME = 500;


    export class Tile extends base.BaseComponent {
        public _gameValue: GameValue;
        private m_states = 0;

        constructor(x: number, y: number, value: GameValue) {
            super();
            this.point = new egret.Point(x, y);
            // this.wishPoint = this.Point;
            this.gameView = value;
            this.updatePosition();
            // this.wishPoint = this.point;
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

        private cachePoint: egret.Point;//当前棋子的位置

        set point(point: egret.Point) {
            this.cachePoint = point;
            // this.x = this.Point.x * PIECE_WIDTH + 42;
            // this.y = this.Point.y * PIECE_WIDTH + 120;
        }

        get Point():egret.Point{
            // if (this._wishPoint) {
            //     return this.wishPoint;
            // } else {
                return this.cachePoint;
            // }
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

        public previousPosition: egret.Point;
        public mergedFrom: any = null;//合并前的棋子信息
        //保存移动之前的坐标并且设置mergedFrom为null
        public savePosition() {
            this.mergedFrom = null;
            this.previousPosition = this.cachePoint;
        }

        public updatePosition() {
            this.x = this.Point.y * PIECE_WIDTH;
            this.y = this.Point.x * PIECE_WIDTH;
        }


        public m_readyToRemove:boolean = false;

        public moveTo(data: any): Promise<any> {
            return new Promise((resolve, reject) => {
                egret.Tween.get(this).to({x: data.goal.y * PIECE_WIDTH, y: data.goal.x * PIECE_WIDTH}, C_MOVE_TIME, egret.Ease.quadIn).call(() => {
                    if (data.merge == true) {
                        this.visible = false;
                    }
                    this.point = new egret.Point(data.goal.x, data.goal.y);
                    resolve();
                })
            })
        }

        //更改Tile的数据
        
    }
}