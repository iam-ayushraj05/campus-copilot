import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { aiService } from '../ai/aiService';
import {
  Sparkles,
  Award,
  AlertTriangle,
  Clock,
  Code,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import '../styles/profile.css';

export const ProfilePage: React.FC = () => {
  const { profile, weakTopics, strongTopics } = useApp();
  const navigate = useNavigate();

  const weakestTopicObj = weakTopics[0];
  const aiInsightText = aiService.getProfileInsight(
    profile.studyHoursThisWeek,
    profile.quizAccuracyPercentage,
    weakestTopicObj?.topic || 'Recursion'
  );

  return (
    <div>
      {/* Header Developer Profile Card */}
      <div className="profile-header-card">
        <img src={profile.avatar} alt={profile.name} className="avatar-large" />
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {profile.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
            {profile.major} • {profile.year}, {profile.semester} • {profile.university}
          </p>
        </div>
      </div>

      {/* Developer Learning Insight */}
      <div className="dev-card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
          <Sparkles size={14} /> LEARNING INSIGHT
        </div>
        <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {aiInsightText}
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ marginBottom: '20px' }}>
        <h3 className="section-title">PROGRESS</h3>
        <div className="metrics-row">
          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{profile.codingProblemsSolved}</div>
            <div className="stat-label">Problems Solved</div>
          </div>

          <div className="stat-box">
            <div className="stat-value">{profile.studyHoursThisWeek}h</div>
            <div className="stat-label">Study Time</div>
          </div>

          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{profile.quizAccuracyPercentage}%</div>
            <div className="stat-label">Quiz Accuracy</div>
          </div>

          <div className="stat-box">
            <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{profile.streakDays}d</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Achievements Row */}
      <div style={{ marginBottom: '24px' }}>
        <h3 className="section-title">ACHIEVEMENTS</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <div className="achievement-pill">
            <Flame size={16} color="var(--accent-orange)" />
            <span>14 Day Streak</span>
          </div>
          <div className="achievement-pill">
            <Code size={16} color="var(--accent-blue)" />
            <span>40+ Problems Solved</span>
          </div>
          <div className="achievement-pill">
            <Clock size={16} color="var(--accent-green)" />
            <span>10 Study Sessions</span>
          </div>
          <div className="achievement-pill">
            <Award size={16} color="var(--accent-purple)" />
            <span>First Topic Mastered</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* NEEDS PRACTICE */}
        <div className="dev-card">
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="var(--accent-red)" />
            NEEDS PRACTICE
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weakTopics.map(wt => (
              <div key={wt.id} className="topic-bar-row">
                <div className="topic-bar-info">
                  <span style={{ color: 'var(--text-primary)' }}>{wt.topic}</span>
                  <span style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>{wt.accuracy}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${wt.accuracy}%`,
                      background: 'var(--accent-red)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {wt.subject} {wt.lastPracticed ? `• ${wt.lastPracticed}` : ''}
                  </span>
                  <button
                    onClick={() => navigate(`/study?mode=teach&topic=${encodeURIComponent(wt.topic)}`)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                  >
                    Practice →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STRONG AREAS */}
        <div className="dev-card">
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--accent-green)" />
            STRONG AREAS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {strongTopics.map(st => (
              <div key={st.id} className="topic-bar-row">
                <div className="topic-bar-info">
                  <span style={{ color: 'var(--text-primary)' }}>{st.topic}</span>
                  <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{st.accuracy}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${st.accuracy}%`,
                      background: 'var(--accent-green)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
