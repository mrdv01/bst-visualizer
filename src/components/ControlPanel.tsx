import React from 'react';

export type TreePreset = 'empty' | 'perfect' | 'random' | 'skewedRight' | 'skewedLeft';

interface ControlPanelProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onInsert: () => void;
  onSearch: () => void;
  onRemove: () => void;
  onFindMin: () => void;
  onFindMax: () => void;
  onClear: () => void;
  onInorder: () => void;
  onPreorder: () => void;
  onPostorder: () => void;
  onGeneratePreset: (preset: TreePreset) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  inputValue,
  onInputChange,
  onInsert,
  onSearch,
  onRemove,
  onFindMin,
  onFindMax,
  onClear,
  onInorder,
  onPreorder,
  onPostorder,
  onGeneratePreset,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers 1-99
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 99)) {
      onInputChange(value);
    }
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TreePreset;
    if (value) {
      onGeneratePreset(value);
      e.target.value = ''; // Reset dropdown
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-900 to-slate-800 p-6 flex flex-col gap-6 border-r border-slate-700">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          BST Visualizer
        </h1>
        <p className="text-slate-400 text-sm mt-1">Binary Search Tree</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

      {/* Quick Generate Dropdown */}
      <div className="space-y-3">
        <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Generate
        </label>
        <select
          onChange={handlePresetChange}
          defaultValue=""
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
          }}
        >
          <option value="" disabled className="bg-slate-800">Select a preset...</option>
          <option value="empty" className="bg-slate-800">🗑️ Empty - Clear Tree</option>
          <option value="perfect" className="bg-slate-800">⚖️ Perfect BST - Balanced</option>
          <option value="random" className="bg-slate-800">🎲 Random BST - 8 Values</option>
          <option value="skewedRight" className="bg-slate-800">➡️ Skewed Right</option>
          <option value="skewedLeft" className="bg-slate-800">⬅️ Skewed Left</option>
        </select>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

      {/* Input Section */}
      <div className="space-y-3">
        <label className="text-slate-300 text-sm font-medium">Enter Value (1-99)</label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a number..."
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Main Operations */}
      <div className="space-y-3">
        <label className="text-slate-300 text-sm font-medium">Operations</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onInsert}
            className="px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Insert
          </button>
          <button
            onClick={onSearch}
            className="px-3 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Search
          </button>
          <button
            onClick={onRemove}
            className="px-3 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-medium rounded-lg shadow-lg shadow-rose-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Utility Operations */}
      <div className="space-y-3">
        <label className="text-slate-300 text-sm font-medium">Utilities</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onFindMin}
            className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Find Min
          </button>
          <button
            onClick={onFindMax}
            className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Find Max
          </button>
          <button
            onClick={onClear}
            className="px-3 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

      {/* Traversal Operations */}
      <div className="space-y-3">
        <label className="text-slate-300 text-sm font-medium">Tree Traversals</label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={onInorder}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Inorder Traversal
          </button>
          <button
            onClick={onPreorder}
            className="px-4 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg shadow-fuchsia-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Preorder Traversal
          </button>
          <button
            onClick={onPostorder}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Postorder Traversal
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Footer Info */}
      <div className="text-center text-slate-500 text-xs">
        <p>Inspired by VisualGo</p>
      </div>
    </div>
  );
};

export default ControlPanel;
