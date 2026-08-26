document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector("aside.sidebar");
  const closeBtn = document.querySelector("aside.sidebar .close");
  const toggleButtons = Array.from(document.querySelectorAll(".toogle-menu"));
  if (!sidebar || !closeBtn) return;

  let openBtn = document.getElementById("sidebarOpenBtn");
  if (!openBtn) {
    openBtn = document.createElement("button");
    openBtn.id = "sidebarOpenBtn";
    openBtn.type = "button";
    openBtn.setAttribute("aria-label", "Open sidebar");
    openBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.appendChild(openBtn);
  }

  // Include openBtn in the toggleButtons array if not already present
  if (!toggleButtons.includes(openBtn)) {
    toggleButtons.push(openBtn);
  }

  const mobileQuery = window.matchMedia("(max-width: 768px)");
  let isOpen = !mobileQuery.matches;

  let overlay = document.getElementById("sidebarOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebarOverlay";
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  const sync = () => {
    const mobile = mobileQuery.matches;
    sidebar.classList.toggle("sidebar-open", mobile && isOpen);
    sidebar.classList.toggle("sidebar-collapsed", mobile && !isOpen);
    
    // In our new mobile header, sidebarOpenBtn is always visible, but we keep this for backwards compatibility
    openBtn.classList.toggle("visible", mobile && !isOpen);
    
    toggleButtons.forEach((button) => button.classList.toggle("active", mobile && isOpen));
    overlay.classList.toggle("visible", mobile && isOpen);
    overlay.setAttribute("aria-hidden", String(!(mobile && isOpen)));
    sidebar.setAttribute("aria-hidden", String(mobile && !isOpen));
  };

  const closeSidebar = () => {
    isOpen = false;
    sync();
  };

  const openSidebar = () => {
    isOpen = true;
    sync();
  };

  const toggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mobileQuery.matches) {
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    } else {
      // For desktop, toggle the sidebar-collapsed class if needed, or just let CSS handle tablet mode
      isOpen = !isOpen;
      sync();
    }
  };

  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
  
  // Attach the single toggle function to all buttons
  toggleButtons.forEach((button) => {
    // Remove old listeners by replacing the element or just add ours? 
    // We are replacing the whole script so no old listeners exist yet.
    button.addEventListener("click", toggleSidebar);
  });

  mobileQuery.addEventListener("change", (event) => {
    isOpen = !event.matches;
    sync();
  });

  sync();
});
