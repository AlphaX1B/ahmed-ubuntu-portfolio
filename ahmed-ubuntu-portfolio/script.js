(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const windows = new Map($$("[data-window]").map(el => [el.dataset.window, el]));
  const dock = $(".dock");
  const systemMenu = $("#systemMenu");
  const calendarPopover = $("#calendarPopover");
  const toast = $("#toast");
  let zIndex = 50;
  let toastTimer;

  function notify(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
  }

  function focusWindow(name) {
    const win = windows.get(name);
    if (!win) return;
    $$(".app-window").forEach(el => el.classList.remove("active-window"));
    win.classList.add("active-window");
    win.style.zIndex = String(++zIndex);
  }

  function openWindow(name) {
    const win = windows.get(name);
    if (!win) return;
    win.hidden = false;
    win.classList.remove("minimized");
    focusWindow(name);
    systemMenu.hidden = true;
    calendarPopover.hidden = true;
    const input = name === "terminal" ? $("#terminalInput") : null;
    if (input) setTimeout(() => input.focus(), 30);
    if (window.matchMedia("(max-width: 760px)").matches) {
      win.style.left = "50%";
      win.style.top = "48%";
      win.style.transform = "translate(-50%,-50%)";
    }
  }

  function closeWindow(name) {
    const win = windows.get(name);
    if (win) win.hidden = true;
  }

  function minimizeWindow(name) {
    const win = windows.get(name);
    if (win) win.hidden = true;
  }

  function maximizeWindow(name) {
    const win = windows.get(name);
    if (!win) return;
    win.classList.toggle("maximized");
    if (!win.classList.contains("maximized")) {
      win.style.left = "50%";
      win.style.top = "50%";
      win.style.transform = "translate(-50%,-50%)";
    }
    focusWindow(name);
  }

  $$("[data-open]").forEach(button => {
    button.addEventListener("click", () => openWindow(button.dataset.open));
  });
  $$("[data-close]").forEach(button => button.addEventListener("click", () => closeWindow(button.dataset.close)));
  $$("[data-minimize]").forEach(button => button.addEventListener("click", () => minimizeWindow(button.dataset.minimize)));
  $$("[data-maximize]").forEach(button => button.addEventListener("click", () => maximizeWindow(button.dataset.maximize)));
  $$(".app-window").forEach(win => win.addEventListener("pointerdown", () => focusWindow(win.dataset.window)));

  $("#terminalDockButton").addEventListener("click", () => openWindow("terminal"));
  $("#showAllButton").addEventListener("click", () => {
    const anyVisible = $$(".app-window").some(w => !w.hidden);
    if (anyVisible) {
      $$(".app-window").forEach(w => w.hidden = true);
      notify("All windows minimized");
    } else {
      openWindow("about");
      notify("Opened About Ahmed");
    }
  });
  $("#activitiesButton").addEventListener("click", () => {
    const visible = $$(".app-window").filter(w => !w.hidden);
    if (visible.length) visible.forEach(w => w.hidden = true);
    else openWindow("about");
  });
  $("#systemMenuButton").addEventListener("click", () => {
    systemMenu.hidden = !systemMenu.hidden;
    calendarPopover.hidden = true;
  });
  $("#clockButton").addEventListener("click", () => {
    calendarPopover.hidden = !calendarPopover.hidden;
    systemMenu.hidden = true;
    $("#calendarDate").textContent = new Intl.DateTimeFormat(undefined, { weekday:"long", month:"long", day:"numeric" }).format(new Date());
  });
  ["networkButton", "soundButton", "powerButton"].forEach(id => {
    $("#" + id).addEventListener("click", () => notify("This is a portfolio simulation — no system settings are changed."));
  });
  $("#themeButton").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    systemMenu.hidden = true;
    notify("Desktop appearance updated");
  });
  $("#resetButton").addEventListener("click", () => {
    $$(".app-window").forEach(w => { w.hidden = true; w.classList.remove("maximized"); });
    systemMenu.hidden = true;
    calendarPopover.hidden = true;
    document.body.classList.remove("light-mode");
    notify("Desktop reset");
  });
  document.addEventListener("click", event => {
    if (!systemMenu.hidden && !systemMenu.contains(event.target) && event.target.id !== "systemMenuButton") systemMenu.hidden = true;
    if (!calendarPopover.hidden && !calendarPopover.contains(event.target) && event.target.id !== "clockButton") calendarPopover.hidden = true;
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      systemMenu.hidden = true;
      calendarPopover.hidden = true;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openWindow("terminal");
    }
  });

  // Browser-only portfolio terminal: fixed command map, no eval and no OS shell.
  const commandHelp = [
    "help       Show available commands",
    "whoami     Display the portfolio owner",
    "about      About Ahmed",
    "skills     List core technologies",
    "projects   Show selected projects",
    "experience Summarize experience",
    "contact    Open contact options",
    "clear      Clear terminal output",
    "date       Show the current local date",
    "exit       Close this terminal window"
  ].join("\n");
  const commandResults = {
    whoami: "Ahmed Siddiq — DevOps Engineer / Site Reliability Engineer",
    about: "I build and operate cloud infrastructure, Kubernetes platforms, CI/CD automation and observability workflows.",
    skills: "AWS, EKS, Terraform, Ansible, Kubernetes, Docker, Jenkins, GitHub Actions, Argo CD, Helm, Dynatrace, CloudWatch, New Relic, Bash and Python.",
    projects: "1) Terraform-based EKS infrastructure\n2) Kubernetes CI/CD and GitOps workflows\n3) Production monitoring and SRE practices\n\nUse the Projects window for repository links.",
    experience: "3.5+ years in DevOps/SRE; supported production applications and AWS EKS environments. Open the Experience window for details.",
    contact: "Open the Contact window to prepare an email, or visit the LinkedIn profile linked in About.",
    date: new Date().toString()
  };
  const output = $("#terminalOutput");
  function addTerminalLine(text, className) {
    const p = document.createElement("p");
    p.className = className || "terminal-result";
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }
  $("#terminalForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#terminalInput");
    const command = input.value.trim().toLowerCase();
    input.value = "";
    if (!command) return;
    addTerminalLine("ahmed@portfolio:~$ " + command, "terminal-command");
    if (command === "clear") {
      output.replaceChildren();
      return;
    }
    if (command === "help") addTerminalLine(commandHelp);
    else if (command === "exit") closeWindow("terminal");
    else if (command === "contact") {
      addTerminalLine(commandResults.contact);
      openWindow("contact");
    } else if (commandResults[command]) addTerminalLine(commandResults[command]);
    else addTerminalLine("Command not found: " + command + "\nThis simulated terminal only supports the commands shown by 'help'.");
  });

  $("#contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#senderName").value.trim();
    const email = $("#senderEmail").value.trim();
    const message = $("#senderMessage").value.trim();
    if (!name || !email || !message) return;
    // Replace the placeholder below with your real, public contact email.
    const recipient = "REPLACE_WITH_YOUR_EMAIL@example.com";
    if (recipient.includes("REPLACE_WITH")) {
      const subject = encodeURIComponent("Portfolio enquiry from " + name);
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      notify("Update the recipient email in script.js before publishing.");
      window.location.href = "mailto:?subject=" + subject + "&body=" + body;
      return;
    }
    const subject = encodeURIComponent("Portfolio enquiry from " + name);
    const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
    window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
  });

  function updateClock() {
    $("#clockButton").textContent = new Intl.DateTimeFormat(undefined, { hour:"2-digit", minute:"2-digit" }).format(new Date());
  }
  updateClock();
  setInterval(updateClock, 15000);

  // Simple pointer drag for non-maximized windows on desktop.
  $$(".window-titlebar").forEach(bar => {
    let dragging = false, startX = 0, startY = 0, originX = 0, originY = 0;
    bar.addEventListener("pointerdown", event => {
      if (event.target.closest(".window-controls") || window.matchMedia("(max-width: 760px)").matches) return;
      const win = bar.closest(".app-window");
      if (win.classList.contains("maximized")) return;
      dragging = true;
      focusWindow(win.dataset.window);
      startX = event.clientX; startY = event.clientY;
      const rect = win.getBoundingClientRect();
      originX = rect.left; originY = rect.top;
      bar.setPointerCapture?.(event.pointerId);
    });
    bar.addEventListener("pointermove", event => {
      if (!dragging) return;
      const win = bar.closest(".app-window");
      const left = Math.max(0, Math.min(window.innerWidth - 180, originX + event.clientX - startX));
      const top = Math.max(36, Math.min(window.innerHeight - 100, originY + event.clientY - startY));
      win.style.left = left + "px";
      win.style.top = top + "px";
      win.style.transform = "none";
    });
    bar.addEventListener("pointerup", () => { dragging = false; });
    bar.addEventListener("pointercancel", () => { dragging = false; });
  });
})();
