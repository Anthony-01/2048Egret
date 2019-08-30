var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var C_PROCESSOR_MAP;
    //各类共用动作执行表
    function initProcess() {
        var moveProcessor = new game.MoveProcessor();
        C_PROCESSOR_MAP = (_a = {},
            _a[game.EActionType.start] = moveProcessor,
            _a);
        var _a;
    }
    //context类
    var ActionExecutor = (function () {
        function ActionExecutor() {
            if (!C_PROCESSOR_MAP) {
                initProcess();
            }
            this._processorMap = C_PROCESSOR_MAP;
        }
        ActionExecutor.prototype.assertAction = function () {
        };
        ActionExecutor.prototype.applyAction = function (command, host) {
            var type = command.actionType;
            // let board = grid.getGrid();
            var processor = this._processorMap[type];
            if (processor.assertAction(command, host)) {
                processor.applyAction(command, host);
            }
            else {
                console.error("动作验证失败", command.actionType);
            }
        };
        ActionExecutor.prototype.cancelAction = function () {
        };
        return ActionExecutor;
    }());
    game.ActionExecutor = ActionExecutor;
    __reflect(ActionExecutor.prototype, "game.ActionExecutor", ["game.IActionExecutor"]);
})(game || (game = {}));
