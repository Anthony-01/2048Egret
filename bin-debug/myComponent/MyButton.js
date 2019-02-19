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
var myComponent;
(function (myComponent) {
    var MyButton = (function (_super) {
        __extends(MyButton, _super);
        function MyButton() {
            var _this = _super.call(this) || this;
            _this.anchorOffsetX = 143;
            _this.anchorOffsetY = 76;
            return _this;
            // console.log("MyButton: construct");
        }
        MyButton.prototype.initBtn = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onBegin, this);
            // this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBegin, this);
        };
        MyButton.prototype.onBegin = function (evt) {
            // console.log("myButton： click");
            switch (evt.type) {
                case egret.TouchEvent.TOUCH_BEGIN: {
                    console.log("touchBegin");
                    this.btn_down.visible = true;
                    break;
                }
                case egret.TouchEvent.TOUCH_END: {
                    console.log("touchEnd");
                    this.btn_down.visible = false;
                    break;
                }
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE: {
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
        };
        return MyButton;
    }(base.BaseComponent));
    myComponent.MyButton = MyButton;
    __reflect(MyButton.prototype, "myComponent.MyButton");
})(myComponent || (myComponent = {}));
