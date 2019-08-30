namespace game {
    export interface IGameHost {
        // gameView: egret.DisplayObjectContainer;
        m_grid: Grid;
        m_commandStack: Array<ActionCommand>;

        assertAction(data: any);
        applyAction(data: any);
    }

    export enum EGameStatus {
        ready,  //准备环节
        on,     //游戏进行环节
        over    //计分等环节
    }

    //动作封装成命令
    export enum EActionStatus {
        ready,  //动作准备环节
        on      //动作进行环节
    }

    /**
     * 是否将游戏数据和游戏动作区分开来?
     */
    export class GameHost extends egret.DisplayObject implements IGameHost  {
        //游戏视图
        private gameView: game.GameView;

        //游戏的状态管理
        private _gameStatus: EGameStatus = EGameStatus.ready;
        //玩家的动作状态(进行移动过程中进来移动动作过滤，进行其他动作时候移动动作排队)
        private _actionStatus: EActionStatus;
        //游戏的数据管理
        public m_grid: Grid;

        private _actionMaster: game.ActionExecutor;

        //游戏的规则中心
        private _rule: any;

        //动作队列
        private _actionList: ActionCommand[] = [];

        //使用代理来过滤游戏动作过程中的其他动作,已经实施的动作
        //实现后撤功能
        public m_commandStack: ActionCommand[] = [];

        private _gameLogic: GameLogic;

        get status(): EActionStatus {
            return this._actionStatus;
        }

        constructor() {
            super();
            this._actionMaster = new ActionExecutor();
            this._actionMaster.host = this;
            this._gameLogic = new GameLogic();
        }

        startGame() { //开始可能包含动画等，是一个异步过程
            if (!this.gameView) return console.error("开始游戏失败,未设置游戏视图");
            this._gameStatus = EGameStatus.on;
            this._actionStatus = EActionStatus.ready;
            this.m_grid = new Grid();
            // this.updateView();
            // this.gameView.startGame(this.m_grid.getGrid());
            //封装一个命令，pushAction中
            // manager.TimerCtrl.getInstance().createTimer(this, 1000 / 60, 0, this.onUpdate, "gameUpdate");
            // let start = new ActionCommand(this, this.subStartGame);
        }

        /**
         * 外部传入游戏命令
         * @param command 游戏命令
         */
        onGameMessage(command: ActionCommand) {

            this._actionList.push(command);
            if (this._actionStatus == EActionStatus.ready) {
                this.applyAction(this._actionList[0]);
            }
        }

        private move(event: egret.Event) { 

            //游戏移动,命令模式
            let data: ActionCommand = event.data;
            console.log(data);
            this._actionList.push(data);
        }

        assertAction(command: ActionCommand): boolean {
            //动作使用策略模式

            //首先处于准备状态
            return this._actionStatus == EActionStatus.ready;
        }

        private _currentCommand: ActionCommand;

        applyAction(command: ActionCommand): void {
            this._actionStatus = EActionStatus.on;
            command.addListener(ActionCommand.EVENT_COMPLETE, this.onComplete, this);
            this._currentCommand = command;
            // this._actionMaster.applyAction(command, this);
            // command.execute();
            let promise: (...ary) => Promise<any>;
            switch(command.actionType) {
                case EActionType.start: {
                    promise = this.subStartGame;
                    break;
                }
                case EActionType.move: {
                    promise = this.subMoveTile;
                }
            }
            promise.call(this, command.actionData).then(() => {
                command.trigger(ActionCommand.EVENT_COMPLETE);
                this.m_commandStack.push(command);
            }).catch((err) => {
                console.log(err);
                command.trigger(ActionCommand.EVENT_COMPLETE);
            })
            

            //grid的改变
        }

        private onComplete() {
            let command = this._currentCommand;
            command.removeListener(ActionCommand.EVENT_COMPLETE, this.onComplete, this);
            this._actionStatus = EActionStatus.ready;
            this.dispatchEventWith(customEvent.ModelEvent.EVENT_ACTION_COMPLETE);
            this._currentCommand = null;
        }

        private subStartGame(): Promise<any> {
            let tile = this.m_grid.addRandomTile();

            return this.gameView.startGame(tile);
        }

        private subMoveTile(direction: EMoveDirection): Promise<any> {
            let grid = this.m_grid.getGrid();
            let moves = this._gameLogic.getBoard(direction, grid);
            return this.gameView.moveTiles(moves);
        }

        setView(view: game.GameView) {
            this.gameView = view;
            // this.gameView.addEventListener()
            // this.gameView.addEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            // this.updateView();
        }
 
        //移除host监听的游戏View事件
        removeView() {
            // this.gameView.removeEventListener(customEvent.ViewEvent.EVENT_MOVE_EVENT, this.move, this);
            // manager.TimerCtrl.getInstance().killTimer(this, "gameUpdate");
        }

        private updateView() {
            // let grid = this.m_grid.getGrid();
            this.gameView.updateView();
            if (this._actionStatus == EActionStatus.ready) {
                let command = this._actionList[0];
                command && this.applyAction(command);
            }
        }

        //执行动作队列
        private onUpdate() {
            this.updateView();
        }

        //重置gameHost
        reset() {

        }
    }
}