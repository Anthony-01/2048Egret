namespace game {

    export interface IActionExecutor {

    }

    //动作对象使用命令模式进行,策略

    export interface IActionProcessor {}

    let C_PROCESSOR_MAP: {[action: number]: IActionProcessor};
    //各类共用动作执行表
    function initProcess() {
        C_PROCESSOR_MAP = {
            
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

        applyAction() {

        }

        cancelAction() {
            
        }
    }
}