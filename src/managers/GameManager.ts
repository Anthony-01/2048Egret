namespace manager {

    export class GameManager {

        private m_inputManager: any;
        private m_storageManager: StorageManager;
        private m_actuator: any;//根据数据生成视图效果

        private c_grid: game.Grid;

        init() {
            this.m_storageManager = new StorageManager();


            //
            this.c_grid = new game.Grid(new game.GameView());
            this.setup();
        }

        private setup() {

        }

        private findFarthestPosition(cell: any, vector) {
            let previous;

            // Progress towards the vector direction until an obstacle is found
            do {
                previous = cell;
                cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
            } while (this.c_grid.withinBounds(cell) && this.c_grid.cellAvailable(cell));//下一步不越界并且没有被占用

            return {
                farthest: previous,
                next: cell // Used to check if a merge is required(检测是否需要合并)
            };
        }



        //将tile移动至指定方位
        private moveTile(tile: game.Tile, cell: any) {
            this.c_grid.cells[tile.x][tile.y] = null;
            this.c_grid.cells[cell.x][cell.y] = tile;
            tile.updatePosition();
        }

        private positionsEqual(first: any, second: any) {
            return first.x === second.x && first.y === second.y;
        }
    }
}