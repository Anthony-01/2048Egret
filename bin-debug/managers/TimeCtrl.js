var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var manager;
(function (manager) {
    var TimerCtrl = (function () {
        function TimerCtrl() {
            /**
             * 时间队列
             */
            this._timerQueue = [];
        }
        TimerCtrl.getInstance = function () {
            if (null == this.m_Instance) {
                this.m_Instance = new TimerCtrl();
                this.m_Instance.onInit();
            }
            return this.m_Instance;
        };
        TimerCtrl.prototype.onInit = function () {
            this.clean();
        };
        TimerCtrl.prototype.createTimer = function (target, delay, repeate, callBack, key) {
            if (delay === void 0) { delay = 1000.0 / 60.0; }
            for (var n = 0; n < this._timerQueue.length; n++) {
                var timer_1 = this._timerQueue[n];
                if (timer_1.key == key) {
                    console.log("队列中存在相同key的定时器");
                    return false;
                }
            }
            var timer = new egret.Timer(delay, repeate);
            timer.addEventListener(egret.TimerEvent.TIMER, callBack, target);
            timer.start();
            var map = {
                key: key,
                timer: timer,
                callBack: callBack,
                target: target
            };
            this._timerQueue.push(map);
            return true;
        };
        /*
        * 清除定时器
        * */
        TimerCtrl.prototype.killTimer = function (target, key) {
            for (var n = 0; n < this._timerQueue.length; n++) {
                var timerInfo = this._timerQueue[n];
                if (timerInfo.key == key) {
                    if (timerInfo.target != target) {
                        console.log("定时器对象错误");
                        return false;
                    }
                    else {
                        var timer = timerInfo.timer;
                        var callBack = timerInfo.callBack;
                        timer.removeEventListener(egret.TimerEvent.TIMER, callBack, target);
                        timer.stop();
                        timer = null;
                        this._timerQueue.splice(n, 1);
                        break;
                    }
                }
            }
            return true;
        };
        /**
         * 清除所有定时器
         * */
        TimerCtrl.prototype.clean = function () {
            for (var n = 0; n < this._timerQueue.length; n++) {
                var callBack = this._timerQueue[n].callBack;
                var target = this._timerQueue[n].target;
                var timer = this._timerQueue[n].timer;
                timer.removeEventListener(egret.TimerEvent.TIMER, callBack, target);
                timer.stop();
                timer = null;
            }
            this._timerQueue = [];
        };
        return TimerCtrl;
    }());
    manager.TimerCtrl = TimerCtrl;
    __reflect(TimerCtrl.prototype, "manager.TimerCtrl");
})(manager || (manager = {}));
