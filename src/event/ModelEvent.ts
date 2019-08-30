namespace customEvent {
    export class ModelEvent extends egret.Event {
        /**
         * 动作完成
         */
        public static EVENT_ACTION_COMPLETE = "actionComplete";

        /**
         * 构造方法
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super(type, bubbles, cancelable, data);
        }
    }
}