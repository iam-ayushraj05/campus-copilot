import React from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Database, Settings as SettingsIcon, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { aiConfig, checkAIConnection, setAIMode, updateAIConfig, studyMaterials } = useApp();

  const isConnected = aiConfig.connectionStatus === 'connected';
  const isChecking = aiConfig.connectionStatus === 'checking';

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SettingsIcon size={26} color="#6366F1" />
          AI Architecture & Provider Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Configure real open-weight AI models (Ollama), Grounded RAG parameters, and connection status.
        </p>
      </div>

      {/* Real Local AI Connection Status Card */}
      <div
        className="glass-card"
        style={{
          marginBottom: '24px',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
          background: isConnected
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%), var(--bg-card)'
            : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 39, 0.8) 100%), var(--bg-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={22} color={isConnected ? '#10B981' : '#F59E0B'} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Real Local AI Status (Ollama Engine)
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '20px',
              background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: isConnected ? '#34D399' : '#F87171',
            }}
          >
            {isConnected ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{isConnected ? '● Connected' : '○ Not Connected'}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>AI Provider</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Ollama Server
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{aiConfig.baseUrl}</div>
          </div>

          <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Model</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Llama 3.1 8B Instruct
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {aiConfig.modelName}
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div
            style={{
              padding: '16px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontWeight: 700, color: '#FBBF24', fontSize: '0.92rem', marginBottom: '4px' }}>
              Local AI unavailable
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              Ollama server is not running on <code>http://localhost:11434</code>. CampusCopilot is operating in <strong>DEMO FALLBACK MODE</strong> so you can continue testing all features seamlessly.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={checkAIConnection}
                disabled={isChecking}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <RefreshCw size={15} className={isChecking ? 'spin' : ''} />
                {isChecking ? 'Checking Connection...' : 'Retry Connection'}
              </button>
              <button
                onClick={() => setAIMode('demo')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Use Demo Mode
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-sm)',
              color: '#34D399',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>REAL LOCAL AI IS ACTIVE via Ollama on port 11434</span>
            <button
              onClick={() => setAIMode('demo')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34D399',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Switch to Demo Mode
            </button>
          </div>
        )}
      </div>

      {/* Local AI & Privacy Section */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#06B6D4" />
          Local AI & Privacy
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          Your AI requests can be processed by an open-weight model running directly on your own machine through Ollama. Your course notes, PDF files, and source code do not need to be sent to external third-party servers when running local inference.
        </p>
      </div>

      {/* RAG & Generation Parameters */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="#10B981" />
          Grounded RAG Vector Search Hyperparameters
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Document Context Grounding (RAG)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Pass retrieved PDF vector chunks into prompt context
              </div>
            </div>
            <input
              type="checkbox"
              checked={aiConfig.ragEnabled}
              onChange={e => updateAIConfig({ ragEnabled: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>Temperature</span>
              <span style={{ color: '#818CF8' }}>{aiConfig.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={aiConfig.temperature}
              onChange={e => updateAIConfig({ temperature: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: '#6366F1' }}
            />
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              Vector Index Statistics
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Indexed Documents: {studyMaterials.length} | Total Vector Chunks: {studyMaterials.reduce((acc, m) => acc + m.chunksCount, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
