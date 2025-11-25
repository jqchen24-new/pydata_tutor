import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { ProblemDisplay } from './components/ProblemDisplay';
import { FeedbackPanel } from './components/FeedbackPanel';
import { generateProblem, evaluateSubmission } from './services/geminiService';
import { Problem, Topic, EvaluationResult, AppState } from './types';
import { Loader2, Code2, Sparkles } from 'lucide-react';

const TOPICS: Topic[] = [
  { id: 'python-basics', name: 'Python Basics', icon: 'terminal', description: 'Lists, Dicts, and Loops' },
  { id: 'numpy-arrays', name: 'NumPy Arrays', icon: 'database', description: 'Array manipulation & math' },
  { id: 'pandas-basics', name: 'Pandas DataFrames', icon: 'chart', description: 'Filtering & Selecting Data' },
  { id: 'pandas-advanced', name: 'Advanced Pandas', icon: 'activity', description: 'Groupby, Merge & Pivot' },
  { id: 'sklearn-intro', name: 'Scikit-Learn Intro', icon: 'brain', description: 'Preprocessing & Modeling' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const handleSelectTopic = useCallback(async (topicId: string) => {
    try {
      setAppState(AppState.GENERATING_PROBLEM);
      setSelectedTopic(topicId);
      setError(null);
      setFeedback(null);
      setIsEditorMaximized(false);
      
      const topic = TOPICS.find(t => t.id === topicId);
      if (!topic) return;

      const problem = await generateProblem(topic.name, difficulty);
      setCurrentProblem(problem);
      setUserCode(problem.startingCode);
      setAppState(AppState.SOLVING);
    } catch (err) {
      console.error(err);
      setError("Failed to generate problem. Please check your API key or try again.");
      setAppState(AppState.IDLE);
    }
  }, [difficulty]);

  const handleNextProblem = useCallback(() => {
    if (selectedTopic) {
      handleSelectTopic(selectedTopic);
    }
  }, [selectedTopic, handleSelectTopic]);

  const handleSubmit = useCallback(async () => {
    if (!currentProblem || !userCode) return;

    try {
      setAppState(AppState.EVALUATING);
      const result = await evaluateSubmission(currentProblem, userCode);
      setFeedback(result);
      setAppState(AppState.REVIEWING);
      // Automatically show the feedback panel by minimizing editor if it was maximized
      if (isEditorMaximized) setIsEditorMaximized(false);
    } catch (err) {
      console.error(err);
      setError("Failed to evaluate submission.");
      setAppState(AppState.SOLVING);
    }
  }, [currentProblem, userCode, isEditorMaximized]);

  const handleReset = () => {
    if (currentProblem) {
      setUserCode(currentProblem.startingCode);
      setFeedback(null);
      setAppState(AppState.SOLVING);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar 
        topics={TOPICS} 
        selectedTopicId={selectedTopic} 
        onSelectTopic={handleSelectTopic}
        isProcessing={appState === AppState.GENERATING_PROBLEM || appState === AppState.EVALUATING}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
      />

      <main className="flex-1 flex flex-col min-w-0">
        
        <div className="flex-1 p-6 overflow-hidden">
          {appState === AppState.IDLE && !currentProblem && (
             <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <div className="bg-slate-900 p-6 rounded-full mb-6 ring-1 ring-slate-800 shadow-2xl shadow-blue-900/20">
                  <Code2 size={48} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Welcome to PyData Tutor</h2>
                <p className="text-slate-400 text-lg mb-8">
                  Select a difficulty and a topic from the sidebar to generate a unique Data Science coding challenge powered by AI.
                </p>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Sparkles size={14} /> AI Generated</span>
                  <span className="flex items-center gap-1"><Sparkles size={14} /> Instant Feedback</span>
                </div>
             </div>
          )}

          {appState === AppState.GENERATING_PROBLEM && (
             <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h3 className="text-xl font-medium text-slate-300">Generating {difficulty} Challenge...</h3>
                <p className="text-slate-500 mt-2">Crafting a unique dataset and problem for you.</p>
             </div>
          )}

          {(currentProblem && appState !== AppState.GENERATING_PROBLEM) && (
            <div className={`h-full grid gap-6 ${isEditorMaximized ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              
              {/* Left Column: Problem & Feedback */}
              <div className={`flex-col h-full min-h-0 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 overflow-hidden relative ${isEditorMaximized ? 'hidden' : 'flex'}`}>
                 {appState === AppState.REVIEWING && feedback ? (
                   <>
                     <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                        <h3 className="font-bold text-slate-200">Evaluation Results</h3>
                        <button 
                          onClick={() => setAppState(AppState.SOLVING)}
                          className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          Back to Problem
                        </button>
                     </div>
                     <FeedbackPanel 
                      result={feedback} 
                      onClose={() => setAppState(AppState.SOLVING)} 
                      onNextProblem={handleNextProblem}
                    />
                   </>
                 ) : (
                    <ProblemDisplay problem={currentProblem} onNextProblem={handleNextProblem} />
                 )}
              </div>

              {/* Right Column: Editor */}
              <div className="flex flex-col h-full min-h-0">
                <CodeEditor 
                  code={userCode} 
                  onChange={setUserCode} 
                  onSubmit={handleSubmit}
                  isSubmitting={appState === AppState.EVALUATING}
                  onReset={handleReset}
                  isMaximized={isEditorMaximized}
                  onToggleMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
                />
                {error && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="hover:text-red-300"><Sparkles size={14}/></button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;