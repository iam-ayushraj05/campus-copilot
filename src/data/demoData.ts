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
  CodeLanguage,
} from '../types';

export const initialStudentProfile: StudentProfile = {
  name: 'Alex',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  university: 'Tech Institute of Computer Science',
  major: 'Computer Science & Engineering',
  year: '3rd Year',
  semester: 'Semester 5',
  streakDays: 14,
  studyHoursThisWeek: 18.5,
  topicsCompleted: 28,
  quizAccuracyPercentage: 74,
  codingProblemsSolved: 42,
};

export const initialWeakTopics: WeakTopic[] = [
  {
    id: 'wt-1',
    subject: 'Data Structures & Algorithms',
    topic: 'Recursion & Backtracking',
    accuracy: 42,
    lastPracticed: 'Yesterday',
    recommendedTimeMinutes: 35,
    relatedMaterialId: 'mat-1',
  },
  {
    id: 'wt-2',
    subject: 'Operating Systems',
    topic: 'Process Synchronization & Semaphores',
    accuracy: 51,
    lastPracticed: '2 days ago',
    recommendedTimeMinutes: 40,
    relatedMaterialId: 'mat-2',
  },
  {
    id: 'wt-3',
    subject: 'Database Management Systems',
    topic: 'SQL Joins & Subqueries',
    accuracy: 58,
    lastPracticed: '3 days ago',
    recommendedTimeMinutes: 30,
    relatedMaterialId: 'mat-3',
  },
];

export const initialStrongTopics: StrongTopic[] = [
  { id: 'st-1', subject: 'Data Structures', topic: 'Arrays & Dynamic Strings', accuracy: 91 },
  { id: 'st-2', subject: 'Object Oriented Design', topic: 'OOP Principles & Polymorphism', accuracy: 87 },
  { id: 'st-3', subject: 'DBMS', topic: 'ER Modeling & Relational Schema', accuracy: 82 },
  { id: 'st-4', subject: 'Computer Networks', topic: 'TCP/IP Protocol Stack', accuracy: 85 },
];

export const initialTodayFocus: TodayFocusItem[] = [
  {
    id: 'tf-1',
    title: 'DSA Assignment — Binary Tree Traversal',
    subject: 'Data Structures & Algorithms',
    priority: 'high',
    dueText: 'Due tomorrow',
    recommendedMinutes: 45,
    targetRoute: '/code',
    topic: 'Tree Recursion',
    actionText: 'Solve Assignment →',
  },
  {
    id: 'tf-2',
    title: 'Operating Systems Revision',
    subject: 'Operating Systems',
    priority: 'medium',
    dueText: 'Exam in 4 days',
    recommendedMinutes: 40,
    targetRoute: '/study?material=mat-2',
    topic: 'Process Synchronization',
    actionText: 'Review Notes →',
  },
  {
    id: 'tf-3',
    title: 'Placement Practice — SQL Querying',
    subject: 'Database Management Systems',
    priority: 'low',
    dueText: '30 min recommended',
    recommendedMinutes: 30,
    targetRoute: '/study?material=mat-3',
    topic: 'Complex Joins',
    actionText: 'Start Quiz →',
  },
];

export const initialNextBestMove: NextBestMove = {
  id: 'nbm-1',
  title: 'Spend 35 minutes practicing Recursion.',
  reason: 'You struggled with recursion in your last 3 practice sessions (42% accuracy). Fixing this now will also prepare you for tomorrow\'s DSA assignment.',
  targetMinutes: 35,
  targetSubject: 'Data Structures & Algorithms',
  targetTopic: 'Recursion',
  targetRoute: '/study?material=mat-1&mode=teach',
  actionText: 'Start Practice Session →',
};

export const initialStudyMaterials: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'DSA Unit 2 — Trees, Graphs & Recursion.pdf',
    subject: 'Data Structures',
    fileName: 'DSA_Unit2_Recursion.pdf',
    fileSize: '3.4 MB',
    uploadDate: 'Oct 2, 2026',
    chunksCount: 24,
    topicsCovered: ['Recursion Fundamentals', 'Call Stack & Base Case', 'Binary Tree Traversals', 'Backtracking'],
    content: `Unit 2: Recursion & Tree Data Structures
1. Recursion Definition: A function calling itself until reaching a base condition.
2. Key Components:
- Base Case: Stops the recursive invocation to prevent stack overflow.
- Recursive Step: Moves the parameter toward the base case.
3. Call Stack: Memory allocated for every function frame. Unwinding occurs when base case evaluates to true.
4. Tree Traversals:
- Pre-Order: Root -> Left -> Right
- In-Order: Left -> Root -> Right
- Post-Order: Left -> Right -> Root
Common Bug: Missing base case causing StackOverflowException in Java/C++.`,
  },
  {
    id: 'mat-2',
    title: 'Operating Systems — Process Synchronization.pdf',
    subject: 'Operating Systems',
    fileName: 'OS_Process_Sync.pdf',
    fileSize: '4.1 MB',
    uploadDate: 'Sep 28, 2026',
    chunksCount: 32,
    topicsCovered: ['Critical Section Problem', 'Race Conditions', 'Peterson Solution', 'Semaphores (Counting & Binary)', 'Mutex Locks'],
    content: `Unit 3: Process Synchronization & Concurrency
1. Critical Section Problem: A segment of code where process accesses shared variables or resources.
2. Requirements for Solution:
- Mutual Exclusion: Only one process inside critical section at a time.
- Progress: Selection of next process cannot be postponed indefinitely.
- Bounded Waiting: Bound on number of times other processes enter.
3. Semaphores: Integer variable modified only via wait() [P] and signal() [V] operations.
- Counting Semaphore: Value range over unrestricted domain.
- Binary Semaphore (Mutex): Value ranges between 0 and 1.
Classic Problems: Producer-Consumer Problem, Dining Philosophers, Readers-Writers Problem.`,
  },
  {
    id: 'mat-3',
    title: 'DBMS Unit 3 — Relational Algebra & SQL Joins.pdf',
    subject: 'DBMS',
    fileName: 'DBMS_Unit3_SQL.pdf',
    fileSize: '2.8 MB',
    uploadDate: 'Sep 25, 2026',
    chunksCount: 18,
    topicsCovered: ['INNER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL JOIN', 'Correlated Subqueries'],
    content: `Unit 3: SQL Advanced Queries and Joins
1. Inner Join: Returns rows when there is a match in both tables.
2. Left Outer Join: Returns all rows from left table, and matched rows from right table (NULL if no match).
3. Correlated Subquery: Subquery that uses values from outer query, evaluated once for each row processed by outer query.
4. Group By & Having: GROUP BY aggregates rows, HAVING filters aggregated results (unlike WHERE which filters individual rows).`,
  },
];

export const initialExams: Exam[] = [
  {
    id: 'ex-1',
    subject: 'Operating Systems Mid-Sem',
    date: 'October 8, 2026',
    daysRemaining: 4,
    location: 'Hall B - Room 204',
    importantTopics: ['Process Synchronization', 'Virtual Memory & Paging', 'CPU Scheduling Algorithms'],
    status: 'urgent',
  },
  {
    id: 'ex-2',
    subject: 'DBMS Theory Examination',
    date: 'October 11, 2026',
    daysRemaining: 7,
    location: 'Lab 3',
    importantTopics: ['SQL Joins', 'Normalization 3NF/BCNF', 'ACID Transactions & Locks'],
    status: 'upcoming',
  },
  {
    id: 'ex-3',
    subject: 'Computer Networks Quiz',
    date: 'October 16, 2026',
    daysRemaining: 12,
    location: 'Online Portal',
    importantTopics: ['TCP 3-Way Handshake', 'Subnetting & CIDR', 'DNS Resolution'],
    status: 'upcoming',
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'DSA Recursion & Tree Assignment',
    subject: 'Data Structures & Algorithms',
    dueDate: 'October 5, 2026',
    dueText: 'Due tomorrow (11:59 PM)',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-2',
    title: 'OS Producer-Consumer Semaphore Lab',
    subject: 'Operating Systems',
    dueDate: 'October 7, 2026',
    dueText: 'Due in 3 days',
    priority: 'high',
    completed: false,
  },
  {
    id: 'asg-3',
    title: 'DBMS Complex SQL Queries Sheet',
    subject: 'DBMS',
    dueDate: 'October 9, 2026',
    dueText: 'Due in 5 days',
    priority: 'medium',
    completed: true,
  },
];

export const initialTasks: TaskItem[] = [
  { id: 'tsk-1', title: 'Finish recursion tree problem set (Questions 1 to 5)', subject: 'Data Structures', completed: false, category: 'assignment' },
  { id: 'tsk-2', title: 'Revise Process Synchronization Peterson Algorithm', subject: 'Operating Systems', completed: false, category: 'exam' },
  { id: 'tsk-3', title: 'Practice 5 LeetCode SQL Join challenges', subject: 'DBMS', completed: true, category: 'practice' },
  { id: 'tsk-4', title: 'Read Memory Management chapter 7 in Operating Systems book', subject: 'Operating Systems', completed: false, category: 'exam' },
];

export const defaultAIConfig: AIModelConfig = {
  mode: 'demo',
  provider: 'ollama',
  modelName: 'llama3.1:8b',
  baseUrl: 'http://localhost:11434',
  connectionStatus: 'disconnected',
  temperature: 0.3,
  ragEnabled: true,
  maxTokens: 1024,
  availableModels: [],
};

export const sampleCodeSnippets: Record<string, { language: CodeLanguage; code: string }> = {
  buggy_recursion: {
    language: 'python',
    code: `def calculate_factorial(n):
    # Student code for factorial calculation
    # Bug: missing base case for n <= 1 leads to Infinite Recursion!
    return n * calculate_factorial(n - 1)

print(calculate_factorial(5))
`,
  },
  buggy_java_threads: {
    language: 'java',
    code: `public class SemaphoreDemo {
    private static int counter = 0;

    public static void main(String[] args) {
        // Bug: Race condition - threads incrementing without Synchronization
        Runnable task = () -> {
            for(int i = 0; i < 1000; i++) {
                counter++;
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);
        t1.start();
        t2.start();
        System.out.println("Final Counter: " + counter);
    }
}
`,
  },
  buggy_cpp_pointers: {
    language: 'cpp',
    code: `#include <iostream>

int* createArray() {
    int arr[5] = {10, 20, 30, 40, 50};
    // Bug: Returning pointer to local stack variable!
    return arr; 
}

int main() {
    int* ptr = createArray();
    std::cout << "Value: " << ptr[0] << std::endl; // Undefined Behavior / Segmentation Fault
    return 0;
}
`,
  },
};
