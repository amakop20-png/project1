// ============================================================
// STUDY FLOW — AUTHENTICATION & GOOGLE SIGN-IN ENGINE
// ============================================================

// 👇 Paste your real Google OAuth Client ID here (Google Cloud Console → Credentials)
const GOOGLE_CLIENT_ID = '754031449338-cbgtihek16296pm3l4fk43mkjg8tuai7.apps.googleusercontent.com';

// This must be added to "Authorized redirect URIs" in Google Cloud Console —
// pointing back at this same login page.
const GOOGLE_REDIRECT_URI = ' https://serene-medovik-6d4d1d.netlify.app';

document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('googleLoginBtn');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const pwError = document.getElementById('pwError');
  const toast = document.getElementById('toast');
  const loginBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');

  // Password visibility toggle
  if (passwordInput && togglePassword) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.textContent = isPassword ? '🙈' : '👁';
    });
  }

  function showToast(message, type = 'info') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show';
    toast.classList.add(`toast-${type}`);
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ============================================================
  // 1. REAL Google OAuth — sends the user to Google's actual
  //    account chooser/login screen, then Google redirects back
  //    here with an access token we exchange for their real profile.
  // ============================================================

  if (googleBtn) {
    googleBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'token',
        scope: 'openid email profile',
        include_granted_scopes: 'true',
        prompt: 'https://app.netlify.com/projects/serene-medovik-6d4d1d/overview' // forces Google's account chooser to show
      });

      // Full-page redirect to Google's real login/account chooser
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    });
  }

  // ============================================================
  // On page load: check if Google just redirected us back with a token
  // (it arrives in the URL hash, e.g. #access_token=...&token_type=...)
  // ============================================================
  handleGoogleRedirectReturn();

  async function handleGoogleRedirectReturn() {
    if (!window.location.hash.includes('access_token')) return;

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    if (!accessToken) return;

    showToast('Connecting to your Google account...', 'loading');

    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) throw new Error('Failed to fetch Google profile');

      const profile = await res.json();

      const googleUser = {
        name: profile.name || 'Google User',
        email: profile.email,
        avatar: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=16A34A&color=fff&size=180`,
        headline: 'Student at Study Flow',
        location: '',
        bio: '',
        provider: 'google',
        authenticatedAt: new Date().toISOString()
      };

      localStorage.setItem('sf_userProfile', JSON.stringify(googleUser));
      localStorage.setItem('sf_currentUser', JSON.stringify(googleUser));
      localStorage.setItem('sf_auth', 'true');

      if (typeof window.syncGlobalUserProfile === 'function') {
        window.syncGlobalUserProfile();
      }

      // Clean the token out of the URL so it's not left visible/bookmarkable
      window.history.replaceState({}, document.title, window.location.pathname);

      showToast(`✅ Signed in as ${googleUser.name}!`, 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 900);

    } catch (err) {
      console.error('Google sign-in error:', err);
      showToast('⚠ Google sign-in failed. Please try again.', 'error');
    }
  }

  // 2. Standard Form Login (unchanged — still local demo validation)
  if (loginForm) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      if (emailError) emailError.style.display = 'none';
      if (pwError) pwError.style.display = 'none';

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const pwVal = passwordInput ? passwordInput.value.trim() : '';

      if (!emailPattern.test(emailVal)) {
        if (emailError) emailError.style.display = 'block';
        isValid = false;
      }

      if (pwVal.length < 6) {
        if (pwError) pwError.style.display = 'block';
        isValid = false;
      }

      if (!isValid) {
        showToast('⚠ Please verify your email and password.', 'error');
        return;
      }

      showToast('🔐 Logging you in…', 'loading');
      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';
      }

      setTimeout(() => {
        const derivedName = emailVal.split('@')[0].replace(/[._]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()) || 'Student';

        const userObj = {
          name: derivedName,
          email: emailVal,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=16A34A&color=fff&size=180`,
          headline: 'Student at Study Flow',
          location: 'Nigeria',
          bio: 'Passionate student learning and building skills with Study Flow.',
          provider: 'email',
          authenticatedAt: new Date().toISOString()
        };

        localStorage.setItem('sf_userProfile', JSON.stringify(userObj));
        localStorage.setItem('sf_currentUser', JSON.stringify(userObj));
        localStorage.setItem('sf_auth', 'true');

        showToast('✅ Login successful!', 'success');

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      }, 1000);
    });
  }
});