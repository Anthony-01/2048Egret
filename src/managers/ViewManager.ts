namespace manager {

    /**
     * 主要为控制不同视图的切换
     * 
     */
    export interface IViewManager {
        setView(view: any, name: EViewName): void;
    }

    export enum EViewName {
        startView,
        gameView,
        overView
    }

    export class ViewManager implements IViewManager {

        public static _ins: ViewManager;

        public static getIns() {
            if (!this._ins) {
                this._ins = new ViewManager();
                this._ins.init();
            }
            return this._ins;
        }

        private startView: egret.DisplayObjectContainer;

        init() {
            this.setView(new egret.DisplayObjectContainer(), EViewName.startView);
        }

        public stage: egret.DisplayObjectContainer;

        //当前视图名称
        private _currentViewName: EViewName;

        private _currentView: egret.DisplayObjectContainer;

        setStage(): void {

        }

        setView(view: any, name: EViewName): void {

        }
    }
}