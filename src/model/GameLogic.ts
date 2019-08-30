namespace game {
    /**
     * 定义数据接口 5 X 5 的棋盘
     * 是否定义成二维数组的形式
     */
    export const C_BOARD_MAX = 5;
    export interface IBoard {

    }

    let table: Array<Array<ITile>> = [];

    //mergedFrom
    export interface ITile {
        x: number,
        y: number,
        value: number,
        merge?: boolean,
        mergedFrom?: Array<ITile>
    }

    export interface IMove {
        origin: IPosition,
        add: boolean,
        goal: IPosition,
        merge: boolean
    }

    export interface IPosition {
        x: number,
        y: number
    }

    enum EVector {
        negative = -1,
        zero = 0,
        positive = 1
    }

    export interface IVector {
        x: EVector,
        y: EVector
    }

    const C_VectorMap = {
        0: { x: -1,  y: 0 }, // Up
        1: { x: 0,  y: 1 },  // Right
        2: { x: 1,  y: 0 },  // Down
        3: { x: 0, y: -1 }   // Left
    };

    // 0: { x: 0,  y: -1 }, // Up
    //     1: { x: 1,  y: 0 },  // Right
    //     2: { x: 0,  y: 1 },  // Down
    //     3: { x: -1, y: 0 }   // Left

    //build
    export interface IBuild {
        x: Array<number>,
        y: Array<number>
    }

    const C_BUILD = {
        x: [0, 1, 2, 3, 4],
        y: [0, 1, 2, 3, 4]
    }

    
    //需要知道那些牌合并，牌的最终位置，value, x, y;最终的board；牌是否已经进行合并
    export class GameLogic {

        /**
         * 返回所有牌的origin、last
         * @param actionType 移动的方向
         * @param grid 
         */
        public getBoard(actionType: EMoveDirection, grid: Array<Array<number>>): IMove[] {
            let back = [];
            let board = this.toBoard(grid);
            if (board) {
                let vector = this.getVector(actionType);
                let build = this.getBuild(vector);
                //找到最边缘的棋子
                build.x.forEach(x => { //4-0
                    build.y.forEach(y => { //0-4
                        let tile = board[x][y];
                        let next = this.getNext(x, y, board, vector);
                        if (tile.value) {
                            //方向问题，x-y方向与数组方向不同
                            //
                            //&& tile.value == next.value && !tile.mergedFrom
                            //标记移动： egret.Point: origin goal
                            //合并标记:  tile.merge: true 被合并
                            //增量标记:  next
                            let move: IMove
                            if (tile.value == next.value && next.mergedFrom.length == 0) {
                                // tile.merge = true;
                                next.value *= 2;
                                next.mergedFrom.push(tile);
                                board[x][y] = this.getInitTile(x, y, null);
                                move = {
                                    origin: {
                                        x: tile.x,
                                        y: tile.y
                                    },
                                    goal: {
                                        x: next.x,
                                        y: next.y
                                    },
                                    merge: true,
                                    add: true
                                }
                                // back.push(move);
                                
                            } else {
                                board[x][y] = this.getInitTile(x, y, null);
                                let goal: IPosition = {
                                    x: next.value ? next.x - vector.x : next.x,
                                    y: next.value ? next.y - vector.y : next.y
                                } 
                                if (goal.x != tile.x || goal.y != tile.y) {
                                    
                                    board[goal.x][goal.y] = tile;
                                    move= {
                                        origin: {
                                            x: tile.x,
                                            y: tile.y
                                        },
                                        goal: goal,
                                        merge: false,
                                        add: false
                                    }
                                    tile.x = goal.x;
                                    tile.y = goal.y;
                                    
                                }
                                
                            }
                            move && back.push(move);
                        }
                    })
                })
                return back;
            }
            
        }

        private getNext(x: number, y: number, board: Array<Array<ITile>>, vector: IVector): ITile {
            //(x + n * vector.x) < C_BOARD_MAX && (y + n * vector.y) < C_BOARD_MAX
            for(let n = 1;this.withinBounds(x + n * vector.x, y + n * vector.y); n++) {
                if (board[x + n * vector.x][y + n * vector.y].value != null) return board[x + n * vector.x][y + n * vector.y];
            }
            return this.getLimit(x, y, board, vector);
        }

        //返回边界
        private getLimit(x: number, y: number, board: Array<Array<ITile>>, vector: IVector): ITile {
            let limitX = vector.x == 0 ? x : (vector.x == 1 ? C_BOARD_MAX - 1 : 0);
            let limitY = vector.y == 0 ? y : (vector.y == 1 ? C_BOARD_MAX - 1 : 0);
            return {
                x: limitX,
                y: limitY,
                value: null
            };
        }

        public withinBounds(x: number, y: number) {
            return x >= 0 && x < SIZE &&
                y >= 0 && y < SIZE;
        }

        /**
         * 
         * @param actionType 方向
         * @return 方向向量
         */
        private getVector(actionType: EMoveDirection): IVector {
            return C_VectorMap[actionType];
        }

        private getBuild(vector: IVector): IBuild {
            // let vector = this.getVector(actionType);
            let build = {
                x: C_BUILD.x.concat(),
                y: C_BUILD.y.concat()
            }
            if (vector.x === 1) build.x.reverse();
            if (vector.y === 1) build.y.reverse();

            return build;
        }

        /**
         * 返回空缺的位置
         * @param grid 
         */
        public getVancancyPosition(grid: Array<Array<number>>): ITile[] {
            let back = [];

            if (!this.checkBoard(grid)) {
                console.log("")
                return [];
            }
            for (let row in grid) {
                grid[row].forEach((value, col) => {
                    if (value == 0) {
                        let tile: ITile = {
                            x: parseInt(row),
                            y: col,
                            value: 0
                        }
                        back.push(tile);
                    }
                })
            }
            return back;
        }

        private toBoard(grid: Array<Array<number>>): Array<Array<ITile>> {
            let board: Array<Array<ITile>> = []; 
            if (this.checkBoard(grid)) {
                for (let row in grid) {
                    let ary = [];
                    grid[row].forEach((value, col) => {
                        if (value !== 0) {
                            let tile: ITile = {
                                x: parseInt(row),
                                y: col,
                                value: value,
                                merge: false,
                                mergedFrom: []
                            }
                            ary[col] = tile;
                        }
                    })
                    board.push(ary);
                }
                return board;
            } else {
                console.error("棋盘数据错误:", grid);
                return null;
            }
        }

        private getInitTile(x: number, y: number, value: number): ITile {
            return {
                x: x,
                y: y,
                value: value,
                merge: false,
                mergedFrom: []
            }
        }

        private checkBoard(grid: Array<Array<number>>): boolean {
            if (grid.length != C_BOARD_MAX) {
                console.error("棋盘数据错误:", grid);
                return false;
            }
            for (let row of grid) {
                if (row.length != C_BOARD_MAX) {
                    console.error("棋盘数据错误:", grid);
                    return false;
                }
            }
            return true;
        }

        

    }
}