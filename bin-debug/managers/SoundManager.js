var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var manager;
(function (manager) {
    var SoundManager = (function () {
        function SoundManager() {
        }
        return SoundManager;
    }());
    manager.SoundManager = SoundManager;
    __reflect(SoundManager.prototype, "manager.SoundManager");
})(manager || (manager = {}));
