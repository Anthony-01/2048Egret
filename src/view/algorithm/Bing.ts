namespace algorithm {
    enum EElementType {
        first,
        second
    }
    export interface INode {
        value: number,
        child: any
    }
    export const CAnimalCount = 10;
    export const CAnimalType = 3;
    export interface IElement {
        type: EElementType,
        x: number,
        y: number
    }
    //并查集以及应用，分类以及应用
    export class Bing {

        private _par: number[] = [];
        private _rank: number[] = [];

        private _elements: IElement[] = [];
        setElement(type: EElementType, x: number, y: number) {
            let element : IElement = {
                type,
                x,
                y
            };
            this._elements.push(element);
        }


        private _errorCount = 0;
        private _root = [];
        /*
        * @param length: K信息的条数
        * @param N: 动物的个数
        * */
        sort() {
            // let length = this._elements.length;
            // this.init(length);
            this._errorCount = 0;
            this._root = [];
            this.init(CAnimalType * CAnimalCount);

            //循环列表来进行归类
            for (let value of this._elements) {

                let [x, y] = [value.x - 1, value.y - 1];
                if (x < 0 || y < 0 || x >= CAnimalCount || y >= CAnimalCount) {
                    this._errorCount ++;
                    console.log(value);
                    continue;
                }
                if (value.type == 1) { //x、y同类
                    if (this.same(x, y + CAnimalCount) || this.same(x, y + 2 * CAnimalCount)) {
                        this._errorCount++;
                        console.log(value);
                        continue;
                    } else {
                        this.merge(x, y);
                        this.merge(x + CAnimalCount, y + CAnimalCount);
                        this.merge(x + 2 * CAnimalCount, y + 2 * CAnimalCount);
                    }
                } else if (value.type == 2) {
                    if (this.same(x, y) || this.same(x, y + 2 * CAnimalCount)) {
                        this._errorCount++;
                        console.log(value);
                        continue;
                    } else {
                        this.merge(x, y + CAnimalCount);
                        this.merge(x + CAnimalCount, y + 2 * CAnimalCount);
                        this.merge(x + 2 * CAnimalCount, y);
                    }
                }

            }

            console.log(this._par,  this._rank);
            console.log(this._errorCount);
            console.log(this._root);
        }

        constructor() {
            // for (let n = 0; n < 5; n++) {
            //     this._par.push(n);
            //     this._rank.push(0);
            // }
        }

        private _nodes: INode[] = [];
        /**
         * @param length:
         * */
        init(length: number) {
            for (let n = 0; n < length; n++) {
                this._par.push(n);
                this._rank.push(0);
                let ele: INode = {
                    value: n,
                    child: null
                };
                this._root.push(ele);
                this._nodes.push(ele);
            }
        }

        public find(x: number): number {
            if (this._par[x] == x) {
                return x;
            } else {
                return this.find(this._par[x]);
            }
        }

        public merge(x: number, y: number): void {
            x = this.find(x);
            y = this.find(y);

            if (x == y) return;
            if (this._rank[x] < this._rank[y]) {
                this._par[x] = this._par[y];
                //
                let par = this.findNode(y);
                let child = this.findNode(x);
                par.child = child;
                let index = this._root.indexOf(child);
                this._root.splice(index, 1);
            } else {
                this._par[y] = this._par[x];
                if (this._rank[x] == this._rank[y]) {
                    this._rank[x] ++
                }
                //
                let par = this.findNode(x);
                let child = this.findNode(y);
                par.child = child;
                let index = this._root.indexOf(child);
                this._root.splice(index, 1);
            }
        }

        private findNode(value: number): INode {
            let node1;
            this._nodes.forEach(node => {
                if (node.value == value)
                    node1 = node;
            });
            return node1;
        }

        publish() {
            console.log(this._par);
            console.log(this._rank);
        }

        public same(x: number, y: number) {
            return this.find(x) == this.find(y);
        }

    }
}