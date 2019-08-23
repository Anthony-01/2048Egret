var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var manager;
(function (manager) {
    var FrameManager = (function () {
        function FrameManager() {
        }
        FrameManager.getInstance = function () {
            if (null == this.m_Instance) {
                this.m_Instance = new FrameManager();
                this.m_Instance.onInit(); //静态方法里，必须用单例去调用方法
            }
            return this.m_Instance;
        };
        /**
         * 初始化
         * */
        FrameManager.prototype.onInit = function () {
            // ServiceCtrl.getInstance().init(); //网络初始化
            manager.TimerCtrl.getInstance().onInit(); //时间控制器初始化
        };
        /**
         * 切换游戏主界面
         * */
        FrameManager.prototype.start = function () {
            if (this.m_CurrentScene.name == "MainScene") {
                console.log("当前即为游戏主界面");
                return;
            }
            // this.replaceScene()
        };
        /**
         * 设置当前场景
         * */
        FrameManager.prototype.setCurrentScene = function (scene) {
            this.m_CurrentScene = null;
            this.m_CurrentScene = scene;
            //将其余场景移除
            this.m_MainStage.removeChildren();
            this.m_MainStage.addChild(scene);
        };
        FrameManager.prototype.getCurrentScene = function () {
            return this.m_CurrentScene;
        };
        FrameManager.prototype.isGameScene = function () {
            return this.m_CurrentScene.name == "MainScene" ? true : false;
        };
        //在切换场景时候将旧的场景销毁
        FrameManager.prototype.replaceScene = function (newScene, animation) {
            var _this = this;
            var curController = this.m_CurrentScene;
            if (this.m_CurrentScene == newScene) {
                utils.colorConsole("替换错误");
            }
            this.m_CurrentScene = null;
            this.m_CurrentScene = newScene;
            if (animation && curController) {
                //添加新视图
                newScene.alpha = 0;
                this.m_MainStage.addChild(newScene);
                //旧视图渐变成透明
                var tw_1 = egret.Tween.get(newScene);
                var tw1_1 = egret.Tween.get(curController);
                var promiseVec = [];
                promiseVec.push(new Promise(function (resolve, reject) {
                    tw1_1.to({ "alpha": 0 }, 1000, egret.Ease.backOut).call(function () {
                        resolve();
                    });
                }));
                promiseVec.push(new Promise(function (resolve, reject) {
                    tw_1.to({ "alpha": 1 }, 1000, egret.Ease.backIn).call(function () {
                        resolve();
                    });
                }));
                return Promise.all(promiseVec).then(function () {
                    _this.m_MainStage.removeChild(curController);
                    return Promise.resolve();
                });
            }
            else {
                this.m_MainStage.addChild(newScene);
                this.m_MainStage.removeChild(curController);
                return Promise.resolve();
            }
        };
        return FrameManager;
    }());
    manager.FrameManager = FrameManager;
    __reflect(FrameManager.prototype, "manager.FrameManager");
})(manager || (manager = {}));
