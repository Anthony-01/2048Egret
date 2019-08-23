namespace customEvent {
    export class ViewEvent extends egret.Event {
        //返回视图
        public static EVENT_RETURN_EVENT: string = "returnEvent";

        //游戏界面
        public static EVENT_GAME_START: string = "gameStart";

        //移动动作
        public static EVENT_MOVE_EVENT: string = "moveEvent";

        

        /**
         * 构造方法
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super(type, bubbles, cancelable, data);
        }
    }
}