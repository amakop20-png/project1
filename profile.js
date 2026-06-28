(() => {
  'use strict';

  const STORAGE_KEY = 'sf_profile';

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const profileAvatar  = document.getElementById('profileAvatar');
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const imageUpload    = document.getElementById('imageUpload');
  const nameEl         = document.getElementById('profileName');
  const headlineEl     = document.getElementById('profileHeadline');
  const locationEl     = document.getElementById('profileLocation');
  const aboutTextarea  = document.getElementById('aboutTextarea');
  const emailInput     = document.getElementById('emailInput');
  const phoneInput     = document.getElementById('phoneInput');
  const saveBtn        = document.getElementById('saveBtn');
  const toast          = document.getElementById('toast');

  // ── Toast ─────────────────────────────────────────────────────────────────
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ── Load saved profile ────────────────────────────────────────────────────
  function loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const d = JSON.parse(raw);

      if (d.image)    profileAvatar.src         = d.image;
      if (d.name)     nameEl.textContent         = d.name;
      if (d.headline) headlineEl.textContent     = d.headline;
      if (d.about)    aboutTextarea.value        = d.about;
      if (d.email)    emailInput.value           = d.email;
      if (d.phone)    phoneInput.value           = d.phone;

      // restore location text but keep the icon
      if (d.location) {
        const icon = locationEl.querySelector('i');
        locationEl.textContent = ' ' + d.location;
        if (icon) locationEl.prepend(icon);
      }

    } catch (err) {
      console.error('Could not load profile:', err);
    }
  }

  // ── Save profile ──────────────────────────────────────────────────────────
  function saveProfile() {
    // strip icon text from location
    const locText = locationEl.textContent.replace(/^\s*/, '').trim();

    const data = {
      image:    profileAvatar.src    || '',
      name:     nameEl.textContent.trim(),
      headline: headlineEl.textContent.trim(),
      location: locText,
      about:    aboutTextarea.value.trim(),
      email:    emailInput.value.trim(),
      phone:    phoneInput.value.trim(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showToast('✅ Profile saved!');
  }

  // ── Photo upload ──────────────────────────────────────────────────────────
  changePhotoBtn.addEventListener('click', () => imageUpload.click());

  imageUpload.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => { profileAvatar.src = e.target.result; };
    reader.readAsDataURL(file);
  });

  // ── Save button ───────────────────────────────────────────────────────────
  saveBtn.addEventListener('click', saveProfile);

  // ── Init ──────────────────────────────────────────────────────────────────
  loadProfile();

})();