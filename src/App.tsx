import { useState, useCallback, useEffect, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import type { TreePreset } from './components/ControlPanel';
import TreeCanvas from './components/TreeCanvas';
import Toast from './components/Toast';
import type { ToastType } from './components/Toast';
import TraversalControls from './components/TraversalControls';
import InfoPanel from './components/InfoPanel';
import BST from './utils/bst';

// Create a single BST instance
const bst = new BST();

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

interface AnimatedEdge {
  from: { x: number; y: number; value: number };
  to: { x: number; y: number; value: number };
}

// Snapshot of the visualization state at a specific step
interface AnimationFrame {
  highlightedNode: number | null;
  pointerPosition: { x: number; y: number } | null;
  visitedNodes: number[];
  pathNodes: number[]; // Yellow border
  connectedEdges: AnimatedEdge[]; // Edges to show as connected/animated
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [nodes, setNodes] = useState<Array<{ value: number; x: number; y: number; left: number | null; right: number | null }>>([]);
  const [edges, setEdges] = useState<Array<{ from: { x: number; y: number }; to: { x: number; y: number } }>>([]);
  const [highlightedPath, setHighlightedPath] = useState<number[]>([]);
  const [message, setMessage] = useState(''); // Used for InfoPanel orange status
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  // Info Panel State
  const [infoTitle, setInfoTitle] = useState('BST Visualizer');
  const [infoCode, setInfoCode] = useState('Select an operation to see details.');

  // Animation state
  const [animatedEdges, setAnimatedEdges] = useState<AnimatedEdge[]>([]);
  const [pointerPosition, setPointerPosition] = useState<{ x: number; y: number } | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [pathNodes, setPathNodes] = useState<number[]>([]);
  
  // Traversal Control State
  const [isTraversalActive, setIsTraversalActive] = useState(false);
  const [traversalType, setTraversalType] = useState('');
  const [traversalFrames, setTraversalFrames] = useState<AnimationFrame[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x default
  const playbackTimerRef = useRef<number | null>(null);

  // Show toast notification
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Update visualization
  const updateVisualization = useCallback(() => {
    setNodes(bst.getNodesForVisualization());
    setEdges(bst.getEdgesForVisualization());
  }, []);

  // Show message temporarily
  const showMessage = (msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  /* =========================================
     ANIMATION FRAME GENERATION
     ========================================= */

  // Update Info Panel
  const updateInfo = (title: string, msg: string, code: string = '') => {
    setInfoTitle(title);
    setMessage(msg);
    if (code) setInfoCode(code);
  };

  // Handlers for Path Animation (Insert/Search/Delete/FindMin/FindMax)
  const generatePathFrames = (path: number[], finalHighlight?: number): AnimationFrame[] => {
    const frames: AnimationFrame[] = [];
    
    // Initial state
    let currentVisited: number[] = [];
    let currentAnimatedEdges: AnimatedEdge[] = [];
    let currentPointer: { x: number; y: number } | null = null;
    let currentHighlighted: number | null = null;

    // Add initial empty frame
    frames.push({
      highlightedNode: null,
      pointerPosition: null,
      visitedNodes: [],
      pathNodes: [],
      connectedEdges: []
    });

    const currentNodes = bst.getNodesForVisualization();
    const getPos = (value: number) => {
      const node = currentNodes.find((n: { value: number; x: number; y: number }) => n.value === value);
      return node ? { x: node.x, y: node.y } : null;
    };

    for (let i = 0; i < path.length; i++) {
        const currentValue = path[i];
        const currentPos = getPos(currentValue);

        if (currentPos) {
            // Step 1: Move pointer to node
            currentPointer = currentPos;
            currentHighlighted = currentValue;
            currentVisited = [...currentVisited, currentValue];
            
            frames.push({
                highlightedNode: currentHighlighted,
                pointerPosition: currentPointer,
                visitedNodes: [...currentVisited],
                pathNodes: [],
                connectedEdges: [...currentAnimatedEdges]
            });

            // Step 2: Draw edge to next node if exists
            if (i < path.length - 1) {
                const nextValue = path[i + 1];
                const nextPos = getPos(nextValue);

                if (nextPos) {
                    currentAnimatedEdges = [...currentAnimatedEdges, {
                        from: { ...currentPos, value: currentValue },
                        to: { ...nextPos, value: nextValue }
                    }];
                    
                    // Add frame with new edge
                    frames.push({
                        highlightedNode: currentHighlighted,
                        pointerPosition: currentPointer,
                        visitedNodes: [...currentVisited],
                        pathNodes: [],
                        connectedEdges: [...currentAnimatedEdges]
                    });
                }
            }
        }
    }

    // Final frame: Highlight the target node specifically if needed
    if (finalHighlight !== undefined) {
        const finalPos = getPos(finalHighlight);
        if (finalPos) {
            frames.push({
                highlightedNode: finalHighlight,
                pointerPosition: finalPos,
                visitedNodes: [...currentVisited],
                pathNodes: [],
                connectedEdges: [...currentAnimatedEdges]
            });
        }
    }

    return frames;
  };

  // Generate all frames for traversal operations
  const generateTraversalFrames = (steps: Array<{ value: number; action: string }>): AnimationFrame[] => {
    const frames: AnimationFrame[] = [];
    
    // Initial state
    let currentVisited: number[] = [];
    let currentPathNodes: number[] = [];
    let currentPointer: { x: number; y: number } | null = null;
    let currentHighlighted: number | null = null;
    
    // Add initial empty frame
    frames.push({
      highlightedNode: null,
      pointerPosition: null,
      visitedNodes: [],
      pathNodes: [],
      connectedEdges: []
    });

    const currentNodes = bst.getNodesForVisualization();
    const getPos = (value: number) => {
      const node = currentNodes.find((n: { value: number; x: number; y: number }) => n.value === value);
      return node ? { x: node.x, y: node.y } : null;
    };

    for (const step of steps) {
      const pos = getPos(step.value);
      if (!pos) continue;

      if (step.action === 'enter') {
        currentPathNodes = [...currentPathNodes, step.value];
        currentPointer = pos;
        currentHighlighted = step.value;
        // ENTER frame
        frames.push({
          highlightedNode: currentHighlighted,
          pointerPosition: currentPointer,
          visitedNodes: [...currentVisited],
          pathNodes: [...currentPathNodes],
          connectedEdges: []
        });
      } else if (step.action === 'visit') {
        currentVisited = [...currentVisited, step.value];
        currentPointer = pos;
        currentHighlighted = step.value;
        // VISIT frame
        frames.push({
          highlightedNode: currentHighlighted,
          pointerPosition: currentPointer,
          visitedNodes: [...currentVisited],
          pathNodes: [...currentPathNodes],
          connectedEdges: []
        });
      } else if (step.action === 'exit') {
        currentPathNodes = currentPathNodes.filter(v => v !== step.value);
        // On exit, we snap back to parent (last node in pathNodes) if exists
        const parentId = currentPathNodes[currentPathNodes.length - 1];
        if (parentId) {
            const parentPos = getPos(parentId);
            currentPointer = parentPos;
            currentHighlighted = parentId;
        } else {
            // Root exit
            currentPointer = null;
            currentHighlighted = null;
        }
        
        // EXIT frame
        frames.push({
          highlightedNode: currentHighlighted,
          pointerPosition: currentPointer,
          visitedNodes: [...currentVisited],
          pathNodes: [...currentPathNodes],
          connectedEdges: []
        });
      }
    }
    
    // Final completion frame
    frames.push({
      highlightedNode: null,
      pointerPosition: null,
      visitedNodes: [...currentVisited],
      pathNodes: [],
      connectedEdges: []
    });

    return frames;
  };

  /* =========================================
     PLAYBACK CHECK CONTROLLER
     ========================================= */

  // Unified start function for ALL animations
  const startAnimation = (type: string, frames: AnimationFrame[]) => {
    // Stop any existing
    setIsTraversalActive(false);
    setIsPlaying(false);
    
    // Reset state
    setAnimatedEdges([]);
    setVisitedNodes([]);
    setPathNodes([]);
    setHighlightedPath([]);
    setPointerPosition(null);
    setHighlightedNode(null);

    // Set new animation
    setTraversalFrames(frames);
    setTraversalType(type);
    setCurrentStep(0);
    setIsTraversalActive(true);
    setIsPlaying(true); // Auto-start
    
    // Apply initial frame
    if (frames.length > 0) {
        applyFrame(frames[0]);
    }
  };

  const applyFrame = (frame: AnimationFrame) => {
    setHighlightedNode(frame.highlightedNode);
    setPointerPosition(frame.pointerPosition);
    setVisitedNodes(frame.visitedNodes);
    setPathNodes(frame.pathNodes);
    setAnimatedEdges(frame.connectedEdges);
  };

  // Playback Loop
  useEffect(() => {
    if (isPlaying && isTraversalActive) {
      playbackTimerRef.current = window.setTimeout(() => {
        if (currentStep < traversalFrames.length - 1) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          applyFrame(traversalFrames[nextStep]);
        } else {
          setIsPlaying(false); // Stop at end
        }
      }, 800 / playbackSpeed); // Base speed 800ms
    }
    return () => {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, [isPlaying, currentStep, traversalFrames, isTraversalActive, playbackSpeed]);

  // Controls Handlers
  const handlePlayPause = () => {
    if (currentStep >= traversalFrames.length - 1) {
        // Restart if at end
        setCurrentStep(0);
        applyFrame(traversalFrames[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < traversalFrames.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      applyFrame(traversalFrames[nextStep]);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      applyFrame(traversalFrames[prevStep]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    applyFrame(traversalFrames[0]);
  };

  const handleCloseTraversal = () => {
    setIsPlaying(false);
    setIsTraversalActive(false);
    setVisitedNodes([]);
    setPathNodes([]);
    setAnimatedEdges([]);
    setPointerPosition(null);
    setHighlightedNode(null);
    updateInfo('BST Visualizer', 'Ready', '');
  };

  /* =========================================
     STANDARD OPERATIONS HANDLERS
     ========================================= */

  const handleInsert = async () => {
    if (inputValue) {
      const value = parseInt(inputValue);
      const result = bst.insert(value);
      updateVisualization();
      
      // Show toast based on result
      if (result.success) {
        showToast(`Inserted value ${value}`, 'success');
      } else {
        showToast(`Value ${value} already exists`, 'warning');
      }
      
      showMessage(result.message || '');
      
      const msg = result.success 
        ? `Inserting value ${value}` 
        : `Value ${value} already exists`;
      
      updateInfo(`Insert(${value})`, msg, 
        `// Algorithm: Insert(v)\n` +
        `if tree is empty, create root(v)\n` +
        `else, compare v with current node:\n` +
        `  if v < current, go left\n` +
        `  if v > current, go right\n` +
        `  insert when leaf is reached`
      );

      // Generate frames and start animation
      const frames = generatePathFrames(result.path);
      startAnimation(`Insert ${value}`, frames);
      
      setInputValue('');
    }
  };

  const handleSearch = async () => {
    if (inputValue) {
      const value = parseInt(inputValue);
      const result = bst.search(value);
      
      if (result.found) {
        showToast(`Found value ${value}`, 'success');
      } else {
        showToast(`Value ${value} not found`, 'error');
      }
      
      showMessage(result.message);
      
      const msg = result.found 
        ? `Found value ${value}` 
        : `Value ${value} not found`;
      
      updateInfo(`Search(${value})`, msg,
        `// Algorithm: Search(v)\n` +
        `if current is null, return not found\n` +
        `if v == current, return found\n` +
        `if v < current, search left\n` +
        `if v > current, search right`
      );

      // Generate frames and start animation
      const frames = generatePathFrames(result.path, result.found ? value : undefined);
      startAnimation(`Search ${value}`, frames);
    }
  };

  const handleRemove = async () => {
    if (inputValue) {
      const value = parseInt(inputValue);
      const result = bst.remove(value);
      
      if (result.success) {
        showToast(`Removed value ${value}`, 'success');
      } else {
        showToast(`Value ${value} not found`, 'error');
      }
      
      showMessage(result.message);
      
      const msg = result.success 
        ? `Removing value ${value}` 
        : `Value ${value} not found`; // This is often standard for remove if not found
      
      updateInfo(`Remove(${value})`, msg,
        `// Algorithm: Remove(v)\n` +
        `search for v\n` +
        `if v is leaf: remove v\n` +
        `if v has 1 child: replace v with child\n` +
        `if v has 2 children: replace v with successor`
      );

      // Note: We animate the path first, but the tree is already updated structurally
      // Ideally we'd animate before update, but for now we animate the search path
      const frames = generatePathFrames(result.path);
      startAnimation(`Remove ${value}`, frames);
      
      updateVisualization();
      setInputValue('');
    }
  };

  const handleFindMin = async () => {
    const result = bst.findMin();
    
    if (result.value !== null) {
      updateInfo('Find Min', `Minimum value is ${result.value}`, 
        `// Algorithm: FindMin\n` +
        `start at root\n` +
        `go left until node.left is null\n` +
        `return node.value`
      );
      // showMessage(result.message);
      
      const frames = generatePathFrames(result.path, result.value);
      startAnimation('Find Min', frames);
    } else {
      showToast('Tree is empty', 'warning');
    }
  };

  const handleFindMax = async () => {
    const result = bst.findMax();
    
    if (result.value !== null) {
      updateInfo('Find Max', `Maximum value is ${result.value}`,
        `// Algorithm: FindMax\n` +
        `start at root\n` +
        `go right until node.right is null\n` +
        `return node.value`
      );
      // showMessage(result.message);
      
      const frames = generatePathFrames(result.path, result.value);
      startAnimation('Find Max', frames);
    } else {
      showToast('Tree is empty', 'warning');
    }
  };

  const handleClear = () => {
    bst.clear();
    setNodes([]);
    setEdges([]);
    setHighlightedPath([]);
    setHighlightedNode(null);
    setAnimatedEdges([]);
    setVisitedNodes([]);
    setPathNodes([]);
    setPointerPosition(null);
    setInputValue('');
    // Also reset traversal mode
    setIsTraversalActive(false);
    
    updateInfo('Clear Tree', 'Tree cleared', '');
    showToast('Tree cleared', 'info');
  };

  const handleInorder = async () => {
    const result = bst.inorderDetailed();
    if (result.values.length === 0) {
      showToast('Tree is empty', 'warning');
      return;
    }
    showToast(`Inorder: ${result.values.join(' → ')}`, 'info');
    
    updateInfo('Inorder', `Traversing: ${result.values.join(' -> ')}`,
        `// Algorithm: Inorder(node)\n` +
        `if node is null return\n` +
        `Inorder(node.left)\n` +
        `Print node.value\n` +
        `Inorder(node.right)`
    );
    
    const frames = generateTraversalFrames(result.steps);
    startAnimation('Inorder', frames);
  };

  const handlePreorder = async () => {
    const result = bst.preorderDetailed();
    if (result.values.length === 0) {
      showToast('Tree is empty', 'warning');
      return;
    }
    showToast(`Preorder: ${result.values.join(' → ')}`, 'info');
    
    updateInfo('Preorder', `Traversing: ${result.values.join(' -> ')}`,
        `// Algorithm: Preorder(node)\n` +
        `if node is null return\n` +
        `Print node.value\n` +
        `Preorder(node.left)\n` +
        `Preorder(node.right)`
    );
    
    const frames = generateTraversalFrames(result.steps);
    startAnimation('Preorder', frames);
  };

  const handlePostorder = async () => {
    const result = bst.postorderDetailed();
    if (result.values.length === 0) {
      showToast('Tree is empty', 'warning');
      return;
    }
    showToast(`Postorder: ${result.values.join(' → ')}`, 'info');
    
    updateInfo('Postorder', `Traversing: ${result.values.join(' -> ')}`,
        `// Algorithm: Postorder(node)\n` +
        `if node is null return\n` +
        `Postorder(node.left)\n` +
        `Postorder(node.right)\n` +
        `Print node.value`
    );
    
    const frames = generateTraversalFrames(result.steps);
    startAnimation('Postorder', frames);
  };

  // Generate preset trees
  const handleGeneratePreset = (preset: TreePreset) => {
    // Clear existing tree first
    bst.clear();
    setHighlightedPath([]);
    setHighlightedNode(null);
    setAnimatedEdges([]);
    setVisitedNodes([]);
    setPathNodes([]);
    setPointerPosition(null);
    setInputValue('');
    setIsTraversalActive(false);

    let valuesToInsert: number[] = [];
    let presetName = '';

    switch (preset) {
      case 'empty':
        presetName = 'Empty';
        break;
      case 'perfect':
        valuesToInsert = [15, 6, 23, 4, 7, 20, 50];
        presetName = 'Perfect BST';
        break;
      case 'random':
        // Generate 8 unique random numbers between 1-99
        const randomSet = new Set<number>();
        while (randomSet.size < 8) {
          randomSet.add(Math.floor(Math.random() * 99) + 1);
        }
        valuesToInsert = Array.from(randomSet);
        presetName = 'Random BST';
        break;
      case 'skewedRight':
        valuesToInsert = [10, 20, 30, 40, 50];
        presetName = 'Skewed Right';
        break;
      case 'skewedLeft':
        valuesToInsert = [50, 40, 30, 20, 10];
        presetName = 'Skewed Left';
        break;
    }

    // Insert values instantly (no animation)
    valuesToInsert.forEach((value) => bst.insert(value));

    // Update visualization
    setNodes(bst.getNodesForVisualization());
    setEdges(bst.getEdgesForVisualization());

    // Show success toast
    showToast(`Generated ${presetName} tree`, 'success');
    updateInfo(`Preset: ${presetName}`, `Generated ${presetName} tree`, '');
  };

  return (
    <div className="h-screen w-screen flex bg-slate-950 overflow-hidden relative">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Control Panel - 30% width */}
      <div className="w-[30%] min-w-[280px] max-w-[400px] flex-shrink-0">
        <ControlPanel
          inputValue={inputValue}
          onInputChange={setInputValue}
          onInsert={handleInsert}
          onSearch={handleSearch}
          onRemove={handleRemove}
          onFindMin={handleFindMin}
          onFindMax={handleFindMax}
          onClear={handleClear}
          onInorder={handleInorder}
          onPreorder={handlePreorder}
          onPostorder={handlePostorder}
          onGeneratePreset={handleGeneratePreset}
        />
      </div>

      {/* Tree Visualizer Canvas - 70% width */}
      <div className="flex-grow overflow-auto relative">
        <TreeCanvas
          nodes={nodes}
          edges={edges}
          highlightedPath={highlightedPath}
          highlightedNode={highlightedNode}
          animatedEdges={animatedEdges}
          pointerPosition={pointerPosition}
          visitedNodes={visitedNodes}
          pathNodes={pathNodes}
        />

        {/* Info Panel - VisualGo Style */}
        <InfoPanel
          title={infoTitle}
          message={message}
          codeSnippet={infoCode}
        />

        {/* Floating Traversal Controls */}
        {isTraversalActive && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
            <TraversalControls
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={traversalFrames.length}
              speed={playbackSpeed}
              onPlay={handlePlayPause}
              onPause={handlePlayPause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onSpeedChange={setPlaybackSpeed}
              onClose={handleCloseTraversal}
              traversalType={traversalType}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
