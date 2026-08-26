// ==========================================
// STUDY FLOW SETTINGS MANAGER
// ==========================================

const SettingsManager = {

    // ==========================================
    // INITIALIZE
    // ==========================================

    init() {
        this.cacheDOM();
        this.loadPreferences();
        this.bindEvents();
        this.watchSystemTheme();
    },


    // ==========================================
    // CACHE DOM ELEMENTS
    // ==========================================

    cacheDOM() {

        // Save bar
        this.saveBar =
            document.getElementById("saveBar");

        this.saveBtn =
            document.getElementById("saveBtn");

        this.discardBtn =
            document.getElementById("discardBtn");


        // Appearance
        this.themeOptions =
            document.querySelectorAll(".theme-option");

        this.systemThemeToggle =
            document.getElementById(
                "systemThemeToggle"
            );


        // Accent
        this.swatches =
            document.querySelectorAll(".swatch");


        // General selects
        this.selects =
            document.querySelectorAll(
                ".setting-select"
            );


        // Font size
        this.fontSizeSelect =
            document.getElementById(
                "fontSizeSelect"
            );


        // Toggles
        this.toggles =
            document.querySelectorAll(
                ".toggle input"
            );


        // Navigation
        this.navItems =
            document.querySelectorAll(
                ".nav-item"
            );


        // Sound
        this.focusSoundsToggle =
            document.getElementById(
                "focusSoundsToggle"
            );

        this.ambientSoundSelect =
            document.getElementById(
                "ambientSoundSelect"
            );

        this.volumeSlider =
            document.getElementById(
                "volumeSlider"
            );

        this.volumeLabel =
            document.getElementById(
                "volumeLabel"
            );

        this.endChimeToggle =
            document.getElementById(
                "endChimeToggle"
            );

        this.testSoundBtn =
            document.getElementById(
                "testSoundBtn"
            );

        this.ambientAudio =
            document.getElementById(
                "ambientAudio"
            );

        this.chimeAudio =
            document.getElementById(
                "chimeAudio"
            );


        // Focus mode
        this.focusModeToggle =
            document.getElementById(
                "focusModeToggle"
            );

        this.focusModeDurationRow =
            document.getElementById(
                "focusModeDurationRow"
            );

        this.sessionLengthSelect =
            document.getElementById(
                "sessionLengthSelect"
            );

        this.breakLengthSelect =
            document.getElementById(
                "breakLengthSelect"
            );

        this.distractionBlockerToggle =
            document.getElementById(
                "distractionBlockerToggle"
            );

        this.focusTimerWidget =
            document.getElementById(
                "focusTimerWidget"
            );

        this.focusTimerDisplay =
            document.getElementById(
                "focusTimerDisplay"
            );

        this.focusStartBtn =
            document.getElementById(
                "focusStartBtn"
            );

        this.focusPauseBtn =
            document.getElementById(
                "focusPauseBtn"
            );

        this.focusResetBtn =
            document.getElementById(
                "focusResetBtn"
            );

        this.focusStatus =
            document.getElementById(
                "focusStatus"
            );


        // Reminders
        this.remindersToggle =
            document.getElementById(
                "remindersToggle"
            );

        this.reminderOptions =
            document.getElementById(
                "reminderOptions"
            );

        this.morningReminderTime =
            document.getElementById(
                "morningReminderTime"
            );

        this.eveningReminderTime =
            document.getElementById(
                "eveningReminderTime"
            );

        this.reminderFrequency =
            document.getElementById(
                "reminderFrequency"
            );

        this.reminderDays =
            document.querySelectorAll(
                "#reminderDays .day-chip"
            );

        this.testReminderBtn =
            document.getElementById(
                "testReminderBtn"
            );

        this.notifPermissionWarning =
            document.getElementById(
                "notifPermissionWarning"
            );


        // Account
        this.twoFAToggle =
            document.getElementById(
                "twoFAToggle"
            );

        this.exportBtn =
            document.getElementById(
                "exportBtn"
            );

        this.resetSettingsBtn =
            document.getElementById(
                "resetSettingsBtn"
            );

        this.deleteAccountBtn =
            document.getElementById(
                "deleteAccountBtn"
            );


        // Saved settings
        this.savedSummaryList =
            document.getElementById(
                "savedSummaryList"
            );

        this.lastSavedTime =
            document.getElementById(
                "lastSavedTime"
            );


        // State
        this.hasChanges = false;
        this.timer = null;
        this.timerSeconds = 0;
        this.toastTimer = null;
    },


    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    bindEvents() {

        // ==========================================
        // LIGHT / DARK THEME
        // ==========================================

        this.themeOptions.forEach(option => {

            option.addEventListener(
                "click",
                () => {
                    this.changeTheme(option);
                }
            );

        });


        // ==========================================
        // SYSTEM THEME
        // ==========================================

        this.systemThemeToggle?.addEventListener(
            "change",
            () => {

                this.toggleSystemTheme();

            }
        );


        // ==========================================
        // ACCENT COLORS
        // ==========================================

        this.swatches.forEach(swatch => {

            swatch.addEventListener(
                "click",
                () => {
                    this.changeAccent(swatch);
                }
            );

        });


        // ==========================================
        // FONT SIZE
        // ==========================================

        this.fontSizeSelect?.addEventListener(
            "change",
            event => {

                this.changeFontSize(
                    event.target.value
                );

            }
        );


        // ==========================================
        // SOUND TOGGLE
        // ==========================================

        this.focusSoundsToggle?.addEventListener(
            "change",
            () => {

                this.handleFocusSounds();

                this.showSaveBar();

            }
        );


        // ==========================================
        // AMBIENT SOUND
        // ==========================================

        this.ambientSoundSelect?.addEventListener(
            "change",
            () => {

                this.changeAmbientSound();

                this.showSaveBar();

            }
        );


        // ==========================================
        // VOLUME
        // ==========================================

        this.volumeSlider?.addEventListener(
            "input",
            event => {

                const volume =
                    Number(event.target.value);

                if (this.volumeLabel) {

                    this.volumeLabel.textContent =
                        `${volume}%`;

                }

                if (this.ambientAudio) {

                    this.ambientAudio.volume =
                        volume / 100;

                }

                localStorage.setItem(
                    "volume",
                    volume
                );

                this.showSaveBar();

            }
        );


        // ==========================================
        // END CHIME
        // ==========================================

        this.endChimeToggle?.addEventListener(
            "change",
            () => {

                localStorage.setItem(
                    "endChime",
                    this.endChimeToggle.checked
                );

                this.showSaveBar();

            }
        );


        // ==========================================
        // TEST SOUND
        // ==========================================

        this.testSoundBtn?.addEventListener(
            "click",
            () => {
                this.testSound();
            }
        );


        // ==========================================
        // FOCUS MODE
        // ==========================================

        this.focusModeToggle?.addEventListener(
            "change",
            () => {

                this.handleFocusMode();

                this.showSaveBar();

            }
        );


        // ==========================================
        // SESSION LENGTH
        // ==========================================

        this.sessionLengthSelect?.addEventListener(
            "change",
            () => {

                this.resetFocusTimer();

                this.showSaveBar();

            }
        );


        // ==========================================
        // BREAK LENGTH
        // ==========================================

        this.breakLengthSelect?.addEventListener(
            "change",
            () => {

                this.showSaveBar();

            }
        );


        // ==========================================
        // DISTRACTION BLOCKER
        // ==========================================

        this.distractionBlockerToggle?.addEventListener(
            "change",
            () => {

                this.showSaveBar();

            }
        );


        // ==========================================
        // FOCUS TIMER BUTTONS
        // ==========================================

        this.focusStartBtn?.addEventListener(
            "click",
            () => {
                this.startFocusTimer();
            }
        );

        this.focusPauseBtn?.addEventListener(
            "click",
            () => {
                this.pauseFocusTimer();
            }
        );

        this.focusResetBtn?.addEventListener(
            "click",
            () => {
                this.resetFocusTimer();
            }
        );


        // ==========================================
        // REMINDERS
        // ==========================================

        this.remindersToggle?.addEventListener(
            "change",
            () => {

                this.toggleReminderOptions();

                this.showSaveBar();

            }
        );


        // ==========================================
        // REMINDER DAYS
        // ==========================================

        this.reminderDays.forEach(day => {

            day.addEventListener(
                "click",
                () => {

                    const checkbox =
                        day.querySelector(
                            "input"
                        );

                    if (!checkbox) return;

                    checkbox.checked =
                        !checkbox.checked;

                    day.classList.toggle(
                        "active",
                        checkbox.checked
                    );

                    this.showSaveBar();

                }
            );

        });


        // ==========================================
        // TEST REMINDER
        // ==========================================

        this.testReminderBtn?.addEventListener(
            "click",
            () => {
                this.testReminder();
            }
        );


        // ==========================================
        // SAVE
        // ==========================================

        this.saveBtn?.addEventListener(
            "click",
            () => {

                this.savePreferences();

                this.hideSaveBar();

                this.showToast(
                    "Settings saved successfully"
                );

            }
        );


        // ==========================================
        // DISCARD
        // ==========================================

        this.discardBtn?.addEventListener(
            "click",
            () => {

                this.loadPreferences();

                this.hideSaveBar();

                this.showToast(
                    "Changes discarded"
                );

            }
        );


        // ==========================================
        // EXPORT
        // ==========================================

        this.exportBtn?.addEventListener(
            "click",
            () => {
                this.exportSettings();
            }
        );


        // ==========================================
        // RESET SETTINGS
        // ==========================================

        this.resetSettingsBtn?.addEventListener(
            "click",
            () => {
                this.resetSettings();
            }
        );


        // ==========================================
        // DELETE ACCOUNT
        // ==========================================

        this.deleteAccountBtn?.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to delete your account?"
                    );

                if (!confirmed) return;

                this.showToast(
                    "Account deletion requested"
                );

            }
        );

    },


    // ==========================================
    // CHANGE LIGHT / DARK THEME
    // ==========================================

    changeTheme(option) {

        if (!option) return;


        const theme =
            option.dataset.themePick;


        if (
            theme !== "light" &&
            theme !== "dark"
        ) {
            return;
        }


        // Turn off system theme
        if (this.systemThemeToggle) {

            this.systemThemeToggle.checked =
                false;

        }


        // Remove selected state
        this.themeOptions.forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


        // Select clicked theme
        option.classList.add(
            "selected"
        );


        // Apply theme
        this.applyTheme(theme);


        // Save
        localStorage.setItem(
            "theme",
            theme
        );

        localStorage.setItem(
            "systemTheme",
            "false"
        );


        this.showSaveBar();

    },


    // ==========================================
    // SYSTEM THEME TOGGLE
    // ==========================================

    toggleSystemTheme() {

        if (!this.systemThemeToggle) return;


        const enabled =
            this.systemThemeToggle.checked;


        if (enabled) {

            // System theme is active
            const currentTheme =
                document.body.classList.contains(
                    "dark-theme"
                )
                    ? "dark"
                    : "light";

            localStorage.setItem(
                "manualTheme",
                currentTheme
            );

            this.applySystemTheme();

            localStorage.setItem(
                "theme",
                "system"
            );

            localStorage.setItem(
                "systemTheme",
                "true"
            );


            // Remove light/dark selection
            this.themeOptions.forEach(option => {

                option.classList.remove(
                    "selected"
                );

            });


            this.showToast(
                "System theme enabled"
            );

        } else {

            // Turn system mode off
            const fallbackTheme =
                localStorage.getItem(
                    "manualTheme"
                ) || "light";


            this.applyTheme(
                fallbackTheme
            );


            this.themeOptions.forEach(option => {

                option.classList.toggle(
                    "selected",
                    option.dataset.themePick ===
                    fallbackTheme
                );

            });


            localStorage.setItem(
                "theme",
                fallbackTheme
            );

            localStorage.setItem(
                "systemTheme",
                "false"
            );


            this.showToast(
                `${fallbackTheme} theme enabled`
            );

        }


        this.showSaveBar();

    },


    // ==========================================
    // APPLY NORMAL THEME
    // ==========================================

    applyTheme(theme) {

        document.documentElement.dataset.theme =
            theme;

        document.body.dataset.theme =
            theme;

        document.body.classList.toggle(
            "dark-theme",
            theme === "dark"
        );

    },


    // ==========================================
    // APPLY SYSTEM THEME
    // ==========================================

    applySystemTheme() {

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        const theme =
            prefersDark
                ? "dark"
                : "light";


        this.applyTheme(theme);

    },


    // ==========================================
    // WATCH SYSTEM THEME
    // ==========================================

    watchSystemTheme() {

        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );


        mediaQuery.addEventListener(
            "change",
            () => {

                const systemEnabled =
                    localStorage.getItem(
                        "systemTheme"
                    ) === "true";


                if (systemEnabled) {

                    this.applySystemTheme();

                }

            }
        );

    },


    // ==========================================
    // ACCENT COLOR
    // ==========================================

    changeAccent(swatch) {

        if (!swatch) return;


        this.swatches.forEach(item => {

            item.classList.remove(
                "active"
            );

        });


        swatch.classList.add(
            "active"
        );


        const color =
            swatch.dataset.accent;


        if (!color) return;


        document.documentElement.style.setProperty(
            "--accent",
            color
        );


        localStorage.setItem(
            "accent",
            color
        );


        this.showSaveBar();

    },


    // ==========================================
    // FONT SIZE
    // ==========================================

    changeFontSize(size) {

        if (!size) return;


        document.documentElement.style.fontSize =
            `${size}px`;


        localStorage.setItem(
            "fontSize",
            size
        );


        this.showSaveBar();

    },


    // ==========================================
    // SOUND
    // ==========================================

    handleFocusSounds() {

        const enabled =
            this.focusSoundsToggle?.checked;


        if (!enabled) {

            this.ambientAudio?.pause();

        }

    },


    // ==========================================
    // AMBIENT SOUND
    // ==========================================

    changeAmbientSound() {

        const sound =
            this.ambientSoundSelect?.value;


        if (!sound || !this.ambientAudio) {
            return;
        }


        const sounds = {

            rain:
                "sounds/rain.mp3",

            forest:
                "sounds/forest.mp3",

            cafe:
                "sounds/cafe.mp3",

            whitenoise:
                "sounds/whitenoise.mp3"

        };


        if (
            sound === "none" ||
            !sounds[sound]
        ) {

            this.ambientAudio.pause();

            this.ambientAudio.removeAttribute(
                "src"
            );

            return;

        }


        this.ambientAudio.src =
            sounds[sound];


        this.ambientAudio.load();


        this.ambientAudio.volume =
            Number(
                this.volumeSlider?.value || 50
            ) / 100;


        if (
            this.focusSoundsToggle?.checked
        ) {

            this.ambientAudio.play()
                .catch(() => {

                    this.showToast(
                        "Click Play preview to start audio"
                    );

                });

        }

    },


    // ==========================================
    // TEST SOUND
    // ==========================================

    testSound() {

        if (
            !this.ambientAudio ||
            !this.ambientAudio.src
        ) {

            this.changeAmbientSound();

        }


        if (
            !this.ambientAudio ||
            !this.ambientAudio.src
        ) {

            this.showToast(
                "Please select an ambient sound first"
            );

            return;

        }


        this.ambientAudio.volume =
            Number(
                this.volumeSlider?.value || 50
            ) / 100;


        this.ambientAudio.play()
            .then(() => {

                this.showToast(
                    "Playing sound preview"
                );

            })
            .catch(() => {

                this.showToast(
                    "Unable to play audio"
                );

            });

    },


    // ==========================================
    // FOCUS MODE
    // ==========================================

    handleFocusMode() {

        const enabled =
            this.focusModeToggle?.checked;


        if (this.focusTimerWidget) {

            this.focusTimerWidget.style.display =
                enabled
                    ? "block"
                    : "none";

        }


        if (this.focusModeDurationRow) {

            this.focusModeDurationRow.style.display =
                enabled
                    ? "flex"
                    : "none";

        }

    },


    // ==========================================
    // RESET FOCUS TIMER
    // ==========================================

    resetFocusTimer() {

        clearInterval(this.timer);


        const minutes =
            Number(
                this.sessionLengthSelect?.value ||
                25
            );


        this.timerSeconds =
            minutes * 60;


        this.updateTimerDisplay();


        if (this.focusPauseBtn) {

            this.focusPauseBtn.style.display =
                "none";

        }


        if (this.focusStartBtn) {

            this.focusStartBtn.style.display =
                "inline-flex";

        }


        if (this.focusStatus) {

            this.focusStatus.textContent =
                "Ready to focus";

        }

    },


    // ==========================================
    // START FOCUS TIMER
    // ==========================================

    startFocusTimer() {

        if (this.timer) return;


        if (
            this.timerSeconds <= 0
        ) {

            this.resetFocusTimer();

        }


        this.focusStartBtn.style.display =
            "none";

        this.focusPauseBtn.style.display =
            "inline-flex";


        this.focusStatus.textContent =
            "Focus session running";


        this.timer =
            setInterval(
                () => {

                    this.timerSeconds--;

                    this.updateTimerDisplay();


                    if (
                        this.timerSeconds <= 0
                    ) {

                        this.finishFocusTimer();

                    }

                },
                1000
            );

    },


    // ==========================================
    // PAUSE FOCUS TIMER
    // ==========================================

    pauseFocusTimer() {

        clearInterval(this.timer);

        this.timer = null;


        this.focusStartBtn.style.display =
            "inline-flex";

        this.focusPauseBtn.style.display =
            "none";


        this.focusStatus.textContent =
            "Timer paused";

    },


    // ==========================================
    // FINISH FOCUS TIMER
    // ==========================================

    finishFocusTimer() {

        clearInterval(this.timer);

        this.timer = null;


        this.focusStartBtn.style.display =
            "inline-flex";

        this.focusPauseBtn.style.display =
            "none";


        this.focusStatus.textContent =
            "Focus session complete";


        this.showToast(
            "Focus session complete!"
        );


        if (
            this.endChimeToggle?.checked &&
            this.chimeAudio
        ) {

            this.chimeAudio.currentTime = 0;

            this.chimeAudio.play()
                .catch(() => {});

        }

    },


    // ==========================================
    // TIMER DISPLAY
    // ==========================================

    updateTimerDisplay() {

        if (!this.focusTimerDisplay) {
            return;
        }


        const minutes =
            Math.floor(
                this.timerSeconds / 60
            );


        const seconds =
            this.timerSeconds % 60;


        this.focusTimerDisplay.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    },


    // ==========================================
    // REMINDERS
    // ==========================================

    toggleReminderOptions() {

        if (!this.reminderOptions) {
            return;
        }


        const enabled =
            this.remindersToggle?.checked;


        this.reminderOptions.style.display =
            enabled
                ? "block"
                : "none";

    },


    // ==========================================
    // TEST REMINDER
    // ==========================================

    testReminder() {

        if (
            !("Notification" in window)
        ) {

            this.showToast(
                "Your browser does not support notifications"
            );

            return;

        }


        if (
            Notification.permission ===
            "denied"
        ) {

            if (
                this.notifPermissionWarning
            ) {

                this.notifPermissionWarning
                    .style.display = "block";

            }

            return;

        }


        const sendNotification = () => {

            new Notification(
                "Study Flow",
                {
                    body:
                        "This is your test study reminder."
                }
            );

            this.showToast(
                "Test reminder sent"
            );

        };


        if (
            Notification.permission ===
            "granted"
        ) {

            sendNotification();

            return;

        }


        Notification.requestPermission()
            .then(permission => {

                if (
                    permission ===
                    "granted"
                ) {

                    sendNotification();

                } else {

                    this.showToast(
                        "Notification permission denied"
                    );

                }

            });

    },


    // ==========================================
    // SAVE PREFERENCES
    // ==========================================

    savePreferences() {

        // Theme
        const selectedTheme =
            document.querySelector(
                ".theme-option.selected"
            );


        if (
            this.systemThemeToggle?.checked
        ) {

            localStorage.setItem(
                "theme",
                "system"
            );

            localStorage.setItem(
                "systemTheme",
                "true"
            );

        } else if (selectedTheme) {

            const theme =
                selectedTheme.dataset.themePick;


            localStorage.setItem(
                "theme",
                theme
            );

            localStorage.setItem(
                "manualTheme",
                theme
            );

            localStorage.setItem(
                "systemTheme",
                "false"
            );

        }


        // Accent
        const activeSwatch =
            document.querySelector(
                ".swatch.active"
            );


        if (activeSwatch) {

            localStorage.setItem(
                "accent",
                activeSwatch.dataset.accent
            );

        }


        // Font size
        if (this.fontSizeSelect) {

            localStorage.setItem(
                "fontSize",
                this.fontSizeSelect.value
            );

        }


        // Sound
        localStorage.setItem(
            "focusSounds",
            this.focusSoundsToggle?.checked
        );

        localStorage.setItem(
            "ambientSound",
            this.ambientSoundSelect?.value ||
            "none"
        );

        localStorage.setItem(
            "volume",
            this.volumeSlider?.value ||
            "50"
        );

        localStorage.setItem(
            "endChime",
            this.endChimeToggle?.checked
        );


        // Focus mode
        localStorage.setItem(
            "focusMode",
            this.focusModeToggle?.checked
        );

        localStorage.setItem(
            "sessionLength",
            this.sessionLengthSelect?.value ||
            "25"
        );

        localStorage.setItem(
            "breakLength",
            this.breakLengthSelect?.value ||
            "5"
        );

        localStorage.setItem(
            "distractionBlocker",
            this.distractionBlockerToggle?.checked
        );


        // Reminders
        localStorage.setItem(
            "reminders",
            this.remindersToggle?.checked
        );

        localStorage.setItem(
            "morningReminder",
            this.morningReminderTime?.value ||
            "08:00"
        );

        localStorage.setItem(
            "eveningReminder",
            this.eveningReminderTime?.value ||
            "20:00"
        );

        localStorage.setItem(
            "reminderFrequency",
            this.reminderFrequency?.value ||
            "weekdays"
        );


        // Reminder days
        const days = [];

        this.reminderDays.forEach(day => {

            const checkbox =
                day.querySelector("input");

            if (
                checkbox?.checked
            ) {

                days.push(
                    day.dataset.day
                );

            }

        });


        localStorage.setItem(
            "reminderDays",
            JSON.stringify(days)
        );


        // Account
        localStorage.setItem(
            "twoFA",
            this.twoFAToggle?.checked
        );


        // Last saved time
        const now =
            new Date().toLocaleString();


        localStorage.setItem(
            "lastSaved",
            now
        );


        this.renderSavedSummary();

    },


    // ==========================================
    // LOAD PREFERENCES
    // ==========================================

    loadPreferences() {

        // ==========================================
        // THEME
        // ==========================================

        const savedTheme =
            localStorage.getItem("theme") ||
            "light";


        const systemEnabled =
            localStorage.getItem(
                "systemTheme"
            ) === "true";


        this.systemThemeToggle.checked =
            systemEnabled;


        if (systemEnabled) {

            this.applySystemTheme();

            this.themeOptions.forEach(option => {

                option.classList.remove(
                    "selected"
                );

            });

        } else {

            const theme =
                savedTheme === "dark"
                    ? "dark"
                    : "light";


            this.applyTheme(theme);


            this.themeOptions.forEach(option => {

                option.classList.toggle(
                    "selected",
                    option.dataset.themePick ===
                    theme
                );

            });

        }


        // ==========================================
        // ACCENT
        // ==========================================

        const accent =
            localStorage.getItem("accent");


        if (accent) {

            document.documentElement.style.setProperty(
                "--accent",
                accent
            );


            this.swatches.forEach(swatch => {

                swatch.classList.toggle(
                    "active",
                    swatch.dataset.accent ===
                    accent
                );

            });

        }


        // ==========================================
        // FONT SIZE
        // ==========================================

        const fontSize =
            localStorage.getItem(
                "fontSize"
            );


        if (fontSize) {

            document.documentElement.style.fontSize =
                `${fontSize}px`;


            if (this.fontSizeSelect) {

                this.fontSizeSelect.value =
                    fontSize;

            }

        }


        // ==========================================
        // SOUND
        // ==========================================

        const focusSounds =
            localStorage.getItem(
                "focusSounds"
            );


        if (focusSounds !== null) {

            this.focusSoundsToggle.checked =
                focusSounds === "true";

        }


        const ambientSound =
            localStorage.getItem(
                "ambientSound"
            );


        if (ambientSound) {

            this.ambientSoundSelect.value =
                ambientSound;

        }


        const volume =
            localStorage.getItem(
                "volume"
            );


        if (volume) {

            this.volumeSlider.value =
                volume;

            this.volumeLabel.textContent =
                `${volume}%`;

        }


        const endChime =
            localStorage.getItem(
                "endChime"
            );


        if (endChime !== null) {

            this.endChimeToggle.checked =
                endChime === "true";

        }


        // ==========================================
        // FOCUS MODE
        // ==========================================

        const focusMode =
            localStorage.getItem(
                "focusMode"
            );


        if (focusMode !== null) {

            this.focusModeToggle.checked =
                focusMode === "true";

        }


        const sessionLength =
            localStorage.getItem(
                "sessionLength"
            );


        if (sessionLength) {

            this.sessionLengthSelect.value =
                sessionLength;

        }


        const breakLength =
            localStorage.getItem(
                "breakLength"
            );


        if (breakLength) {

            this.breakLengthSelect.value =
                breakLength;

        }


        const distractionBlocker =
            localStorage.getItem(
                "distractionBlocker"
            );


        if (distractionBlocker !== null) {

            this.distractionBlockerToggle.checked =
                distractionBlocker === "true";

        }


        this.handleFocusMode();


        // ==========================================
        // REMINDERS
        // ==========================================

        const reminders =
            localStorage.getItem(
                "reminders"
            );


        if (reminders !== null) {

            this.remindersToggle.checked =
                reminders === "true";

        }


        if (
            this.morningReminderTime
        ) {

            this.morningReminderTime.value =
                localStorage.getItem(
                    "morningReminder"
                ) || "08:00";

        }


        if (
            this.eveningReminderTime
        ) {

            this.eveningReminderTime.value =
                localStorage.getItem(
                    "eveningReminder"
                ) || "20:00";

        }


        if (
            this.reminderFrequency
        ) {

            this.reminderFrequency.value =
                localStorage.getItem(
                    "reminderFrequency"
                ) || "weekdays";

        }


        const savedDays =
            JSON.parse(
                localStorage.getItem(
                    "reminderDays"
                ) || "[]"
            );


        if (savedDays.length) {

            this.reminderDays.forEach(day => {

                const checkbox =
                    day.querySelector("input");


                const active =
                    savedDays.includes(
                        day.dataset.day
                    );


                checkbox.checked =
                    active;


                day.classList.toggle(
                    "active",
                    active
                );

            });

        }


        this.toggleReminderOptions();


        // ==========================================
        // ACCOUNT
        // ==========================================

        const twoFA =
            localStorage.getItem(
                "twoFA"
            );


        if (twoFA !== null) {

            this.twoFAToggle.checked =
                twoFA === "true";

        }


        // ==========================================
        // SAVED SUMMARY
        // ==========================================

        this.renderSavedSummary();

    },


    // ==========================================
    // SAVED SETTINGS SUMMARY
    // ==========================================

    renderSavedSummary() {

        if (!this.savedSummaryList) {
            return;
        }


        const theme =
            localStorage.getItem(
                "theme"
            ) || "light";


        const accent =
            localStorage.getItem(
                "accent"
            ) || "#7c3aed";


        const fontSize =
            localStorage.getItem(
                "fontSize"
            ) || "16";


        const lastSaved =
            localStorage.getItem(
                "lastSaved"
            ) || "never";


        this.savedSummaryList.innerHTML = `

            <div class="saved-setting">
                <strong>Theme</strong>
                <span>${theme}</span>
            </div>

            <div class="saved-setting">
                <strong>Accent</strong>
                <span>${accent}</span>
            </div>

            <div class="saved-setting">
                <strong>Font size</strong>
                <span>${fontSize}px</span>
            </div>

        `;


        if (this.lastSavedTime) {

            this.lastSavedTime.textContent =
                lastSaved;

        }

    },


    // ==========================================
    // RESET SETTINGS
    // ==========================================

    resetSettings() {

        const confirmed =
            confirm(
                "Reset all Study Flow settings to their defaults?"
            );


        if (!confirmed) return;


        localStorage.clear();


        location.reload();

    },


    // ==========================================
    // EXPORT SETTINGS
    // ==========================================

    exportSettings() {

        const settings = {};


        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const key =
                localStorage.key(i);


            if (key) {

                settings[key] =
                    localStorage.getItem(key);

            }

        }


        const blob =
            new Blob(
                [
                    JSON.stringify(
                        settings,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "study-flow-settings.json";


        document.body.appendChild(link);

        link.click();

        link.remove();


        URL.revokeObjectURL(url);


        this.showToast(
            "Settings exported successfully"
        );

    },


    // ==========================================
    // SAVE BAR
    // ==========================================

    showSaveBar() {

        if (!this.saveBar) return;

        this.saveBar.classList.add(
            "show"
        );

        this.hasChanges = true;

    },


    hideSaveBar() {

        if (!this.saveBar) return;

        this.saveBar.classList.remove(
            "show"
        );

        this.hasChanges = false;

    },


    // ==========================================
    // TOAST
    // ==========================================

    showToast(message) {

        let toast =
            document.querySelector(
                ".toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.className =
                "toast";

            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            this.toastTimer
        );


        this.toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                3000
            );

    }

};


// ==========================================
// START STUDY FLOW SETTINGS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        SettingsManager.init();

    }
);
