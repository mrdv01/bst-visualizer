/**
 * Node class for Binary Search Tree
 */
class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        // Coordinates for visualization
        this.x = 0;
        this.y = 0;
    }
}

/**
 * Binary Search Tree implementation
 * Rules: left child < parent < right child, no duplicates allowed
 */
class BST {
    constructor() {
        this.root = null;
    }

    /**
     * Insert a new value into the BST
     * @param {number} value - Value to insert (1-99)
     * @returns {{ success: boolean, path: number[], message?: string }}
     */
    insert(value) {
        const path = [];

        if (this.root === null) {
            this.root = new BSTNode(value);
            path.push(value);
            return { success: true, path, message: `Inserted ${value} as root` };
        }

        let current = this.root;

        while (true) {
            path.push(current.value);

            // Check for duplicate
            if (value === current.value) {
                return {
                    success: false,
                    path,
                    message: `Duplicate value ${value} not allowed`
                };
            }

            if (value < current.value) {
                // Go left
                if (current.left === null) {
                    current.left = new BSTNode(value);
                    path.push(value);
                    return { success: true, path, message: `Inserted ${value}` };
                }
                current = current.left;
            } else {
                // Go right
                if (current.right === null) {
                    current.right = new BSTNode(value);
                    path.push(value);
                    return { success: true, path, message: `Inserted ${value}` };
                }
                current = current.right;
            }
        }
    }

    /**
     * Search for a value in the BST
     * @param {number} value - Value to search for
     * @returns {{ found: boolean, path: number[], message: string }}
     */
    search(value) {
        const path = [];
        let current = this.root;

        while (current !== null) {
            path.push(current.value);

            if (value === current.value) {
                return { found: true, path, message: `Found ${value}` };
            }

            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        return { found: false, path, message: `Value ${value} not found` };
    }

    /**
     * Remove a value from the BST
     * Handles 3 cases: leaf node, one child, two children
     * @param {number} value - Value to remove
     * @returns {{ success: boolean, path: number[], message: string }}
     */
    remove(value) {
        const path = [];
        let parent = null;
        let current = this.root;
        let isLeftChild = false;

        // Find the node to remove
        while (current !== null && current.value !== value) {
            path.push(current.value);
            parent = current;

            if (value < current.value) {
                current = current.left;
                isLeftChild = true;
            } else {
                current = current.right;
                isLeftChild = false;
            }
        }

        // Node not found
        if (current === null) {
            return { success: false, path, message: `Value ${value} not found` };
        }

        path.push(current.value);

        // Case 1: Leaf node (no children)
        if (current.left === null && current.right === null) {
            if (current === this.root) {
                this.root = null;
            } else if (isLeftChild) {
                parent.left = null;
            } else {
                parent.right = null;
            }
            return { success: true, path, message: `Removed leaf node ${value}` };
        }

        // Case 2: Node with one child
        if (current.left === null || current.right === null) {
            const child = current.left !== null ? current.left : current.right;

            if (current === this.root) {
                this.root = child;
            } else if (isLeftChild) {
                parent.left = child;
            } else {
                parent.right = child;
            }
            return { success: true, path, message: `Removed ${value} (one child)` };
        }

        // Case 3: Node with two children
        // Find in-order successor (smallest in right subtree)
        let successorParent = current;
        let successor = current.right;

        while (successor.left !== null) {
            path.push(successor.value);
            successorParent = successor;
            successor = successor.left;
        }
        path.push(successor.value);

        // Copy successor value to current node
        current.value = successor.value;

        // Remove successor (it has at most one right child)
        if (successorParent === current) {
            successorParent.right = successor.right;
        } else {
            successorParent.left = successor.right;
        }

        return { success: true, path, message: `Removed ${value} (two children, replaced with ${successor.value})` };
    }

    /**
     * Find the minimum value in the BST
     * @returns {{ value: number | null, path: number[], message: string }}
     */
    findMin() {
        const path = [];

        if (this.root === null) {
            return { value: null, path, message: 'Tree is empty' };
        }

        let current = this.root;
        while (current.left !== null) {
            path.push(current.value);
            current = current.left;
        }
        path.push(current.value);

        return { value: current.value, path, message: `Minimum value is ${current.value}` };
    }

    /**
     * Find the maximum value in the BST
     * @returns {{ value: number | null, path: number[], message: string }}
     */
    findMax() {
        const path = [];

        if (this.root === null) {
            return { value: null, path, message: 'Tree is empty' };
        }

        let current = this.root;
        while (current.right !== null) {
            path.push(current.value);
            current = current.right;
        }
        path.push(current.value);

        return { value: current.value, path, message: `Maximum value is ${current.value}` };
    }

    /**
     * Calculate the height of the tree
     * @returns {number} Height of the tree (-1 for empty tree)
     */
    getHeight() {
        const calculateHeight = (node) => {
            if (node === null) {
                return -1;
            }
            const leftHeight = calculateHeight(node.left);
            const rightHeight = calculateHeight(node.right);
            return Math.max(leftHeight, rightHeight) + 1;
        };

        return calculateHeight(this.root);
    }

    /**
     * Clear the entire tree
     * @returns {{ success: boolean, message: string }}
     */
    clear() {
        this.root = null;
        return { success: true, message: 'Tree cleared' };
    }

    /**
     * Inorder traversal (Left, Root, Right)
     * @returns {{ values: number[], message: string }}
     */
    inorder() {
        const values = [];

        const traverse = (node) => {
            if (node !== null) {
                traverse(node.left);
                values.push(node.value);
                traverse(node.right);
            }
        };

        traverse(this.root);
        return { values, message: `Inorder: ${values.join(' → ') || 'Empty tree'}` };
    }

    /**
     * Preorder traversal (Root, Left, Right)
     * @returns {{ values: number[], message: string }}
     */
    preorder() {
        const values = [];

        const traverse = (node) => {
            if (node !== null) {
                values.push(node.value);
                traverse(node.left);
                traverse(node.right);
            }
        };

        traverse(this.root);
        return { values, message: `Preorder: ${values.join(' → ') || 'Empty tree'}` };
    }

    /**
     * Postorder traversal (Left, Right, Root)
     * @returns {{ values: number[], message: string }}
     */
    postorder() {
        const values = [];

        const traverse = (node) => {
            if (node !== null) {
                traverse(node.left);
                traverse(node.right);
                values.push(node.value);
            }
        };

        traverse(this.root);
        return { values, message: `Postorder: ${values.join(' → ') || 'Empty tree'}` };
    }

    /**
     * Inorder traversal with detailed path (for animation)
     * Returns sequence of actions: 'enter', 'visit', 'exit'
     * @returns {{ steps: Array<{ value: number, action: string }>, values: number[], message: string }}
     */
    inorderDetailed() {
        const steps = [];
        const values = [];

        const traverse = (node) => {
            if (node !== null) {
                // Enter this node (going down)
                steps.push({ value: node.value, action: 'enter' });

                // Go left
                traverse(node.left);

                // Visit (process) this node - this is when we "read" the value
                steps.push({ value: node.value, action: 'visit' });
                values.push(node.value);

                // Go right
                traverse(node.right);

                // Exit this node (going back up)
                steps.push({ value: node.value, action: 'exit' });
            }
        };

        traverse(this.root);
        return { steps, values, message: `Inorder: ${values.join(' → ') || 'Empty tree'}` };
    }

    /**
     * Preorder traversal with detailed path (for animation)
     * @returns {{ steps: Array<{ value: number, action: string }>, values: number[], message: string }}
     */
    preorderDetailed() {
        const steps = [];
        const values = [];

        const traverse = (node) => {
            if (node !== null) {
                // Enter and visit immediately (preorder visits first)
                steps.push({ value: node.value, action: 'enter' });
                steps.push({ value: node.value, action: 'visit' });
                values.push(node.value);

                // Go left
                traverse(node.left);

                // Go right
                traverse(node.right);

                // Exit
                steps.push({ value: node.value, action: 'exit' });
            }
        };

        traverse(this.root);
        return { steps, values, message: `Preorder: ${values.join(' → ') || 'Empty tree'}` };
    }

    /**
     * Postorder traversal with detailed path (for animation)
     * @returns {{ steps: Array<{ value: number, action: string }>, values: number[], message: string }}
     */
    postorderDetailed() {
        const steps = [];
        const values = [];

        const traverse = (node) => {
            if (node !== null) {
                // Enter
                steps.push({ value: node.value, action: 'enter' });

                // Go left
                traverse(node.left);

                // Go right
                traverse(node.right);

                // Visit (postorder visits last)
                steps.push({ value: node.value, action: 'visit' });
                values.push(node.value);

                // Exit
                steps.push({ value: node.value, action: 'exit' });
            }
        };

        traverse(this.root);
        return { steps, values, message: `Postorder: ${values.join(' → ') || 'Empty tree'}` };
    }

    /**
     * Get all nodes with their positions for visualization
     * @returns {Array<{ value: number, x: number, y: number, left: number | null, right: number | null }>}
     */
    getNodesForVisualization() {
        if (this.root === null) {
            return [];
        }

        const nodes = [];
        const canvasWidth = 800;
        const verticalSpacing = 70;
        const topMargin = 50;

        const assignPositions = (node, level, left, right) => {
            if (node === null) return;

            const x = (left + right) / 2;
            const y = topMargin + level * verticalSpacing;

            node.x = x;
            node.y = y;

            nodes.push({
                value: node.value,
                x,
                y,
                left: node.left ? node.left.value : null,
                right: node.right ? node.right.value : null,
            });

            assignPositions(node.left, level + 1, left, x);
            assignPositions(node.right, level + 1, x, right);
        };

        assignPositions(this.root, 0, 0, canvasWidth);
        return nodes;
    }

    /**
     * Get edges for visualization (connections between nodes)
     * @returns {Array<{ from: { x: number, y: number }, to: { x: number, y: number } }>}
     */
    getEdgesForVisualization() {
        if (this.root === null) {
            return [];
        }

        const edges = [];

        const collectEdges = (node) => {
            if (node === null) return;

            if (node.left !== null) {
                edges.push({
                    from: { x: node.x, y: node.y },
                    to: { x: node.left.x, y: node.left.y },
                });
                collectEdges(node.left);
            }

            if (node.right !== null) {
                edges.push({
                    from: { x: node.x, y: node.y },
                    to: { x: node.right.x, y: node.right.y },
                });
                collectEdges(node.right);
            }
        };

        // First assign positions
        this.getNodesForVisualization();
        collectEdges(this.root);
        return edges;
    }
}

export { BSTNode };
export default BST;
