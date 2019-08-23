var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var manager;
(function (manager) {
    var StorageManager = (function () {
        function StorageManager() {
            this.storage = window.localStorage;
            this.bestScoreKey = "bestScore"; //最高分数
            this.gameStateKey = "gameState"; //游戏状态
        }
        StorageManager.prototype.setGameState = function (gameState) {
            this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
        };
        /**
         * 获取游戏本地游戏状态
         * */
        StorageManager.prototype.getGameStatus = function () {
            var stateJSON = this.storage.getItem(this.gameStateKey); //本地缓存的数据
            return stateJSON ? JSON.parse(stateJSON) : null;
        };
        StorageManager.prototype.getBestScore = function () {
            return this.storage.getItem(this.bestScoreKey) || 0;
        };
        return StorageManager;
    }());
    manager.StorageManager = StorageManager;
    __reflect(StorageManager.prototype, "manager.StorageManager");
})(manager || (manager = {}));
