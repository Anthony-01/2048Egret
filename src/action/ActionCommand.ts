namespace game {

    export enum EActionType {
        move
    }

    export enum EMoveDirection {
        up = 0,
        down,
        left,
        right
    }

    export interface IActionCommand {
        // new (component: any, callBack: (...arg) => Promise<any>, params?: any[]): void
    }

    export class ActionCommand implements IActionCommand {

        public static EVENT_COMPLETE: string = "eventComplete";

        public actionType: EActionType;

        public moveDirection: EMoveDirection;

        private _component: any;

        private _callBack: () => Promise<any>;

        private _params: any;

        /**
         * 
         * @param component 执行动作的对象
         */
        constructor(component: any, callBack: (...arg) => Promise<any>, params?: any[]) {
            this._component = component;
            this._callBack = callBack;
            this._params = params;
            
            //记录旧值
        }

        /**
         * 命令执行
         */
        execute() {
            this._callBack.apply(this._component, this._params).then(() => {
                this.trigger(ActionCommand.EVENT_COMPLETE);
            });
        }

        /**
         * 撤销
         */
        undo() {
            //返回到旧值
        }

        private clientList: {[name:string] : Array<Function>} = {};

        private objList: {[name:string] : Array<any>} = {};

        private trigger(key: string, ...ary: any[]) {
            if (!this.clientList[key]) return false;
            let fns = this.clientList[key];
            let objs = this.objList[key];
            for (let n = 0, fn, obj; n < fns.length; n++) {
                fn = fns[n];
                obj = objs[n];
                fn.apply(obj, ...ary);
            }
        }

        addListener(key: string, fn: Function, obj: any) {
            //记录游戏对象
            if (!this.clientList[key]) {
                this.clientList[key] = [];
                this.objList[key] = [];
            }
            this.clientList[key].push(fn);
            this.objList[key].push(obj);
        }
    }
}