namespace game {

    export interface IActionExecutor {

    }

    //动作对象使用命令模式进行,策略

    export interface IActionProcessor {
        assertAction(command: IActionCommand, host: any): boolean;
        applyAction(command: IActionCommand, host: any): void;
    }

    let C_PROCESSOR_MAP: {[action: number]: IActionProcessor};
    //各类共用动作执行表
    function initProcess() {
        let moveProcessor = new MoveProcessor();
        C_PROCESSOR_MAP = {
            [EActionType.start]: moveProcessor
        }
    } 

    //context类
    export class ActionExecutor implements IActionExecutor {
        //动作执行者宿主
        public host: IGameHost; 

        private _processorMap: {[action: number]: IActionProcessor};

        constructor() {
            if (!C_PROCESSOR_MAP) {
                initProcess();
            }
            this._processorMap = C_PROCESSOR_MAP;
        }

        assertAction() {

        }

        applyAction(command: ActionCommand, host: GameHost) {
            let type = command.actionType;
            // let board = grid.getGrid();
            let processor = this._processorMap[type];
            if (processor.assertAction(command, host)) {
                processor.applyAction(command, host);
            } else {
                console.error("动作验证失败", command.actionType);
            }
        }

        cancelAction() {
            
        }
    }
}