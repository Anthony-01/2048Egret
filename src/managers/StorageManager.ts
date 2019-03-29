namespace manager {
    export class StorageManager {

        private bestScoreKey: string;
        private gameStateKey: string;
        private storage = window.localStorage;

        constructor() {
            this.bestScoreKey     = "bestScore";//最高分数
            this.gameStateKey     = "gameState";//游戏状态

        }

        public setGameState(gameState) {
            this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
        }

        /**
         * 获取游戏本地游戏状态
         * */
        public getGameStatus() {
            let stateJSON = this.storage.getItem(this.gameStateKey);//本地缓存的数据
            return stateJSON ? JSON.parse(stateJSON) : null;
        }


        public getBestScore() {
            return this.storage.getItem(this.bestScoreKey) || 0;
        }
    }
}