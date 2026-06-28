const bellBtn = document.getElementById("bellBtn");
const userBtn = document.getElementById("userBtn");

const notificationDropdown =
    document.getElementById("notificationDropdown");

const userDropdown =
    document.getElementById("userDropdown");

const markAllRead =
    document.getElementById("markAllRead");

const notificationCount =
    document.getElementById("notificationCount");


// Notification Toggle
bellBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    notificationDropdown.classList.toggle("active");

    userDropdown.classList.remove("active");

});


// User Toggle
userBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    userDropdown.classList.toggle("active");

    notificationDropdown.classList.remove("active");

});


// Close when clicking outside
document.addEventListener("click", () => {

    notificationDropdown.classList.remove("active");

    userDropdown.classList.remove("active");

});


// Prevent closing when clicking inside
notificationDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
});

userDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
});


// Mark all read
markAllRead.addEventListener("click", () => {

    document
        .querySelectorAll(".notification-item.unread")
        .forEach(item => item.classList.remove("unread"));

    notificationCount.textContent = "0";
    notificationCount.style.display = "none";
});


// Individual notification click
document
    .querySelectorAll(".notification-item")
    .forEach(item => {

        item.addEventListener("click", () => {

            item.classList.remove("unread");

            const remaining =
                document.querySelectorAll(
                    ".notification-item.unread"
                ).length;

            notificationCount.textContent = remaining;

            if (remaining === 0) {
                notificationCount.style.display = "none";
            }
        });
    });
// ===============================
// PASSWORD TOGGLE
// ===============================
const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";

    passwordInput.type =
        isPassword ? "text" : "password";

    togglePassword.textContent =
        isPassword ? "🙈" : "👁";
});

// ===============================
// LOGIN FORM VALIDATION
// ===============================
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");

const emailError =
    document.getElementById("emailError");

const pwError =
    document.getElementById("pwError");

const toast =
    document.getElementById("toast");

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let isValid = true;

    // Hide previous errors
    emailError.style.display = "none";
    pwError.style.display = "none";

    // Email Validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
        emailError.style.display = "block";
        isValid = false;
    }

    // Password Validation
    if (passwordInput.value.trim().length < 6) {
        pwError.style.display = "block";
        isValid = false;
    }

    if (!isValid) return;

    // Show Toast
    toast.classList.add("show");
    toast.textContent = "🔐 Logging you in...";

    const loginBtn =
        document.getElementById("loginBtn");

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing In...";

    setTimeout(() => {

        toast.textContent =
            "✅ Login Successful!";

        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";



        toast.classList.remove("show");

        // Go to dashboard
        window.location.href = "dashboard.html";

    }, 1500);
});



// ===============================
// ADD NEW NOTIFICATION EXAMPLE
// ===============================
function addNotification(message, icon = "🔔") {

    const notificationList =
        document.querySelector(".notification-dropdown");

    const notification =
        document.createElement("div");

    notification.className =
        "notification-item unread";

    notification.innerHTML = `
        <i>${icon}</i>
        ${message}
    `;

    notificationList.appendChild(notification);

    let count =
        parseInt(notificationCount.textContent) || 0;

    count++;

    notificationCount.style.display = "flex";
    notificationCount.textContent = count;
}
// Profile Card JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const profileAvatar = document.getElementById('profileAvatar');
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const imageUpload = document.getElementById('imageUpload');
  const saveBtn = document.querySelector('.save-btn');
  const textarea = document.querySelector('.profile-section textarea');
  const inputs = document.querySelectorAll('.form-group input');

  // Default avatar placeholder
  const defaultAvatar = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';

  // Initialize
  init();

  function init() {
    loadProfileData();
    setupEventListeners();
    addTextareaAutoResize();
  }

  function setupEventListeners() {
    // Change photo button click
    changePhotoBtn.addEventListener('click', () => {
      imageUpload.click();
    });

    // Image upload change
    imageUpload.addEventListener('change', handleImageUpload);

    // Save button
    saveBtn.addEventListener('click', handleSaveProfile);

    // Input validation on blur
    inputs.forEach(input => {
      input.addEventListener('blur', validateInput);
      input.addEventListener('input', clearValidation);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveProfile();
      }
    });
  }

  // Handle image upload
  function handleImageUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('Image size must be less than 5MB', 'error');
      return;
    }

    // Read and display image
    const reader = new FileReader();

    reader.onload = (event) => {
      profileAvatar.src = event.target.result;
      profileAvatar.style.opacity = '0';

      setTimeout(() => {
        profileAvatar.style.transition = 'opacity 0.3s ease';
        profileAvatar.style.opacity = '1';
      }, 100);

      showNotification('Profile photo updated!', 'success');
    };

    reader.onerror = () => {
      showNotification('Error reading image file', 'error');
    };

    reader.readAsDataURL(file);
  }

  // Handle save profile
  function handleSaveProfile() {
    const profileData = collectProfileData();

    // Validate required fields
    if (!validateProfile(profileData)) {
      return;
    }

    // Show loading state
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    // Simulate save operation (replace with actual API call)
    setTimeout(() => {
      saveToLocalStorage(profileData);

      saveBtn.classList.remove('loading');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Profile';

      showNotification('Profile saved successfully!', 'success');
    }, 800);
  }

  // Collect profile data
  function collectProfileData() {
    return {
      avatar: profileAvatar.src,
      name: document.querySelector('.profile-info h2')?.textContent || '',
      headline: document.querySelector('.profile-info .headline')?.textContent || '',
      location: document.querySelector('.profile-info .location')?.textContent.trim() || '',
      about: textarea?.value || '',
      skills: Array.from(document.querySelectorAll('.skills-list span')).map(span => span.textContent),
      email: document.querySelector('input[type="email"]')?.value || '',
      phone: document.querySelector('input[type="tel"]')?.value || '',
      lastUpdated: new Date().toISOString()
    };
  }

  // Validate profile data
  function validateProfile(data) {
    let isValid = true;

    // Validate email
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(data.email)) {
      showInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate phone
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput && data.phone && !isValidPhone(data.phone)) {
      showInputError(phoneInput, 'Please enter a valid phone number');
      isValid = false;
    }

    return isValid;
  }

  // Validation helpers
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,6}[-\s\.]?[0-9]{3,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Input validation on blur
  function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();

    if (input.type === 'email' && value && !isValidEmail(value)) {
      showInputError(input, 'Invalid email format');
    } else if (input.type === 'tel' && value && !isValidPhone(value)) {
      showInputError(input, 'Invalid phone format');
    }
  }

  // Clear validation styling
  function clearValidation(e) {
    const input = e.target;
    input.classList.remove('invalid');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  }

  // Show input error
  function showInputError(input, message) {
    input.classList.add('invalid');

    let errorMsg = input.parentElement.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('span');
      errorMsg.className = 'error-message';
      errorMsg.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
      input.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  // Save to localStorage
  function saveToLocalStorage(data) {
    try {
      localStorage.setItem('userProfile', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Load profile data from localStorage
  function loadProfileData() {
    try {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        const data = JSON.parse(saved);

        if (data.avatar && !data.avatar.includes('pexels.com')) {
          profileAvatar.src = data.avatar;
        }

        if (data.about && textarea) {
          textarea.value = data.about;
        }

        const emailInput = document.querySelector('input[type="email"]');
        const phoneInput = document.querySelector('input[type="tel"]');

        if (emailInput && data.email) emailInput.value = data.email;
        if (phoneInput && data.phone) phoneInput.value = data.phone;
      }
    } catch (e) {
      console.error('Failed to load profile data:', e);
    }
  }

  // Auto-resize textarea
  function addTextareaAutoResize() {
    if (!textarea) return;

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="close-notification">&times;</button>
    `;

    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0ea5e9',
      color: 'white',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '0.9375rem',
      fontWeight: '500',
      zIndex: '1000',
      animation: 'slideIn 0.3s ease'
    });

    document.body.appendChild(notification);

    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .form-group input.invalid {
          border-color: #ef4444 !important;
        }
        .notification .close-notification {
          background: none;
          border: none;
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0;
          margin-left: 0.5rem;
        }
      `;
      document.head.appendChild(style);
    }

    notification.querySelector('.close-notification').addEventListener('click', () => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 4000);
  }


});

// ── Load saved profile into dashboard card ───────────────────
(function loadDashProfile() {
  try {
    const saved = localStorage.getItem('sf_userProfile');
    if (!saved) return;
 
    const data = JSON.parse(saved);
 
    // Avatar
    const dashAvatar = document.getElementById('dashAvatar');
    if (dashAvatar && data.avatar &&
        !data.avatar.includes('pravatar') &&
        !data.avatar.includes('ui-avatars')) {
      dashAvatar.src = data.avatar;
    }
 
    // Name / Headline / Location
    const dashName     = document.getElementById('dashName');
    const dashHeadline = document.getElementById('dashHeadline');
    const dashLocation = document.getElementById('dashLocation');
 
    if (dashName     && data.name)     dashName.textContent     = data.name;
    if (dashHeadline && data.headline) dashHeadline.textContent = data.headline;
    if (dashLocation && data.location) {
      dashLocation.innerHTML =
        `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
    }
 
    // ── BIO ──────────────────────────────────────────────────
    const dashBio = document.getElementById('dashBio');
    if (dashBio) {
      if (data.about && data.about.trim()) {
        dashBio.textContent = data.about;
      } else {
        dashBio.innerHTML = 'No bio yet. <a href="profile.html">Add one →</a>';
      }
    }
 
    // Email / Phone
    const dashEmail = document.getElementById('dashEmail');
    const dashPhone = document.getElementById('dashPhone');
    if (dashEmail && data.email) dashEmail.textContent = data.email;
    if (dashPhone && data.phone) dashPhone.textContent = data.phone;
 
    // Last updated timestamp
    const dashLastUpdated = document.getElementById('dashLastUpdated');
    if (dashLastUpdated && data.lastUpdated) {
      const d = new Date(data.lastUpdated);
      dashLastUpdated.textContent =
        'Last updated: ' + d.toLocaleDateString('en-NG', {
          day   : 'numeric',
          month : 'short',
          year  : 'numeric',
          hour  : '2-digit',
          minute: '2-digit'
        });
    }
 
  } catch (err) {
    console.error('Could not load profile data:', err);
  }
})();







