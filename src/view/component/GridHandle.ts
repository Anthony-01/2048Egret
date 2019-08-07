namespace component {
    export const PIECE_WIDTH = 111;
    export const TILE_LENGTH = 5;
    export class GridHandle extends base.BaseComponent {


        constructor() {
            super();
        }

        protected init() {

        }

        private _tileAry: Array<Array<number>> = [];
        private _tiles: {[name: string]: game.Tile};
        private c_grid: game.Grid;

        initTable() {
            for (let n = 0; n < TILE_LENGTH; n++) {
                this._tileAry[n] = [];
                for (let m = 0; m < TILE_LENGTH; m++) {
                    this._tileAry[n].push(0)
                }
            }
            this.c_grid = new game.Grid(this);
            console.log("grid:", this._tileAry);
        }

        addTile(x: number, y: number, value: game.GameValue) {
            let tile = new game.Tile(x, y, value);
            this._tiles["" + x + y] = tile;
            this.addChild(tile);
        }

        addRandomTile() {
            let vacancies = this.getVacancyPositions();
            if (vacancies.length) {
                let position = vacancies[Math.floor(Math.random() * vacancies.length)];
                let value = Math.random() < 0.9 ? 1 : 2;
                this.addTile(position.x, position.y, value);
            } else {
                console.log("无空位可添加棋子");
            }
        }

        private getVacancyPositions() {
            let back: egret.Point[] = [];
            //遍历整个棋盘
            for (let n = 0; n < 5; n++) {
                for (let m = 0; m < 5; m++) {
                    if (this.isVacancy(n, m) == false) {
                        back.push(new egret.Point(n, m));
                    }
                }
            }

            return back;
        }

        private isVacancy(x: number, y: number): boolean {
            return this._tileAry[x][y] != 0;
        }
    }
}