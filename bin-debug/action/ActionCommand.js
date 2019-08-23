var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var EActionType;
    (function (EActionType) {
        EActionType[EActionType["move"] = 0] = "move";
    })(EActionType = game.EActionType || (game.EActionType = {}));
    var EMoveDirection;
    (function (EMoveDirection) {
        EMoveDirection[EMoveDirection["up"] = 0] = "up";
        EMoveDirection[EMoveDirection["down"] = 1] = "down";
        EMoveDirection[EMoveDirection["left"] = 2] = "left";
        EMoveDirection[EMoveDirection["right"] = 3] = "right";
    })(EMoveDirection = game.EMoveDirection || (game.EMoveDirection = {}));
    var ActionCommand = (function () {
        /**
         *
         * @param component 执行动作的对象
         */
        function ActionCommand(component, callBack, params) {
            this.clientList = {};
            this.objList = {};
            this._component = component;
            this._callBack = callBack;
            this._params = params;
            //记录旧值
        }
        /**
         * 命令执行
         */
        ActionCommand.prototype.execute = function () {
            var _this = this;
            this._callBack.apply(this._component, this._params).then(function () {
                _this.trigger(ActionCommand.EVENT_COMPLETE);
            });
        };
        /**
         * 撤销
         */
        ActionCommand.prototype.undo = function () {
            //返回到旧值
        };
        ActionCommand.prototype.trigger = function (key) {
            var ary = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ary[_i - 1] = arguments[_i];
            }
            if (!this.clientList[key])
                return false;
            var fns = this.clientList[key];
            var objs = this.objList[key];
            for (var n = 0, fn = void 0, obj = void 0; n < fns.length; n++) {
                fn = fns[n];
                obj = objs[n];
                fn.apply.apply(fn, [obj].concat(ary));
            }
        };
        ActionCommand.prototype.addListener = function (key, fn, obj) {
            //记录游戏对象
            if (!this.clientList[key]) {
                this.clientList[key] = [];
                this.objList[key] = [];
            }
            this.clientList[key].push(fn);
            this.objList[key].push(obj);
        };
        ActionCommand.EVENT_COMPLETE = "eventComplete";
        return ActionCommand;
    }());
    game.ActionCommand = ActionCommand;
    __reflect(ActionCommand.prototype, "game.ActionCommand", ["game.IActionCommand"]);
})(game || (game = {}));
