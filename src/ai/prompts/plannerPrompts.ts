import type { SmartPlanRequest } from '../types';

export function getSmartPlanPrompt(req: SmartPlanRequest): string {
  const { availableHours, examDate, subjects, currentConfidence, importantTopics } = req;
  return `You are CampusCopilot Smart Study Planner.
Generate a realistic time-blocked study plan for a college student.

Student Parameters:
- Available Study Time Today: ${availableHours} hours
- Next Exam Date: ${examDate}
- Subjects: ${subjects.join(', ')}
- Current Topic Confidence: ${JSON.stringify(currentConfidence)}
- Weak Topics Needing Attention: ${importantTopics.join(', ')}

Rules:
1. Prioritize approaching deadlines, weak topics, and low confidence areas.
2. Include 10-minute breaks between intense 40-minute study blocks to prevent fatigue.
3. Output a structured JSON array of study blocks containing: timeSlot, subject, topic, type ('practice'|'revision'|'break'|'coding'), durationMinutes, and reason.`;
}
