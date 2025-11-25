import React from 'react';
import { Topic } from '../types';
import { Terminal, BarChart2, Database, BrainCircuit, Activity } from 'lucide-react';

interface SidebarProps {
  topics: Topic[];
  selectedTopicId: string | null;
  onSelectTopic: (id: string) => void;
  isProcessing: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  onSelectDifficulty: (diff: 'Easy' | 'Medium' | 'Hard') => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'terminal': return <Terminal size={18} />;
    case 'database': return <Database size={18} />;
    case 'chart': return <BarChart2 size={18} />;
    case 'brain': return <BrainCircuit size={18} />;
    case 'activity': return <Activity size={18} />;
    default: return <Terminal size={18} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  topics, 
  selectedTopicId, 
  onSelectTopic, 
  isProcessing,
  difficulty,
  onSelectDifficulty
}) => {
  const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
          <Terminal className="text-cyan-400" /> PyData Tutor
        </h1>
        <p className="text-xs text-slate-500 mt-2 mb-4">Master Python for Data Science</p>
        
        <div className="flex bg-slate-800/50 p-1 rounded-lg">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => !isProcessing && onSelectDifficulty(diff)}
              className={`flex-1 text-[10px] font-semibold py-1.5 rounded-md transition-all ${
                difficulty === diff 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              disabled={isProcessing}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Learning Paths
        </div>
        <nav className="space-y-1 px-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => !isProcessing && onSelectTopic(topic.id)}
              disabled={isProcessing}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                ${selectedTopicId === topic.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span className={selectedTopicId === topic.id ? 'text-blue-400' : 'text-slate-500'}>
                {getIcon(topic.icon)}
              </span>
              <div className="text-left">
                <div className="leading-none mb-1">{topic.name}</div>
                <div className="text-[10px] opacity-70 font-normal">{topic.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </aside>
  );
};