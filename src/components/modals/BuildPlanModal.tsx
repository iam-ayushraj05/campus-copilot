import React, { useState } from 'react';
import { X, Sparkles, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { aiService } from '../../ai/aiService';
import type { SmartPlanResult } from '../../ai/types';
import { useApp } from '../../context/AppContext';

interface BuildPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildPlanModal: React.FC<BuildPlanModalProps> = ({ isOpen, onClose }) => {
  const { weakTopics, addTasksFromStudyPlan } = useApp();
  const [availableHours, setAvailableHours] = useState<number>(2.5);
  const [examDate, setExamDate] = useState<string>('2026-10-08');
  const [subjectsStr, setSubjectsStr] = useState<string>('Data Structures, Operating Systems, DBMS');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultPlan, setResultPlan] = useState<SmartPlanResult | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const subjects = subjectsStr.split(',').map(s => s.trim()).filter(Boolean);
      const confMap: Record<string, number> = {};
      weakTopics.forEach(wt => {
        confMap[wt.topic] = wt.accuracy;
      });

      const plan = aiService.createSmartPlan({
        availableHours,
        examDate,
        subjects,
        currentConfidence: confMap,
        importantTopics: weakTopics.map(w => w.topic),
      });

      setResultPlan(plan);
      setLoading(false);
    }, 500);
  };

  const handleSavePlanToPlanner = () => {
    if (resultPlan && resultPlan.blocks.length > 0) {
      addTasksFromStudyPlan(resultPlan.blocks);
    }
    setResultPlan(null);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="dev-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '24px',
          borderLeft: '4px solid var(--accent-green)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={18} color="var(--accent-green)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Build My Smart Study Plan
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          CampusCopilot creates a time-blocked schedule prioritizing approaching deadlines and your weakest topics.
        </p>

        {!resultPlan ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Available Study Time Today: <span style={{ color: 'var(--accent-green)' }}>{availableHours} Hours</span>
              </label>
              <input
                type="range"
                min="0.75"
                max="6"
                step="0.25"
                value={availableHours}
                onChange={e => setAvailableHours(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-green)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Target Exam Date
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--text-secondary)" />
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Target Subjects (comma separated)
              </label>
              <input
                type="text"
                value={subjectsStr}
                onChange={e => setSubjectsStr(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ background: 'var(--bg-card-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                PRIORITY WEAK TOPICS DETECTED
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {weakTopics.map(wt => (
                  <span
                    key={wt.id}
                    className="dev-badge badge-red"
                  >
                    {wt.topic} ({wt.accuracy}%)
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
            >
              {loading ? (
                <>Building your study plan...</>
              ) : (
                <>
                  Generate Time-Blocked Plan <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                background: 'var(--accent-green-bg)',
                border: '1px solid var(--accent-green-border)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--accent-green)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{resultPlan.summary}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {resultPlan.blocks.map((block, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    background: block.type === 'break' ? 'var(--accent-orange-bg)' : 'var(--bg-card-secondary)',
                    border: '1px solid var(--border-color)',
                    borderLeft: `4px solid ${
                      block.type === 'break' ? 'var(--accent-orange)' : block.type === 'coding' ? 'var(--accent-blue)' : 'var(--accent-green)'
                    }`,
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {block.timeSlot} ({block.durationMinutes} min)
                    </span>
                    <span className="dev-badge badge-blue">
                      {block.subject}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {block.topic}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {block.reason}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setResultPlan(null)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Adjust Inputs
              </button>
              <button
                onClick={handleSavePlanToPlanner}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Add Plan to Planner →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
