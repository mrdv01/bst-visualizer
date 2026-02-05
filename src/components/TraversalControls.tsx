import React from 'react';

interface TraversalControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onClose: () => void;
  traversalType: string;
}

const TraversalControls: React.FC<TraversalControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onClose,
  traversalType,
}) => {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const isAtStart = currentStep === 0;
  const isAtEnd = currentStep >= totalSteps;

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600 p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {traversalType} Traversal
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* Reset */}
        <button
          onClick={onReset}
          disabled={isAtStart}
          className={`p-2 rounded-lg transition-all ${
            isAtStart
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
          }`}
          title="Reset"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Step Backward */}
        <button
          onClick={onStepBackward}
          disabled={isAtStart || isPlaying}
          className={`p-2 rounded-lg transition-all ${
            isAtStart || isPlaying
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
          }`}
          title="Step Backward"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isAtEnd && !isPlaying}
          className={`p-3 rounded-full transition-all ${
            isAtEnd && !isPlaying
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 active:scale-95 shadow-lg shadow-amber-500/30'
          }`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={isAtEnd || isPlaying}
          className={`p-2 rounded-lg transition-all ${
            isAtEnd || isPlaying
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
          }`}
          title="Step Forward"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Skip to End */}
        <button
          onClick={() => { while (currentStep < totalSteps) onStepForward(); }}
          disabled={isAtEnd || isPlaying}
          className={`p-2 rounded-lg transition-all ${
            isAtEnd || isPlaying
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
          }`}
          title="Skip to End"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 w-12">Speed</span>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.25"
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <span className="text-sm text-amber-400 font-mono w-12 text-right">{speed}x</span>
      </div>

      {/* Status */}
      <div className="mt-3 text-center text-sm text-slate-400">
        {isAtEnd ? (
          <span className="text-green-400">✓ Traversal Complete</span>
        ) : isPlaying ? (
          <span className="text-amber-400">▶ Playing...</span>
        ) : (
          <span>Ready to traverse</span>
        )}
      </div>
    </div>
  );
};

export default TraversalControls;
