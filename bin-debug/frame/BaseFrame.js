var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var frame;
(function (frame) {
    var BaseFrame = (function () {
        function BaseFrame(delegate) {
            this._dispatcher = new egret.EventDispatcher();
            this.addEventListener();
        }
        BaseFrame.prototype.getDispatcher = function () {
            return this._dispatcher;
        };
        BaseFrame.prototype.setDelegate = function (delegame) {
            this._delegate = delegame;
        };
        BaseFrame.prototype.addEventListener = function () {
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.onConnectComplete, this);
            this._dispatcher.addEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);
        };
        BaseFrame.prototype.removeEventListener = function () {
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_CONNECT_COMPLETE, this.onConnectComplete, this);
            this._dispatcher.removeEventListener(customEvent.CustomEvent.EVENT_MESSAGE_DISPATCH, this.onGameMessage, this);
        };
        BaseFrame.prototype.onConnectComplete = function (event) {
            console.log("连接成功");
        };
        /**
         * 处理网络消息
         * */
        BaseFrame.prototype.onGameMessage = function (event) {
        };
        /**
         * 发送心跳
         */
        BaseFrame.prototype.sendPing = function (service) {
            // //构造数据
            // let Ping = new utils.ByteArray();
            //
            // //设置偏移
            // Ping.position(df.Len_Tcp_Head);
            //
            // //发送心跳
            // service.SendSocketData(df.MDM_KN_COMMAND, df.SUB_KN_DETECT_SOCKET, Ping, Ping.getLength());
        };
        return BaseFrame;
    }());
    frame.BaseFrame = BaseFrame;
    __reflect(BaseFrame.prototype, "frame.BaseFrame");
})(frame || (frame = {}));
