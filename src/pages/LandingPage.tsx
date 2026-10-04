import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code2, Calendar, ArrowRight, Cpu, Code } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px', textAlign: 'center' }}>
      {/* Hero Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--accent-green-bg)',
          color: 'var(--accent-green)',
          border: '1px solid var(--accent-green-border)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          marginBottom: '24px',
        }}
      >
        <Code size={14} />
        <span>BUILT FOR COMPUTER SCIENCE & ENGINEERING STUDENTS</span>
      </div>

      {/* Main Headline */}
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '16px',
          color: 'var(--text-primary)',
        }}
      >
        CampusCopilot
      </h1>

      <p
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--accent-green)',
          marginBottom: '12px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Your developer campus workspace.
      </p>

      <p
        style={{
          fontSize: '1.02rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 32px',
          lineHeight: 1.6,
        }}
      >
        Study smarter. Understand your code. Stay ahead of deadlines. CampusCopilot knows what you're studying, what you're struggling with, and what you should practice next.
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px' }}>
        <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          Launch Command Center <ArrowRight size={16} />
        </Link>
        <Link to="/study" className="btn-secondary" style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
          Open StudyBuddy
        </Link>
      </div>

      {/* 3 Core Feature Panels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          textAlign: 'left',
          marginBottom: '50px',
        }}
      >
        <div className="dev-card">
          <div style={{ color: 'var(--accent-green)', marginBottom: '14px' }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            📚 StudyBuddy
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Learn from your own materials. Upload PDF notes, ask questions with Grounded RAG, and practice with step-by-step progressive breakdown mode.
          </p>
        </div>

        <div className="dev-card">
          <div style={{ color: 'var(--accent-blue)', marginBottom: '14px' }}>
            <Code2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            &lt;/&gt; CodeExplain
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Understand errors instead of just fixing them. Get structured breakdowns on what happened, why it happened, and how to prevent stack overflows or race conditions.
          </p>
        </div>

        <div className="dev-card">
          <div style={{ color: 'var(--accent-orange)', marginBottom: '14px' }}>
            <Calendar size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            □ Campus Planner
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.55' }}>
            Know what to work on next. Manage exams, assignments, and generate intelligent time-blocked study plans personalized to your weakest topics.
          </p>
        </div>
      </div>

      {/* Trust Banner */}
      <div
        className="dev-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '20px 24px',
          textAlign: 'left',
          borderLeft: '4px solid var(--accent-green)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Cpu size={28} color="var(--accent-green)" />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Open-Weight AI Modular Architecture
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Runs seamlessly with local models (Llama 3.1) through Ollama or standalone fallback. Zero lock-in.
            </p>
          </div>
        </div>
        <Link to="/dashboard" className="btn-primary">
          Enter CampusCopilot <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};
