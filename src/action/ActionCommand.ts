namespace game {

    export enum EActionType {
        start,
        move
    }

    export enum EMoveDirection {
        up = 0,
        right,
        down,
        left
    }

    export interface IActionCommand {
        // new (component: any, callBack: (...arg) => Promise<any>, params?: any[]): void
    }

    export class ActionCommand implements IActionCommand {

        public static EVENT_COMPLETE: string = "eventComplete";

        public actionType: EActionType;

        public moveDirection: EMoveDirection;

        public actionData: any;

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

        // private clientList: {[name:string] : Array<Function>} = {};

        // private objList: {[name:string] : Array<any>} = {};

        private mapList: {[name:string] : Array<any>} = {};

        // 发射事件
        public trigger(key: string, ...ary: any[]) {
            if (!this.mapList[key]) return false;
            // let fns = this.clientList[key];
            // let objs = this.objList[key];
            let map = this.mapList[key];
            for (let n = 0, fn, obj; n < map.length; n++) {
                fn = map[n].fn;
                obj = map[n].obj;
                fn.apply(obj, ...ary);
            }
            // for (let n = 0, fn, obj; n < fns.length; n++) {
            //     fn = fns[n];
            //     obj = objs[n];
            //     fn.apply(obj, ...ary);
            // }
        }

        addListener(key: string, fn: Function, obj: any) {
            //记录游戏对象
            if (!this.mapList[key]) {
                // this.clientList[key] = [];
                // this.objList[key] = [];
                this.mapList[key] = [];
            }
            
            let map = {
                fn: fn,
                obj: obj
            }
            let index = this.mapList[key].indexOf(map);
            if (index != -1) return console.error("重复监听");
            this.mapList[key].push(map);
            // this.clientList[key].push(fn);
            // this.objList[key].push(obj);
        }

        removeListener(key: string, fn: Function, obj: any) {
            let map = {
                fn: fn,
                obj: obj
            }
            let num;
            if (this.mapList[key]) {
                this.mapList[key].forEach((value, index) => {
                    if (value.fn == map.fn && value.obj == map.obj) {
                        num = index;
                    }
                })
            }
            // let index = this.mapList[key].indexOf(map);
            if (num !== undefined) {
                this.mapList[key].splice(num, 1);
            } else {
                return console.error("移除不存在的监听");
            }
        }
    }
}