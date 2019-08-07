namespace game {
    export class Tiles {

        private m_myTiles: Tile[] = [];
        private m_main: GameView;

        constructor(main: GameView) {

        }

        getPositionTile(point: egret.Point):any {
            this.m_myTiles.forEach((tile, index) => {
                if (point == tile.Point) {
                    return {
                        tile,index
                    }
                }
            })
        }

        push(tile: Tile) {
            this.m_myTiles.push(tile);
            this.m_main.addChild(tile);
        }

        remove(point: egret.Point) {
            let info = this.getPositionTile(point).tile;
            this.m_main.removeChild(info.tile);
            this.m_myTiles.splice(info.index);
        }
    }
}