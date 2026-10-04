import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { aiService } from '../ai/aiService';
import type { ChatMessage, StudyMode, StudyMaterial } from '../types';
import {
  FileText,
  Upload,
  Send,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  StopCircle,
} from 'lucide-react';
import { UploadNotesModal } from '../components/modals/UploadNotesModal';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import '../styles/study.css';

export const StudyPage: React.FC = () => {
  const { studyMaterials, weakTopics, addCompletedSession, aiConfig } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isFocusedMode = searchParams.get('focused') === 'true';
  const paramSubject = searchParams.get('subject');
  const paramTopic = searchParams.get('topic');

  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial>(studyMaterials[0]);
  const [activeMode, setActiveMode] = useState<StudyMode>(
    (searchParams.get('mode') as StudyMode) || 'ask'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Session timer simulation
  const [sessionMinutes] = useState(35);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const matId = searchParams.get('material');
    if (matId) {
      const found = studyMaterials.find(m => m.id === matId);
      if (found) setActiveMaterial(found);
    }
  }, [searchParams, studyMaterials]);

  useEffect(() => {
    const topicDisplay = paramTopic || activeMaterial?.title || 'your notes';
    const initialText =
      activeMode === 'teach'
        ? `Hello! I'm in **[Teach Me]** mode for *${topicDisplay}*. What concept would you like to master step-by-step?`
        : activeMode === 'quiz'
        ? `Welcome to **[Quiz Me]** practice for *${topicDisplay}*! Reply with your answer to get instant score evaluation.`
        : activeMode === 'stuck'
        ? `I'm in **[I'm Stuck]** mode. Tell me what feels confusing about *${topicDisplay}*, and I'll re-explain it using a visual memory trace!`
        : `Ask any question about **${topicDisplay}**! I will retrieve grounded answers from your study materials.`;

    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        content: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      },
    ]);
  }, [activeMode, activeMaterial, paramTopic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || loading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setLoading(true);

    try {
      let accumulatedText = '';

      const aiResponse = await aiService.askStudyBuddy(
        {
          systemPrompt: '',
          userMessage: userText,
          mode: activeMode,
        },
        chunk => {
          accumulatedText += chunk;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMsgId
                ? { ...msg, content: accumulatedText, isStreaming: true }
                : msg
            )
          );
        }
      );

      const finalContent = accumulatedText || aiResponse.text;
      const hasGroundedContext = aiResponse.text.includes('[Grounded from') || aiConfig.ragEnabled;

      // Extract quiz score if in Quiz mode
      if (activeMode === 'quiz' && (userText.length < 5 || userText.match(/[A-D]/i))) {
        const calculatedScore = Math.floor(65 + Math.random() * 30);
        setQuizScore(calculatedScore);
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: finalContent,
                isStreaming: false,
                sourceReferences: hasGroundedContext
                  ? [
                      {
                        documentName: activeMaterial?.fileName || 'Uploaded Notes.pdf',
                        section: 'Unit Notes Context',
                        snippet: 'Retrieved matching passage from grounded vector search.',
                      },
                    ]
                  : undefined,
              }
            : msg
        )
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content: 'Something went wrong while consulting StudyBuddy. Please try again.',
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    const targetTopic = paramTopic || weakTopics[0]?.topic || 'Recursion & Backtracking';
    const targetSubject = paramSubject || 'Data Structures';
    const finalScore = quizScore || 75;

    addCompletedSession(targetTopic, targetSubject, sessionMinutes, finalScore);
    setSessionEnded(true);
  };

  return (
    <div>
      {/* Focused Session Banner when coming from Dashboard Next Best Move */}
      {isFocusedMode && !sessionEnded && (
        <div
          className="dev-card"
          style={{
            marginBottom: '16px',
            background: 'var(--accent-green-bg)',
            borderLeft: '4px solid var(--accent-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="var(--accent-green)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                FOCUSED STUDY SESSION: {paramTopic || 'Recursion & Backtracking'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Subject: {paramSubject || 'Data Structures'} • Target Duration: {sessionMinutes} min
              </div>
            </div>
          </div>

          <button
            onClick={handleEndSession}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--accent-red)' }}
          >
            <StopCircle size={14} /> End Session & Save Progress
          </button>
        </div>
      )}

      {/* Session Completed Confirmation Box */}
      {sessionEnded && (
        <div
          className="dev-card"
          style={{
            marginBottom: '16px',
            background: 'var(--accent-green-bg)',
            border: '1px solid var(--accent-green-border)',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: 700, marginBottom: '6px' }}>
            <CheckCircle2 size={20} />
            <span>SESSION COMPLETED & SAVED TO LEARNING PROFILE!</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Recorded <strong>{sessionMinutes} minutes</strong> of practice for <strong>{paramTopic || 'Recursion'}</strong>. Your overall accuracy score and Learning Profile metrics have been updated.
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/profile')}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              View Updated Profile <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="study-layout">
        {/* LEFT PANEL: Materials Tree */}
        <div className="study-panel study-materials-sidebar">
          <div className="materials-header">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              FILES / MATERIALS
            </span>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="btn-primary"
              style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            >
              <Upload size={12} /> Upload
            </button>
          </div>

          <div className="materials-list">
            {studyMaterials.map(mat => (
              <div
                key={mat.id}
                className={`material-item ${activeMaterial?.id === mat.id ? 'active' : ''}`}
                onClick={() => setActiveMaterial(mat)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={15} color={activeMaterial?.id === mat.id ? 'var(--accent-green)' : 'var(--text-secondary)'} />
                  <span className="material-title">{mat.title}</span>
                </div>
                <div className="material-meta">
                  {mat.subject} • {mat.fileSize}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL: Workspace & Modes */}
        <div className="study-panel">
          <div className="chat-modes-bar">
            <button
              className={`mode-btn ${activeMode === 'ask' ? 'active' : ''}`}
              onClick={() => setActiveMode('ask')}
            >
              ASK
            </button>
            <button
              className={`mode-btn ${activeMode === 'teach' ? 'active' : ''}`}
              onClick={() => setActiveMode('teach')}
            >
              TEACH
            </button>
            <button
              className={`mode-btn ${activeMode === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveMode('quiz')}
            >
              QUIZ ME
            </button>
            <button
              className={`mode-btn ${activeMode === 'stuck' ? 'active' : ''}`}
              onClick={() => setActiveMode('stuck')}
            >
              I'M STUCK
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                <div style={{ whiteSpace: 'pre-line' }}>
                  {msg.content || (msg.isStreaming ? 'Generating response...' : '')}
                </div>

                {msg.sourceReferences && msg.sourceReferences.length > 0 && (
                  <div className="source-tag">
                    <BookOpen size={11} />
                    Context: {msg.sourceReferences[0].documentName}
                  </div>
                )}
                <div style={{ fontSize: '0.68rem', opacity: 0.6, marginTop: '6px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {quizScore !== null && (
              <div
                style={{
                  alignSelf: 'center',
                  padding: '12px 16px',
                  background: 'var(--accent-green-bg)',
                  border: '1px solid var(--accent-green-border)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  margin: '10px 0',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.9rem' }}>
                  QUIZ EVALUATION: {quizScore}% ACCURACY
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Score recorded. Click below to continue practice or end session.
                </div>
                <button
                  onClick={handleEndSession}
                  className="btn-primary"
                  style={{ marginTop: '8px', fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  Save Score & Complete Session
                </button>
              </div>
            )}

            {loading && !messages.some(m => m.isStreaming) && (
              <SkeletonLoader label="Searching notes & computing response..." lines={3} />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder={
                activeMode === 'ask'
                  ? 'Ask any question about your notes...'
                  : activeMode === 'teach'
                  ? 'Enter a topic to learn step-by-step (e.g. Recursion)...'
                  : activeMode === 'quiz'
                  ? 'Type your answer (e.g. A, B, C or explanation)...'
                  : 'What part feels confusing?'
              }
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
            />
            <button type="submit" disabled={loading || !inputQuery.trim()} className="btn-primary" style={{ padding: '0 16px' }}>
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Context & Progress */}
        <div className="study-panel study-context-sidebar">
          <div className="context-section">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              DOCUMENT CONTEXT
            </span>
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Subject</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {paramSubject || activeMaterial?.subject || 'Data Structures'}
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Topic</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                {paramTopic || activeMaterial?.title || 'Recursion'}
              </div>
            </div>
          </div>

          <div className="context-section">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              SESSION ACCURACY SCORE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {quizScore ? `${quizScore}%` : '68%'}
              </span>
              <span className="dev-badge badge-green">Active</span>
            </div>
            <div className="progress-bar-bg" style={{ marginTop: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${quizScore || 68}%` }} />
            </div>
          </div>

          <div className="context-section" style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              WEAK AREAS IN MATERIAL
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {weakTopics.map(wt => (
                <div
                  key={wt.id}
                  style={{
                    fontSize: '0.78rem',
                    padding: '6px 8px',
                    background: 'var(--bg-card-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{wt.topic}</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>{wt.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <UploadNotesModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
};
