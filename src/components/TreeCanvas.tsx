import React from 'react';

interface NodeData {
  value: number;
  x: number;
  y: number;
  left: number | null;
  right: number | null;
}

interface EdgeData {
  from: { x: number; y: number };
  to: { x: number; y: number };
}

interface AnimatedEdge {
  from: { x: number; y: number; value: number };
  to: { x: number; y: number; value: number };
}

interface TreeCanvasProps {
  nodes?: NodeData[];
  edges?: EdgeData[];
  highlightedPath?: number[];
  highlightedNode: number | null;
  // New animation props
  animatedEdges: AnimatedEdge[];
  pointerPosition: { x: number; y: number } | null;
  visitedNodes: number[];
  // Nodes currently in the traversal path (entered but not yet visited)
  pathNodes?: number[];
}

const TreeCanvas: React.FC<TreeCanvasProps> = ({
  nodes = [],
  edges = [],
  highlightedPath = [],
  highlightedNode,
  animatedEdges,
  pointerPosition = null,
  visitedNodes,
  pathNodes = [],
}) => {
  const nodeRadius = 22;

  const getNodeColor = (value: number): string => {
    // Visited nodes become solid orange (fully processed)
    if (visitedNodes.includes(value)) {
      return '#f97316'; // Orange - visited/processed
    }
    // Currently active node (pointer is here)
    if (highlightedNode === value) {
      return '#fbbf24'; // Yellow - current
    }
    // Nodes in traversal path (entered but not visited) - keep default color
    if (pathNodes.includes(value)) {
      return '#06b6d4'; // Cyan - but will have yellow border
    }
    // Legacy highlightedPath support
    if (highlightedPath.includes(value)) {
      return '#f59e0b'; // Amber
    }
    return '#06b6d4'; // Cyan - default
  };

  const getNodeBorderColor = (value: number): string => {
    // Visited nodes get orange border
    if (visitedNodes.includes(value)) {
      return '#fb923c'; // Orange border for visited
    }
    // Current node gets bright yellow border
    if (highlightedNode === value) {
      return '#fbbf24'; // Bright yellow border
    }
    // Nodes in path get yellow border (shows they're in call stack)
    if (pathNodes.includes(value)) {
      return '#fbbf24'; // Yellow border for path
    }
    if (highlightedPath.includes(value)) {
      return '#fbbf24';
    }
    return '#22d3ee'; // Cyan border - default
  };

  // Get border width - thicker for path/active nodes
  const getNodeBorderWidth = (value: number): number => {
    if (highlightedNode === value || pathNodes.includes(value) || visitedNodes.includes(value)) {
      return 4;
    }
    return 3;
  };

  // Check if an edge is part of the animated path
  const isEdgeAnimated = (edge: EdgeData): boolean => {
    return animatedEdges.some(
      (ae) =>
        (ae.from.x === edge.from.x && ae.from.y === edge.from.y &&
         ae.to.x === edge.to.x && ae.to.y === edge.to.y)
    );
  };

  return (
    <div className="h-full bg-slate-950 p-4 flex flex-col">
      {/* Header with message */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-300">Visualization</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>{nodes.length > 0 ? `${nodes.length} nodes` : 'Ready'}</span>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-grow min-h-[600px] min-w-[800px] bg-white rounded-xl border-2 border-slate-700 shadow-2xl shadow-slate-900/50 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          className="w-full h-full"
          style={{ minWidth: '800px', minHeight: '600px' }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            </pattern>
            {/* Node shadow filter */}
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            {/* Glow filter for animated elements */}
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Arrow marker for pointer */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#fbbf24"
              />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Draw base edges (gray) */}
          {edges.map((edge, index) => (
            <line
              key={`edge-${index}`}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke={isEdgeAnimated(edge) ? 'transparent' : '#64748b'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* Draw animated edges (yellow/orange growing line) */}
          {animatedEdges.map((edge, index) => (
            <g key={`animated-edge-${index}`}>
              {/* Glow effect */}
              <line
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#fbbf24"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.4"
                filter="url(#glowFilter)"
              />
              {/* Main animated line */}
              <line
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                stroke="#f59e0b"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </g>
          ))}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={`node-${node.value}`} filter="url(#nodeShadow)">
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={getNodeColor(node.value)}
                stroke={getNodeBorderColor(node.value)}
                strokeWidth={getNodeBorderWidth(node.value)}
                className="transition-all duration-300"
              />
              {/* Node value */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontWeight="bold"
                fontSize="14"
                fontFamily="system-ui"
              >
                {node.value}
              </text>
            </g>
          ))}

          {/* Pointer arrow indicator */}
          {pointerPosition && (
            <g className="transition-all duration-500 ease-in-out">
              {/* Arrow pointing down at the current node */}
              <polygon
                points={`${pointerPosition.x},${pointerPosition.y - nodeRadius - 10} ${pointerPosition.x - 10},${pointerPosition.y - nodeRadius - 28} ${pointerPosition.x + 10},${pointerPosition.y - nodeRadius - 28}`}
                fill="#fbbf24"
                filter="url(#glowFilter)"
              />
            </g>
          )}

          {/* Placeholder when empty */}
          {nodes.length === 0 && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94a3b8"
              fontSize="18"
              fontFamily="system-ui"
            >
              Insert values to visualize the BST
            </text>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-cyan-400" />
          <span>Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-400" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-yellow-400" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-amber-500 rounded" />
          <span>Path</span>
        </div>
      </div>
    </div>
  );
};

export default TreeCanvas;
