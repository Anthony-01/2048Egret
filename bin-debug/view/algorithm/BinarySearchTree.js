var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var algorithm;
(function (algorithm) {
    var BinarySearchTree = (function () {
        function BinarySearchTree() {
        }
        //插入
        BinarySearchTree.prototype.insert = function (node, value) {
            var p;
            if (node == null) {
                p = new SearchNode();
                p.left = p.right = null;
                p.value = value;
                return p;
            }
            else {
                if (node.value > value)
                    node.left = this.insert(node.left, value);
                node.right = this.insert(node.right, value);
                return node;
            }
        };
        BinarySearchTree.prototype.find = function (node, value) {
            if (node == null)
                return false;
            if (node.value == value)
                return true;
            if (value < node.value)
                return this.find(node.left, value);
            return this.find(node.right, value);
        };
        BinarySearchTree.prototype.remove = function (node, value) {
            //二叉搜索树中没有此节点
            if (node == null)
                return null;
            if (value < node.value)
                this.remove(node.left, value);
            if (value > node.value)
                this.remove(node.right, value);
            if (node.left == null) {
                //改变原先的指针指向目前的右节点,将父节点的指针指向当前指针的右节点
                node.value = node.right.value;
                node.left = node.right.left;
                node.right = node.right.right;
                return node;
            }
            else if (node.left.right == null) {
                node.value = node.left.value;
                node.left = node.left.left;
                node.right = node.left.right;
                return node;
            }
            else {
                //将左节点中最大的的子孙节点提升上来
                var last = node.left.right;
                for (; last.right != null; last = last.right)
                    ;
                node.value = last.value;
                node.left = last.left;
                node.right = last.right;
                return last;
            }
        };
        return BinarySearchTree;
    }());
    algorithm.BinarySearchTree = BinarySearchTree;
    __reflect(BinarySearchTree.prototype, "algorithm.BinarySearchTree");
    var SearchNode = (function () {
        function SearchNode() {
        }
        return SearchNode;
    }());
    algorithm.SearchNode = SearchNode;
    __reflect(SearchNode.prototype, "algorithm.SearchNode");
})(algorithm || (algorithm = {}));
