namespace factory {
    //对象本身的职责，创建对象的职责，使用对象的职责
    //单一职责原则
    //防止实例化一个类的代码到处都是，提供一系列方法名不同的工厂方法，对应不同的构造函数
    export interface tileFactory {
        createTile(x: number, y: number, value: number): game.Tile;
    }

    export class TileFactory implements tileFactory {

        constructor() {

        }

        public createTile(x: number, y: number, value: number): game.Tile {
            return new game.Tile(x, y, value);
        }
    }
}