namespace game {
    export interface IGameHost {
        gameView: egret.DisplayObjectContainer;
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
    export class GameHost implements IGameHost {
        //游戏视图
        public gameView: egret.DisplayObjectContainer;

        //游戏的状态管理
        private _gameStatus: EGameStatus = EGameStatus.ready;
        //玩家的动作状态(进行移动过程中进来移动动作过滤，进行其他动作时候移动动作排队)
        private _actionStatus: EActionStatus;
        //游戏的数据管理
        private _grid: Grid;

        private _actionMaster: game.ActionExecutor;

        //游戏的规则中心
        private _rule: any;

        constructor() {
            this._actionMaster = new ActionExecutor();
            this._actionMaster.host = this;
        }

        startGame() {
            this._gameStatus = EGameStatus.on;
            this._actionStatus = EActionStatus.ready;
            // this._grid = new Grid();
        }


        //使用代理来过滤游戏动作过程中的其他动作
        //实现后撤功能
        private _commandStack: ActionCommand[] = [];

        assertAction(command: ActionCommand):boolean {
            //动作使用策略模式

            //首先处于准备状态
            return this._actionStatus == EActionStatus.ready;
        }

        applyAction(command: ActionCommand):void {
            this._actionStatus = EActionStatus.on;
            command.addListener(ActionCommand.EVENT_COMPLETE, this.onComplete, this);
            command.execute();
            this._commandStack.push(command);
        }

        private onComplete() {
            this._actionStatus = EActionStatus.ready;
        }

        setView(view: egret.DisplayObjectContainer) {
            this.gameView = view;
        }
    }
}