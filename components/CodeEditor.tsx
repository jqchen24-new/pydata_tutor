import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onReset: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  onSubmit, 
  isSubmitting, 
  onReset,
  isMaximized,
  onToggleMaximize
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      // Need to defer setting selection range after render
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          <span className="ml-3 text-xs text-slate-400 font-medium">main.py</span>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={onToggleMaximize}
            className="flex items-center justify-center w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors mr-2"
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

           <button 
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            disabled={isSubmitting}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-500 rounded transition-all
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]'}
            `}
          >
            <Play size={14} className={isSubmitting ? 'animate-spin' : ''} /> 
            {isSubmitting ? 'Judging...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="relative flex-1 overflow-hidden flex">
        {/* Line Numbers */}
        <div className="w-10 bg-slate-900 text-right pr-3 pt-4 text-xs text-slate-600 select-none code-font leading-6">
          {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Editor Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 w-full h-full bg-transparent text-slate-300 p-4 pt-4 outline-none resize-none code-font text-sm leading-6 whitespace-pre"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
};