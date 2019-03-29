namespace game {
    export const SIZE = 5;
    export class Grid {

        public cells: any[];
        private m_main: GameView;

        constructor(main: GameView,grid?: number[][]) {
            this.m_main = main;
            grid ? this.fromState(grid) : this.empty();
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
        public insertTile(tile: Tile) {
            this.cells[tile.Point.x][tile.Point.y] = tile;
            this.m_main.addChild(tile);
        }

        public removeTile(tile: Tile) {
            this.cells[tile.Point.x][tile.Point.y] = null;
            this.m_main.removeChild(tile);
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
    }
}