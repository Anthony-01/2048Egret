namespace myComponent {
    export class MyButton extends base.BaseComponent {

        constructor() {
            super();
            this.anchorOffsetX = 143;
            this.anchorOffsetY = 76;
            // console.log("MyButton: construct");
        }

        init() {
            console.log("MyButton");
        }

        protected initBtn() {
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onBegin, this);
            // this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBegin, this);
        }

        private onBegin(evt: egret.TouchEvent) {
            // console.log("myButton： click");
            switch(evt.type) {
                case egret.TouchEvent.TOUCH_BEGIN: {
                    console.log("touchBegin");
                    // this.btn_down.visible = true;
                    this.currentState = "down";
                    break;
                }
                case egret.TouchEvent.TOUCH_END:{
                    console.log("touchEnd");
                    // this.btn_down.visible = false;
                    this.currentState = "up";
                    break;
                }
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:{
                    console.log("touchOUT");
                    // this.btn_down.visible = false;
                    this.currentState = "up";
                    break;
                }
                case egret.TouchEvent.TOUCH_CANCEL: {
                    console.log("touchCancel");
                    // this.btn_down.visible = false;
                    this.currentState = "up";
                    break;
                }
                case egret.TouchEvent.TOUCH_TAP: {
                    console.log("touchTap");
                    break;
                }

            }
        }

    }
}