namespace game {
    export const SIZE = 5;
    export interface ITileData {
        x: number,
        y: number,
        value: GameValue
    }
    export class Grid {

        public cells: any[];
        private m_main: egret.DisplayObjectContainer;

        private _gameLogic: GameLogic;

        constructor(main?: egret.DisplayObjectContainer, grid?: number[][]) {
            if (main) {
                this.m_main = main;
            }
            grid ? this.fromState(grid) : this.empty();
        }

        public getGrid() {
            return this.cells;
        }

        startGame() {
            this.addRandomTile();
        }

        addRandomTile() {
            let vacancies = this.getVacancyPositions();
            if (vacancies.length) {
                let position = vacancies[Math.floor(Math.random() * vacancies.length)];
                let value = Math.random() < 0.9 ? 1 : 2;
                this.insertTile(position.x, position.y, value);
                let tile: ITileData = {
                    x: position.x,
                    y: position.y,
                    value: value
                }
                return tile;
            } else {
                console.log("无空位可添加棋子");
                return null;
            }
        }

        private getVacancyPositions() {
            let back: egret.Point[] = [];
            //遍历整个棋盘
            for (let n = 0; n < C_BOARD_MAX; n++) {
                for (let m = 0; m < C_BOARD_MAX; m++) {
                    if (this.isVacancy(n, m) == true) {
                        back.push(new egret.Point(n, m));
                    }
                }
            }

            return back;
        }

        /**
         * 是否空缺
         * @param x 
         * @param y 
         */
        private isVacancy(x: number, y: number): boolean {
            return this.cells[x][y] == null || this.cells[x][y] == 0;
        }


        /**
         * 根据配置文件生成棋盘
         * */
        private fromState(grid: any[]) {
            let cells = [];

            for (let x = 0; x < SIZE; x++) {
                let row = cells[x] = [];

                for (let y = 0; y < SIZE; y++) {
                    let tile = grid[x][y];
                    row.push(tile ? new Tile(tile.position.x, tile.position.y,  tile.value) : null);
                }
            }

            this.cells = cells;
            return cells;
        }
        /**
         * 随机生成新的棋盘
         * */
        private empty() {
            let cells = [];

            for (let x = 0; x < SIZE; x++) {
                let row = cells[x] = [];

                for (let y = 0; y < SIZE; y++) {
                    row.push(null);
                }
            }
            this.cells = cells;
            return cells;
        }

        public serialize() {
            let cellState = [];

            for (let x = 0; x < SIZE; x++) {
                let row = cellState[x] = [];

                for (let y = 0; y < SIZE; y++) {
                    row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
                }
            }

            return {
                size: SIZE,
                cells: cellState
            };
        }

        //移动之前棋子状态标记
        public eachCell(callBack: Function) {
            for (let x = 0; x < SIZE; x++) {
                for (let y = 0; y < SIZE; y++) {
                    callBack(x, y, this.cells[x][y]);
                }
            }
        }

        //得到棋盘中cell位置的棋子
        public cellContent(cell: any) {
            if (this.withinBounds(cell)) {
                return this.cells[cell.x][cell.y];
            } else {
                return null;
            }
        }

        //坐标是否越界
        public withinBounds(position: any) {
            return position.x >= 0 && position.x < SIZE &&
                position.y >= 0 && position.y < SIZE;
        }

        public cellAvailable(cell: any) {
            return !this.cellOccupied(cell);
        }

        private cellOccupied(cell: any) {
            return !!this.cellContent(cell);
        }


        /**
         * 插入棋子
         * */
        public insertTile(x: number, y: number,tile: number) {
            this.cells[x][y] = tile;
        }

        public removeTile(x, y) {
            console.log(`移除${x + "," + y}`);
            this.cells[x][y] = null;
        }

        public cellsAvailable() {
            return !!this.availableCells().length;
        }

        private availableCells() {
            let cells = [];

            this.eachCell(function (x, y, tile) {
                if (!tile) {
                    cells.push({ x: x, y: y });
                }
            });

            return cells;
        }

        public randomAvailableCell() {
            let cells = this.availableCells();

            if (cells.length) {
                return cells[Math.floor(Math.random() * cells.length)];
            }
        }

        //移动棋子
        public moveTile(tile: any, cell: any) {
            let temp = this.cells[tile.x][tile.y];
            this.cells[tile.x][tile.y] = null;
            this.cells[cell.x][cell.y] = temp;
        }
    }
}