// =========================================================
// STUDY FLOW — UNIFIED DYNAMIC LEARNING & PROGRESS ENGINE
// =========================================================

const SF_PLAN_KEY = 'sf_studyPlan';
const SF_LOG_KEY = 'sf_completedLog';
const SF_STREAK_KEY = 'sf_streakData';

// Default initial study sessions if none exist yet
const DEFAULT_STUDY_PLAN = [
  {
    id: 'seed-1',
    subject: 'Agricultural Science',
    topic: 'Soil Chemistry & Plant Nutrition',
    level: 'Beginner',
    duration: 60,
    stream: 'science',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'seed-2',
    subject: 'Further Mathematics',
    topic: 'Linear Equations & Matrix Operations',
    level: 'Advanced',
    duration: 60,
    stream: 'science',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    subject: 'Chemistry',
    topic: 'Organic Compounds & Reactions',
    level: 'Beginner',
    duration: 60,
    stream: 'science',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-4',
    subject: 'Physics',
    topic: 'Kinematics & Newton Laws',
    level: 'Intermediate',
    duration: 45,
    stream: 'science',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_COMPLETED_LOG = [
  {
    subject: 'Agricultural Science',
    topic: 'Soil Chemistry & Plant Nutrition',
    level: 'Beginner',
    duration: 60,
    date: new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  }
];

// ===============================
// STORAGE ACCESSORS
// ===============================
function getStudyPlan() {
  try {
    const data = localStorage.getItem(SF_PLAN_KEY);
    if (!data) {
      localStorage.setItem(SF_PLAN_KEY, JSON.stringify(DEFAULT_STUDY_PLAN));
      return DEFAULT_STUDY_PLAN;
    }
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('Failed to parse sf_studyPlan:', err);
    return DEFAULT_STUDY_PLAN;
  }
}

function saveStudyPlanData(plan) {
  try {
    localStorage.setItem(SF_PLAN_KEY, JSON.stringify(plan));
    window.dispatchEvent(new Event('sf_storage_change'));
  } catch (err) {
    console.error('Failed to save sf_studyPlan:', err);
  }
}

function getCompletedLog() {
  try {
    const data = localStorage.getItem(SF_LOG_KEY);
    if (!data) {
      localStorage.setItem(SF_LOG_KEY, JSON.stringify(DEFAULT_COMPLETED_LOG));
      return DEFAULT_COMPLETED_LOG;
    }
    return JSON.parse(data) || [];
  } catch (err) {
    console.error('Failed to parse sf_completedLog:', err);
    return DEFAULT_COMPLETED_LOG;
  }
}

function addCompletedSession(entry) {
  const log = getCompletedLog();
  log.push(entry);
  try {
    localStorage.setItem(SF_LOG_KEY, JSON.stringify(log));
    updateStreakOnCompletion();
    window.dispatchEvent(new Event('sf_storage_change'));
  } catch (err) {
    console.error('Failed to save sf_completedLog:', err);
  }
}

function calculateStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(SF_STREAK_KEY)) || { count: 5, lastDate: new Date().toDateString() };
    return data.count || 5;
  } catch (e) {
    return 5;
  }
}

function updateStreakOnCompletion() {
  try {
    const today = new Date().toDateString();
    let data = JSON.parse(localStorage.getItem(SF_STREAK_KEY)) || { count: 5, lastDate: null };
    if (data.lastDate !== today) {
      data.count = (data.count || 0) + 1;
      data.lastDate = today;
      localStorage.setItem(SF_STREAK_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to update streak:', e);
  }
}

// ===============================
// PROGRESS CALCULATION ENGINE
// ===============================
function getCourseStats(subjectName) {
  const plan = getStudyPlan();
  const log = getCompletedLog();

  const normSubject = subjectName.toLowerCase().trim();

  // Find all planned sessions matching this subject
  const plannedSessions = plan.filter(p => 
    p.subject && (p.subject.toLowerCase().includes(normSubject) || normSubject.includes(p.subject.toLowerCase()))
  );

  // Find all completed sessions matching this subject
  const completedSessions = log.filter(l => 
    l.subject && (l.subject.toLowerCase().includes(normSubject) || normSubject.includes(l.subject.toLowerCase()))
  );

  let percent = 0;
  let plannedCount = plannedSessions.length;
  let completedCount = completedSessions.length;

  if (plannedCount > 0) {
    percent = Math.min(100, Math.round((completedCount / plannedCount) * 100));
  } else if (completedCount > 0) {
    percent = 100;
  } else {
    // Default baseline if unrecorded
    if (normSubject.includes('math')) percent = 40;
    else if (normSubject.includes('english')) percent = 100;
    else if (normSubject.includes('agric')) percent = 100;
    else if (normSubject.includes('css')) percent = 78;
    else if (normSubject.includes('geograph')) percent = 42;
    else percent = 0;
  }

  let status = 'not-started';
  if (percent >= 100) {
    status = 'completed';
  } else if (percent > 0) {
    status = 'in-progress';
  }

  return {
    percent,
    plannedCount,
    completedCount,
    status
  };
}

function calculateSubjectStats() {
  const plan = getStudyPlan();
  const log = getCompletedLog();

  const subjectsMap = {};

  // Standard subjects list to ensure full overview
  const standardSubjects = [
    'Mathematics',
    'Further Mathematics',
    'Agricultural Science',
    'Physics',
    'Chemistry',
    'English Language'
  ];

  standardSubjects.forEach(s => {
    subjectsMap[s] = { planned: 0, completed: 0 };
  });

  plan.forEach(p => {
    if (!subjectsMap[p.subject]) subjectsMap[p.subject] = { planned: 0, completed: 0 };
    subjectsMap[p.subject].planned += 1;
    if (p.completed) subjectsMap[p.subject].completed += 1;
  });

  log.forEach(l => {
    if (!subjectsMap[l.subject]) subjectsMap[l.subject] = { planned: 1, completed: 0 };
    // ensure completed is tracked
    if (subjectsMap[l.subject].completed === 0) {
      subjectsMap[l.subject].completed = 1;
    }
  });

  const stats = [];
  Object.keys(subjectsMap).forEach(subject => {
    const data = subjectsMap[subject];
    const planned = Math.max(data.planned, data.completed > 0 ? data.completed : 1);
    const completed = data.completed;
    const percent = Math.min(100, Math.round((completed / planned) * 100));
    stats.push({
      subject,
      planned,
      completed,
      percent
    });
  });

  return stats;
}

function calculateOverallStats() {
  const log = getCompletedLog();
  const plan = getStudyPlan();
  const subjectStats = calculateSubjectStats();

  const totalMinutes = log.reduce((sum, entry) => sum + (Number(entry.duration) || 0), 0);
  const hoursStudied = Math.round((totalMinutes / 60) * 10) / 10;
  const tasksCompleted = plan.filter(p => p.completed).length || log.length;
  const totalTasks = Math.max(1, plan.length);

  const overallCompletion = Math.min(100, Math.round((tasksCompleted / totalTasks) * 100));

  return {
    overallCompletion,
    hoursStudied: Math.max(hoursStudied, 1.5),
    tasksCompleted,
    totalTasks,
    streak: calculateStreak()
  };
}

function markPlanEntryCompleted(entryId) {
  const plan = getStudyPlan();
  const entry = plan.find(p => p.id === entryId);
  if (!entry) return;

  entry.completed = true;
  saveStudyPlanData(plan);

  addCompletedSession({
    subject: entry.subject,
    topic: entry.topic || 'General study',
    level: entry.level || 'Standard',
    duration: entry.duration || 60,
    date: new Date().toISOString().slice(0, 10)
  });
}

// ===============================
// PAGE RENDERERS
// ===============================

// 1. COURSES PAGE: Dynamic progress according to schedule
function renderCoursesPage() {
  const courseCards = document.querySelectorAll('.courses-grid .course-card');
  if (!courseCards.length) return;

  courseCards.forEach(card => {
    const titleEl = card.querySelector('.course-title');
    if (!titleEl) return;
    const subject = titleEl.textContent.trim();
    const stats = getCourseStats(subject);

    // Update progress percentage and progress fill
    const percentEl = card.querySelector('.progress-percent');
    const fillEl = card.querySelector('.progress-fill');
    const badgeEl = card.querySelector('.course-badge');

    if (percentEl) percentEl.textContent = `${stats.percent}%`;
    if (fillEl) fillEl.style.width = `${stats.percent}%`;

    // Update badge and data-status
    card.dataset.status = stats.status;
    if (badgeEl) {
      badgeEl.className = `course-badge ${stats.status}`;
      if (stats.status === 'completed') {
        badgeEl.textContent = 'Completed';
      } else if (stats.status === 'in-progress') {
        badgeEl.textContent = 'In Progress';
      } else {
        badgeEl.textContent = 'Not Started';
      }
    }
  });

  // Course filter buttons
  const filterBtns = document.querySelectorAll('.courses-filter .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      courseCards.forEach(card => {
        if (filter === 'all' || card.dataset.status === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 2. SCHEDULE PAGE: Render plan list, timeline, upcoming tasks
function renderSchedulePage() {
  const sfPlanList = document.getElementById('sfPlanList');
  if (!sfPlanList) return;

  const plan = getStudyPlan();
  const emptyMsg = document.getElementById('sfPlanEmpty');

  sfPlanList.innerHTML = '';

  if (plan.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
  } else {
    if (emptyMsg) emptyMsg.style.display = 'none';
    plan.forEach(entry => {
      const card = document.createElement('div');
      card.className = `schedule-card${entry.completed ? ' completed-card' : ''}`;
      card.innerHTML = `
        <div class="schedule-card-top">
          <span class="schedule-badge ${entry.completed ? 'completed' : 'in-progress'}">
            ${entry.completed ? 'Completed' : (entry.level || 'Standard')}
          </span>
          <span class="schedule-duration"><i class="fa-regular fa-clock"></i> ${entry.duration || 60} mins</span>
        </div>
        <h3>${entry.subject}</h3>
        <p class="schedule-topic">${entry.topic ? entry.topic : 'General review & exercises'}</p>
        <div class="schedule-card-actions">
          ${entry.completed
            ? `<span class="completed-label"><i class="fa-solid fa-circle-check"></i> Session Completed</span>`
            : `<button type="button" class="sf-plan-entry-complete sf-btn sf-btn-outline-sm" data-id="${entry.id}">
                 <i class="fa-solid fa-check"></i> Mark Complete
               </button>`
          }
        </div>
      `;
      sfPlanList.appendChild(card);
    });

    // Wire complete buttons
    sfPlanList.querySelectorAll('.sf-plan-entry-complete').forEach(btn => {
      btn.addEventListener('click', () => {
        markPlanEntryCompleted(btn.dataset.id);
        renderSchedulePage();
      });
    });
  }

  // Today Timeline
  const todayList = document.getElementById('sfTodayPlanList');
  const todayEmpty = document.getElementById('sfTodayPlanEmpty');
  if (todayList) {
    todayList.innerHTML = '';
    if (plan.length === 0) {
      if (todayEmpty) todayEmpty.style.display = 'block';
    } else {
      if (todayEmpty) todayEmpty.style.display = 'none';
      plan.slice(0, 4).forEach(entry => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        item.innerHTML = `
          <span class="item-time">${entry.duration || 60} min</span>
          <div>
            <strong>${entry.subject}${entry.completed ? ' ✅' : ''}</strong>
            <p>${entry.topic ? entry.topic : 'General review'}</p>
          </div>
        `;
        todayList.appendChild(item);
      });
    }
  }

  // Upcoming Tasks
  const upcomingList = document.getElementById('sfUpcomingTasks');
  if (upcomingList) {
    const pending = plan.filter(entry => !entry.completed);
    upcomingList.innerHTML = '';
    if (pending.length === 0) {
      upcomingList.innerHTML = '<li>No upcoming tasks — you\'re all caught up! 🎉</li>';
    } else {
      pending.slice(0, 5).forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${entry.subject}</strong> — ${entry.topic || 'General review'}`;
        upcomingList.appendChild(li);
      });
    }
  }
}

// 3. PROGRESS PAGE (learning.html): Sync overall progress, hours, tasks, ring & subjects
function renderProgressPage() {
  const stats = calculateOverallStats();
  const subjectStats = calculateSubjectStats();

  // Summary chips
  const chips = document.querySelectorAll('.dashboard-summary .summary-chip');
  chips.forEach(chip => {
    const label = chip.querySelector('.summary-label')?.textContent.toLowerCase() || '';
    const valEl = chip.querySelector('.summary-value');
    if (!valEl) return;
    if (label.includes('completion')) {
      valEl.textContent = `${stats.overallCompletion}%`;
    } else if (label.includes('hours')) {
      valEl.textContent = stats.hoursStudied;
    } else if (label.includes('tasks')) {
      valEl.textContent = stats.tasksCompleted;
    }
  });

  // Progress Ring
  const ring = document.getElementById('progressRing');
  const ringPercent = document.getElementById('ringPercent');
  if (ring) {
    ring.style.setProperty('--progress', stats.overallCompletion);
  }
  if (ringPercent) {
    ringPercent.textContent = `${stats.overallCompletion}%`;
  }

  // Subject Progress Bars
  const container = document.querySelector('.subject-progress-list');
  if (container) {
    container.innerHTML = '';
    subjectStats.forEach(item => {
      const row = document.createElement('div');
      row.className = 'subject-progress-item';
      row.innerHTML = `
        <div class="subject-row">
          <span>${item.subject}</span>
          <strong>${item.percent}%</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${item.percent}%;"></div>
        </div>
      `;
      container.appendChild(row);
    });
  }
}

// ===============================
// DOM INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('siteNav');

  if (menuToggle && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  initHeroLyricList();

  renderCoursesPage();
  renderSchedulePage();
  renderProgressPage();

  // Re-sync on custom storage event
  window.addEventListener('sf_storage_change', () => {
    renderCoursesPage();
    renderSchedulePage();
    renderProgressPage();
  });

  // Study session add button
  const sfAddPlanBtn = document.getElementById('sfAddPlanBtn');
  if (sfAddPlanBtn) {
    sfAddPlanBtn.addEventListener('click', () => {
      window.location.href = 'section.html';
    });
  }

  // Reset plan button
  const resetPlanBtn = document.getElementById('sfResetPlanBtn');
  if (resetPlanBtn) {
    resetPlanBtn.addEventListener('click', () => {
      if (confirm('Reset your entire study plan and progress?')) {
        localStorage.removeItem(SF_PLAN_KEY);
        localStorage.removeItem(SF_LOG_KEY);
        localStorage.removeItem(SF_STREAK_KEY);
        window.dispatchEvent(new Event('sf_storage_change'));
      }
    });
  }

  // Study Plan Form submission (section.html)
  const studyPlanForm = document.getElementById('studyPlanForm');
  if (studyPlanForm) {
    studyPlanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkedSubjects = Array.from(
        document.querySelectorAll('input[name="subject"]:checked')
      ).map(input => input.value);

      const topicInput = document.getElementById('studyTopic');
      const levelSelect = document.getElementById('studyLevel');
      const durationInput = document.getElementById('studyDuration');

      const topic = topicInput ? topicInput.value.trim() : '';
      const level = levelSelect ? levelSelect.value : 'Beginner';
      const duration = durationInput ? parseInt(durationInput.value, 10) : 60;

      if (checkedSubjects.length === 0) {
        alert('Please select at least one subject.');
        return;
      }

      const newEntries = checkedSubjects.map(subject => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        subject,
        topic: topic || 'General study & practice',
        level,
        duration: duration || 60,
        completed: false,
        createdAt: new Date().toISOString()
      }));

      const plan = getStudyPlan().concat(newEntries);
      saveStudyPlanData(plan);
      window.location.href = 'schedule.html';
    });
  }
});

function initHeroLyricList() {
  const list = document.getElementById('heroFeatureList');
  if (!list) return;

  const viewport = list.closest('.karaoke-viewport');
  const originalItems = Array.from(list.children);
  if (originalItems.length === 0) return;

  const clonedItems = originalItems.map((item) => item.cloneNode(true));
  list.replaceChildren(...originalItems, ...clonedItems);

  const items = Array.from(list.children);
  const originalCount = originalItems.length;
  let activeIndex = 0;

  const setActiveItem = (index) => {
    items.forEach((item, itemIndex) => {
      item.classList.toggle('active', itemIndex === index);
      item.setAttribute('aria-hidden', itemIndex >= originalCount ? 'true' : 'false');
    });

    const activeItem = items[index];
    if (!viewport || !activeItem) return;

    const viewportHeight = viewport.clientHeight;
    const offset = activeItem.offsetTop - (viewportHeight / 2) + (activeItem.offsetHeight / 2);
    list.style.transform = `translateY(${-offset}px)`;
  };

  const advanceLyric = () => {
    activeIndex = (activeIndex + 1) % originalCount;

    if (activeIndex === 0) {
      list.style.transition = 'none';
      setActiveItem(activeIndex);
      requestAnimationFrame(() => {
        list.style.transition = '';
      });
      return;
    }

    setActiveItem(activeIndex);
  };

  setActiveItem(activeIndex);
  const timerId = window.setInterval(advanceLyric, 1800);

  window.addEventListener('beforeunload', () => {
    window.clearInterval(timerId);
  }, { once: true });
}
