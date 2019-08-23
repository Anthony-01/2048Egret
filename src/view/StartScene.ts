namespace game {
    export class StartScene extends base.BaseScene {

        // public btn_start: myComponent.MyButton;


        constructor() {
            super("StartScene")
        }

        private btn_start: myComponent.MyButton;

        public initBtn() {
            this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
            
        }

        init() {

        }

        private startGame() {
            //开始游戏
            // GameEngine.getIns().startGame();
            this.dispatchEventWith(customEvent.ViewEvent.EVENT_GAME_START);
        }

    }
}