namespace base {
    export class BaseComponent extends eui.Component {

        constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        }

        //动作列表
        public _actionList: any[] = [];
        //初始化标识
        public m_ifComplete: boolean = false;

        protected onComplete() {
            console.log("baseComponent:组件初始化完毕");
            this.adjustComponent();
            this.m_ifComplete = true;
            this.initBtn();
            this.beginComponentAction();
        }

        protected beginComponentAction() {
            let callBack = this._actionList[0] as Function;
            if (callBack != null) {
                callBack();
                this._actionList.splice(0, 1);
                this.beginComponentAction();
            }
        }

        /**
         * 子类重写按钮初始化
         * */
        protected initBtn() {

        }

        protected _adjustComponent: any[] = [];
        protected _scaleComponent: any[] = [];

        /**
         * 适配屏幕
         * */
        protected adjustComponent() {

        }

        /**
         * 按钮动画
         * */
        protected addBtnChange(button: eui.Button) {
            button.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        }

        protected removeBrnChange(button: eui.Button) {
            button.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndChange, this);
            button.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEndChange, this);
        }

        public _touchButton: eui.Button = null;
        public onTouchBeginChange(e: egret.TouchEvent) {
            this._touchButton = e.currentTarget;
            let scale = this._touchButton.scaleX - 0.1;
            this._touchButton.scaleX = this._touchButton.scaleY = scale;
        }

        public onTouchMoveChange(e: egret.TouchEvent) {
            if (e.currentTarget != this._touchButton) {

            }
        }

        public onTouchEndChange(e: egret.TouchEvent) {
            if (e.currentTarget != this._touchButton) {
            }
            if (null != this._touchButton) {
                let scale = this._touchButton.scaleX + 0.1;
                this._touchButton.scaleX = this._touchButton.scaleY = scale;
            }
            this._touchButton = null;
        }

        public pushAction(callBack: Function) {
            if (this.m_ifComplete) {
                callBack();
            } else {
                this._actionList.push(callBack);
            }
        }
    }
}