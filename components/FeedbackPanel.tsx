import React, { useState } from 'react';
import { EvaluationResult } from '../types';
import { CheckCircle2, XCircle, Zap, MessageSquare, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface FeedbackPanelProps {
  result: EvaluationResult;
  onClose: () => void;
  onNextProblem: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ result, onClose, onNextProblem }) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2">
       <div className={`p-4 rounded-xl border mb-6 flex items-center gap-4 ${
         result.isCorrect 
          ? 'bg-green-500/10 border-green-500/20' 
          : 'bg-red-500/10 border-red-500/20'
       }`}>
          {result.isCorrect ? (
            <div className="bg-green-500 p-2 rounded-full text-white shadow-lg shadow-green-900/20">
              <CheckCircle2 size={24} />
            </div>
          ) : (
             <div className="bg-red-500 p-2 rounded-full text-white shadow-lg shadow-red-900/20">
              <XCircle size={24} />
            </div>
          )}
          <div>
            <h3 className={`text-lg font-bold ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {result.isCorrect ? 'Great Job!' : 'Needs Improvement'}
            </h3>
            <p className="text-sm text-slate-400">
              Score: <span className="font-mono font-bold text-slate-200">{result.score}/100</span>
            </p>
          </div>
       </div>

       <div className="space-y-6 flex-1">
          <div>
            <div className="flex items-center gap-2 text-slate-200 mb-2 font-medium">
              <MessageSquare size={16} className="text-purple-400" /> Feedback
            </div>
            <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700 leading-relaxed">
              {result.feedback}
            </div>
          </div>

          <div>
             <div className="flex items-center gap-2 text-slate-200 mb-2 font-medium">
              <Zap size={16} className="text-yellow-400" /> Analysis
            </div>
             <div className="text-sm text-slate-400 mb-4 italic">
              {result.reasoning}
            </div>
          </div>
          
          {result.optimizedCode && (
            <div className="border-t border-slate-800 pt-4">
               <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-slate-200 font-medium hover:text-white transition-colors w-full mb-2"
               >
                 {showSolution ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                 <span>Reveal Optimized Solution</span>
               </button>
              
              {showSolution && (
                <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="text-xs text-slate-500 mb-1 ml-1">optimized_solution.py</div>
                  <pre className="text-xs bg-slate-950 p-4 rounded-lg border border-slate-800 text-blue-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {result.optimizedCode}
                  </pre>
                </div>
              )}
            </div>
          )}
       </div>

       <div className="pt-6 mt-4 border-t border-slate-800">
          <button 
            onClick={onNextProblem}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
          >
            Next Question <ArrowRight size={18} />
          </button>
       </div>
    </div>
  );
};