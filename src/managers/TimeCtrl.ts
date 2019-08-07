namespace manager {
    export class TimerCtrl {
        private static m_Instance: TimerCtrl;

        public static getInstance() {
            if (null == this.m_Instance) {
                this.m_Instance = new TimerCtrl();
                this.m_Instance.onInit();
            }
            return this.m_Instance;
        }

        public onInit() {
            this.clean();
        }

        /**
         * 时间队列
         */
        private _timerQueue: any[] = [];

        public createTimer(target: any, delay: number = 1000.0 / 60.0, repeate: number, callBack: Function, key: string): boolean {
            for (let n = 0; n < this._timerQueue.length; n++) {
                const timer = this._timerQueue[n];
                if (timer.key == key) {
                    console.log("队列中存在相同key的定时器");
                    return false;
                }
            }

            let timer = new egret.Timer(delay, repeate);
            timer.addEventListener(egret.TimerEvent.TIMER, callBack, target);
            timer.start();

            let map = {
                key: key,
                timer: timer,
                callBack: callBack,
                target: target
            };

            this._timerQueue.push(map);

            return true;
        }

        /*
        * 清除定时器
        * */
        public killTimer(target: any, key: string): boolean {
            for (let n = 0; n < this._timerQueue.length; n++) {
                let timerInfo = this._timerQueue[n];
                if (timerInfo.key == key) {
                    if (timerInfo.target != target) {
                        console.log("定时器对象错误");
                        return false;
                    } else {
                        let timer = timerInfo.timer;

                        let callBack = timerInfo.callBack;

                        timer.removeEventListener(egret.TimerEvent.TIMER, callBack, target);

                        timer.stop();
                        timer = null;

                        this._timerQueue.splice(n, 1);
                        break;
                    }
                }
            }
            return true;

        }

        /**
         * 清除所有定时器
         * */
        public clean() {
            for (let n = 0; n < this._timerQueue.length; n++) {
                let callBack = this._timerQueue[n].callBack;
                let target = this._timerQueue[n].target;
                let timer = this._timerQueue[n].timer;

                timer.removeEventListener(egret.TimerEvent.TIMER, callBack, target);
                timer.stop();
                timer = null;
            }

            this._timerQueue = [];
        }

    }
}