import type { WeakTopic, NextBestMove, Exam, Assignment } from '../types';

export function computeNextBestMove(
  weakTopics: WeakTopic[],
  exams: Exam[] = [],
  assignments: Assignment[] = []
): NextBestMove {
  // 1. Priority 1: High priority assignment due tomorrow
  const dueTomorrowAssignment = assignments.find(a => !a.completed && a.dueText.toLowerCase().includes('tomorrow'));
  const weakest = [...weakTopics].sort((a, b) => a.accuracy - b.accuracy)[0];

  if (dueTomorrowAssignment) {
    return {
      id: `nbm-${Date.now()}`,
      title: `Spend 35 minutes practicing ${weakest?.topic || 'Recursion'}.`,
      reason: `You struggled with ${weakest?.topic || 'recursion'} in your last practice sessions (${weakest?.accuracy || 42}% accuracy). Fixing this now directly supports your ${dueTomorrowAssignment.title} due tomorrow.`,
      targetMinutes: 35,
      targetSubject: weakest?.subject || 'Data Structures & Algorithms',
      targetTopic: weakest?.topic || 'Recursion & Backtracking',
      targetRoute: `/study?mode=teach&subject=${encodeURIComponent(weakest?.subject || 'Data Structures')}&topic=${encodeURIComponent(weakest?.topic || 'Recursion & Backtracking')}&focused=true`,
      actionText: 'Start Session →',
    };
  }

  // 2. Priority 2: Approaching exam in <= 4 days
  const urgentExam = exams.find(e => e.daysRemaining <= 4);
  if (urgentExam) {
    const examWeakTopic = weakTopics.find(w => w.subject.toLowerCase().includes(urgentExam.subject.toLowerCase())) || weakest;
    return {
      id: `nbm-${Date.now()}`,
      title: `Revise ${examWeakTopic?.topic || 'Process Synchronization'} for 40 minutes.`,
      reason: `Your accuracy is currently ${examWeakTopic?.accuracy || 51}%. ${urgentExam.subject} exam is coming up in ${urgentExam.daysRemaining} days.`,
      targetMinutes: 40,
      targetSubject: urgentExam.subject,
      targetTopic: examWeakTopic?.topic || 'Process Synchronization',
      targetRoute: `/study?mode=quiz&subject=${encodeURIComponent(urgentExam.subject)}&topic=${encodeURIComponent(examWeakTopic?.topic || 'Process Synchronization')}&focused=true`,
      actionText: 'Start Revision →',
    };
  }

  // 3. Priority 3: Weakest topic practice
  return {
    id: `nbm-${Date.now()}`,
    title: `Practice ${weakest?.topic || 'SQL Joins'} for 30 minutes.`,
    reason: `Your accuracy in ${weakest?.topic || 'SQL Joins'} is currently ${weakest?.accuracy || 58}%. A short drill will boost your profile mastery.`,
    targetMinutes: 30,
    targetSubject: weakest?.subject || 'DBMS',
    targetTopic: weakest?.topic || 'SQL Joins',
    targetRoute: `/study?mode=teach&subject=${encodeURIComponent(weakest?.subject || 'DBMS')}&topic=${encodeURIComponent(weakest?.topic || 'SQL Joins')}&focused=true`,
    actionText: 'Start Practice →',
  };
}

export function generateAIProfileInsight(
  studyHours: number,
  accuracy: number,
  weakestTopic: string
): string {
  if (accuracy < 60) {
    return `"You perform well when learning through examples, but your accuracy drops when solving problems without guidance, particularly in ${weakestTopic}. We recommend using [Teach Me] step-by-step breakdown before attempting quizzes."`;
  } else if (accuracy < 80) {
    return `"Strong execution on foundational concepts! Your study consistency is high (${studyHours} hrs/week). Focus on high-value weak areas like ${weakestTopic} to reach peak performance before exams."`;
  } else {
    return `"Exceptional mastery across topics (${accuracy}% overall accuracy). You are ready for advanced competitive placement problems!"`;
  }
}
