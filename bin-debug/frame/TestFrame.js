var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var frame;
(function (frame) {
    var TestFrame = (function () {
        function TestFrame() {
            console.log("测试框架");
        }
        return TestFrame;
    }());
    frame.TestFrame = TestFrame;
    __reflect(TestFrame.prototype, "frame.TestFrame");
})(frame || (frame = {}));
