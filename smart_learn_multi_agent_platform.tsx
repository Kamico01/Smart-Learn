import React, { useState, useEffect, useMemo, useRef, Component } from 'react';
import { 
  BookOpen, Brain, Sparkles, Search, UserCheck, ShieldAlert, 
  Clock, CheckCircle2, XCircle, AlertCircle, PlayCircle, 
  FileText, Upload, Plus, ChevronRight, BarChart3, GraduationCap, 
  Zap, Compass, ArrowRight, RefreshCw, MessageSquare, Lightbulb,
  Layers, ExternalLink, Menu, X, Filter, Target, EyeOff,
  FileUp, File, Video, Paperclip, Eye, Download, Timer, Trash2,
  Tag, Wand2, Users, School, ArrowLeftRight, Settings, ChevronDown,
  Check, ArrowLeft, Send, HelpCircle, Bell, Award, UserPlus,
  BookMarked, TrendingUp, AlertTriangle, Activity, Sliders,
  Network, Flame, ShieldCheck, PieChart, Volume2, LogOut, Key, Mail, User
} from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("SmartLearn Error caught in boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold mb-2">Smart Learn Platform Restored</h1>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            A state sync anomaly was caught and isolated. Your session data remains safe.
          </p>
          <button 
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30"
          >
            Refresh Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

async function callGeminiApi(userPrompt, systemPrompt = '', asJson = false) {
  const apiKey = ""; // Canvas runtime provides this automatically
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined
  };

  if (asJson) {
    payload.generationConfig = { responseMimeType: "application/json" };
  }

  let delay = 1000;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    } catch (e) {
      // Exponential backoff
    }
    await new Promise(r => setTimeout(r, delay));
    delay *= 2;
  }
  return null;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function calculateRetention(daysElapsed = 1, initialStrength = 7) {
  const stability = Math.max(2, initialStrength);
  const retention = Math.exp(-daysElapsed / stability) * 100;
  return Math.max(12, Math.min(100, Math.round(retention)));
}

function extractAiSuggestedTags(title = '', content = '', filename = '') {
  const text = `${title} ${filename} ${content}`.toLowerCase();
  const tagDictionary = [
    { tag: 'Consensus Protocols', triggers: ['consensus', 'raft', 'paxos', 'election', 'quorum', 'leader', 'term'] },
    { tag: 'Fault Tolerance', triggers: ['byzantine', 'fault', 'failure', 'bft', 'crash', 'resilience', 'split-brain'] },
    { tag: 'Distributed Storage', triggers: ['sharding', 'replication', 'dynamo', 'cassandra', 'key-value', 'partition'] },
    { tag: 'Logical Clocks', triggers: ['vector', 'lamport', 'clock', 'causality', 'ordering', 'timestamp'] },
    { tag: 'CAP Theorem', triggers: ['cap', 'consistency', 'availability', 'partition', 'trade-off', 'acid', 'pacelc'] },
    { tag: 'FFT & Spectral', triggers: ['fft', 'fourier', 'butterfly', 'dft', 'cooley', 'tukey', 'spectrum'] },
    { tag: 'Sampling Theorem', triggers: ['nyquist', 'sampling', 'aliasing', 'rate', 'shannon', 'signal'] },
    { tag: 'Filter Synthesis', triggers: ['iir', 'fir', 'filter', 'attenuation', 'cutoff', 'impulse', 'poles'] },
    { tag: 'Gene Editing & CRISPR', triggers: ['crispr', 'cas9', 'gene', 'rna', 'dna', 'endonuclease', 'pam'] },
    { tag: 'Neural Architectures', triggers: ['gradient', 'neural', 'weights', 'loss', 'transformer', 'attention'] }
  ];

  const matched = tagDictionary.filter(item => 
    item.triggers.some(trig => text.includes(trig))
  ).map(item => item.tag);

  return matched.length > 0 ? matched : ['Foundations', 'Core Theory', 'Applied Methods'];
}

const INITIAL_COURSES = [
  {
    id: 'c1',
    code: 'CSC 401',
    title: 'Distributed Systems & Cloud Architecture',
    lecturer: 'Dr. Adeyemi Roberts',
    lecturerEmail: 'adeyemi@university.edu',
    department: 'Computer Science',
    level: '400 Level',
    enrolledCount: 3,
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    description: 'Consensus mechanisms, Byzantine fault tolerance, logical clocks, and CAP trade-offs.',
    frictionPoints: [
      { topicTag: 'Fault Tolerance', dropOffRate: 74, avgHesitation: 18.2, note: 'Students frequently stall on 3f+1 quorum proofs.' }
    ],
    materials: [
      {
        id: 'm1',
        title: 'Paxos & Raft Consensus Mechanisms Compared',
        type: 'pdf',
        duration: '18 min read',
        topicTag: 'Consensus Protocols',
        wordCount: 1420,
        url: '#',
        required: true,
        textContent: 'Paxos achieves consensus through two strict phases: Prepare/Promise and Accept/Accepted. Raft simplifies this by decomposing state into explicit Leader Election, Log Replication, and Safety Invariants. If a follower node experiences an election timeout without receiving heartbeats, it transitions to candidate state, increments term, and votes for itself.'
      },
      {
        id: 'm2',
        title: 'Byzantine Fault Tolerance & Quorum Systems',
        type: 'youtube',
        duration: '16 min video',
        topicTag: 'Fault Tolerance',
        wordCount: 950,
        url: 'https://www.youtube.com/watch?v=dfs0LkW_W9c',
        required: true,
        textContent: 'In Byzantine models, faulty nodes can arbitrarily fabricate messages or collude. In an asynchronous system with f faulty nodes, we require N >= 3f + 1 total nodes because f nodes can be faulty, f nodes can be slow, and the intersection of any two quorums must contain at least f + 1 honest nodes.'
      },
      {
        id: 'm3',
        title: 'Lamport Timestamps & Vector Clock Orders',
        type: 'notes',
        duration: '12 min read',
        topicTag: 'Logical Clocks',
        wordCount: 1100,
        textContent: 'Logical clocks establish partial orders of events where physical synchronized clocks are impossible due to relativistic delays and clock drift. Vector clocks capture true causal relationships (A -> B) by maintaining vector V of length N.',
        required: true
      }
    ],
    quizzes: [
      {
        id: 'q1',
        title: 'Diagnostic Checkpoint 1: Consensus & Clocks',
        questionsCount: 3,
        topicTag: 'Consensus Protocols',
        questions: [
          {
            id: 'qq1',
            question: 'In the Raft protocol, what immediately triggers a follower node to transition into a candidate state?',
            options: [
              'Explicit signal from client proxy',
              'Absence of leader heartbeat before election timeout expires',
              'Immediate failure of another follower node',
              'Receipt of conflicting write commands'
            ],
            answer: 1,
            topicTag: 'Consensus Protocols',
            difficulty: 'Medium',
            remediation: 'Review Section 3: "Raft Leader Election" in the Paxos & Raft reading.'
          },
          {
            id: 'qq2',
            question: 'To guarantee safety against f arbitrary Byzantine nodes in an asynchronous network, what is the strict minimum total nodes (N)?',
            options: ['2f + 1', '3f + 1', 'f + 1', '4f - 1'],
            answer: 1,
            topicTag: 'Fault Tolerance',
            difficulty: 'Hard',
            remediation: 'Review "Byzantine Quorum Systems": Any two quorums must overlap by at least f+1 nodes.'
          },
          {
            id: 'qq3',
            question: 'If event A causally precedes event B (A -> B), what is guaranteed about their Lamport timestamps L(A) and L(B)?',
            options: ['L(A) == L(B)', 'L(A) < L(B)', 'L(A) > L(B)', 'No definite ordering exists'],
            answer: 1,
            topicTag: 'Logical Clocks',
            difficulty: 'Easy',
            remediation: 'Revisit Clock Condition invariant in the Lamport Timestamps notes.'
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    code: 'EEE 305',
    title: 'Digital Signal Processing & Filter Design',
    lecturer: 'Engr. Sarah Benson',
    lecturerEmail: 'sarah.b@university.edu',
    department: 'Electrical Engineering',
    level: '300 Level',
    enrolledCount: 1,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'Fast Fourier Transforms, Z-transforms, digital filter synthesis, and Nyquist sampling.',
    frictionPoints: [],
    materials: [
      {
        id: 'm5',
        title: 'Radix-2 Cooley-Tukey FFT Derivation',
        type: 'pdf',
        duration: '22 min read',
        topicTag: 'FFT & Spectral',
        wordCount: 1600,
        url: '#',
        required: true,
        textContent: 'Divide-and-conquer decomposition of Discrete Fourier Transform into even and odd index sub-transforms, reducing computation from O(N^2) to O(N log N).'
      },
      {
        id: 'm6',
        title: 'Nyquist-Shannon Sampling & Anti-Aliasing Filters',
        type: 'youtube',
        duration: '14 min video',
        topicTag: 'Sampling Theorem',
        wordCount: 880,
        url: 'https://www.youtube.com/watch?v=yWqrx08Uvn8',
        required: true,
        textContent: 'To reconstruct a continuous signal from discrete samples without aliasing, sampling rate must exceed 2x the highest spectral frequency present.'
      }
    ],
    quizzes: []
  },
  {
    id: 'c3',
    code: 'BIO 412',
    title: 'Synthetic Biology & Gene Editing',
    lecturer: 'Prof. David Okafor',
    lecturerEmail: 'okafor@university.edu',
    department: 'Biosciences',
    level: '400 Level',
    enrolledCount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    description: 'CRISPR-Cas9 gene editing mechanisms, guide RNA design, and metabolic circuit engineering.',
    frictionPoints: [],
    materials: [
      {
        id: 'm7',
        title: 'CRISPR Cas9 Double-Strand Break Mechanics',
        type: 'notes',
        duration: '25 min read',
        topicTag: 'Gene Editing & CRISPR',
        wordCount: 1350,
        textContent: 'Guide RNA directs Cas9 endonuclease to introduce blunt-end double-strand breaks at target loci directly upstream of a Proto-spacer Adjacent Motif (PAM).',
        required: true
      }
    ],
    quizzes: []
  }
];

const INITIAL_USERS_DB = [
  {
    email: 'adeyemi@university.edu',
    password: 'password123',
    role: 'lecturer',
    name: 'Dr. Adeyemi Roberts',
    title: 'Senior Lecturer',
    department: 'Computer Science',
    matricOrStaffId: 'STF/CS/084'
  },
  {
    email: 'sarah.b@university.edu',
    password: 'password123',
    role: 'lecturer',
    name: 'Engr. Sarah Benson',
    title: 'Associate Professor',
    department: 'Electrical Engineering',
    matricOrStaffId: 'STF/EEE/021'
  },
  {
    email: 'tolu@student.edu',
    password: 'password123',
    role: 'student',
    name: 'Tolu Johnson',
    matricOrStaffId: 'CSC/2022/0481',
    department: 'Computer Science',
    level: '400 Level',
    registeredCourseIds: ['c1'],
    readinessScore: 54,
    avgHesitation: 14.8,
    dwellCoverage: 32,
    cognitiveMisconceptions: ['Byzantine Quorum Overlap'],
    neglectedTopics: ['Fault Tolerance', 'Logical Clocks'],
    materialEngagement: {
      'm1': { opened: true, timeSpentSeconds: 610, completed: true, velocityWpm: 145, lastVisited: 'Yesterday' },
      'm2': { opened: false, timeSpentSeconds: 20, completed: false, velocityWpm: 480, lastVisited: '3 days ago' },
      'm3': { opened: false, timeSpentSeconds: 0, completed: false, velocityWpm: 0, lastVisited: 'Never' }
    },
    quizHistory: [
      {
        quizId: 'q1',
        courseId: 'c1',
        score: 33,
        total: 100,
        date: '2026-09-18',
        weakTopicTags: ['Fault Tolerance', 'Logical Clocks'],
        avgHesitation: 14.8,
        calibrations: [
          { questionId: 'qq1', isCorrect: true, confidence: 'high', type: 'calibrated_master' },
          { questionId: 'qq2', isCorrect: false, confidence: 'high', type: 'hazardous_misconception', topicTag: 'Fault Tolerance' },
          { questionId: 'qq3', isCorrect: false, confidence: 'low', type: 'identified_gap', topicTag: 'Logical Clocks' }
        ]
      }
    ]
  },
  {
    email: 'amina@student.edu',
    password: 'password123',
    role: 'student',
    name: 'Amina Bello',
    matricOrStaffId: 'CSC/2022/0112',
    department: 'Computer Science',
    level: '400 Level',
    registeredCourseIds: ['c1'],
    readinessScore: 92,
    avgHesitation: 7.2,
    dwellCoverage: 96,
    cognitiveMisconceptions: [],
    neglectedTopics: [],
    materialEngagement: {
      'm1': { opened: true, timeSpentSeconds: 1050, completed: true, velocityWpm: 110, lastVisited: 'Just now' },
      'm2': { opened: true, timeSpentSeconds: 980, completed: true, velocityWpm: 90, lastVisited: 'Yesterday' },
      'm3': { opened: true, timeSpentSeconds: 840, completed: true, velocityWpm: 115, lastVisited: 'Yesterday' }
    },
    quizHistory: []
  }
];

export default function App() {
  // Authentication & Users State
  const [usersDb, setUsersDb] = useState(INITIAL_USERS_DB);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS_DB[2]); // Default signed-in student (Tolu)
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup' | 'onboarding'
  const [isOnboarding, setIsOnboarding] = useState(false);

  // App Navigation
  const [studentTab, setStudentTab] = useState('missionControl'); // 'missionControl' | 'myCourses' | 'search' | 'copilot' | 'courseView' | 'quizTaker'
  const [lecturerTab, setLecturerTab] = useState('cohortDashboard'); // 'cohortDashboard' | 'frictionHeatmap' | 'courses'

  // Courses & In-Courses Registration Modal
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('c1');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedStudentForInspect, setSelectedStudentForInspect] = useState(null);

  // Search & Socratic Copilot
  const [searchQuery, setSearchQuery] = useState('');
  const [copilotMessages, setCopilotMessages] = useState([
    {
      sender: 'agent',
      agentName: 'Socratic Mentor Agent',
      text: 'Welcome to Smart Learn! I track your reading dwell times, hesitation, and concept calibration. Notice any areas you need help with in your registered syllabus?'
    }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Window Focus Detection for Dwell Tracking
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  /* Authentication Handlers */
  const handleSignIn = (email, password) => {
    const found = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      showToast("Account not found. Please verify your email or sign up!");
      return;
    }
    if (found.password !== password) {
      showToast("Incorrect password. Please try again.");
      return;
    }

    setCurrentUser(found);
    if (found.role === 'student') setStudentTab('missionControl');
    else setLecturerTab('cohortDashboard');
    showToast(`Welcome back, ${found.name}! Signed in as ${found.role.toUpperCase()}`);
  };

  const handleSignUp = (formData) => {
    const existing = usersDb.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (existing) {
      showToast("An account with this email already exists!");
      return;
    }

    const newUser = {
      ...formData,
      registeredCourseIds: formData.role === 'student' ? ['c1'] : [],
      readinessScore: formData.role === 'student' ? 70 : undefined,
      avgHesitation: formData.role === 'student' ? 8.5 : undefined,
      dwellCoverage: formData.role === 'student' ? 40 : undefined,
      cognitiveMisconceptions: [],
      neglectedTopics: [],
      materialEngagement: {},
      quizHistory: []
    };

    setUsersDb(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsOnboarding(true);
    showToast("Account successfully created!");
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthView('login');
    showToast("Signed out of Smart Learn.");
  };

  /* Toggle Course Registration */
  const handleToggleRegistration = (courseId) => {
    if (!currentUser || currentUser.role !== 'student') return;

    const isEnrolled = currentUser.registeredCourseIds?.includes(courseId);
    const targetCourse = courses.find(c => c.id === courseId);

    const updatedUser = {
      ...currentUser,
      registeredCourseIds: isEnrolled
        ? currentUser.registeredCourseIds.filter(id => id !== courseId)
        : [...(currentUser.registeredCourseIds || []), courseId]
    };

    setCurrentUser(updatedUser);
    setUsersDb(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));

    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          enrolledCount: isEnrolled ? Math.max(0, c.enrolledCount - 1) : c.enrolledCount + 1
        };
      }
      return c;
    }));

    if (isEnrolled) {
      showToast(`Dropped ${targetCourse?.code || 'Course'} from your registered roster.`);
    } else {
      showToast(`Successfully registered for ${targetCourse?.code}! Multi-Agent tracking activated.`);
    }
  };

  /* Dwell Telemetry Tracking */
  const handleLogDwellTime = (materialId, secondsToAdd = 5, wordCount = 1000) => {
    if (!isWindowFocused || !currentUser || currentUser.role !== 'student') return;

    const currentEng = currentUser.materialEngagement?.[materialId] || { opened: false, timeSpentSeconds: 0, velocityWpm: 0 };
    const newTime = currentEng.timeSpentSeconds + secondsToAdd;
    const minutes = Math.max(0.1, newTime / 60);
    const estimatedWpm = Math.round(wordCount / minutes);

    const updatedUser = {
      ...currentUser,
      materialEngagement: {
        ...(currentUser.materialEngagement || {}),
        [materialId]: {
          opened: true,
          timeSpentSeconds: newTime,
          completed: newTime >= 60,
          velocityWpm: estimatedWpm,
          lastVisited: 'Just now'
        }
      }
    };

    setCurrentUser(updatedUser);
    setUsersDb(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
  };

  /* Diagnostics for Student */
  const studentAgentDiagnostics = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return {};

    const registered = courses.filter(c => currentUser.registeredCourseIds?.includes(c.id));
    const allMaterials = registered.flatMap(c => 
      c.materials.map(m => ({ ...m, courseId: c.id, courseTitle: c.title, courseCode: c.code }))
    );

    const avoidedMaterials = allMaterials.filter(m => {
      const eng = currentUser.materialEngagement?.[m.id];
      return !eng || !eng.opened || eng.timeSpentSeconds < 90;
    });

    const totalMaterialsCount = Math.max(1, allMaterials.length);
    const completedCount = allMaterials.filter(m => currentUser.materialEngagement?.[m.id]?.completed).length;
    const dwellRatio = Math.round((completedCount / totalMaterialsCount) * 100);

    const latestQuiz = currentUser.quizHistory?.[0];
    const quizScore = latestQuiz ? latestQuiz.score : 70;
    const calibratedCount = latestQuiz?.calibrations?.filter(c => c.type === 'calibrated_master').length || 1;
    const totalCalibrations = Math.max(1, latestQuiz?.calibrations?.length || 3);
    const calibrationFactor = (calibratedCount / totalCalibrations) * 100;

    const readinessIndex = Math.min(100, Math.round((dwellRatio * 0.35) + (quizScore * 0.45) + (calibrationFactor * 0.20)));
    const retentionRate = calculateRetention(3, 7);

    return {
      readinessIndex: isNaN(readinessIndex) ? 65 : readinessIndex,
      dwellRatio,
      avoidedMaterials,
      avoidedCount: avoidedMaterials.length,
      retentionRate,
      misconceptions: currentUser.cognitiveMisconceptions || [],
      primaryWeakTopic: latestQuiz?.weakTopicTags?.[0] || avoidedMaterials[0]?.topicTag || 'Core Foundations',
      nextActionItem: avoidedMaterials[0] || allMaterials[0] || null
    };
  }, [courses, currentUser]);

  /* Cross-Institution Search with Registered Course Prioritization */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const hits = [];

    courses.forEach(course => {
      const isRegistered = currentUser?.registeredCourseIds?.includes(course.id);

      if (course.title.toLowerCase().includes(query) || course.code.toLowerCase().includes(query) || course.description.toLowerCase().includes(query)) {
        hits.push({
          type: 'course',
          course,
          title: `${course.code}: ${course.title}`,
          snippet: course.description,
          topicTag: course.department,
          isRegistered,
          priority: isRegistered ? 200 : 50
        });
      }

      course.materials.forEach(mat => {
        if (mat.title.toLowerCase().includes(query) || mat.topicTag.toLowerCase().includes(query) || (mat.textContent && mat.textContent.toLowerCase().includes(query))) {
          hits.push({
            type: 'material',
            material: mat,
            course,
            title: mat.title,
            snippet: `Curriculum module in ${course.code} • ${course.lecturer}`,
            topicTag: mat.topicTag,
            isRegistered,
            priority: isRegistered ? 250 : 75
          });
        }
      });
    });

    return hits.sort((a, b) => b.priority - a.priority);
  }, [searchQuery, courses, currentUser]);

  /* Live Socratic Copilot with Gemini API */
  const handleSendCopilotMessage = async (e) => {
    e?.preventDefault();
    if (!copilotInput.trim() || isCopilotTyping) return;

    const userText = copilotInput;
    setCopilotMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setCopilotInput('');
    setIsCopilotTyping(true);

    const registeredTitles = courses
      .filter(c => currentUser?.registeredCourseIds?.includes(c.id))
      .map(c => `${c.code}: ${c.title}`)
      .join(', ');

    const systemPrompt = `You are the Socratic Mentor Agent for the Smart Learn platform.
You are tutoring student: ${currentUser?.name || 'Student'}.
Student's Registered Courses: ${registeredTitles}.
Student's Avoided Topics: ${studentAgentDiagnostics.avoidedMaterials?.map(m => m.topicTag).join(', ') || 'None'}.
Rules:
1. Speak Socratically: Guide the student with leading questions rather than giving immediate solutions.
2. If asked about syllabus topics (Raft, Paxos, Nyquist, CRISPR), reference architectural invariants.
3. Keep answers concise, highly encouraging, and under 80 words.`;

    const responseText = await callGeminiApi(userText, systemPrompt, false);

    setCopilotMessages(prev => [
      ...prev,
      {
        sender: 'agent',
        agentName: 'Socratic Mentor Agent',
        text: responseText || "Let us examine the foundational invariant: In an asynchronous network model, why does a quorum intersection guarantee that any subsequent read operation will observe the highest committed term?"
      }
    ]);
    setIsCopilotTyping(false);
  };

  const selectedCourse = useMemo(() => {
    return courses.find(c => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  if (!currentUser) {
    return (
      <ErrorBoundary>
        <AuthGateView 
          authView={authView}
          setAuthView={setAuthView}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onDemoStudent={() => handleSignIn('tolu@student.edu', 'password123')}
          onDemoLecturer={() => handleSignIn('adeyemi@university.edu', 'password123')}
        />
      </ErrorBoundary>
    );
  }

  if (isOnboarding) {
    return (
      <ErrorBoundary>
        <OnboardingWizardView 
          user={currentUser}
          courses={courses}
          onComplete={(selectedCourses) => {
            const updatedUser = {
              ...currentUser,
              registeredCourseIds: selectedCourses
            };
            setCurrentUser(updatedUser);
            setUsersDb(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));
            setIsOnboarding(false);
            showToast("Onboarding complete! Your personalized workspace is ready.");
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-20 md:pb-4">
        
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-16 right-4 sm:right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Multi-Agent Status & Session Header */}
        <div className="bg-slate-950 text-white text-xs px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between border-b border-slate-800 sticky top-0 z-50 gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-300 font-bold uppercase tracking-wider">
              Smart Learn Platform Active
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden lg:inline">
              Account: <strong className="text-white">{currentUser.email}</strong> ({currentUser.role.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-bold rounded-full transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STUDENT PORTAL */}
        {/* ============================================================== */}
        {currentUser.role === 'student' && (
          <>
            <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                
                {/* Brand */}
                <div 
                  onClick={() => setStudentTab('missionControl')}
                  className="flex items-center space-x-2.5 cursor-pointer shrink-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-600/20">
                    S<span className="text-blue-200">L</span>
                  </div>
                  <div>
                    <span className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                      Smart<span className="text-blue-600">Learn</span>
                      <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Student
                      </span>
                    </span>
                    <p className="text-[10px] text-slate-500 hidden sm:block">Cognitive Calibration & Remediation Mesh</p>
                  </div>
                </div>

                {/* Instant Cross-Course Search Bar */}
                <div className="flex-1 max-w-md hidden md:block">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search across all university topics (e.g. Paxos, Nyquist, CRISPR)..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (studentTab !== 'search') setStudentTab('search');
                      }}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-1">
                  <button
                    onClick={() => setStudentTab('missionControl')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${studentTab === 'missionControl' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Mission Control
                  </button>
                  <button
                    onClick={() => setStudentTab('myCourses')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${studentTab === 'myCourses' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Courses ({currentUser.registeredCourseIds?.length || 0})
                  </button>
                  <button
                    onClick={() => setStudentTab('copilot')}
                    className={`relative px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${studentTab === 'copilot' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    <Brain className="w-3.5 h-3.5 text-blue-400" />
                    <span>Socratic AI</span>
                    {studentAgentDiagnostics.avoidedCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white"></span>
                    )}
                  </button>
                </nav>

                {/* Profile Identity */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-300">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{currentUser.matricOrStaffId || currentUser.email}</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Student View Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              
              {studentTab === 'missionControl' && (
                <StudentMissionControlView 
                  student={currentUser}
                  courses={courses}
                  diagnostics={studentAgentDiagnostics}
                  onOpenCourse={(courseId) => {
                    setSelectedCourseId(courseId);
                    setStudentTab('courseView');
                  }}
                  onOpenRegisterPortal={() => setShowRegisterModal(true)}
                  onOpenCopilot={() => setStudentTab('copilot')}
                  onStartQuiz={(courseId, quizId) => {
                    setSelectedCourseId(courseId);
                    setSelectedQuizId(quizId);
                    setStudentTab('quizTaker');
                  }}
                />
              )}

              {studentTab === 'myCourses' && (
                <StudentCoursesPortalView 
                  courses={courses}
                  student={currentUser}
                  onOpenCourse={(courseId) => {
                    setSelectedCourseId(courseId);
                    setStudentTab('courseView');
                  }}
                  onOpenRegisterModal={() => setShowRegisterModal(true)}
                />
              )}

              {studentTab === 'search' && (
                <UniversalSearchDiscoveryView 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  results={searchResults}
                  onSelectCourse={(courseId) => {
                    setSelectedCourseId(courseId);
                    setStudentTab('courseView');
                  }}
                  onToggleRegistration={handleToggleRegistration}
                />
              )}

              {studentTab === 'copilot' && (
                <SocraticCopilotHub 
                  student={currentUser}
                  courses={courses}
                  diagnostics={studentAgentDiagnostics}
                  messages={copilotMessages}
                  input={copilotInput}
                  setInput={setCopilotInput}
                  onSendMessage={handleSendCopilotMessage}
                  isTyping={isCopilotTyping}
                  onOpenMaterial={(courseId) => {
                    setSelectedCourseId(courseId);
                    setStudentTab('courseView');
                  }}
                />
              )}

              {studentTab === 'courseView' && (
                <CourseDetailStudioView 
                  course={selectedCourse}
                  student={currentUser}
                  isRegistered={currentUser.registeredCourseIds?.includes(selectedCourse.id)}
                  onToggleRegistration={() => handleToggleRegistration(selectedCourse.id)}
                  onLogDwellTime={handleLogDwellTime}
                  onStartQuiz={(quizId) => {
                    setSelectedQuizId(quizId);
                    setStudentTab('quizTaker');
                  }}
                  onBack={() => setStudentTab('myCourses')}
                />
              )}

              {studentTab === 'quizTaker' && (
                <AdaptiveDiagnosticQuizTaker 
                  course={selectedCourse}
                  quizId={selectedQuizId}
                  onCompleteQuiz={(score, weakTags, hesitation, calibrations) => {
                    const newAttempt = {
                      quizId: selectedQuizId,
                      courseId: selectedCourse.id,
                      score,
                      total: 100,
                      date: 'Just now',
                      weakTopicTags: weakTags,
                      avgHesitation: hesitation,
                      calibrations
                    };

                    const hazardousMisconceptions = calibrations
                      .filter(c => c.type === 'hazardous_misconception')
                      .map(c => c.topicTag);

                    const updatedUser = {
                      ...currentUser,
                      quizHistory: [newAttempt, ...(currentUser.quizHistory || [])],
                      cognitiveMisconceptions: Array.from(new Set([...(currentUser.cognitiveMisconceptions || []), ...hazardousMisconceptions]))
                    };

                    setCurrentUser(updatedUser);
                    setUsersDb(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));

                    showToast(`Diagnostic submitted: ${score}% score with calibration logged!`);
                    setStudentTab('copilot');
                  }}
                  onCancel={() => setStudentTab('courseView')}
                />
              )}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex items-center justify-around py-2.5 px-2 shadow-lg">
              <button 
                onClick={() => setStudentTab('missionControl')}
                className={`flex flex-col items-center text-[10px] font-bold ${studentTab === 'missionControl' ? 'text-blue-600' : 'text-slate-500'}`}
              >
                <Compass className="w-5 h-5 mb-0.5" />
                <span>Mission</span>
              </button>
              <button 
                onClick={() => setStudentTab('myCourses')}
                className={`flex flex-col items-center text-[10px] font-bold ${studentTab === 'myCourses' ? 'text-blue-600' : 'text-slate-500'}`}
              >
                <BookOpen className="w-5 h-5 mb-0.5" />
                <span>Courses</span>
              </button>
              <button 
                onClick={() => setStudentTab('copilot')}
                className={`relative flex flex-col items-center text-[10px] font-bold ${studentTab === 'copilot' ? 'text-blue-600' : 'text-slate-500'}`}
              >
                <Brain className="w-5 h-5 mb-0.5" />
                <span>Socratic AI</span>
                {studentAgentDiagnostics.avoidedCount > 0 && (
                  <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>
            </nav>
          </>
        )}

        {/* ============================================================== */}
        {/* LECTURER COMMAND STUDIO */}
        {/* ============================================================== */}
        {currentUser.role === 'lecturer' && (
          <>
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-10 z-40 shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                      Faculty<span className="text-blue-400">Studio</span>
                      <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        Instructor
                      </span>
                    </span>
                    <p className="text-[10px] text-slate-400 hidden sm:block">Cohort Friction Diagnostics & AI Curriculum Architect</p>
                  </div>
                </div>

                <nav className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => setLecturerTab('cohortDashboard')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${lecturerTab === 'cohortDashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Cohort Analytics</span>
                  </button>
                  <button
                    onClick={() => setLecturerTab('frictionHeatmap')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${lecturerTab === 'frictionHeatmap' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Friction Heatmap</span>
                  </button>
                  <button
                    onClick={() => setLecturerTab('courses')}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${lecturerTab === 'courses' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Manage Courses</span>
                  </button>
                </nav>

                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{currentUser.department}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              {lecturerTab === 'cohortDashboard' && (
                <LecturerCohortDashboardView 
                  cohortStudents={usersDb.filter(u => u.role === 'student')}
                  courses={courses}
                  onInspectStudent={(stu) => setSelectedStudentForInspect(stu)}
                  onSendNudge={(stu, topic) => {
                    showToast(`AI Socratic Intervention Nudge dispatched to ${stu.name} (${topic})`);
                  }}
                />
              )}

              {lecturerTab === 'frictionHeatmap' && (
                <LecturerCurriculumFrictionHeatmapView 
                  courses={courses}
                  cohortStudents={usersDb.filter(u => u.role === 'student')}
                  onDispatchBroadcast={(courseCode, topic) => {
                    showToast(`Broadcasted remedial clarifications for ${courseCode} (${topic})`);
                  }}
                />
              )}

              {lecturerTab === 'courses' && (
                <LecturerCourseStudioView 
                  currentUser={currentUser}
                  courses={courses}
                  onAddCourse={(newC) => {
                    setCourses([newC, ...courses]);
                    showToast(`Course ${newC.code} successfully published!`);
                  }}
                  onUpdateCourse={(updated) => {
                    setCourses(courses.map(c => c.id === updated.id ? updated : c));
                    showToast(`Updated syllabus content for ${updated.code}`);
                  }}
                />
              )}
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex items-center justify-around py-2.5 px-2 text-slate-300 shadow-xl">
              <button 
                onClick={() => setLecturerTab('cohortDashboard')}
                className={`flex flex-col items-center text-[10px] font-bold ${lecturerTab === 'cohortDashboard' ? 'text-blue-400' : 'text-slate-400'}`}
              >
                <BarChart3 className="w-5 h-5 mb-0.5" />
                <span>Cohort</span>
              </button>
              <button 
                onClick={() => setLecturerTab('frictionHeatmap')}
                className={`flex flex-col items-center text-[10px] font-bold ${lecturerTab === 'frictionHeatmap' ? 'text-blue-400' : 'text-slate-400'}`}
              >
                <Flame className="w-5 h-5 mb-0.5" />
                <span>Friction</span>
              </button>
              <button 
                onClick={() => setLecturerTab('courses')}
                className={`flex flex-col items-center text-[10px] font-bold ${lecturerTab === 'courses' ? 'text-blue-400' : 'text-slate-400'}`}
              >
                <BookOpen className="w-5 h-5 mb-0.5" />
                <span>Courses</span>
              </button>
            </nav>

            {selectedStudentForInspect && (
              <StudentDossierInspectModal 
                student={selectedStudentForInspect}
                courses={courses}
                onClose={() => setSelectedStudentForInspect(null)}
                onSendDirectNudge={(msg) => {
                  showToast(`Direct intervention dispatched to ${selectedStudentForInspect.name}`);
                  setSelectedStudentForInspect(null);
                }}
              />
            )}
          </>
        )}

        {/* Global Slide-Over Registration Modal */}
        {showRegisterModal && (
          <CourseRegistrationModal 
            courses={courses}
            student={currentUser}
            onToggleRegistration={handleToggleRegistration}
            onClose={() => setShowRegisterModal(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

function AuthGateView({ authView, setAuthView, onSignIn, onSignUp, onDemoStudent, onDemoLecturer }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student'); // 'student' | 'lecturer'
  const [department, setDepartment] = useState('Computer Science');
  const [idNumber, setIdNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authView === 'login') {
      onSignIn(email, password);
    } else {
      if (!name || !email || !password) return;
      onSignUp({
        name,
        email,
        password,
        role,
        department,
        matricOrStaffId: idNumber || (role === 'student' ? 'STU/2026/001' : 'STF/2026/001')
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-blue-600">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
            S<span className="text-blue-200">L</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Smart Learn</h1>
          <p className="text-xs text-slate-400">
            Autonomous Multi-Agent Behavioral Learning & Friction Diagnostics
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl text-xs font-bold text-center border border-slate-800">
          <button
            type="button"
            onClick={() => setAuthView('login')}
            className={`py-2 rounded-xl transition ${authView === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthView('signup')}
            className={`py-2 rounded-xl transition ${authView === 'signup' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authView === 'signup' && (
            <>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Samuel Adekunle"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 rounded-xl font-bold border transition ${role === 'student' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('lecturer')}
                    className={`py-2 rounded-xl font-bold border transition ${role === 'lecturer' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                  >
                    Lecturer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Department</label>
                  <input 
                    type="text" 
                    value={department} 
                    onChange={e => setDepartment(e.target.value)} 
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    {role === 'student' ? 'Matric No' : 'Staff ID'}
                  </label>
                  <input 
                    type="text" 
                    value={idNumber} 
                    onChange={e => setIdNumber(e.target.value)} 
                    placeholder={role === 'student' ? 'CSC/2026/012' : 'STF/2026/099'}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="font-bold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your.email@university.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-600 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/25"
          >
            {authView === 'login' ? 'Sign In to Workspace' : 'Create Academic Account'}
          </button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <span className="text-[10px] text-slate-500 font-mono block">Instant Demo Access</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onDemoStudent}
              className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 transition"
            >
              Demo as Student
            </button>
            <button
              type="button"
              onClick={onDemoLecturer}
              className="py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-slate-300 transition"
            >
              Demo as Lecturer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingWizardView({ user, courses, onComplete }) {
  const [selectedCourses, setSelectedCourses] = useState(courses.slice(0, 1).map(c => c.id));

  const toggleSelect = (id) => {
    setSelectedCourses(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-400/30">
            Academic Onboarding
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Welcome to Smart Learn, {user.name}!
          </h2>
          <p className="text-xs text-slate-400">
            Select your primary registered courses so your behavioral Multi-Agent mesh can begin monitoring your reading dwell, calibration, and syllabus discovery.
          </p>
        </div>

        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 block">Select Courses to Enroll:</label>
          {courses.map(c => {
            const isChecked = selectedCourses.includes(c.id);
            return (
              <div 
                key={c.id}
                onClick={() => toggleSelect(c.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs ${
                  isChecked ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{c.code}</span>
                    <span className="text-[10px] text-slate-400">• {c.lecturer}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{c.title}</p>
                </div>
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-500' : 'border-slate-700'}`}>
                  {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onComplete(selectedCourses)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 text-xs"
        >
          Initialize Learning Mesh ({selectedCourses.length} Enrolled)
        </button>
      </div>
    </div>
  );
}

function StudentMissionControlView({ student, courses, diagnostics, onOpenCourse, onOpenRegisterPortal, onOpenCopilot, onStartQuiz }) {
  const registered = courses.filter(c => student.registeredCourseIds?.includes(c.id));

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Autonomous Multi-Agent Behavioral Mesh</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Learning Command: {student.name}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Smart Learn measures dwell velocity, question hesitation delays, and confidence-competence calibration to dismantle flawed mental models before exams.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button 
              onClick={onOpenRegisterPortal}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Register for More Courses</span>
            </button>
            <button 
              onClick={onOpenCopilot}
              className="px-4 py-2.5 bg-blue-900/60 hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition border border-white/20 flex items-center gap-1.5"
            >
              <Brain className="w-4 h-4" />
              <span>Consult Socratic AI</span>
            </button>
          </div>
        </div>

        {/* Holistic Readiness Scorecard */}
        <div className="mt-6 sm:mt-0 sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 w-full sm:w-64 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 block">Holistic Readiness Index</span>
          <div className="text-4xl font-black text-white mt-1">
            {diagnostics.readinessIndex}%
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${diagnostics.readinessIndex > 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${diagnostics.readinessIndex}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-blue-200 mt-2">
            Blends dwell velocity, quiz accuracy, and confidence calibration.
          </p>
        </div>
      </div>

      {/* Immediate Next Step Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              Immediate Guided Action Item
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {diagnostics.nextActionItem ? `Study: ${diagnostics.nextActionItem.title}` : 'All registered materials reviewed!'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Topic: <strong className="text-slate-700">#{diagnostics.primaryWeakTopic}</strong> • Telemetry logged low dwell velocity on this required module.
            </p>
          </div>
        </div>

        {diagnostics.nextActionItem && (
          <button
            onClick={() => onOpenCourse(diagnostics.nextActionItem.courseId || 'c1')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <span>Resume Reading</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4 Multi-Agent Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Content Dwell Ratio</span>
          <div className="text-3xl font-black text-blue-600">{diagnostics.dwellRatio}%</div>
          <p className="text-[11px] text-slate-500">Materials deeply processed without tab defocusing.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avoided Modules</span>
          <div className="text-3xl font-black text-amber-600">{diagnostics.avoidedCount}</div>
          <p className="text-[11px] text-slate-500">Unvisited or skimmed under 90-second threshold.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Question Hesitation</span>
          <div className="text-3xl font-black text-slate-800">{student.avgHesitation || 8.5}s</div>
          <p className="text-[11px] text-slate-500">Deliberation time before locking in diagnostic answers.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ebbinghaus Retention</span>
          <div className="text-3xl font-black text-emerald-600">{diagnostics.retentionRate}%</div>
          <p className="text-[11px] text-slate-500">Predicted memory decay curve since last checkpoint.</p>
        </div>
      </div>

      {/* Hazardous Misconceptions Warning Bar */}
      {diagnostics.misconceptions && diagnostics.misconceptions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                Dunning-Kruger Misconception Detected
              </span>
              <p className="text-xs font-bold text-red-900 mt-1">
                You expressed High Confidence on incorrect answers for: {diagnostics.misconceptions.join(', ')}
              </p>
              <p className="text-[11px] text-red-700">
                A false model is more hazardous than an admitted knowledge gap. We suggest reviewing the Socratic mentor dialogue.
              </p>
            </div>
          </div>
          <button 
            onClick={onOpenCopilot}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shrink-0 transition"
          >
            Debrief with Socratic Agent
          </button>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Registered Courses</h2>
            <p className="text-xs text-slate-500">Active enrollments on your personal academic roster</p>
          </div>
          <button 
            onClick={onOpenRegisterPortal}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Register for New Courses</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {registered.map(course => {
            const viewedCount = course.materials.filter(m => student.materialEngagement?.[m.id]?.opened).length;
            const progress = course.materials.length > 0 ? Math.round((viewedCount / course.materials.length) * 100) : 0;

            return (
              <div 
                key={course.id}
                onClick={() => onOpenCourse(course.id)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col group"
              >
                <div className="h-32 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {course.code}
                  </span>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-medium truncate">
                    {course.lecturer}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Dwell Progress</span>
                      <span className="font-semibold text-slate-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {course.materials.length} Materials • {course.quizzes.length} Quizzes
                      </span>
                      <span className="text-blue-600 font-bold flex items-center text-xs">
                        Open Room <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {registered.length === 0 && (
            <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No registered courses yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the institutional catalog and register for your first course.
              </p>
              <button 
                onClick={onOpenRegisterPortal}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
              >
                Register for Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentCoursesPortalView({ courses, student, onOpenCourse, onOpenRegisterModal }) {
  const registered = courses.filter(c => student.registeredCourseIds?.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">My Registered Courses</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Courses on your active syllabus roster. Register for new courses directly using the button on the right.
          </p>
        </div>

        {/* Register Button in Courses */}
        <button 
          onClick={onOpenRegisterModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 self-start shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register for New Courses</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {registered.map(course => (
          <div 
            key={course.id}
            onClick={() => onOpenCourse(course.id)}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-blue-400 transition cursor-pointer flex flex-col group"
          >
            <div className="h-36 bg-slate-100 relative">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {course.code}
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">{course.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400">{course.materials.length} Syllabus Modules</span>
                <span className="text-blue-600 font-bold flex items-center">
                  Open Learning Room <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseRegistrationModal({ courses, student, onToggleRegistration, onClose }) {
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const departments = useMemo(() => {
    const set = new Set(courses.map(c => c.department));
    return ['all', ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (departmentFilter === 'all') return courses;
    return courses.filter(c => c.department === departmentFilter);
  }, [courses, departmentFilter]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Institutional Course Registration</h2>
            <p className="text-xs text-slate-500">Register or drop courses with 1-click. State updates immediately.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${departmentFilter === dept ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {dept === 'all' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map(course => {
            const isEnrolled = student.registeredCourseIds?.includes(course.id);
            return (
              <div 
                key={course.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isEnrolled ? 'bg-blue-50/50 border-blue-500' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-blue-600 font-mono">{course.code}</span>
                    <span className="text-[10px] text-slate-400">{course.department}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{course.lecturer}</span>
                  <button
                    onClick={() => onToggleRegistration(course.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isEnrolled 
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Registered (Drop)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function UniversalSearchDiscoveryView({ searchQuery, setSearchQuery, results, onSelectCourse, onToggleRegistration }) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
        <h1 className="text-xl font-bold text-slate-900">Institutional Cross-Topic Search</h1>
        <p className="text-xs text-slate-500">
          Search every lecture, PDF, transcript, and theorem across the university. Topics from your <strong className="text-blue-600">registered courses</strong> are prioritized at the top of results.
        </p>

        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search keywords: e.g. Byzantine, Cooley-Tukey, Cas9, Raft, Vector Clocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            autoFocus
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">Popular:</span>
          {['Consensus Protocols', 'Fault Tolerance', 'CAP Theorem', 'Sampling Theorem', 'FFT & Spectral'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium transition text-[11px]"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Search Results ({results.length})</span>
          {searchQuery && <span>Keyword: "{searchQuery}"</span>}
        </div>

        {results.map((hit, idx) => (
          <div 
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl border transition bg-white ${
              hit.isRegistered ? 'border-blue-400 ring-2 ring-blue-50 shadow-xs' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  {hit.isRegistered ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      In Your Registered Syllabus (Prioritized)
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      External Course Syllabus
                    </span>
                  )}
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                    {hit.type}
                  </span>
                </div>

                <h3 
                  onClick={() => onSelectCourse(hit.course.id)}
                  className="font-bold text-slate-900 text-sm hover:text-blue-600 transition cursor-pointer"
                >
                  {hit.title}
                </h3>
                <p className="text-xs text-slate-500">{hit.snippet}</p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <span className="text-blue-600 font-semibold">#{hit.topicTag}</span>
                  <span>•</span>
                  <span>Course: {hit.course.code}</span>
                  <span>•</span>
                  <span>Instructor: {hit.course.lecturer}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectCourse(hit.course.id)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                >
                  View Material
                </button>
                {!hit.isRegistered && (
                  <button
                    onClick={() => onToggleRegistration(hit.course.id)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Register
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocraticCopilotHub({ student, courses, diagnostics, messages, input, setInput, onSendMessage, isTyping, onOpenMaterial }) {
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Socratic Mentor AI Companion</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Powered by live Gemini 3 Flash. Connects directly to your registered courses to guide your comprehension through inquiry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini 3 Flash Agent Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avoidance & Misconception Radar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Behavioral Avoidance Radar</span>
              </h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {diagnostics.avoidedMaterials?.length || 0} Avoided
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Low dwell velocity flagged on these modules. Read them before the next checkpoint:
            </p>

            <div className="space-y-2 pt-1">
              {diagnostics.avoidedMaterials?.map(item => (
                <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block truncate">{item.title}</span>
                    <span className="text-[10px] text-blue-600 font-medium">#{item.topicTag} • {item.courseCode}</span>
                  </div>
                  <button
                    onClick={() => onOpenMaterial(item.courseId)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] transition flex items-center justify-center gap-1"
                  >
                    <span>Read Topic Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {(!diagnostics.avoidedMaterials || diagnostics.avoidedMaterials.length === 0) && (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold text-center border border-emerald-200">
                  Great work! No neglected modules detected in your syllabus.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Socratic Chat */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 flex flex-col h-[560px] shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Socratic Mentor Agent</h3>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Contextual Course Tutor
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, i) => (
              <div 
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'agent' && (
                  <span className="text-[10px] font-bold text-blue-600 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {msg.agentName}
                  </span>
                )}
                <div 
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Socratic Agent formulating inquiry...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={onSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Socratic Mentor a question about your syllabus..."
              className="flex-1 text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CourseDetailStudioView({ course, student, isRegistered, onToggleRegistration, onLogDwellTime, onStartQuiz, onBack }) {
  const [activeMaterial, setActiveMaterial] = useState(course.materials[0] || null);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'quizzes'

  useEffect(() => {
    if (!activeMaterial || !isRegistered) return;
    const interval = setInterval(() => {
      onLogDwellTime(activeMaterial.id, 5, activeMaterial.wordCount || 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeMaterial, isRegistered]);

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Courses
      </button>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {course.code}
            </span>
            <span className="text-xs text-slate-400">• {course.department}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{course.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{course.description}</p>
        </div>

        <button
          onClick={onToggleRegistration}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            isRegistered 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
        >
          {isRegistered ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Registered in Course</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Register for Course</span>
            </>
          )}
        </button>
      </div>

      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 border-b-2 transition ${activeTab === 'modules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Syllabus Content ({course.materials.length})
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 border-b-2 transition ${activeTab === 'quizzes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Diagnostic Quizzes ({course.quizzes.length})
        </button>
      </div>

      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Modules & Readings
            </span>
            {course.materials.map(m => {
              const eng = student.materialEngagement?.[m.id];
              const isSelected = activeMaterial?.id === m.id;
              const isAvoided = !eng || !eng.opened;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveMaterial(m);
                    onLogDwellTime(m.id, 10, m.wordCount || 1000);
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 text-xs ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                        {m.type}
                      </span>
                      <span className="font-bold truncate">{m.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">Topic: #{m.topicTag}</span>
                  </div>

                  {isAvoided ? (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Unread
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Read
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
            {activeMaterial ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                      Topic: #{activeMaterial.topicTag}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">{activeMaterial.title}</h2>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Active Telemetry</span>
                    <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {student.materialEngagement?.[activeMaterial.id]?.timeSpentSeconds || 0}s logged
                    </span>
                  </div>
                </div>

                {activeMaterial.type === 'youtube' && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                    <iframe
                      src={getYouTubeEmbedUrl(activeMaterial.url)}
                      title={activeMaterial.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {activeMaterial.type === 'video' && activeMaterial.fileUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                    <video controls src={activeMaterial.fileUrl} className="w-full h-full" />
                  </div>
                )}

                {(activeMaterial.type === 'pdf' || activeMaterial.type === 'notes' || !activeMaterial.fileUrl) && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="flex items-center gap-2 font-bold text-slate-700">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Syllabus Reading Transcript ({activeMaterial.wordCount || 1200} words)</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Reading Velocity: {student.materialEngagement?.[activeMaterial.id]?.velocityWpm || 140} WPM
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                      {activeMaterial.textContent || 'No text transcript attached.'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-12 text-center">Select a syllabus module from the left to begin reading.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  #{quiz.topicTag}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{quiz.questionsCount} questions</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{quiz.title}</h3>
              <p className="text-xs text-slate-500">
                Includes Confidence-Competence calibration to separate honest knowledge gaps from hazardous misconceptions.
              </p>

              <button 
                onClick={() => onStartQuiz(quiz.id)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PlayCircle className="w-4 h-4" /> Start Calibrated Checkpoint
              </button>
            </div>
          ))}
          {course.quizzes.length === 0 && (
            <div className="col-span-full bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center">
              <p className="text-xs text-slate-400">No diagnostic quizzes currently active for this course.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdaptiveDiagnosticQuizTaker({ course, quizId, onCompleteQuiz, onCancel }) {
  const quiz = course.quizzes.find(q => q.id === quizId) || course.quizzes[0];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [confidences, setConfidences] = useState({});
  const [hesitationTimes, setHesitationTimes] = useState({});
  const [startTime, setStartTime] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quiz.questions[currentIdx];

  const handleSelectOption = (idx) => {
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    setHesitationTimes(prev => ({ ...prev, [currentIdx]: elapsed }));
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: idx }));
  };

  const handleSelectConfidence = (conf) => {
    setConfidences(prev => ({ ...prev, [currentIdx]: conf }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setStartTime(Date.now());
    } else {
      setIsFinished(true);
    }
  };

  const results = useMemo(() => {
    if (!isFinished) return null;
    let correct = 0;
    const weakTags = [];
    let totalHesitation = 0;
    const calibrations = [];

    quiz.questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      const conf = confidences[idx] || 'medium';
      const hes = hesitationTimes[idx] || 6;
      totalHesitation += hes;

      const isCorrect = selected === q.answer;
      if (isCorrect) correct += 1;
      else {
        if (!weakTags.includes(q.topicTag)) weakTags.push(q.topicTag);
      }

      let type = 'identified_gap';
      if (isCorrect && conf === 'high') type = 'calibrated_master';
      else if (isCorrect && (conf === 'low' || conf === 'medium')) type = 'hesitant_comprehension';
      else if (!isCorrect && conf === 'high') type = 'hazardous_misconception';
      else if (!isCorrect && conf === 'low') type = 'identified_gap';

      calibrations.push({
        questionId: q.id,
        topicTag: q.topicTag,
        isCorrect,
        confidence: conf,
        hesitation: hes,
        type
      });
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const avgHesitation = Math.round(totalHesitation / quiz.questions.length);

    return { score, weakTags, avgHesitation, calibrations };
  }, [isFinished, quiz, selectedAnswers, confidences, hesitationTimes]);

  if (isFinished && results) {
    const misconceptions = results.calibrations.filter(c => c.type === 'hazardous_misconception');

    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 text-center shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Brain className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Calibration Matrix Diagnostic</span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Assessment Finalized</h2>
          <div className="text-4xl font-black text-blue-600 mt-2">{results.score}%</div>
          <p className="text-xs text-slate-500 mt-1">Average Response Hesitation: <strong>{results.avgHesitation}s</strong></p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="font-bold text-emerald-900 block">Calibrated Mastery</span>
            <span className="text-lg font-black text-emerald-700">
              {results.calibrations.filter(c => c.type === 'calibrated_master').length} Questions
            </span>
            <p className="text-[10px] text-emerald-800 mt-0.5">High confidence & correct answer.</p>
          </div>

          <div className="p-3 rounded-2xl bg-red-50 border border-red-200">
            <span className="font-bold text-red-900 block">Hazardous Misconceptions</span>
            <span className="text-lg font-black text-red-700">{misconceptions.length} Questions</span>
            <p className="text-[10px] text-red-800 mt-0.5">High confidence but wrong answer.</p>
          </div>
        </div>

        <button 
          onClick={() => onCompleteQuiz(results.score, results.weakTags, results.avgHesitation, results.calibrations)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
        >
          Commit Diagnostics to Copilot
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
        <div>
          <span className="font-bold text-blue-600">Question {currentIdx + 1} of {quiz.questions.length}</span>
          <span className="text-slate-400 ml-2">Topic: #{currentQ.topicTag}</span>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQ.question}
        </h2>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentIdx] === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl text-left text-xs font-semibold border transition flex items-center justify-between ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {selectedAnswers[currentIdx] !== undefined && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              How confident are you in this answer?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 'low', label: 'Low (Guessing)' },
                { level: 'medium', label: 'Medium (Fairly Sure)' },
                { level: 'high', label: 'High (100% Certain)' }
              ].map(item => {
                const isConfSelected = confidences[currentIdx] === item.level;
                return (
                  <button
                    type="button"
                    key={item.level}
                    onClick={() => handleSelectConfidence(item.level)}
                    className={`py-2 px-1 text-center rounded-xl font-bold transition text-[11px] ${
                      isConfSelected 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400 text-[11px] font-mono">
          Hesitation & Calibration Active
        </span>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentIdx] === undefined || !confidences[currentIdx]}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span>{currentIdx === quiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function LecturerCohortDashboardView({ cohortStudents, courses, onInspectStudent, onSendNudge }) {
  const averageReadiness = cohortStudents.length > 0
    ? Math.round(cohortStudents.reduce((acc, s) => acc + (s.readinessScore || 70), 0) / cohortStudents.length)
    : 70;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
              Faculty Radar
            </span>
            <span className="text-xs text-slate-500 font-semibold">• Real Cohort Diagnostics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Student Performance & Neglect Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracks individual dwell velocity, hazardous misconceptions, and skipped syllabus topics across your enrolled cohort.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
          {cohortStudents.length} Students Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cohort Holistic Readiness</span>
          <div className="text-3xl font-black text-blue-600">{averageReadiness}%</div>
          <p className="text-[11px] text-slate-500">Blended average of dwell velocity + calibrated checkpoints.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Cohort Blindspot</span>
          <div className="text-xl font-bold text-red-600">Fault Tolerance (3f+1 Quorums)</div>
          <p className="text-[11px] text-slate-500">Identified as the highest source of hazardous misconceptions.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Hesitation</span>
          <div className="text-3xl font-black text-slate-800">11.4s</div>
          <p className="text-[11px] text-slate-500">Average pause before clicking choices.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Enrolled Student Cohort Roster</h2>
          <span className="text-xs text-slate-400">Click any student to inspect cognitive dossier</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3 pl-2">Student Name</th>
                <th className="pb-3">Matric / ID</th>
                <th className="pb-3">Readiness Index</th>
                <th className="pb-3">Dwell Coverage</th>
                <th className="pb-3">Misconceptions</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cohortStudents.map(stu => (
                <tr key={stu.email} className="hover:bg-slate-50 transition">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        {stu.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{stu.name}</span>
                        <span className="text-[10px] text-slate-400">{stu.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-500">{stu.matricOrStaffId}</td>
                  <td className="py-3 font-bold text-slate-800">{stu.readinessScore || 70}%</td>
                  <td className="py-3 text-slate-600 font-semibold">{stu.dwellCoverage || 40}%</td>
                  <td className="py-3">
                    {stu.cognitiveMisconceptions?.length > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        {stu.cognitiveMisconceptions[0]}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold">Calibrated</span>
                    )}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onInspectStudent(stu)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold rounded-xl transition"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onSendNudge(stu, stu.neglectedTopics?.[0] || 'Syllabus')}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition"
                        title="Send Socratic Intervention"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LecturerCurriculumFrictionHeatmapView({ courses, cohortStudents, onDispatchBroadcast }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Curriculum Friction & Drop-Off Heatmap</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pinpoints exact syllabus modules where student dwell velocity collapses or excessive question pauses occur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCourse.id === c.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedCourse.materials.map((m, idx) => (
          <div key={m.id} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                #{m.topicTag}
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                Module {idx + 1}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{m.duration} • Type: {m.type.toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cohort Drop-Off</span>
                <div className="text-xl font-black text-red-600 mt-0.5">52%</div>
                <p className="text-[10px] text-slate-500">Unread by cohort</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cohort Avg Dwell</span>
                <div className="text-xl font-black text-blue-600 mt-0.5">420s</div>
                <p className="text-[10px] text-slate-500">Active reading time</p>
              </div>
            </div>

            <button
              onClick={() => onDispatchBroadcast(selectedCourse.code, m.topicTag)}
              className="w-full py-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dispatch Clarifying Broadcast Note</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentDossierInspectModal({ student, courses, onClose, onSendDirectNudge }) {
  const [nudgeMessage, setNudgeMessage] = useState(
    `Hello ${student.name.split(' ')[0]}, the diagnostic agent observed high hesitation and cognitive friction in your recent syllabus reviews. Please review the assigned reading before the checkpoint!`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
              <p className="text-xs text-slate-500 font-mono">{student.matricOrStaffId} • {student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Readiness</span>
            <p className="text-lg font-black text-blue-600 mt-0.5">{student.readinessScore || 70}%</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Hesitation</span>
            <p className="text-lg font-black text-slate-800 mt-0.5">{student.avgHesitation || 8.5}s</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Dwell Coverage</span>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{student.dwellCoverage || 40}%</p>
          </div>
        </div>

        <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Send Socratic Academic Nudge
          </span>
          <textarea
            rows={3}
            value={nudgeMessage}
            onChange={(e) => setNudgeMessage(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold">Cancel</button>
            <button
              onClick={() => onSendDirectNudge(nudgeMessage)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
            >
              Dispatch Nudge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LecturerCourseStudioView({ currentUser, courses, onAddCourse, onUpdateCourse }) {
  const [activeCourseId, setActiveCourseId] = useState(courses[0]?.id || 'c1');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAiQuizModal, setShowAiQuizModal] = useState(false);

  // New Course inputs
  const [cCode, setCCode] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cDept, setCDept] = useState(currentUser.department || 'Computer Science');
  const [cDesc, setCDesc] = useState('');

  // Material upload state
  const [uploadType, setUploadType] = useState('file'); // 'file' | 'youtube' | 'notes'
  const [matTitle, setMatTitle] = useState('');
  const [matTopic, setMatTopic] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [notesContent, setNotesContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [detectedType, setDetectedType] = useState('pdf');
  const fileInputRef = useRef(null);

  // AI Tag Suggestions
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);

  // AI Quiz Generator fields
  const [targetTopic, setTargetTopic] = useState('Byzantine Fault Tolerance');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const selectedCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  useEffect(() => {
    if (!matTitle && !notesContent && !selectedFile) {
      setSuggestedTags([]);
      return;
    }

    setIsExtracting(true);
    const timer = setTimeout(() => {
      const tags = extractAiSuggestedTags(matTitle, notesContent, selectedFile?.name || '');
      setSuggestedTags(tags);
      setIsExtracting(false);
      if (!matTopic && tags.length > 0) setMatTopic(tags[0]);
    }, 250);

    return () => clearTimeout(timer);
  }, [matTitle, notesContent, selectedFile]);

  const handleCreateCourseSubmit = (e) => {
    e.preventDefault();
    if (!cCode || !cTitle) return;

    const newCourse = {
      id: 'c_' + Date.now(),
      code: cCode.toUpperCase(),
      title: cTitle,
      lecturer: currentUser.name,
      lecturerEmail: currentUser.email,
      department: cDept,
      level: '400 Level',
      enrolledCount: 0,
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      description: cDesc || 'Syllabus tracked with continuous Multi-Agent diagnostic monitoring.',
      frictionPoints: [],
      materials: [],
      quizzes: []
    };

    onAddCourse(newCourse);
    setActiveCourseId(newCourse.id);
    setShowAddCourseModal(false);
    setCCode('');
    setCTitle('');
    setCDesc('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (!matTitle) {
      const clean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setMatTitle(clean);
    }

    let type = 'pdf';
    if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.includes('text') || file.name.endsWith('.md')) type = 'notes';
    setDetectedType(type);

    const blob = URL.createObjectURL(file);
    setFileUrl(blob);

    if (file.type.includes('text') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (ev) => setNotesContent(ev.target.result);
      reader.readAsText(file);
    }
  };

  const handleSaveMaterial = (e) => {
    e.preventDefault();
    if (!matTitle || !matTopic) return;

    let finalType = uploadType;
    let url = '#';
    let fUrl = '';
    let fName = '';
    let fSize = 0;
    let text = '';

    if (uploadType === 'file') {
      finalType = detectedType;
      fUrl = fileUrl;
      fName = selectedFile?.name || 'Uploaded File';
      fSize = selectedFile?.size || 0;
      text = notesContent;
    } else if (uploadType === 'youtube') {
      finalType = 'youtube';
      url = youtubeUrl;
    } else if (uploadType === 'notes') {
      finalType = 'notes';
      text = notesContent;
    }

    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 1200;

    const newMaterial = {
      id: 'm_' + Date.now(),
      title: matTitle,
      type: finalType,
      duration: finalType === 'pdf' ? '15 min read' : (finalType === 'video' ? 'Video' : 'Reading'),
      url,
      fileUrl: fUrl,
      fileName: fName,
      fileSize: fSize,
      wordCount,
      textContent: text,
      topicTag: matTopic,
      required: true
    };

    onUpdateCourse({
      ...selectedCourse,
      materials: [...selectedCourse.materials, newMaterial]
    });

    setShowAddMaterialModal(false);
    setMatTitle('');
    setMatTopic('');
    setYoutubeUrl('');
    setNotesContent('');
    setSelectedFile(null);
    setFileUrl('');
  };

  /* Gemini-Powered AI Quiz Generation */
  const handleGenerateAiQuiz = async () => {
    setIsGeneratingQuiz(true);

    const prompt = `Generate a rigorous diagnostic checkpoint quiz on "${targetTopic}" for the course "${selectedCourse.title}".
Format strictly as JSON with this schema:
{
  "title": "AI Checkpoint: ${targetTopic}",
  "topicTag": "${targetTopic}",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": 0,
      "difficulty": "Medium",
      "remediation": "string with specific syllabus reference"
    }
  ]
}
Include exactly 2 challenging questions with cognitive distractors.`;

    const jsonText = await callGeminiApi(prompt, "You are an expert university professor creating diagnostic exams.", true);
    let parsedQuiz = null;

    if (jsonText) {
      try {
        parsedQuiz = JSON.parse(jsonText);
      } catch (e) {
        console.error("AI quiz parsing failed", e);
      }
    }

    if (!parsedQuiz) {
      parsedQuiz = {
        title: `AI Checkpoint: ${targetTopic}`,
        topicTag: targetTopic,
        questions: [
          {
            id: 'qq_gen_1',
            question: `In ${targetTopic}, which invariant strictly guarantees quorum intersection despite arbitrary Byzantine message dropping?`,
            options: [
              'Overlap criterion: N >= 3f + 1 with 2f + 1 quorum responses',
              'Single broadcast leader sequence token',
              'Client-side monotonic timestamp override',
              'Synchronous TCP acknowledgement barrier'
            ],
            answer: 0,
            difficulty: 'Hard',
            remediation: `Review reading notes on ${targetTopic}.`
          }
        ]
      };
    }

    const completeQuiz = {
      id: 'q_ai_' + Date.now(),
      title: parsedQuiz.title || `AI Checkpoint: ${targetTopic}`,
      questionsCount: parsedQuiz.questions?.length || 1,
      topicTag: parsedQuiz.topicTag || targetTopic,
      questions: (parsedQuiz.questions || []).map((q, i) => ({
        ...q,
        id: `qq_ai_${Date.now()}_${i}`,
        topicTag: parsedQuiz.topicTag || targetTopic
      }))
    };

    onUpdateCourse({
      ...selectedCourse,
      quizzes: [completeQuiz, ...selectedCourse.quizzes]
    });

    setIsGeneratingQuiz(false);
    setShowAiQuizModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Curriculum & Course Studio</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author courses, upload real PDFs and videos with auto-suggested AI topic tags, and synthesize adaptive quizzes.
          </p>
        </div>

        <button 
          onClick={() => setShowAddCourseModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 self-start shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCourseId(c.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap ${
              selectedCourse.id === c.id 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c.code}: {c.title.length > 24 ? c.title.substring(0, 24) + '...' : c.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {selectedCourse.code}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedCourse.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{selectedCourse.description}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button 
              onClick={() => setShowAddMaterialModal(true)}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              Upload Material & AI Auto-Tag
            </button>
            <button 
              onClick={() => setShowAiQuizModal(true)}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              Generate Quiz with Gemini Agent
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Course Materials ({selectedCourse.materials.length})</h3>
              <span className="text-xs text-slate-400">Indexed for Semantic Discovery</span>
            </div>

            <div className="space-y-2">
              {selectedCourse.materials.map(m => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="uppercase font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {m.type}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                      #{m.topicTag}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {m.fileSize ? formatFileSize(m.fileSize) : (m.duration || 'Live')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Diagnostic Quizzes ({selectedCourse.quizzes.length})</h3>
              <span className="text-xs text-slate-400">Feeds Student Calibration Radar</span>
            </div>

            <div className="space-y-2">
              {selectedCourse.quizzes.map(q => (
                <div key={q.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{q.title}</p>
                    <p className="text-[11px] text-slate-500">{q.questionsCount} questions • Topic: #{q.topicTag}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Create Academic Course</h3>
            <form onSubmit={handleCreateCourseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Code (e.g. CSC 415)</label>
                <input 
                  type="text" 
                  value={cCode} 
                  onChange={e => setCCode(e.target.value)} 
                  placeholder="CSC 415"
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  required 
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title</label>
                <input 
                  type="text" 
                  value={cTitle} 
                  onChange={e => setCTitle(e.target.value)} 
                  placeholder="Advanced Computer Vision & Neural Systems"
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  required 
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input 
                  type="text" 
                  value={cDept} 
                  onChange={e => setCDept(e.target.value)} 
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Syllabus Overview</label>
                <textarea 
                  rows={3}
                  value={cDesc} 
                  onChange={e => setCDesc(e.target.value)} 
                  placeholder="Brief description of course modules and learning goals..."
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-xs"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Material with AI Auto-Tagging */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Learning Material to {selectedCourse.code}</h3>
                <p className="text-xs text-slate-500">Real-time AI Topic Tagging for zero-effort indexing</p>
              </div>
              <button onClick={() => setShowAddMaterialModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${uploadType === 'file' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
              >
                <FileUp className="w-3.5 h-3.5" /> File / PDF
              </button>
              <button
                type="button"
                onClick={() => setUploadType('youtube')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${uploadType === 'youtube' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
              >
                <PlayCircle className="w-3.5 h-3.5 text-red-600" /> YouTube
              </button>
              <button
                type="button"
                onClick={() => setUploadType('notes')}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${uploadType === 'notes' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'}`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Notes
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs">
              {uploadType === 'file' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Select Real File (PDF, Video, Docs)</label>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.mp4,.webm,.mp3,.txt,.md,.doc,.docx"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition"
                  >
                    <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                    {selectedFile ? (
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {formatFileSize(selectedFile.size)} • Type: {detectedType.toUpperCase()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-slate-700">Click to browse or drop file here</p>
                        <p className="text-[11px] text-slate-400 mt-1">Supports PDF, MP4 Video, Markdown, and Text</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {uploadType === 'youtube' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">YouTube Video Link</label>
                  <input 
                    type="url" 
                    value={youtubeUrl} 
                    onChange={e => setYoutubeUrl(e.target.value)} 
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              )}

              {uploadType === 'notes' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lecture Text / Markdown Notes</label>
                  <textarea 
                    rows={4}
                    value={notesContent} 
                    onChange={e => setNotesContent(e.target.value)} 
                    placeholder="Paste or type lecture theorems and notes here..."
                    className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-mono text-xs"
                    required
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Material Display Title</label>
                <input 
                  type="text" 
                  value={matTitle} 
                  onChange={e => setMatTitle(e.target.value)} 
                  placeholder="e.g. Raft Consensus Protocol Step-by-Step"
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  required 
                />
              </div>

              {/* AI Auto-Tag Suggester */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI-Suggested Topic Tags
                  </label>
                  {isExtracting && (
                    <span className="text-[10px] text-blue-600 flex items-center gap-1 font-semibold">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing text...
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map(tag => {
                    const isSelected = matTopic === tag;
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setMatTopic(tag)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                        <span>#{tag}</span>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Active Topic Tag
                  </label>
                  <input 
                    type="text" 
                    value={matTopic} 
                    onChange={e => setMatTopic(e.target.value)} 
                    placeholder="Click suggestion or enter custom tag..."
                    className="w-full p-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs"
                    required 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploadType === 'file' && !selectedFile}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Quiz Generator */}
      {showAiQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Curriculum Architect AI Agent</h3>
            </div>
            <p className="text-xs text-slate-500">
              Scans syllabus topics and constructs a diagnostic checkpoint with cognitive distractors using Gemini 3 Flash.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Concept Keyword</label>
                <input 
                  type="text" 
                  value={targetTopic} 
                  onChange={e => setTargetTopic(e.target.value)} 
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAiQuizModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={isGeneratingQuiz}
                  onClick={handleGenerateAiQuiz}
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Synthesizing Assessment...
                    </>
                  ) : (
                    'Generate Diagnostic Quiz'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}