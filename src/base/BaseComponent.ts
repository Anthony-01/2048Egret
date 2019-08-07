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
            // console.log("baseComponent:组件初始化完毕");
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.adjustComponent();
            this.m_ifComplete = true;
            this.initBtn();
            this.init();
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

        /*
        * 子类的组件初始化
        * */
        protected init() {

        }

        protected _adjustComponent: any[] = [];
        protected _scaleComponent: any[] = [];

        /**
         * 适配屏幕
         * */
        protected adjustComponent() {

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