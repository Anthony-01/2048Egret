var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var manager;
(function (manager) {
    var EViewName;
    (function (EViewName) {
        EViewName[EViewName["startView"] = 0] = "startView";
        EViewName[EViewName["gameView"] = 1] = "gameView";
        EViewName[EViewName["overView"] = 2] = "overView";
    })(EViewName = manager.EViewName || (manager.EViewName = {}));
    var ViewManager = (function () {
        function ViewManager() {
        }
        ViewManager.getIns = function () {
            if (!this._ins) {
                this._ins = new ViewManager();
                this._ins.init();
            }
            return this._ins;
        };
        ViewManager.prototype.init = function () {
            this.setView(new egret.DisplayObjectContainer(), EViewName.startView);
        };
        ViewManager.prototype.setStage = function () {
        };
        ViewManager.prototype.setView = function (view, name) {
        };
        return ViewManager;
    }());
    manager.ViewManager = ViewManager;
    __reflect(ViewManager.prototype, "manager.ViewManager", ["manager.IViewManager"]);
})(manager || (manager = {}));
