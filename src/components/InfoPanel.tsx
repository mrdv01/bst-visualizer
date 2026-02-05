import React, { useState } from 'react';

interface InfoPanelProps {
  title: string;
  message: string;
  codeSnippet: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ title, message, codeSnippet }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed bottom-0 right-0 z-40 flex items-end transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'
      }`}
    >
      {/* Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-l-lg shadow-lg flex items-center justify-center transition-colors"
          style={{ width: '40px', height: '50px' }}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Panel Content */}
      <div className="bg-slate-100 w-80 shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header - Title */}
        <div className="bg-slate-100 p-2 text-right">
          <h3 className="text-xl font-bold text-gray-900">{title || 'BST Visualizer'}</h3>
        </div>

        {/* Status Bar - Orange */}
        <div className="bg-[#ff9933] p-3 text-white font-medium text-sm min-h-[50px] flex items-center">
          {message || 'Ready'}
        </div>

        {/* Code Area - Green */}
        <div className="bg-[#dcdcaa] p-3 text-black font-mono text-sm leading-relaxed whitespace-pre-wrap min-h-[150px] border-t border-slate-300">
            {/* Using a lighter green/yellow shade similar to VSCode light theme or the screenshot */}
            {/* The screenshot had a lime green #99cc33 style. Let's try to match that better. */}
            <div className="bg-[#99cc33] -m-3 p-4 h-full min-h-[200px] overflow-y-auto">
                {codeSnippet || '// Algorithm details will appear here...'}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
