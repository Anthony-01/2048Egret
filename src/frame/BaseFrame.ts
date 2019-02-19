namespace frame {
    export class BaseFrame {
        //业务代理
        public _delegate;
        //通知实例
        public _dispatcher;

        public getDispatcher() {
            return this._dispatcher
        }

        constructor(delegate?: any) {
            this._dispatcher = new egret.EventDispatcher();
            this.addEventListener();
        }

        public setDelegate(delegame: any) {
            this._delegate = delegame;
        }

        public addEventListener() {
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.onConnectComplete, this);
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);
        }

        public removeEventListener() {
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.onConnectComplete, this);
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);
        }

        private onConnectComplete(event: egret.Event) {
            console.log("连接成功");
        }

        /**
         * 处理网络消息
         * */
        private onGameMessage(event: egret.Event) {

        }

        /**
         * 发送心跳
         */
        public sendPing(service): void {
            // //构造数据
            // let Ping = new utils.ByteArray();
            //
            // //设置偏移
            // Ping.position(df.Len_Tcp_Head);
            //
            // //发送心跳
            // service.SendSocketData(df.MDM_KN_COMMAND, df.SUB_KN_DETECT_SOCKET, Ping, Ping.getLength());
        }
    }
}