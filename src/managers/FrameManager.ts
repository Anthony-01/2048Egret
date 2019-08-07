namespace manager {
    export class FrameManager {
        //单例
        private static m_Instance: FrameManager;

        public static getInstance() {
            if (null == this.m_Instance) {
                this.m_Instance = new FrameManager();
                this.m_Instance.onInit();//静态方法里，必须用单例去调用方法
            }
            return this.m_Instance;
        }

        /**
         *游戏主舞台
         */
        public m_MainStage: egret.Stage;

        /**
         * 初始化
         * */
        public onInit() {
            // ServiceCtrl.getInstance().init(); //网络初始化
            TimerCtrl.getInstance().onInit(); //时间控制器初始化
        }

        /**
         * 切换游戏主界面
         * */
        public start() {
            if (this.m_CurrentScene.name == "MainScene") {
                console.log("当前即为游戏主界面");
                return;
            }
            // this.replaceScene()
        }

        public m_CurrentScene: base.BaseScene;

        /**
         * 设置当前场景
         * */
        public setCurrentScene(scene: base.BaseScene) {
            this.m_CurrentScene = null;
            this.m_CurrentScene = scene;
            //将其余场景移除
            this.m_MainStage.removeChildren();
            this.m_MainStage.addChild(scene);
        }

        public getCurrentScene(): base.BaseScene {
            return this.m_CurrentScene;
        }

        public isGameScene(): boolean {
            return this.m_CurrentScene.name == "MainScene" ? true : false;
        }

        //在切换场景时候将旧的场景销毁
        public replaceScene(newScene: base.BaseScene, animation?: boolean): Promise<any> {
            let curController = this.m_CurrentScene;

            if (this.m_CurrentScene == newScene) {
                utils.colorConsole("替换错误");
            }
            this.m_CurrentScene = null;
            this.m_CurrentScene = newScene;

            if (animation && curController) { //旧视图存在
                //添加新视图
                newScene.alpha = 0;
                this.m_MainStage.addChild(newScene);

                //旧视图渐变成透明
                let tw = egret.Tween.get(newScene);
                let tw1 = egret.Tween.get(curController);
                let promiseVec = [];
                promiseVec.push(new Promise((resolve, reject) => {
                    tw1.to({ "alpha": 0 }, 1000, egret.Ease.backOut).call(() => {
                        resolve();
                    })
                }));

                promiseVec.push(new Promise((resolve, reject) => {
                    tw.to({ "alpha": 1 }, 1000, egret.Ease.backIn).call(() => {
                        resolve();
                    })
                }));

                return Promise.all(promiseVec).then(() => {
                    this.m_MainStage.removeChild(curController);
                    return Promise.resolve();
                });


            } else {
                this.m_MainStage.addChild(newScene);
                this.m_MainStage.removeChild(curController);
                return Promise.resolve();
            }
        }
    }
}