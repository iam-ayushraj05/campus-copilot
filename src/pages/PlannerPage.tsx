import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BuildPlanModal } from '../components/modals/BuildPlanModal';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Clock,
} from 'lucide-react';
import '../styles/planner.css';

export const PlannerPage: React.FC = () => {
  const { exams, assignments, tasks, addTask, toggleTask, deleteTask } = useApp();
  const [isBuildPlanOpen, setIsBuildPlanOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), 'Data Structures', 'practice');
    setNewTaskTitle('');
  };

  return (
    <div>
      {/* Top Banner with Build Study Plan CTA */}
      <div
        className="dev-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          borderLeft: '4px solid var(--accent-green)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
            <Sparkles size={14} /> PLANNER ENGINE
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Campus Planner
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Organize exams, assignments, and generate time-blocked study schedules.
          </p>
        </div>

        <button
          onClick={() => setIsBuildPlanOpen(true)}
          className="btn-primary"
        >
          <Sparkles size={15} /> Build My Study Plan
        </button>
      </div>

      <div className="planner-grid">
        {/* Column 1: Exams */}
        <div className="dev-card">
          <div className="planner-card-header">
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CalendarIcon size={16} color="var(--accent-red)" />
              UPCOMING EXAMS
            </h3>
            <span className="dev-badge badge-red">{exams.length} URGENT</span>
          </div>

          {exams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              🎉 No upcoming exams scheduled.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {exams.map(exam => (
                <div
                  key={exam.id}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-card-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {exam.subject}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>
                      {exam.daysRemaining}d left
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Date: {exam.date} • {exam.location || 'Exam Hall'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Assignments */}
        <div className="dev-card">
          <div className="planner-card-header">
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--accent-orange)" />
              ASSIGNMENTS
            </h3>
            <span className="dev-badge badge-orange">{assignments.length} ACTIVE</span>
          </div>

          {assignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              ✨ All assignments submitted!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {assignments.map(asg => (
                <div
                  key={asg.id}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-card-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {asg.title}
                    </span>
                    <span className={`dev-badge badge-${asg.priority === 'high' ? 'red' : 'orange'}`}>{asg.priority}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {asg.subject} • <span style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>{asg.dueText}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Interactive Tasks */}
        <div className="dev-card">
          <div className="planner-card-header">
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={16} color="var(--accent-green)" />
              DAILY TASKS
            </h3>
          </div>

          <form onSubmit={handleAddTaskSubmit} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Add task..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '6px 10px' }}>
              <Plus size={14} />
            </button>
          </form>

          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              👍 You're all caught up!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`task-checkbox-item ${task.completed ? 'completed' : ''}`}
                >
                  <div
                    onClick={() => toggleTask(task.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}
                  >
                    {task.completed ? (
                      <CheckSquare size={16} color="var(--accent-green)" />
                    ) : (
                      <Square size={16} color="var(--text-muted)" />
                    )}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{task.title}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BuildPlanModal isOpen={isBuildPlanOpen} onClose={() => setIsBuildPlanOpen(false)} />
    </div>
  );
};
