namespace game {
    export class StartScene extends base.BaseScene {

        // public btn_start: myComponent.MyButton;


        constructor() {
            super("StartScene")
        }

        private btn_start: myComponent.MyButton;

        public initBtn() {
            this.btn_start = new myComponent.MyButton();
            this.btn_start.x = 320;
            this.btn_start.y = 534;
            this.addChild(this.btn_start);
            let callBack = () => {
                this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
            };
            this.btn_start.pushAction(callBack);
        }

        private startGame() {
            //开始游戏
            GameEngine.getIns().startGame();
        }

    }
}