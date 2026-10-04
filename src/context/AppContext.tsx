import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  StudentProfile,
  WeakTopic,
  StrongTopic,
  TodayFocusItem,
  NextBestMove,
  StudyMaterial,
  Exam,
  Assignment,
  TaskItem,
  AIModelConfig,
  AIMode,
  ThemeMode,
  StudyPlanBlock,
  CompletedSession,
} from '../types';
import {
  initialStudentProfile,
  initialWeakTopics,
  initialStrongTopics,
  initialTodayFocus,
  initialStudyMaterials,
  initialExams,
  initialAssignments,
  initialTasks,
  defaultAIConfig,
} from '../data/demoData';
import { aiService } from '../ai/aiService';

const STORAGE_KEY = 'campus_copilot_state_v3';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  profile: StudentProfile;
  weakTopics: WeakTopic[];
  strongTopics: StrongTopic[];
  todayFocus: TodayFocusItem[];
  nextBestMove: NextBestMove;
  studyMaterials: StudyMaterial[];
  exams: Exam[];
  assignments: Assignment[];
  tasks: TaskItem[];
  completedSessions: CompletedSession[];
  aiConfig: AIModelConfig;

  // AI Connection & Mode Actions
  checkAIConnection: () => Promise<void>;
  setAIMode: (mode: AIMode) => void;
  updateAIConfig: (newConfig: Partial<AIModelConfig>) => void;

  // Domain Actions
  uploadMaterial: (title: string, subject: string, fileName: string, content: string) => void;
  addTask: (title: string, subject: string, category: 'assignment' | 'exam' | 'practice') => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addTasksFromStudyPlan: (blocks: StudyPlanBlock[]) => void;
  addCompletedSession: (topic: string, subject: string, durationMinutes: number, quizScore?: number) => void;
  incrementProblemsSolved: () => void;
  recordCodingMistake: (topic: string) => void;
  updateWeakTopicAccuracy: (id: string, newAccuracy: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state from localStorage if available
  const getSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse localStorage state:', e);
    }
    return null;
  };

  const savedState = getSavedState();

  const [theme, setTheme] = useState<ThemeMode>(savedState?.theme || 'dark');
  const [profile, setProfile] = useState<StudentProfile>(savedState?.profile || initialStudentProfile);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(savedState?.weakTopics || initialWeakTopics);
  const [strongTopics] = useState<StrongTopic[]>(savedState?.strongTopics || initialStrongTopics);
  const [todayFocus] = useState<TodayFocusItem[]>(initialTodayFocus);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(savedState?.studyMaterials || initialStudyMaterials);
  const [exams] = useState<Exam[]>(savedState?.exams || initialExams);
  const [assignments] = useState<Assignment[]>(savedState?.assignments || initialAssignments);
  const [tasks, setTasks] = useState<TaskItem[]>(savedState?.tasks || initialTasks);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>(savedState?.completedSessions || []);
  const [aiConfig, setAiConfig] = useState<AIModelConfig>(savedState?.aiConfig || defaultAIConfig);

  // Compute dynamic Next Best Move based on current state
  const [nextBestMove, setNextBestMove] = useState<NextBestMove>(() =>
    aiService.getNextBestMove(weakTopics, exams, assignments)
  );

  // Recompute Next Best Move whenever weak topics, exams, or assignments change
  useEffect(() => {
    const updated = aiService.getNextBestMove(weakTopics, exams, assignments);
    setNextBestMove(updated);
  }, [weakTopics, exams, assignments]);

  // Save state to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme,
          profile,
          weakTopics,
          strongTopics,
          studyMaterials,
          exams,
          assignments,
          tasks,
          completedSessions,
          aiConfig,
        })
      );
    } catch (e) {
      console.warn('Failed to write localStorage state:', e);
    }
  }, [theme, profile, weakTopics, strongTopics, studyMaterials, exams, assignments, tasks, completedSessions, aiConfig]);

  useEffect(() => {
    studyMaterials.forEach(mat => aiService.indexStudyMaterial(mat));
  }, [studyMaterials]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const checkAIConnection = async () => {
    setAiConfig(prev => ({ ...prev, connectionStatus: 'checking' }));
    const result = await aiService.checkOllamaConnection(aiConfig.baseUrl, aiConfig.modelName);

    if (result.connected) {
      setAiConfig(prev => ({
        ...prev,
        mode: 'local',
        provider: 'ollama',
        connectionStatus: 'connected',
        availableModels: result.models.length > 0 ? result.models : ['llama3.1:8b'],
        lastCheckedTime: new Date().toLocaleTimeString(),
      }));
    } else {
      setAiConfig(prev => ({
        ...prev,
        mode: 'demo',
        provider: 'demo',
        connectionStatus: 'disconnected',
        lastCheckedTime: new Date().toLocaleTimeString(),
      }));
    }
  };

  const setAIMode = (mode: AIMode) => {
    if (mode === 'demo') {
      aiService.useDemoMode();
      setAiConfig(prev => ({ ...prev, mode: 'demo', provider: 'demo' }));
    } else {
      aiService.useLocalOllama(aiConfig.modelName);
      setAiConfig(prev => ({ ...prev, mode: 'local', provider: 'ollama' }));
    }
  };

  const updateAIConfig = (newConfig: Partial<AIModelConfig>) => {
    setAiConfig(prev => {
      const updated = { ...prev, ...newConfig };
      if (newConfig.modelName) {
        aiService.useLocalOllama(newConfig.modelName);
      }
      return updated;
    });
  };

  const uploadMaterial = (title: string, subject: string, fileName: string, content: string) => {
    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: title.endsWith('.pdf') ? title : `${title}.pdf`,
      subject,
      fileName,
      fileSize: '1.8 MB',
      uploadDate: 'Just now',
      content,
      chunksCount: Math.ceil(content.length / 300),
      topicsCovered: [subject, 'Uploaded Notes'],
    };
    setStudyMaterials(prev => [newMat, ...prev]);
    aiService.indexStudyMaterial(newMat);
  };

  const addTask = (title: string, subject: string, category: 'assignment' | 'exam' | 'practice') => {
    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title,
      subject,
      completed: false,
      category,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTasksFromStudyPlan = (blocks: StudyPlanBlock[]) => {
    const newTasks: TaskItem[] = blocks
      .filter(b => b.type !== 'break')
      .map((b, i) => ({
        id: `tsk-plan-${Date.now()}-${i}`,
        title: `${b.topic} (${b.timeSlot})`,
        subject: b.subject,
        completed: false,
        category: b.type === 'coding' ? 'practice' : b.type === 'revision' ? 'exam' : 'assignment',
      }));
    setTasks(prev => [...newTasks, ...prev]);
  };

  const addCompletedSession = (topic: string, subject: string, durationMinutes: number, quizScore?: number) => {
    const newSession: CompletedSession = {
      id: `ses-${Date.now()}`,
      topic,
      subject,
      durationMinutes,
      quizScore,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: true,
    };

    setCompletedSessions(prev => [newSession, ...prev]);

    // Update Profile metrics
    setProfile(prev => {
      const addedHours = parseFloat((durationMinutes / 60).toFixed(1));
      const newStudyHours = parseFloat((prev.studyHoursThisWeek + addedHours).toFixed(1));
      let newAccuracy = prev.quizAccuracyPercentage;

      if (quizScore !== undefined) {
        newAccuracy = Math.round(prev.quizAccuracyPercentage * 0.7 + quizScore * 0.3);
      }

      return {
        ...prev,
        studyHoursThisWeek: newStudyHours,
        topicsCompleted: prev.topicsCompleted + 1,
        quizAccuracyPercentage: newAccuracy,
      };
    });

    // Update Weak Topic accuracy if applicable
    if (quizScore !== undefined) {
      setWeakTopics(prev =>
        prev.map(wt => {
          if (wt.topic.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(wt.topic.toLowerCase())) {
            const updatedAccuracy = quizScore >= 75 
              ? Math.min(95, wt.accuracy + 8) 
              : Math.max(30, wt.accuracy - 4);
            return { ...wt, accuracy: updatedAccuracy, lastPracticed: 'Just now' };
          }
          return wt;
        })
      );
    }
  };

  const incrementProblemsSolved = () => {
    setProfile(prev => ({
      ...prev,
      codingProblemsSolved: prev.codingProblemsSolved + 1,
    }));
  };

  const recordCodingMistake = (topic: string) => {
    setWeakTopics(prev => {
      const found = prev.find(wt => wt.topic.toLowerCase().includes(topic.toLowerCase()));
      if (found) {
        return prev.map(wt =>
          wt.id === found.id ? { ...wt, accuracy: Math.max(30, wt.accuracy - 5), lastPracticed: 'Recent error' } : wt
        );
      } else {
        return [
          ...prev,
          {
            id: `wt-${Date.now()}`,
            subject: 'Computer Science',
            topic,
            accuracy: 45,
            lastPracticed: 'Coding error detected',
            recommendedTimeMinutes: 30,
          },
        ];
      }
    });
  };

  const updateWeakTopicAccuracy = (id: string, newAccuracy: number) => {
    setWeakTopics(prev =>
      prev.map(wt => (wt.id === id ? { ...wt, accuracy: newAccuracy, lastPracticed: 'Just now' } : wt))
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        profile,
        weakTopics,
        strongTopics,
        todayFocus,
        nextBestMove,
        studyMaterials,
        exams,
        assignments,
        tasks,
        completedSessions,
        aiConfig,
        checkAIConnection,
        setAIMode,
        updateAIConfig,
        uploadMaterial,
        addTask,
        toggleTask,
        deleteTask,
        addTasksFromStudyPlan,
        addCompletedSession,
        incrementProblemsSolved,
        recordCodingMistake,
        updateWeakTopicAccuracy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
