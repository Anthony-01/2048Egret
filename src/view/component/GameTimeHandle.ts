namespace component {
    interface ITimeHandleData {
        time: number
    }
    const TEXT_INFO = "GameTime: ";
    export class GameTimeHandle extends base.BaseComponent {

        public gameTime:eui.Label;

        private data: ITimeHandleData = {
            time: 0
        };

        constructor() {
            super();
            this.skinName = GameTimerSkin;
        }

        // public onComplete() {
        //     console.log("timeHandle:组件初始化");
        // }

        private addCurrentTime() {
            this.data.time += 1;
            this.gameTime.text = TEXT_INFO + this.data.time + "s";
        }

        init() {
            console.log(this.gameTime);
            //不知道在哪创建了一个
            // manager.TimerCtrl.getInstance().createTimer(this, 1000, 0, this.addCurrentTime,"gameTime");
        }
        //
        createChildren() {
            manager.TimerCtrl.getInstance().createTimer(this, 1000, 0, this.addCurrentTime,"gameTime");
        }

    }
}