var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var game;
(function (game) {
    var EActionType;
    (function (EActionType) {
        EActionType[EActionType["start"] = 0] = "start";
        EActionType[EActionType["move"] = 1] = "move";
    })(EActionType = game.EActionType || (game.EActionType = {}));
    var EMoveDirection;
    (function (EMoveDirection) {
        EMoveDirection[EMoveDirection["up"] = 0] = "up";
        EMoveDirection[EMoveDirection["right"] = 1] = "right";
        EMoveDirection[EMoveDirection["down"] = 2] = "down";
        EMoveDirection[EMoveDirection["left"] = 3] = "left";
    })(EMoveDirection = game.EMoveDirection || (game.EMoveDirection = {}));
    var ActionCommand = (function () {
        /**
         *
         * @param component 执行动作的对象
         */
        function ActionCommand(component, callBack, params) {
            // private clientList: {[name:string] : Array<Function>} = {};
            // private objList: {[name:string] : Array<any>} = {};
            this.mapList = {};
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
        // 发射事件
        ActionCommand.prototype.trigger = function (key) {
            var ary = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ary[_i - 1] = arguments[_i];
            }
            if (!this.mapList[key])
                return false;
            // let fns = this.clientList[key];
            // let objs = this.objList[key];
            var map = this.mapList[key];
            for (var n = 0, fn = void 0, obj = void 0; n < map.length; n++) {
                fn = map[n].fn;
                obj = map[n].obj;
                fn.apply.apply(fn, [obj].concat(ary));
            }
            // for (let n = 0, fn, obj; n < fns.length; n++) {
            //     fn = fns[n];
            //     obj = objs[n];
            //     fn.apply(obj, ...ary);
            // }
        };
        ActionCommand.prototype.addListener = function (key, fn, obj) {
            //记录游戏对象
            if (!this.mapList[key]) {
                // this.clientList[key] = [];
                // this.objList[key] = [];
                this.mapList[key] = [];
            }
            var map = {
                fn: fn,
                obj: obj
            };
            var index = this.mapList[key].indexOf(map);
            if (index != -1)
                return console.error("重复监听");
            this.mapList[key].push(map);
            // this.clientList[key].push(fn);
            // this.objList[key].push(obj);
        };
        ActionCommand.prototype.removeListener = function (key, fn, obj) {
            var map = {
                fn: fn,
                obj: obj
            };
            var num;
            if (this.mapList[key]) {
                this.mapList[key].forEach(function (value, index) {
                    if (value.fn == map.fn && value.obj == map.obj) {
                        num = index;
                    }
                });
            }
            // let index = this.mapList[key].indexOf(map);
            if (num !== undefined) {
                this.mapList[key].splice(num, 1);
            }
            else {
                return console.error("移除不存在的监听");
            }
        };
        ActionCommand.EVENT_COMPLETE = "eventComplete";
        return ActionCommand;
    }());
    game.ActionCommand = ActionCommand;
    __reflect(ActionCommand.prototype, "game.ActionCommand", ["game.IActionCommand"]);
})(game || (game = {}));
