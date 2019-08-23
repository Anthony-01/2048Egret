var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var algorithm;
(function (algorithm) {
    var EElementType;
    (function (EElementType) {
        EElementType[EElementType["first"] = 0] = "first";
        EElementType[EElementType["second"] = 1] = "second";
    })(EElementType || (EElementType = {}));
    algorithm.CAnimalCount = 10;
    algorithm.CAnimalType = 3;
    //并查集以及应用，分类以及应用
    var Bing = (function () {
        function Bing() {
            this._par = [];
            this._rank = [];
            this._elements = [];
            this._errorCount = 0;
            this._root = [];
            this._nodes = [];
            // for (let n = 0; n < 5; n++) {
            //     this._par.push(n);
            //     this._rank.push(0);
            // }
        }
        Bing.prototype.setElement = function (type, x, y) {
            var element = {
                type: type,
                x: x,
                y: y
            };
            this._elements.push(element);
        };
        /*
        * @param length: K信息的条数
        * @param N: 动物的个数
        * */
        Bing.prototype.sort = function () {
            // let length = this._elements.length;
            // this.init(length);
            this._errorCount = 0;
            this._root = [];
            this.init(algorithm.CAnimalType * algorithm.CAnimalCount);
            //循环列表来进行归类
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var value = _a[_i];
                var _b = [value.x - 1, value.y - 1], x = _b[0], y = _b[1];
                if (x < 0 || y < 0 || x >= algorithm.CAnimalCount || y >= algorithm.CAnimalCount) {
                    this._errorCount++;
                    console.log(value);
                    continue;
                }
                if (value.type == 1) {
                    if (this.same(x, y + algorithm.CAnimalCount) || this.same(x, y + 2 * algorithm.CAnimalCount)) {
                        this._errorCount++;
                        console.log(value);
                        continue;
                    }
                    else {
                        this.merge(x, y);
                        this.merge(x + algorithm.CAnimalCount, y + algorithm.CAnimalCount);
                        this.merge(x + 2 * algorithm.CAnimalCount, y + 2 * algorithm.CAnimalCount);
                    }
                }
                else if (value.type == 2) {
                    if (this.same(x, y) || this.same(x, y + 2 * algorithm.CAnimalCount)) {
                        this._errorCount++;
                        console.log(value);
                        continue;
                    }
                    else {
                        this.merge(x, y + algorithm.CAnimalCount);
                        this.merge(x + algorithm.CAnimalCount, y + 2 * algorithm.CAnimalCount);
                        this.merge(x + 2 * algorithm.CAnimalCount, y);
                    }
                }
            }
            console.log(this._par, this._rank);
            console.log(this._errorCount);
            console.log(this._root);
        };
        /**
         * @param length:
         * */
        Bing.prototype.init = function (length) {
            for (var n = 0; n < length; n++) {
                this._par.push(n);
                this._rank.push(0);
                var ele = {
                    value: n,
                    child: null
                };
                this._root.push(ele);
                this._nodes.push(ele);
            }
        };
        Bing.prototype.find = function (x) {
            if (this._par[x] == x) {
                return x;
            }
            else {
                return this.find(this._par[x]);
            }
        };
        Bing.prototype.merge = function (x, y) {
            x = this.find(x);
            y = this.find(y);
            if (x == y)
                return;
            if (this._rank[x] < this._rank[y]) {
                this._par[x] = this._par[y];
                //
                var par = this.findNode(y);
                var child = this.findNode(x);
                par.child = child;
                var index = this._root.indexOf(child);
                this._root.splice(index, 1);
            }
            else {
                this._par[y] = this._par[x];
                if (this._rank[x] == this._rank[y]) {
                    this._rank[x]++;
                }
                //
                var par = this.findNode(x);
                var child = this.findNode(y);
                par.child = child;
                var index = this._root.indexOf(child);
                this._root.splice(index, 1);
            }
        };
        Bing.prototype.findNode = function (value) {
            var node1;
            this._nodes.forEach(function (node) {
                if (node.value == value)
                    node1 = node;
            });
            return node1;
        };
        Bing.prototype.publish = function () {
            console.log(this._par);
            console.log(this._rank);
        };
        Bing.prototype.same = function (x, y) {
            return this.find(x) == this.find(y);
        };
        return Bing;
    }());
    algorithm.Bing = Bing;
    __reflect(Bing.prototype, "algorithm.Bing");
})(algorithm || (algorithm = {}));
