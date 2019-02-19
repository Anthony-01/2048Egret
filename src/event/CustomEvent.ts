namespace customEvent {
    export class CustomEvent extends egret.Event {
        /**
         * 连接完成
         */
        public static EVENT_CONNECT_COMPLETE: string = "connectComplete";

        /**
         * 消息分发
         */
        public static EVENT_MESSAGE_DISPATCH: string = "messageDispatch";

        /**
         * 连接失败
         */
        public static EVENT_CONNECT_FAIlURE: string = "connectFailure";

        /**
         * 构造方法
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any) {
            super(type, bubbles, cancelable, data);
        }
    }
}