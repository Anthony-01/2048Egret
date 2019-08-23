var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var utils;
(function (utils) {
    var ConstUtil = (function () {
        function ConstUtil() {
        }
        return ConstUtil;
    }());
    utils.ConstUtil = ConstUtil;
    __reflect(ConstUtil.prototype, "utils.ConstUtil");
    function colorConsole(msg, color, fontSize, data) {
        if (color === void 0) { color = "red"; }
        if (fontSize === void 0) { fontSize = 1.5; }
        console.log("%c" + msg, "color: " + color + "; font-size: " + fontSize);
        data && console.log(data);
    }
    utils.colorConsole = colorConsole;
})(utils || (utils = {}));
