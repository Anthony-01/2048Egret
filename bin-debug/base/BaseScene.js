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
    /*
    * 游戏场景基类
    * */
    var BaseScene = (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            return _this;
        }
        /*
        * 回收内存
        * */
        BaseScene.prototype.dealloc = function () {
            this.removeChildren();
        };
        return BaseScene;
    }(base.BaseComponent));
    base.BaseScene = BaseScene;
    __reflect(BaseScene.prototype, "base.BaseScene");
})(base || (base = {}));
