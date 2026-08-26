// ============================================================
// STUDY FLOW — GLOBAL THEME & USER STATE SYNC ENGINE
// ============================================================

(function () {
  const THEME_KEYS = ['theme', 'studyflow_theme'];
  const PROFILE_KEY = 'sf_userProfile';

  // 1. Theme application logic
  function getStoredTheme() {
    for (const key of THEME_KEYS) {
      const val = localStorage.getItem(key);
      if (val === 'dark' || val === 'light') return val;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.dataset.theme = theme;
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
      document.body.dataset.theme = theme;
      document.body.classList.toggle('dark-theme', isDark);
    }
  }

  // Run immediately in <head> to prevent theme flash
  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  // 2. Global user profile synchronization
  window.syncGlobalUserProfile = function () {
    const profileRaw = localStorage.getItem(PROFILE_KEY) || localStorage.getItem('sf_currentUser');
    if (!profileRaw) {
      // Default seed profile
      const defaultUser = {
        name: 'Precious Emmanuel',
        email: 'amakop20@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Precious+Emmanuel&background=4f46e5&color=fff&size=180',
        headline: 'Frontend Developer & Student at Rivers State University',
        location: 'Port Harcourt, Rivers State, Nigeria',
        bio: 'Passionate Frontend Developer focused on building responsive, accessible, and user-friendly web applications. Skilled in HTML, CSS, JavaScript, and modern UI design principles.',
        phone: '+234 701 389 2949'
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }

    try {
      const user = JSON.parse(profileRaw);

      // Update avatar images
      const avatars = document.querySelectorAll('#dashAvatar, .user-avatar, #profileAvatar');
      avatars.forEach(img => {
        if (user.avatar) img.src = user.avatar;
      });

      // Update name text
      const nameEls = document.querySelectorAll('#dashName, .user-name-inline, #profileName');
      nameEls.forEach(el => {
        if (user.name) el.textContent = user.name;
      });

      // Update email text & inputs
      const emailEls = document.querySelectorAll('#dashEmail, #emailInput');
      emailEls.forEach(el => {
        if (user.email) {
          if (el.tagName === 'INPUT') el.value = user.email;
          else el.textContent = user.email;
        }
      });

      // Update bio
      const bioEls = document.querySelectorAll('#dashBio, #aboutTextarea');
      bioEls.forEach(el => {
        if (user.bio) {
          if (el.tagName === 'TEXTAREA') el.value = user.bio;
          else el.innerHTML = `${user.bio} <a href="profile.html">Edit →</a>`;
        }
      });

      // Update headline & location
      const headlineEl = document.getElementById('profileHeadline');
      if (headlineEl && user.headline) headlineEl.textContent = user.headline;

      const locationEl = document.getElementById('profileLocation');
      if (locationEl && user.location) {
        locationEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${user.location}`;
      }

      // Update phone
      const phoneInput = document.getElementById('phoneInput');
      if (phoneInput && user.phone) phoneInput.value = user.phone;

      return user;
    } catch (err) {
      console.error('Error syncing profile:', err);
    }
  };

  // Expose global theme changer
  window.setStudyFlowTheme = function (theme) {
    THEME_KEYS.forEach(key => localStorage.setItem(key, theme));
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent('sf_theme_changed', { detail: { theme } }));
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getStoredTheme());
    window.syncGlobalUserProfile();
  });

  // Keep all open tabs synchronized
  window.addEventListener('storage', (e) => {
    if (THEME_KEYS.includes(e.key)) {
      applyTheme(getStoredTheme());
    }
    if (e.key === PROFILE_KEY || e.key === 'sf_currentUser') {
      window.syncGlobalUserProfile();
    }
  });
})();
