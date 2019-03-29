namespace game {
    export class GameView extends base.BaseScene{

        public score:eui.Label;
        public btn_up:eui.Button;
        public btn_down:eui.Button;
        public btn_letf:eui.Button;
        public btn_right:eui.Button;


        constructor() {
            super("GameScene");
        }

        onComplete() {
            super.onComplete();
        }

        initBtn() {
            this.btn_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_down.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_letf.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_right.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
        }

        private onMove(e: egret.TouchEvent) {
            let name = e.currentTarget;
            // console.log(name);
            switch(name.label) {
                case "上" : {
                    GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "up"});
                    break;
                }
                case "下" : {
                    GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "down"});
                    break;
                }
                case "左" : {
                    GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "left"});
                    break;
                }
                case "右" : {
                    GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "right"});
                    break;
                }
            }
        }

        /**
         * 游戏开始动作
         * @param data 游戏开始数据
         * */
        public startGameBegin(data: any, callBack?: Function) {

            this.initTable();
            callBack && callBack();
        }

        public startAppearTile(callBack: Function) {
            //从棋盘中没有棋子的位置随机生成一个棋子
            // let positions = this.getPositions();
            // let position = positions[Math.floor(Math.random() * positions.length)];
            // this.appearOneTile(position);
            this.addRandomTile();


            callBack && callBack();
        }

        private addRandomTile() {
            if (this.c_grid.cellsAvailable()) {
                let value = Math.random() < 0.9 ? 1 : 2;
                let point = this.c_grid.randomAvailableCell();
                let tile = new Tile(point.x, point.y, value);
                // this.addChild(tile);

                this.c_grid.insertTile(tile);
            }
        }

        private m_Tiles: Tile[] = [];

        private appearOneTile(point: egret.Point) {
            this._pieceContainer[point.x][point.y] = 1;
            let tile = new Tile(point.x, point.y, 1);
            this.m_Tiles.push(tile);
            this.addChild(tile);
        }

        private getPositions(): egret.Point[] {
            let back: egret.Point[] = [];
            //遍历整个棋盘
            for (let n = 0; n < 5; n++) {
                for (let m = 0; m < 5; m++) {
                    if (this.isTile(n, m) == false) {
                        back.push(new egret.Point(n, m));
                    }
                }
            }

            return back;
        }

        private isTile(x: number, y: number): boolean {
            return this._pieceContainer[x][y] == 1;
        }

        // private _pieceContainer: eui.Group;
        /**
         * 棋盘数组
         * 0 - 无棋子
         * 1 - 有棋子
         * 42\120
         * */
        private _pieceContainer: any[] = [];

        private c_grid: Grid;
        /**
         * 初始化棋盘
         * */
        private initTable() {
            // for (let n = 0; n < 5; n++) {
            //     this._pieceContainer[n] = [];
            //     for (let m = 0; m < 5; m++) {
            //         this._pieceContainer[n][m] = 0;
            //     }
            // }
            //
            // console.log(this._pieceContainer);

            this.c_grid = new Grid(this);//初始化棋盘
        }

        startMoveTile(data: any, callBack: Function) {
            //异步的移动动作
            this.disAbleBtn();
            let promiseVec = [];
            promiseVec.push(this.moveAllTile(data.direction));


            Promise.all(promiseVec).then(() => {
                callBack && callBack();
            });
        }

        finishMoveTile(data: any) {
            this.activeBtn();
        }

        private disAbleBtn() {
            this.btn_up.enabled = false;
            this.btn_down.enabled = false;
            this.btn_letf.enabled = false;
            this.btn_right.enabled = false;
        }

        private moveAllTile(direction: string): Promise<any> {
            let self = this;
            let cell, tile;
            return new Promise((resolve, reject) => {
                // this.getConfig(direction);
                let promiseVec = [];

                let vector     = this.getVector(direction);//方向
                let traversals = this.buildTraversals(vector);
                let moved      = false;

                this.prepareTiles();//移动之前的状态标记

                traversals.x.forEach(function (x) {
                    traversals.y.forEach(function (y) {
                        cell = { x: x, y: y };
                        tile = self.c_grid.cellContent(cell);

                        if (tile) {
                            let positions = self.findFarthestPosition(cell, vector);
                            let next      = self.c_grid.cellContent(positions.next);

                            // Only one merger per row traversal?
                            if (next && next.value === tile.value && !next.mergedFrom) {
                                let merged = new Tile(positions.next.x, positions.next.y, tile.value * 2);
                                merged.mergedFrom = [tile, next];

                                self.c_grid.insertTile(merged);
                                self.c_grid.removeTile(tile);

                                // Converge the two tiles' positions
                                // tile.updatePosition(positions.next);

                                // Update the score
                                // self.score += merged.value;

                                // The mighty 2048 tile
                                // if (merged.value === 2048) self.won = true;
                            } else {
                                promiseVec.push(self.moveTile(tile, positions.farthest))
                            }

                            // if (!self.positionsEqual(cell, tile)) {
                            //     moved = true; // The tile moved from its original cell!
                            // }
                        }
                    });
                });

                //@version 1.0
                // this.m_Tiles.forEach(tile => {
                //     if (tile.wishPoint) {
                //         promiseVec.push(this.asyncMove(tile));
                //     }
                // });
                Promise.all(promiseVec).then(() => {
                    resolve();
                    // this.active
                    // this.mergeTiles(direction);
                    this.activeBtn();
                })
            })
        }

        private moveTile(tile: Tile, farthest): Promise<any> {
            return new Promise(resolve => {
                tile.moveTo(farthest).call(() => {
                    resolve();
                })
            })
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

        private getVector(direction: string) {
            // Vectors representing tile movement
            // 0: up, 1: right, 2: down, 3: left
            let index: number;
            switch (direction) {
                case "up" : {
                    index = 0;
                    break;
                }
                case "right": {
                    index = 1;
                    break;
                }
                case "down" : {
                    index = 2;
                    break;
                }
                case "left" : {
                    index = 3;
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
            if (vector.x === 1) traversals.x = traversals.x.reverse();//倒装？
            if (vector.y === 1) traversals.y = traversals.y.reverse();

            return traversals;
        }

        private prepareTiles() {
            this.c_grid.eachCell(function (x, y, tile) {
                if (tile) {
                    tile.mergedFrom = null;
                    tile.savePosition();
                }
            });
        }

        /**
         * 合并拼图
         * */
        private mergeTiles(direction: string) {
            //检测是否能够合并
            while(this.adjustMerge(direction)) {

            }
        }

        private adjustMerge(direction: string): boolean {
            let back = false;
            //也要分辨方向

            return back;
        }

        private asyncMove(tile: Tile): Promise<any> {
            return new Promise((resolve, reject) => {
                if (tile.wishPoint) {
                    egret.Tween.get(tile).to({x: tile.wishPoint.y * PIECE_WIDTH + 42, y: tile.wishPoint.x * PIECE_WIDTH + 120}, 100).call(() => {
                        tile.point = tile.wishPoint;
                        tile.wishPoint = null;
                        resolve();
                    });
                } else {
                    resolve();
                }
            })
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
                        if (this._pieceContainer[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._pieceContainer[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (let j = 0; j < this.m_Tiles.length; j++) {
                                let point = this.m_Tiles[j].Point;
                                if (point.x == n && point.y == m && this.m_Tiles[j].wishPoint == null) {
                                    this.m_Tiles[j].wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._pieceContainer[leftTile.x][leftTile.y] = this._pieceContainer[point.x][point.y];
                                    this._pieceContainer[point.x][point.y] = 0;
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
                        if (this._pieceContainer[n][m] == 0 && leftTile == null) {
                            leftTile = new egret.Point(n, m);
                        }
                        if (this._pieceContainer[n][m] != 0 && leftTile != null) {
                            // if (leftTile && leftTile.y > m) {
                            for (let j = 0; j < this.m_Tiles.length; j++) {
                                let point = this.m_Tiles[j].Point;
                                if (point.x == n && point.y == m && this.m_Tiles[j].wishPoint == null) {
                                    this.m_Tiles[j].wishPoint = new egret.Point(leftTile.x, leftTile.y);
                                    this._pieceContainer[leftTile.x][leftTile.y] = this._pieceContainer[point.x][point.y];
                                    this._pieceContainer[point.x][point.y] = 0;
                                    n = leftTile.x;
                                    // m = leftTile.y;
                                    leftTile = null;
                                    break;
                                }
                            }
                            // }
                        }
                    }
                }
            }

            //消除以及合并

        }

        private activeBtn() {
            this.btn_up.enabled = true;
            this.btn_down.enabled = true;
            this.btn_letf.enabled = true;
            this.btn_right.enabled = true;
        }

        /**
         * 游戏开始结束
         * */
        public finishGameBegin(data: any) {

        }

        //释放内存
        dealloc() {

        }
    }
}