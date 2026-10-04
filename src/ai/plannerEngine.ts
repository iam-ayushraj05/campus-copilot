import type { SmartPlanRequest, SmartPlanResult } from './types';
import type { StudyPlanBlock } from '../types';

export function generateSmartStudyPlan(req: SmartPlanRequest): SmartPlanResult {
  const { availableHours, subjects, currentConfidence, importantTopics } = req;
  const totalMinutes = Math.min(Math.max(availableHours * 60, 45), 360);

  const blocks: StudyPlanBlock[] = [];
  let currentTime = 18 * 60; // Start at 6:00 PM (18:00)

  const sortedTopics = [...importantTopics].sort((a, b) => {
    const confA = currentConfidence[a] ?? 50;
    const confB = currentConfidence[b] ?? 50;
    return confA - confB;
  });

  const topic1 = sortedTopics[0] || 'Recursion & Backtracking';
  const topic2 = sortedTopics[1] || 'Process Synchronization';
  const topic3 = sortedTopics[2] || 'SQL Joins';

  const formatTimeRange = (startMin: number, duration: number) => {
    const formatSingle = (m: number) => {
      const hrs = Math.floor(m / 60) % 24;
      const mins = m % 60;
      const padMins = mins < 10 ? `0${mins}` : mins;
      const displayHrs = hrs > 12 ? hrs - 12 : hrs === 0 ? 12 : hrs;
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      return `${displayHrs}:${padMins} ${ampm}`;
    };
    return `${formatSingle(startMin)} – ${formatSingle(startMin + duration)}`;
  };

  const b1Duration = Math.min(40, Math.floor(totalMinutes * 0.35));
  blocks.push({
    timeSlot: formatTimeRange(currentTime, b1Duration),
    subject: subjects[0] || 'Data Structures',
    topic: topic1,
    type: 'practice',
    durationMinutes: b1Duration,
    reason: `Targeted weak area (${currentConfidence[topic1] ?? 42}% confidence). High exam/assignment priority.`,
  });
  currentTime += b1Duration;

  const b2Duration = 10;
  blocks.push({
    timeSlot: formatTimeRange(currentTime, b2Duration),
    subject: 'Rest',
    topic: 'Mind Refresh & Hydration',
    type: 'break',
    durationMinutes: b2Duration,
    reason: 'Prevent cognitive overload before switching conceptual context.',
  });
  currentTime += b2Duration;

  const b3Duration = Math.min(40, Math.floor(totalMinutes * 0.35));
  blocks.push({
    timeSlot: formatTimeRange(currentTime, b3Duration),
    subject: subjects[1] || 'Operating Systems',
    topic: topic2,
    type: 'revision',
    durationMinutes: b3Duration,
    reason: `Exam approaching soon. Practice semaphores and mutex scenarios.`,
  });
  currentTime += b3Duration;

  const b4Duration = Math.min(30, totalMinutes - (b1Duration + b2Duration + b3Duration));
  if (b4Duration > 10) {
    blocks.push({
      timeSlot: formatTimeRange(currentTime, b4Duration),
      subject: subjects[2] || 'DBMS',
      topic: topic3,
      type: 'coding',
      durationMinutes: b4Duration,
      reason: 'Active recall & problem-solving drill to solidify learning.',
    });
  }

  return {
    summary: `Personalized ${availableHours}h Plan created based on your upcoming exam deadlines and lowest confidence scores (${topic1} & ${topic2}).`,
    blocks,
  };
}
