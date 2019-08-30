namespace component {
    export const PIECE_WIDTH = 111;
    export const TILE_LENGTH = 5;
    export const SIZE = 5;
    export class GridHandle extends base.BaseComponent {


        constructor() {
            super();
        }

        protected init() {

        }

        private _tileAry: Array<Array<number>> = [];
        private _tiles: {[name: string]: game.Tile} = {};
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

        /**
         * 
         * @param x 代表棋盘中的纵向坐标
         * @param y 
         * @param value 
         */
        addTile(x: number, y: number, value: game.GameValue) {
            let tile = new game.Tile(x, y, value);
            this._tiles["" + x + y] = tile;
            this.tiles["" + x + y] = tile;
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

        private clearMerge() {
            for(let tile in this._tiles) {
                this._tiles[tile].savePosition();
            }
        }

        public moveTile(direction: string): Promise<any> {
            return
        }

        private moveAllTile(direction: string): Promise<any> {
            return new Promise((resolve, reject) => {
                this.clearMerge();
                this.getConfig(direction);//将所有
                let promiseVec = [];
                //@version 1.0
                for(let index in this._tiles) {
                    let tile = this._tiles[index];
                    if (tile.wishPoint) {
                        promiseVec.push(this.asyncMove(tile));
                    }
                }
                Promise.all(promiseVec).then(() => {
                    resolve();
                })
            })
        }

        private mergeTiles(direction: string): Promise<any> {
            //检测是否能够合并
            this.adjustMerge(direction);//合并一次
            //再移动一次
            return this.moveAllTile(direction);
        }

        private adjustMerge(direction: string): boolean {
            let back = false;
            let vector = this.getVector(direction);
            let build = this.buildTraversals(vector);

            //右边，x 从大到小，y
            //此时已经全部归于一个方向
            build.x.forEach(x => {
                build.y.forEach(y => {
                    //如果有tile，并且下一个tile的值相等，进行合并
                    let tile = this.getTile(x, y);
                    let next = this.getTile(x - vector.x, y - vector.y);
                    if (tile && next && tile.value == next.value && !tile.mergedFrom) {
                        let merge = new game.Tile(tile.Point.x, tile.Point.y, tile.value + 1);
                        merge.mergedFrom = [tile, next];
                        // this.m_Tiles.push(merge);
                        this._tiles["" + tile.Point.x + tile.Point.y] = merge;
                        this.addChild(merge);
                        this._tileAry[tile.Point.x][tile.Point.y] = tile.value + 1;
                        this._tileAry[next.Point.x][next.Point.y] = 0;

                        this.removeTile(tile);
                        this.removeTile(next);
                    }
                })
            });
            return back;
        }

        private removeTile(tile) {
            delete this._tiles[tile.point.x][tile.point.y];

            // let index;
            // index = this.m_Tiles.indexOf(tile);
            // if (index >= 0) {
            //     this.removeChild(this.m_Tiles.splice(index, 1)[0]);
            //     return true;
            // } else {
            //     return false;
            // }
        }

        private getVector(direction: string) {
            // Vectors representing tile movement
            // 0: up, 1: right, 2: down, 3: left
            let index: number;
            switch (direction) {
                case "up" : {
                    index = 3;
                    break;
                }
                case "right": {
                    index = 2;
                    break;
                }
                case "down" : {
                    index = 1;
                    break;
                }
                case "left" : {
                    index = 0;
                    break;
                }
            }
            let map = {
                0: { x: 0,  y: -1 }, // Up
                1: { x: 1,  y: 0 },  // Right
                2: { x: 0,  y: 1 },  // Down
                3: { x: -1, y: 0 }   // Left
            };

            return map[index];
        }

        private buildTraversals(vector: any) {
            let traversals = { x: [], y: [] };

            for (let pos = 0; pos < SIZE; pos++) {
                traversals.x.push(pos);
                traversals.y.push(pos);
            }

            // Always traverse from the farthest cell in the chosen direction
            if (vector.x === 1) traversals.x = traversals.x.reverse();
            if (vector.y === 1) traversals.y = traversals.y.reverse();

            return traversals;
        }

        private getConfig(direction: string): any[] {
            let back = [];
            //行标识
            let row = false;
            //左标识
            let forward = false;
            //将所有能够移动的全部移动到一侧
            switch (direction) {
                case "up" : {
                    row = false;
                    forward = false;
                    break;
                }
                case "down" : {
                    row = false;
                    forward = true;
                    break;
                }
                case "left" : {
                    row = true;
                    forward = false;
                    break;
                }
                case "right" : {
                    row = true;
                    forward = true;
                    break;
                }
            }
            this.changeData(row, forward);

            return back;


        }

        private getTile(x: number, y: number): game.Tile {
            let need = null;
            for (let index in this._tiles) {
                let myTile = this._tiles[index];
                if (myTile.Point.x == x && myTile.Point.y == y) {
                    need = myTile;
                }
            }
            // this.m_Tiles.forEach(myTile => {
            //     if (myTile.Point.x == x && myTile.Point.y == y) {
            //         need = myTile;
            //     }
            // });
            return need;
        }

        private asyncMove(tile: game.Tile) {

        }

        private changeData(row: boolean, forward: boolean) {
            let right: number;
            if (forward) {
                right = -1;
            } else {
                right = 1;
            }


            if (row) {
                for (let n = 0; n < 5; n++) { // 左右
                    let leftTile = null;
                    for (let m = forward ? 4 : 0; m >= 0 && m <= 4; m = m + right) {
                        if (this._tileAry[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._tileAry[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (let index in this._tiles) {
                                let tile = this._tiles[index];
                                let point = tile.Point;
                                if (point.x == n && point.y == m && tile.wishPoint == null) {
                                    tile.wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._tileAry[leftTile.x][leftTile.y] = this._tileAry[point.x][point.y];
                                    this._tileAry[point.x][point.y] = 0;
                                    // n = leftTile.x;
                                    m = leftTile.y;
                                    leftTile = null;
                                    break;
                                }
                            }

                            // }
                        }
                    }
                }
            } else {
                //如何处理上下
                for (let m = 0; m < 5; m++) { // 上下
                    let leftTile = null;
                    for (let n = forward ? 4 : 0; n >= 0 && n <= 4; n = n + right) {
                        if (this._tileAry[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }

                        if (this._tileAry[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (let index in this._tiles) {
                                let tile = this._tiles[index];
                                let point = tile.Point;
                                if (point.x == n && point.y == m && tile.wishPoint == null) {
                                    tile.wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._tileAry[leftTile.x][leftTile.y] = this._tileAry[point.x][point.y];
                                    this._tileAry[point.x][point.y] = 0;
                                    n = leftTile.x;
                                    // m = leftTile.y;
                                    leftTile = null;
                                    break;
                                }
                            }
                            // for (let j = 0; j < this.m_Tiles.length; j++) {
                            //     let point = this.m_Tiles[j].Point;
                            //     if (point.x == n && point.y == m && this.m_Tiles[j].wishPoint == null) {
                            //         this.m_Tiles[j].wishPoint = new egret.Point(leftTile.x, leftTile.y);
                            //         this._tileAry[leftTile.x][leftTile.y] = this._tileAry[point.x][point.y];
                            //         this._tileAry[point.x][point.y] = 0;
                            //         n = leftTile.x;
                            //         // m = leftTile.y;
                            //         leftTile = null;
                            //         break;
                            //     }
                            // }
                            // }
                        }
                    }
                }
            }

            // //消除以及合并
            
        }

        //根据配置生成棋子
        initBoard(grid: any[]) {

        }

        //如何根据origin中的内容找到tile
        //1、对象形式，索引作为对象的键key，tile对应键对应的tile，需要delete，然后重新赋值
        //2、创建一个相同的二维数组，根据键值赋予tile对象
        private tiles: {[key: string]: game.Tile} = {};

        moveTiles(move: any[]): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                let promiseVec = [];
                move.forEach((data) => {
                    let tile = this.tiles["" + data.origin.x + data.origin.y];
                    promiseVec.push(tile.moveTo(data).then(() => {
                        if (data.merge) {
                            self.removeChild(tile);
                            delete self.tiles["" + data.origin.x + data.origin.y];
                            let goal = this.tiles["" + data.goal.x + data.goal.y];
                            goal.gameView = goal.gameView * 2;
                        } else {
                            delete self.tiles["" + data.origin.x + data.origin.y];
                            self.tiles["" + data.goal.x + data.goal.y] = tile;
                        }
                    }));
                })
                Promise.all(promiseVec).then(() => {
                    console.log(self.tiles);
                    resolve();
                }).catch((err) => {
                    console.error("棋子移动出现问题:", err);
                })
            })
        }

        /**
         * 重置整个handle,包括tile的引用等
         */
        reset() {
            // const form = {
            //     id: '011',
            //     name: '测试一',
            //     description: '测试demo'
            //    }
          
          // 目标: 取到删除description属性的对象, 即下文的data
          //方法一:
        //   let data = (({id, name}) =>({id, name}))(form);
        }
    }
}