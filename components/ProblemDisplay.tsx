import React, { useState } from 'react';
import { Problem } from '../types';
import { BookOpen, AlertCircle, Lightbulb, ChevronDown, ChevronUp, ArrowRight, SkipForward } from 'lucide-react';
import { marked } from 'marked';

interface ProblemDisplayProps {
  problem: Problem;
  onNextProblem: () => void;
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem, onNextProblem }) => {
  const [showHints, setShowHints] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400';
    }
  };

  const renderMarkdown = (text: string) => {
    return { __html: marked.parse(text) };
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2 custom-scrollbar">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {problem.id}</span>
          </div>
          <button 
            onClick={onNextProblem}
            className="text-slate-500 hover:text-white transition-colors p-1"
            title="Skip Question"
          >
            <SkipForward size={16} />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-100 mb-4 leading-tight">
          {problem.title}
        </h2>
        
        <div 
          className="prose prose-invert prose-sm max-w-none text-slate-300 bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 [&>pre]:bg-slate-900 [&>pre]:border [&>pre]:border-slate-700"
          dangerouslySetInnerHTML={renderMarkdown(problem.description)}
        />
      </div>

      <div className="mt-auto space-y-4">
        {problem.hints && problem.hints.length > 0 && (
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg overflow-hidden">
            <button 
              onClick={() => setShowHints(!showHints)}
              className="w-full px-4 py-3 flex items-center justify-between text-blue-400 hover:bg-blue-500/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={16} />
                <span className="text-sm font-semibold">Need a hint?</span>
              </div>
              {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showHints && (
              <div className="px-4 pb-4 pt-1">
                <ul className="list-disc list-inside text-sm text-blue-300/80 space-y-2 border-t border-blue-500/10 pt-3">
                  {problem.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex gap-3 items-start">
          <AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-slate-400">
            Write your solution in the editor. Focus on efficiency and using proper library functions (e.g., Pandas vectorization).
          </p>
        </div>

        <button 
          onClick={onNextProblem}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg font-medium transition-colors border border-slate-700 mt-4 group"
        >
          <span>Skip to Next Question</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};