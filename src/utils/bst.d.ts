export default class BST {
    constructor();
    insert(value: number): { success: boolean, path: number[], message?: string };
    search(value: number): { found: boolean, path: number[], message: string };
    remove(value: number): { success: boolean, path: number[], message?: string };
    findMin(): { value: number | null, path: number[], message: string };
    findMax(): { value: number | null, path: number[], message: string };
    clear(): { message: string };
    
    inorderDetailed(): { values: number[], steps: Array<{ value: number, action: string }>, message: string };
    preorderDetailed(): { values: number[], steps: Array<{ value: number, action: string }>, message: string };
    postorderDetailed(): { values: number[], steps: Array<{ value: number, action: string }>, message: string };
    
    getNodesForVisualization(): Array<{ value: number, x: number, y: number, left: number | null, right: number | null }>;
    getEdgesForVisualization(): Array<{ from: { x: number, y: number }, to: { x: number, y: number } }>;
}
