// ==========================================
// STUDY FLOW SETTINGS MANAGER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    SettingsManager.init();
});

const SettingsManager = {

    init() {
        this.cacheDOM();
        this.loadPreferences();
        this.bindEvents();
    },

    cacheDOM() {
        this.saveBar = document.getElementById("saveBar");
        this.saveBtn = document.getElementById("saveBtn");
        this.discardBtn = document.getElementById("discardBtn");

        this.themeOptions = document.querySelectorAll(".theme-option");
        this.swatches = document.querySelectorAll(".swatch");
        this.toggles = document.querySelectorAll(".toggle input");
        this.selects = document.querySelectorAll(".setting-select");
        this.navItems = document.querySelectorAll(".nav-item");
        this.fontSizeSelect = document.getElementById("fontSizeSelect");

        this.hasChanges = false;
    },

    bindEvents() {

        // Theme Picker
        this.themeOptions.forEach(option => {
            option.addEventListener("click", () => {
                this.changeTheme(option);
            });
        });

        // Accent Colors
        this.swatches.forEach(swatch => {
            swatch.addEventListener("click", () => {
                this.changeAccent(swatch);
            });
        });

        // Font Size
        this.fontSizeSelect?.addEventListener("change", e => {
            this.changeFontSize(e.target.value);
        });

        // Toggles
        this.toggles.forEach(toggle => {
            toggle.addEventListener("change", () => {
                this.showSaveBar();
                this.showToast(
                    toggle.checked
                        ? "Setting enabled"
                        : "Setting disabled"
                );
            });
        });

        // Select Inputs
        this.selects.forEach(select => {
            select.addEventListener("change", () => {
                this.showSaveBar();
                this.showToast("Preference updated");
            });
        });

        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener("click", () => {
                this.setActiveNav(item);
            });
        });

        // Save / Discard
        this.saveBtn?.addEventListener("click", () => {
            this.hideSaveBar();
            this.showToast("Settings saved successfully");
        });

        this.discardBtn?.addEventListener("click", () => {
            this.hideSaveBar();
            this.showToast("Changes discarded");
        });

        // Danger Buttons
        document.querySelectorAll(".btn-danger")
            .forEach(btn => {
                btn.addEventListener("click", () => {
                    this.handleDangerAction(btn);
                });
            });

        // Export Button
        document.querySelectorAll(".btn-discard")
            .forEach(btn => {
                if (btn.textContent.trim() === "Export") {
                    btn.addEventListener("click", () => {
                        this.showToast("Preparing export...");
                    });
                }
            });
    },

    // ==========================================
    // THEME
    // ==========================================

    changeTheme(option) {

        this.themeOptions.forEach(item =>
            item.classList.remove("selected")
        );

        option.classList.add("selected");

        const theme = option.dataset.themePick;

        document.body.classList.toggle(
            "dark-theme",
            theme === "dark"
        );

        localStorage.setItem("theme", theme);

        this.showSaveBar();
    },

    // ==========================================
    // ACCENT COLOR
    // ==========================================

    changeAccent(swatch) {

        this.swatches.forEach(item =>
            item.classList.remove("active")
        );

        swatch.classList.add("active");

        const color = swatch.dataset.accent;

        document.documentElement.style.setProperty(
            "--accent",
            color
        );

        localStorage.setItem("accent", color);

        this.showSaveBar();
    },

    // ==========================================
    // FONT SIZE
    // ==========================================

    changeFontSize(size) {

        document.documentElement.style.fontSize =
            `${size}px`;

        localStorage.setItem("fontSize", size);

        this.showSaveBar();
    },

    // ==========================================
    // NAVIGATION
    // ==========================================

    setActiveNav(item) {

        this.navItems.forEach(nav =>
            nav.classList.remove("active")
        );

        item.classList.add("active");
    },

    // ==========================================
    // SAVE BAR
    // ==========================================

    showSaveBar() {

        if (!this.saveBar) return;

        this.saveBar.classList.add("show");
        this.hasChanges = true;
    },

    hideSaveBar() {

        if (!this.saveBar) return;

        this.saveBar.classList.remove("show");
        this.hasChanges = false;
    },

    // ==========================================
    // DANGER ACTIONS
    // ==========================================

    handleDangerAction(button) {

        const action =
            button.textContent.trim();

        const confirmed = confirm(
            `Are you sure you want to ${action.toLowerCase()}?`
        );

        if (!confirmed) return;

        this.showToast(`${action} completed`);
    },

    // ==========================================
    // STORAGE
    // ==========================================

    loadPreferences() {

        const theme =
            localStorage.getItem("theme");

        const accent =
            localStorage.getItem("accent");

        const fontSize =
            localStorage.getItem("fontSize");

        if (theme === "dark") {

            document.body.classList.add(
                "dark-theme"
            );

            document
                .getElementById("themeDark")
                ?.classList.add("selected");

            document
                .getElementById("themeLight")
                ?.classList.remove("selected");
        }

        if (accent) {

            document.documentElement
                .style.setProperty(
                    "--accent",
                    accent
                );
        }

        if (fontSize) {

            document.documentElement
                .style.fontSize =
                `${fontSize}px`;

            if (this.fontSizeSelect) {
                this.fontSizeSelect.value =
                    fontSize;
            }
        }
    },

    // ==========================================
    // TOAST
    // ==========================================

    showToast(message) {

        let toast =
            document.querySelector(".toast");

        if (!toast) {

            toast = document.createElement("div");
            toast.className = "toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(this.toastTimer);

        this.toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
};