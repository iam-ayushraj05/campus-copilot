import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Target,
} from 'lucide-react';
import '../styles/dashboard.css';

export const DashboardPage: React.FC = () => {
  const { profile, todayFocus, nextBestMove, weakTopics, exams, assignments } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Good morning, {profile.name} 👋</h1>
        <p className="dashboard-subtitle">Here's what you should focus on today.</p>
      </div>

      {/* Developer Challenge Recommendation Box */}
      <div className="recommendation-box">
        <div className="recommendation-header">
          <span className="recommendation-tag">
            RECOMMENDED PRACTICE
          </span>
          <span className="dev-badge badge-orange">Priority Focus</span>
        </div>

        <h2 className="recommendation-title">{nextBestMove.targetSubject} — {nextBestMove.targetTopic}</h2>
        <p className="recommendation-reason">{nextBestMove.reason}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {nextBestMove.targetAccuracy !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Accuracy:</span>
              <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{nextBestMove.targetAccuracy}%</span>
            </div>
          )}

          {nextBestMove.targetAccuracy !== undefined && (
            <div style={{ width: '140px' }} className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${nextBestMove.targetAccuracy}%`, background: nextBestMove.targetAccuracy < 50 ? 'var(--accent-red)' : 'var(--accent-orange)' }} />
            </div>
          )}

          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            Est. Time: {nextBestMove.targetMinutes} mins
          </div>
        </div>

        <button
          onClick={() => navigate(nextBestMove.targetRoute)}
          className="btn-primary"
        >
          Start Practice Session <ArrowRight size={16} />
        </button>
      </div>

      {/* Compact Developer Metrics Row */}
      <div style={{ marginBottom: '24px' }}>
        <h3 className="section-title">
          <Target size={18} color="var(--accent-green)" />
          Developer Stats
        </h3>

        <div className="metrics-row">
          <div className="stat-box">
            <div className="stat-value">{profile.studyHoursThisWeek}h</div>
            <div className="stat-label">Study Time</div>
          </div>

          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{profile.quizAccuracyPercentage}%</div>
            <div className="stat-label">Quiz Accuracy</div>
          </div>

          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{profile.codingProblemsSolved}</div>
            <div className="stat-label">Problems Solved</div>
          </div>

          <div className="stat-box">
            <div className="stat-value">{profile.topicsCompleted}</div>
            <div className="stat-label">Topics Mastered</div>
          </div>

          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{profile.streakDays}d</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Today's Goals & Tasks */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h3 className="section-title">
              <CheckSquare size={18} color="var(--accent-green)" />
              TODAY'S GOALS & TASKS
            </h3>

            <div className="goals-list">
              {todayFocus.map(item => (
                <div key={item.id} className="goal-row">
                  <div className="goal-left">
                    <div className="goal-checkbox">
                      <Square size={14} color="var(--text-muted)" />
                    </div>
                    <div>
                      <div className="goal-title">{item.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.subject} • <span style={{ color: item.priority === 'high' ? 'var(--accent-red)' : 'var(--accent-orange)' }}>{item.dueText}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(item.targetRoute)}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    {item.actionText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weak Topics & Upcoming */}
        <div>
          {/* Weak Topics Box */}
          <div className="dev-card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="var(--accent-red)" />
              Weak Topics (Needs Practice)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weakTopics.map(topic => (
                <div key={topic.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {topic.topic}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {topic.accuracy}% Accuracy
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/study?mode=teach&topic=${encodeURIComponent(topic.topic)}`)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                  >
                    Practice →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="dev-card">
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="var(--accent-blue)" />
              Upcoming Deadlines
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {exams.map(exam => (
                <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{exam.subject} Exam</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontWeight: 700 }}>{exam.daysRemaining}d left</span>
                </div>
              ))}

              {assignments.map(asg => (
                <div key={asg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{asg.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>{asg.dueText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
