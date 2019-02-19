namespace model {

    export class GameModel extends eui.UILayer {
        public _gameFrame: frame.GameFrame; //网络通信
        public _gameView: game.GameView;//主游戏界面

        constructor() {
            super();
            this.onInitEngine();
            //倒计时定时器
            manager.TimerCtrl.getInstance().createTimer(this,1000,0,this.onClockUpdateEvent,"clock");

            //帧率刷新
            manager.TimerCtrl.getInstance().createTimer(this,1000 / 60,0,this.onUpdate,"update");
        }

        /**
         * 初始化
         * 各游戏子类覆盖此方法
         */
        onInitEngine(view?: game.GameView) {
            view && this.setGameView(view);
            // this._gameFrame = manager.TcpServiceCtrl.getInstance().getDelegate();//获取游戏引擎
        }

        onResetEngine() {

        }

        setGameView(view: game.GameView) {
            this._gameView = view;
        }

        setGameFrame(frame: frame.GameFrame) {
            this._gameFrame = frame;
        }

        /**倒计时刷新
         * 各游戏子类覆盖此方法
         */
        public onClockUpdateEvent() {

        }

        /**帧率刷新
         * 各游戏子类覆盖此方法
         */
        public onUpdate() {

        }
    }
}