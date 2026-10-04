import React, { useState } from 'react';
import type { CodeLanguage, CodeAction, CodeAnalysisResult } from '../types';
import { sampleCodeSnippets } from '../data/demoData';
import { aiService } from '../ai/aiService';
import { useApp } from '../context/AppContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import {
  Code2,
  Bug,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Play,
  Lightbulb,
  Send,
  XCircle,
} from 'lucide-react';
import '../styles/code.css';

export const CodePage: React.FC = () => {
  const { incrementProblemsSolved, recordCodingMistake } = useApp();
  const [language, setLanguage] = useState<CodeLanguage>('python');
  const [code, setCode] = useState<string>(sampleCodeSnippets.buggy_recursion.code);
  const [activeAction, setActiveAction] = useState<CodeAction>('find_bug');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<CodeAnalysisResult | null>(
    aiService.analyzeCodeSnippet({ code: sampleCodeSnippets.buggy_recursion.code, language: 'python', action: 'find_bug' })
  );

  // Practice state
  const [practiceCode, setPracticeCode] = useState<string>('def factorial(n):\n    # Add base case here\n    return n * factorial(n - 1)');
  const [practiceEvaluation, setPracticeEvaluation] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [submittingPractice, setSubmittingPractice] = useState<boolean>(false);

  const handleLanguageChange = (lang: CodeLanguage) => {
    setLanguage(lang);
    if (lang === 'python') setCode(sampleCodeSnippets.buggy_recursion.code);
    else if (lang === 'java') setCode(sampleCodeSnippets.buggy_java_threads.code);
    else if (lang === 'cpp' || lang === 'c') setCode(sampleCodeSnippets.buggy_cpp_pointers.code);
  };

  const handleRunAnalysis = (action: CodeAction) => {
    setActiveAction(action);
    setLoading(true);
    setPracticeEvaluation(null);

    setTimeout(() => {
      const res = aiService.analyzeCodeSnippet({
        code,
        language,
        action,
      });
      setAnalysis(res);
      setLoading(false);

      if (action === 'find_bug' || action === 'explain_error') {
        recordCodingMistake('Recursion');
      }
    }, 400);
  };

  const handlePracticeSubmit = () => {
    setSubmittingPractice(true);
    setTimeout(() => {
      setSubmittingPractice(false);
      const codeTrim = practiceCode.toLowerCase();
      const hasBaseCase = (codeTrim.includes('if') || codeTrim.includes('return 1')) && (codeTrim.includes('n <= 1') || codeTrim.includes('n == 0') || codeTrim.includes('n == 1') || codeTrim.includes('<= 1') || codeTrim.includes('== 1'));

      if (hasBaseCase) {
        setPracticeEvaluation({
          isCorrect: true,
          feedback: 'Correct! Great job adding the base case (n <= 1 -> return 1). This prevents infinite recursive calls and stack overflow.',
        });
        incrementProblemsSolved();
      } else {
        setPracticeEvaluation({
          isCorrect: false,
          feedback: 'Needs Work: Your function is still missing a base case (e.g., if n <= 1: return 1). Without a base case, recursion runs infinitely.',
        });
        recordCodingMistake('Recursion');
      }
    }, 400);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={20} color="var(--accent-green)" />
            CodeExplain IDE Workspace
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Understand why your code fails instead of just getting a quick fix.
          </p>
        </div>
      </div>

      <div className="code-layout">
        {/* LEFT: Code Editor (Dark IDE Theme) */}
        <div className="editor-panel">
          <div className="editor-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#8B949E' }}>LANG:</span>
              <select
                className="language-select"
                value={language}
                onChange={e => handleLanguageChange(e.target.value as CodeLanguage)}
              >
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
                <option value="javascript">JavaScript (ES6)</option>
                <option value="c">C (GCC)</option>
              </select>
            </div>

            <button
              onClick={() => handleRunAnalysis(activeAction)}
              className="btn-primary"
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
            >
              <Play size={13} /> Run Analysis
            </button>
          </div>

          {/* Compact IDE Tool Bar */}
          <div className="action-bar">
            <button
              className={`mode-btn ${activeAction === 'explain' ? 'active' : ''}`}
              onClick={() => handleRunAnalysis('explain')}
            >
              Explain
            </button>
            <button
              className={`mode-btn ${activeAction === 'find_bug' ? 'active' : ''}`}
              onClick={() => handleRunAnalysis('find_bug')}
            >
              Find Bug
            </button>
            <button
              className={`mode-btn ${activeAction === 'fix' ? 'active' : ''}`}
              onClick={() => handleRunAnalysis('fix')}
            >
              Fix Code
            </button>
            <button
              className={`mode-btn ${activeAction === 'explain_error' ? 'active' : ''}`}
              onClick={() => handleRunAnalysis('explain_error')}
            >
              Explain Error
            </button>
            <button
              className={`mode-btn ${activeAction === 'practice' ? 'active' : ''}`}
              onClick={() => handleRunAnalysis('practice')}
            >
              Practice
            </button>
          </div>

          <textarea
            className="code-textarea"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="// Paste your code here..."
            spellCheck={false}
          />
        </div>

        {/* RIGHT: IDE Documentation Side Panel */}
        <div className="analysis-panel">
          {loading ? (
            <SkeletonLoader label="Executing static analysis & stack unrolling..." lines={5} />
          ) : analysis ? (
            <>
              {/* WHAT HAPPENED */}
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <AlertTriangle size={14} color="var(--accent-red)" /> WHAT HAPPENED
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {analysis.whatHappened}
                </p>
              </div>

              {/* WHY IT HAPPENED */}
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <Lightbulb size={14} color="var(--accent-orange)" /> WHY IT HAPPENED
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {analysis.whyItHappened}
                </p>
              </div>

              {/* WHERE */}
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <Bug size={14} color="var(--accent-blue)" /> WHERE
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                  {analysis.whereLocation}
                </div>
              </div>

              {/* HOW TO FIX IT */}
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <CheckCircle2 size={14} color="var(--accent-green)" /> HOW TO FIX IT
                </div>
                <pre className="code-block-preview">{analysis.howToFixCode}</pre>
              </div>

              {/* LEARN THIS */}
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <BookOpen size={14} color="var(--accent-green)" /> LEARN THIS
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {analysis.learnConcept}
                </p>
              </div>

              {/* TRY THIS PRACTICE PROBLEM */}
              <div className="analysis-section">
                <div className="analysis-section-title">
                  <Sparkles size={14} color="var(--accent-orange)" /> TRY THIS PRACTICE PROBLEM
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {analysis.tryPracticeProblem.title}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {analysis.tryPracticeProblem.description}
                </p>

                <textarea
                  style={{
                    width: '100%',
                    height: '100px',
                    background: '#0D1117',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#E6EDF3',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    resize: 'vertical',
                    marginBottom: '8px',
                  }}
                  value={practiceCode}
                  onChange={e => setPracticeCode(e.target.value)}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                    💡 Hint: {analysis.tryPracticeProblem.hint}
                  </span>
                  <button
                    onClick={handlePracticeSubmit}
                    disabled={submittingPractice}
                    className="btn-primary"
                    style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                  >
                    <Send size={12} /> {submittingPractice ? 'Evaluating...' : 'Submit Solution'}
                  </button>
                </div>

                {practiceEvaluation && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      marginTop: '8px',
                      background: practiceEvaluation.isCorrect ? 'rgba(46, 160, 67, 0.15)' : 'rgba(218, 54, 51, 0.15)',
                      border: `1px solid ${practiceEvaluation.isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                      fontSize: '0.82rem',
                      color: practiceEvaluation.isCorrect ? 'var(--accent-green)' : 'var(--accent-red)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    {practiceEvaluation.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>
                        {practiceEvaluation.isCorrect ? 'Correct!' : 'Needs Work'}
                      </div>
                      <div style={{ opacity: 0.9, lineHeight: '1.4' }}>{practiceEvaluation.feedback}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Select an action above or click "Run Analysis".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

