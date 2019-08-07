namespace base {
    /*
    * 游戏场景基类
    * */
    export class BaseScene extends BaseComponent {
        /**
         * 控制器名称
         */
        name: string;

        constructor(name?: string) {
            super();
            this.name = name;
        }

        /*
        * 回收内存
        * */
        public dealloc() {
            this.removeChildren();
        }
    }
}