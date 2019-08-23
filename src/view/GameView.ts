namespace game {
    export class GameView extends base.BaseScene{

        public bg:eui.Image;
        public score:eui.Label;
        public btn_up:eui.Button;
        public btn_down:eui.Button;
        public btn_letf:eui.Button;
        public btn_right:eui.Button;
        public gameTime:component.GameTimeHandle;
        public gridHandle:component.GridHandle;
        public btn_return: eui.Button;




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
            this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
        }

        removeBtn() {
            this.btn_up.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_down.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_letf.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_right.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMove, this);
            this.btn_return.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
        }



        /*
        * 初始化组件
        * */
        init() {
            console.log("gameView初始化!");
            //生成各个子部件
            // GameEngine.getIns().pushAction(EActionType.AK_GAME_BEGIN);
            //生成随机棋子的动作
            // GameEngine.getIns().pushAction(EActionType.AK_APPEAR_TILE);
        }

        private onMove(e: egret.TouchEvent) {
            let command = new ActionCommand(this.bg, () => {
                return new Promise((resolve, reject) => {
                    console.log("命令一");
                    resolve();
                })
            })
            command.actionType = EActionType.move;
            
            let name = e.currentTarget;
            // console.log(name);
            switch(name.label) {
                case "上" : {
                    command.moveDirection = EMoveDirection.up;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "up"});
                    break;
                }
                case "下" : {
                    command.moveDirection = EMoveDirection.down;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "down"});
                    break;
                }
                case "左" : {
                    command.moveDirection = EMoveDirection.left;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "left"});
                    break;
                }
                case "右" : {
                    command.moveDirection = EMoveDirection.right;
                    // GameEngine.getIns().pushAction(EActionType.AK_PIECE_MOVE, {direction: "right"});
                    break;
                }
            }
            this.dispatchEventWith(customEvent.ViewEvent.EVENT_MOVE_EVENT, false, command);
        }

        private onReturn() {
            this.dispatchEventWith(customEvent.ViewEvent.EVENT_RETURN_EVENT);
        }

        /**
         * 游戏开始动作,使用回调函数的形式进行动作队列
         * @param data 游戏开始数据
         * */
        public startGameBegin(data: any, callBack?: Function) {
            //初始化棋盘
            this.initTable();
            this.gridHandle.initTable();
            callBack && callBack();
        }

        public startAppearTile(callBack: Function) {
            this.gridHandle.addRandomTile();

            //从棋盘中没有棋子的位置随机生成一个棋子
            let positions = this.getPositions();
            let position = positions[Math.floor(Math.random() * positions.length)];
            this.appearOneTile(position);
            // this.addRandomTile();

            callBack && callBack();
        }


        private addRandomTile() {
            if (this.c_grid.cellsAvailable()) {
                let value = Math.random() < 0.9 ? 1 : 2;
                let point = this.c_grid.randomAvailableCell();
                let tile = new Tile(point.x, point.y, value);
                // this.addChild(tile);

                this.c_grid.insertTile(point.x, point.y, value);//数据
                this.m_Tiles.push(tile);
                this.addChild(tile);
            }
        }

        private m_Tiles: Tile[] = [];

        private appearOneTile(point: egret.Point) {
            let value = Math.random() < 0.9 ? 1 : 2;
            this._pieceContainer[point.x][point.y] = value;
            let tile = new Tile(point.x, point.y, value);
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
            return this._pieceContainer[x][y] != 0;
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
            for (let n = 0; n < 5; n++) {
                this._pieceContainer[n] = [];
                for (let m = 0; m < 5; m++) {
                    this._pieceContainer[n][m] = 0;
                }
            }

            // console.log(this._pieceContainer);

            this.c_grid = new Grid(this);//初始化棋盘

            // this.addTestTile(3,4,2);
            // this.addTestTile(4,4,4);
            // this.addTestTile(2,4,1);
        }

        startMoveTile(data: any, callBack: Function) {
            //异步的移动动作
            this.disAbleBtn();
            this.clearMerge();
            this.gridHandle.moveTile(data.direction).then(() => {
                this.activeBtn();
                callBack && callBack();
            });
            this.moveAllTile(data.direction).then(() => {
                this.mergeTiles(data.direction).then(() => {

                });

            });


            // Promise.all(promiseVec).then(() => {
            //     callBack && callBack();
            // });
        }

        finishMoveTile(data: any) {
            this.activeBtn();
        }

        private clearMerge() {
            this.m_Tiles.forEach(tile => {
                tile.savePosition();
            })
        }

        private disAbleBtn() {
            this.btn_up.enabled = false;
            this.btn_down.enabled = false;
            this.btn_letf.enabled = false;
            this.btn_right.enabled = false;
        }

        private moveAllTile(direction: string): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                this.getConfig(direction);//将所有
                let promiseVec = [];
                //@version 1.0
                this.m_Tiles.forEach(tile => {
                    if (tile.wishPoint) {
                        promiseVec.push(this.asyncMove(tile));
                    }
                });
                Promise.all(promiseVec).then(() => {
                    resolve();
                    // this.clearRemove();
                    // this.active
                    // this.mergeTiles(direction);
                    this.activeBtn();
                })
            })
        }


        private removeTile(tile) {
            let index;
            index = this.m_Tiles.indexOf(tile);
            if (index >= 0) {
                this.removeChild(this.m_Tiles.splice(index, 1)[0]);
                return true;
            } else {
                return false;
            }
        }

        private getTile(x, y): Tile {
            let self = this;
            let need = null;
            this.m_Tiles.forEach(myTile => {
                if (myTile.Point.x == x && myTile.Point.y == y) {
                    need = myTile;
                }
            });
            return need;
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

        private prepareTiles() {
            let self = this;
            this.c_grid.eachCell(function (x, y, tile) {
                if (tile) {

                }
            });
        }

        /**
         * 合并拼图
         * */
        private mergeTiles(direction: string) {
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
                        let merge = new Tile(tile.Point.x, tile.Point.y, tile.value + 1);
                        merge.mergedFrom = [tile, next];
                        this.m_Tiles.push(merge);
                        this.addChild(merge);
                        this._pieceContainer[tile.Point.x][tile.Point.y] = tile.value + 1;
                        this._pieceContainer[next.Point.x][next.Point.y] = 0;


                        //将merge插入tile位置并且将next删除
                        // this.c_grid.insertTile(tile.x, tile.y, tile.value * 2);
                        // this.c_grid.removeTile(next.x, next.y);

                        this.removeTile(tile);
                        this.removeTile(next);
                    }
                })
            });
            return back;
        }

        private _readyToRemove: Tile[] = [];

        private clearRemove() {
            this._readyToRemove.forEach(tile => {
                this.removeTile(tile);
            })
        }

        private asyncMove(tile: Tile): Promise<any> {
            let self = this;
            return new Promise((resolve, reject) => {
                if (tile.wishPoint) {
                    egret.Tween.get(tile).to({x: tile.wishPoint.y * PIECE_WIDTH + 42, y: tile.wishPoint.x * PIECE_WIDTH + 120}, 300, egret.Ease.	backOut).call(() => {
                        //@version 1.0
                        tile.point = tile.wishPoint;
                        tile.wishPoint = null;
                        resolve();
                    });
                } else {
                    resolve();
                }
            })
        }

        private getAllConfigs(direction: string) {
            let self = this;
            let vector = this.getVector(direction);
            let build = this.buildTraversals(vector);
            this.m_Tiles.forEach(tile => {
                tile.savePosition();
            });//思考，中途新加的点该如何

            build.x.forEach(x => {
                build.y.forEach(y => {
                    let cell = this.getTile(x, y);//get现在位置
                    if (cell) {
                        //传入位置以及方向
                        let position = {
                            x,y
                        };
                        let farthest = this.findFarthestPosition(position, vector);
                        //将棋子移动到最远的距离
                        //数据
                        let origin = {
                            x: x,
                            y: y
                        };
                        this.c_grid.moveTile(origin, farthest.farthest);
                        cell.point = new egret.Point(farthest.farthest.x, farthest.farthest.y);
                        cell.wishPoint = new egret.Point(farthest.farthest.x, farthest.farthest.y);

                        //检测是否需要合并
                        let next = this.getTile(farthest.next.x, farthest.next.y);

                        if (next && next.value === cell.value && !next.mergedFrom) {
                            let merged = new Tile(farthest.next.x, farthest.next.y, cell.value * 2);
                            merged.mergedFrom = [cell, next];
                            self.c_grid.insertTile(farthest.next.x, farthest.next.y, cell.value * 2);
                            self.m_Tiles.push(merged);
                            self.addChild(merged);

                            //消除next
                            self.removeTile(next);
                            // this.c_grid.removeTile(next.Point.x, next.Point.y);//被占用，不用消除
                            //等待动画播放完全以后再消除
                            this.c_grid.removeTile(cell.Point.x, cell.Point.y);
                            // cell.wishPoint = new egret.Point(farthest.farthest.x, farthest.farthest.y);
                            cell.m_readyToRemove = true;
                        }
                    }
                })
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

            // //消除以及合并

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

        public dealloc() {
            super.dealloc();
            
        }


    }
}