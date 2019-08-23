namespace algorithm {
    export class BinarySearchTree {
        //插入
        insert(node: SearchNode, value: number): SearchNode {
            let p: SearchNode;
            if (node == null) {
                p = new SearchNode();
                p.left = p.right = null;
                p.value = value;
                return p;
            } else {
                if (node.value > value) node.left = this.insert(node.left, value);
                node.right = this.insert(node.right, value);
                return node;
            }

        }

        find(node: SearchNode, value: number): boolean {
            if (node == null) return false;
            if (node.value == value) return true;
            if (value < node.value) return this.find(node.left, value);
            return this.find(node.right, value);
        }

        remove(node: SearchNode, value: number): SearchNode {
            //二叉搜索树中没有此节点
            if (node == null) return null;
            if (value < node.value) this.remove(node.left, value);
            if (value > node.value) this.remove(node.right, value);
            if (node.left == null) {
                //改变原先的指针指向目前的右节点,将父节点的指针指向当前指针的右节点
                node.value = node.right.value;
                node.left = node.right.left;
                node.right = node.right.right;
                return node;
            } else
            if (node.left.right == null) {
                node.value = node.left.value;
                node.left = node.left.left;
                node.right = node.left.right;
                return node;
            } else {
                //将左节点中最大的的子孙节点提升上来
                let last = node.left.right;
                for (;last.right != null;last = last.right);
                node.value = last.value;
                node.left = last.left;
                node.right = last.right;
                return last;
            }

        }
    }

    export class SearchNode {
        public left: SearchNode;
        public right: SearchNode;
        public value: number;

        constructor() {

        }
    }
}