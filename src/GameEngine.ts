namespace game {

    export interface IAction {
        bLock: boolean,                 //动画锁
        nKind: EActionType,             //动画类型
        actions?: EActionType[],        //子动作类型
        data: any,                      //数据类型,动画所需要的各种数据
        start: number
    }

    export enum EActionType {         //动作类型
        AK_GAME_BEGIN   =   0,        //游戏开始动画
        AK_APPEAR_TILE  =   1,        //生成随机棋子
        AK_PIECE_MOVE   =   2,        //棋子移动动作
    }

    export class GameEngine extends model.GameModel{

        private static m_Instance: GameEngine;

        //动作队列
        public _actionList: IAction[] = [];

        //
        private _actionQueqe: any[] = [];

        private _actionMaster: ActionExecutor;

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


        /**，sawn， you are my baby as y
         * 游戏引擎初始化
         * */
        private init() {
            this._gameHost = new GameHost();
        }

        // private _actionList: any[] = [];

        runGame() {
            this._gameView ? this._gameHost.setView(this._gameView) : console.warn("未初始化游戏视图");
            this._gameHost.addEventListener(customEvent.ModelEvent.EVENT_ACTION_COMPLETE, this.actionComplete, this);
            this._gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            this._gameHost.startGame();
            let command = new ActionCommand(this, () => {
                return new Promise((resolve) => {
                    console.log("游戏开始");
                })
            })
            command.actionType = EActionType.start;
            this._gameHost.applyAction(command);
            //构造开始游戏的命令
            // let command = new ActionCommand(this._gameView, this._gameView.startGame)构造命令时，不能绕过数据

            // this._gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            //游戏网络部分的
            manager.TimerCtrl.getInstance().createTimer(this, 1000 / 60, 0, this.onUpdate, "gameUpdate");
        }

        private actionComplete() {
            let command = this._actionQueqe.shift();
            if (command) {
                this._gameHost.applyAction(command);
            }
            
        }

        //gameEngine的游戏职能，是否需要将动作队列移动至gamehost
        private move(event: egret.Event) { 

            //游戏移动,命令模式
            let data: ActionCommand = event.data;
            // console.log(data);
            // data.addListener(ActionCommand.EVENT_COMPLETE, this.onMoveComplete, this);
            // data.execute();
            //host验证动作=>执行

            //通过host验证后上传服务器
            this._actionQueqe.push(data);

            if (this._gameHost.status == EActionStatus.ready) {
                let command = this._actionQueqe.shift();
                this._gameHost.applyAction(command);
            }
            // this._gameHost.applyAction(data);
        }

        private onMoveComplete() {
            console.log("事件完成!");
        }
        onResetEngine() {
            this._gameHost.removeEventListener(customEvent.ModelEvent.EVENT_ACTION_COMPLETE, this.actionComplete, this);
            this._gameView.removeEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            manager.TimerCtrl.getInstance().killTimer(this, "gameUpdate");
        }

    }
}