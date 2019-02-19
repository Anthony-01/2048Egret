namespace myComponent {
    export class MyButton extends base.BaseComponent {

        public btn_up:eui.Image;
        public btn_down:eui.Image;
        public btn_disabled:eui.Image;

        constructor() {
            super();
            this.anchorOffsetX = 143;
            this.anchorOffsetY = 76;
            // console.log("MyButton: construct");
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
                    this.btn_down.visible = true;
                    break;
                }
                case egret.TouchEvent.TOUCH_END:{
                    console.log("touchEnd");
                    this.btn_down.visible = false;
                    break;
                }
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:{
                    console.log("touchOUT");
                    this.btn_down.visible = false;
                    break;
                }
                case egret.TouchEvent.TOUCH_CANCEL: {
                    console.log("touchCancel");
                    this.btn_down.visible = false;
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