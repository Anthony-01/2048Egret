namespace game {

    export interface IAction {
        bLock: boolean,                 //动画锁
        nKind: EActionType,             //动画类型
        actions?: EActionType[],        //子动作类型
        data: any,                      //数据类型,动画所需要的各种数据
        start: number
    }

    export enum EActionType { //动作类型
        AK_GAME_BEGIN   =   0,        //游戏开始动画,
        AK_APPEAR_TILE  =   1,        //生成随机棋子
        AK_PIECE_MOVE   =   2,        //棋子移动动作
    }

    export class GameEngine extends model.GameModel{

        private static m_Instance: GameEngine;

        //动作队列
        public _actionList: IAction[] = [];

        /**
         * 游戏引擎单例
         * */
        public static getIns() {
            if (null == this.m_Instance) {
                this.m_Instance = new GameEngine();
                this.m_Instance.init();
            }
            return this.m_Instance;
        }


        public m_StartScene: StartScene;


        /**
         * 游戏引擎初始化
         * */
        private init() {
            // this.setGameView(new GameView());
            this.m_StartScene = new StartScene();
            this._gameView = new GameView();
        }

        /**
         * 初始化游戏,将开始界面替换进舞台
         * */
        initGame() {
            manager.FrameManager.getInstance().setCurrentScene(this.m_StartScene);
        }

        /**
         * 开始游戏
         * */
        startGame() {
            manager.FrameManager.getInstance().replaceScene(this._gameView, true);
            //将开始游戏动作导入动作队列
            //游戏开始动作
            this.pushAction(EActionType.AK_GAME_BEGIN);
            //生成随机棋子的动作
            this.pushAction(EActionType.AK_APPEAR_TILE);
        }

        /**
         * 添加游戏动作
         * */
        pushAction(kind: EActionType, data?: any) {
            let myData = {};
            if (data) {
                myData = data;
            }
            let action: IAction = {
                bLock: false,
                nKind: kind,
                data: data,
                start: Date.now()
            };
            this._actionList.push(action);
            this.beginGameAction();
        }

        /**
         * 执行动作队列
         * */
        private beginGameAction() {
            let action = this._actionList[0];
            if (null == action || action.bLock) {
                console.log("%c当前动作:", "color: red; font-size: 1.5em");
                console.log(action);
                let now = Date.now();
                let time = now - action.start;
                console.log("持续时间:", time / 1000);
                if (time > 5000) { //移除长时间动作
                    this._actionList.splice(0, 1);
                    this.beginGameAction();
                }
                return; //bLock动作锁(表示该动作正在执行)
            }

            action.bLock = true;

            switch(action.nKind) {
                case EActionType.AK_GAME_BEGIN   :{
                    this.startGameBegin(action);
                    break;
                }
                case EActionType.AK_APPEAR_TILE   :{
                    this.startAppearTile(action);
                    break;
                }
                case EActionType.AK_PIECE_MOVE     :{
                    this.startMoveTiles(action);
                    break;
                }
            }
        }

        private removeGameAction(bContinue?: boolean) {
            let action = this._actionList[0];
            if (null == action || !action.bLock) return;

            let nkind: number = action.nKind;

            switch (nkind) {
                case EActionType.AK_GAME_BEGIN: {
                    this.finishGameBegin(action);
                    break;
                }
                case EActionType.AK_PIECE_MOVE     :{
                    this.finishMoveTile(action);
                    break;
                }
            }

            //移除队列
            this._actionList.splice(0, 1);

            //下一动作
            if (bContinue == true && this._actionList.length > 0) {
                this.beginGameAction();
            }
        }

        private startGameBegin(action: IAction) {
            let callBack = () => {
                this.removeGameAction(true);
            };
            this._gameView && this._gameView.startGameBegin(action.data, callBack);
        }

        private finishGameBegin(action: IAction) {
            this._gameView && this._gameView.finishGameBegin(action.data);
        }

        private startAppearTile(action: IAction) {
            let callBack = () => {
                this.removeGameAction(true);
            };
            this._gameView && this._gameView.startAppearTile(callBack);
        }

        private startMoveTiles(action: IAction) {
            let callBack = () => {
                this.removeGameAction(true);
                this.pushAction(EActionType.AK_APPEAR_TILE);
            };
            this._gameView && this._gameView.startMoveTile(action.data, callBack);
        }

        private finishMoveTile(action) {
            this._gameView && this._gameView.finishMoveTile(action.data);
        }

    }
}