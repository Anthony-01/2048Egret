var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var base;
(function (base) {
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent() {
            var _this = _super.call(this) || this;
            //动作列表
            _this._actionList = [];
            //初始化标识
            _this.m_ifComplete = false;
            _this._adjustComponent = [];
            _this._scaleComponent = [];
            _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
            return _this;
        }
        BaseComponent.prototype.onComplete = function () {
            // console.log("baseComponent:组件初始化完毕");
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
            this.adjustComponent();
            this.m_ifComplete = true;
            this.initBtn();
            this.init();
            this.beginComponentAction();
        };
        BaseComponent.prototype.beginComponentAction = function () {
            var callBack = this._actionList[0];
            if (callBack != null) {
                callBack();
                this._actionList.splice(0, 1);
                this.beginComponentAction();
            }
        };
        /**
         * 子类重写按钮初始化
         * */
        BaseComponent.prototype.initBtn = function () {
        };
        /*
        * 子类的组件初始化
        * */
        BaseComponent.prototype.init = function () {
        };
        /**
         * 适配屏幕
         * */
        BaseComponent.prototype.adjustComponent = function () {
        };
        BaseComponent.prototype.pushAction = function (callBack) {
            if (this.m_ifComplete) {
                callBack();
            }
            else {
                this._actionList.push(callBack);
            }
        };
        return BaseComponent;
    }(eui.Component));
    base.BaseComponent = BaseComponent;
    __reflect(BaseComponent.prototype, "base.BaseComponent");
})(base || (base = {}));
