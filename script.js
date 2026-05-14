const skillData = {
  french: {
    lesson: 'Focus on a 30-minute mix of vocabulary, grammar, and business conversation. Start with French greetings, travel phrases, and simple marketing-related sentences. Practice speaking aloud and connect each word to your international marketing terms.',
    weeklyWeakness: 'Vocabulary for travel, customer service, and business introductions. Relearn with short dialogues and themed flashcards.',
    quiz: [
      { type: 'mcq', question: 'Quel est le mot français pour "market"?', options: ['Le marché', 'Le bureau', 'La salle'], answer: 0 },
      { type: 'trueFalse', question: '"Bonjour" means "Good morning".', answer: true },
      { type: 'fill', question: 'Je ____ parler français.', answer: 'veux' }
    ],
    weeklyExam: [
      { type: 'mcq', question: 'Quel mot décrit "international marketing"?', options: ['Marketing international', 'Vente locale', 'Gestion interne'], answer: 0 },
      { type: 'mcq', question: 'Comment dit-on "customer" en français?', options: ['Client', 'Partenaire', 'Collègue'], answer: 0 },
      { type: 'trueFalse', question: '"Merci" is a polite way to say thank you.', answer: true }
    ],
  },
  sap: {
    lesson: 'Spend 30 minutes learning SAP process flow and how modules connect to marketing operations. Read about SAP S/4HANA basics, configuration concepts, and how data moves through sales and finance modules.',
    weeklyWeakness: 'Understanding module purpose and standard process flow. Relearn with diagrams, short notes, and example business scenarios.',
    quiz: [
      { type: 'mcq', question: 'SAP is primarily used for:', options: ['Enterprise resource planning', 'Graphic design', 'Video editing'], answer: 0 },
      { type: 'trueFalse', question: 'A module in SAP can manage finance, logistics, or HR.', answer: true },
      { type: 'fill', question: 'SAP stands for Systems, Applications, and ___.', answer: 'Products' }
    ],
    weeklyExam: [
      { type: 'mcq', question: 'Which SAP module is often used for sales order processing?', options: ['SD', 'MM', 'PP'], answer: 0 },
      { type: 'mcq', question: 'What is the core foundation of SAP ERP?', options: ['Business process integration', 'Photo editing', 'Social media analytics'], answer: 0 },
      { type: 'trueFalse', question: 'openSAP offers free learning courses.', answer: true }
    ],
  }
};

const botAnswers = [
  { keywords: ['bonjour', 'hello', 'greeting'], answer: 'For French, start with greetings and simple business phrases like "Bonjour", "Merci", and "Je m’appelle...".' },
  { keywords: ['sap module', 'module', 'sd', 'mm', 'fi'], answer: 'SAP modules are grouped by function. For marketing-related business, learn SD (Sales & Distribution) and CO/MM basics to understand customer order flow.' },
  { keywords: ['book', 'source', 'material'], answer: 'Use books like Practice Makes Perfect: Complete French Grammar and Discover SAP, plus websites TV5Monde, openSAP, SAP Help Portal for reliable learning.' },
  { keywords: ['exam', 'test', 'weekly'], answer: 'Do the weekly 30-minute exam after 6 days of practice. Review weak answers and focus on the concepts you missed with short, repeatable drills.' },
  { keywords: ['weak', 'weakness', 'difficult'], answer: 'When a topic feels weak, break it into 5-minute mini-lessons and repeat with examples. Use real-world scenarios to make French and SAP easier to recall.' }
];

const state = {
  completedTasks: 0,
  deadlines: 3,
  frenchScore: 0,
  sapScore: 0
};

const lessonElements = {
  french: document.getElementById('frenchLesson'),
  sap: document.getElementById('sapLesson')
};

const weaknessElements = {
  french: document.getElementById('frenchWeakness'),
  sap: document.getElementById('sapWeakness')
};

const progressElements = {
  french: document.getElementById('frenchProgress'),
  sap: document.getElementById('sapProgress')
};

const todayTasks = document.getElementById('todayTasks');
const completedTasks = document.getElementById('completedTasks');
const deadlineCount = document.getElementById('deadlineCount');
const chatMessages = document.getElementById('chatMessages');

function initDashboard() {
  lessonElements.french.textContent = skillData.french.lesson;
  lessonElements.sap.textContent = skillData.sap.lesson;
  weaknessElements.french.textContent = skillData.french.weeklyWeakness;
  weaknessElements.sap.textContent = skillData.sap.weeklyWeakness;

  updateMetrics();
  renderTodayTasks();
  addChatMessage('Hi! I am your study companion. Ask me a question about French or SAP.');
}

function updateMetrics() {
  completedTasks.textContent = state.completedTasks;
  deadlineCount.textContent = state.deadlines;
  progressElements.french.style.width = `${Math.min(100, state.frenchScore)}%`;
  progressElements.sap.style.width = `${Math.min(100, state.sapScore)}%`;
}

function renderTodayTasks() {
  const tasks = [
    'French: 30 min lesson + 10 min quiz',
    'SAP: 30 min lesson + 10 min quiz',
    'Review yesterday’s weak points from the weekly checklist'
  ];
  todayTasks.innerHTML = tasks.map(task => `<li>${task}</li>`).join('');
}

function showQuiz(skill) {
  const entries = skillData[skill].quiz;
  const html = [`<h2>${skill === 'french' ? 'French' : 'SAP'} 10-Minute Quiz</h2>`, '<form id="quizForm">'];
  entries.forEach((item, index) => {
    if (item.type === 'mcq') {
      html.push(`<div class="quiz-item"><p>${index + 1}. ${item.question}</p>`);
      item.options.forEach((option, optionIndex) => {
        html.push(`<label><input type="radio" name="q${index}" value="${optionIndex}"> ${option}</label>`);
      });
      html.push('</div>');
    } else if (item.type === 'trueFalse') {
      html.push(`<div class="quiz-item"><p>${index + 1}. ${item.question}</p>`);
      html.push(`<label><input type="radio" name="q${index}" value="true"> True</label>`);
      html.push(`<label><input type="radio" name="q${index}" value="false"> False</label></div>`);
    } else if (item.type === 'fill') {
      html.push(`<div class="quiz-item"><p>${index + 1}. ${item.question}</p><input type="text" name="q${index}" placeholder="Your answer"></div>`);
    }
  });
  html.push('<button type="button" class="primary-button" onclick="submitQuiz(\'' + skill + '\')">Submit answers</button></form>');
  openModal(html.join(''));
}

function showWeeklyExam(skill) {
  const entries = skillData[skill].weeklyExam;
  const html = [`<h2>${skill === 'french' ? 'French' : 'SAP'} Weekly Exam</h2>`, '<form id="examForm">'];
  entries.forEach((item, index) => {
    if (item.type === 'mcq') {
      html.push(`<div class="quiz-item"><p>${index + 1}. ${item.question}</p>`);
      item.options.forEach((option, optionIndex) => {
        html.push(`<label><input type="radio" name="q${index}" value="${optionIndex}"> ${option}</label>`);
      });
      html.push('</div>');
    } else if (item.type === 'trueFalse') {
      html.push(`<div class="quiz-item"><p>${index + 1}. ${item.question}</p>`);
      html.push(`<label><input type="radio" name="q${index}" value="true"> True</label>`);
      html.push(`<label><input type="radio" name="q${index}" value="false"> False</label></div>`);
    }
  });
  html.push('<button type="button" class="primary-button" onclick="submitWeeklyExam(\'' + skill + '\')">Submit exam</button></form>');
  openModal(html.join(''));
}

function submitQuiz(skill) {
  const form = document.getElementById('quizForm');
  if (!form) return;
  const entries = skillData[skill].quiz;
  let score = 0;
  entries.forEach((item, index) => {
    const value = form[`q${index}`]?.value?.trim();
    if (item.type === 'fill') {
      if (value && value.toLowerCase() === item.answer.toLowerCase()) score += 1;
    } else if (item.type === 'trueFalse') {
      if ((value === 'true') === item.answer) score += 1;
    } else {
      if (value === String(item.answer)) score += 1;
    }
  });
  closeModal();
  state.completedTasks += 1;
  if (skill === 'french') state.frenchScore = Math.min(100, state.frenchScore + score * 10);
  else state.sapScore = Math.min(100, state.sapScore + score * 10);
  addChatMessage(`You scored ${score}/${entries.length} on the ${skill} quiz. Keep going!`);
  updateMetrics();
}

function submitWeeklyExam(skill) {
  const form = document.getElementById('examForm');
  if (!form) return;
  const entries = skillData[skill].weeklyExam;
  let score = 0;
  entries.forEach((item, index) => {
    const value = form[`q${index}`]?.value?.trim();
    if (!value) return;
    if (item.type === 'trueFalse') {
      if ((value === 'true') === item.answer) score += 1;
    } else {
      if (value === String(item.answer)) score += 1;
    }
  });
  closeModal();
  state.completedTasks += 1;
  state.deadlines = Math.max(0, state.deadlines - 1);
  addChatMessage(`Weekly exam result: ${score}/${entries.length}. Review the weak points and repeat the targeted mini-lesson.`);
  updateMetrics();
}

function openModal(content) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  body.innerHTML = content;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function sendBotQuestion() {
  const input = document.getElementById('botQuestion');
  const text = input.value.trim();
  if (!text) return;
  addChatMessage(text, true);
  input.value = '';
  const answer = findBotAnswer(text);
  setTimeout(() => addChatMessage(answer), 250);
}

function addChatMessage(text, isUser = false) {
  const message = document.createElement('div');
  message.className = isUser ? 'chat-message' : 'chat-reply';
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function findBotAnswer(text) {
  const lower = text.toLowerCase();
  for (const item of botAnswers) {
    if (item.keywords.some(keyword => lower.includes(keyword))) {
      return item.answer;
    }
  }
  return 'Try asking about daily study, quiz help, or learning French/SAP concepts. I can recommend sources and explain weak topics.';
}

initDashboard();
