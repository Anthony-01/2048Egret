namespace game {
    export class GameView extends base.BaseScene{


        constructor() {
            super("GameScene");
        }

        onComplete() {
            super.onComplete();
        }

        /**
         * 游戏开始动作
         * @param data 游戏开始数据
         * */
        public startGameBegin(data: any, callBack?: Function) {

            this.initTable();
            callBack && callBack();
        }

        // private _pieceContainer: eui.Group;
        /**
         * 初始化棋盘
         * */
        private initTable() {
            // this._pieceContainer = new eui.Group();
            // this._pieceContainer.x = 42;
            // this._pieceContainer.x = 120;
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