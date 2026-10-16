/**
 * Repo Pilot Workplace - Application Logic & Controllers
 */

document.addEventListener("DOMContentLoaded", () => {
  const store = window.repoPilotStore || window.hexonStore;
  let activeChannel = "general";
  let activeDocId = store.getState().docs[0]?.id || null;
  let currentFilter = "all";

  // Elements
  const viewTitle = document.getElementById("currentViewTitle");
  const navItems = document.querySelectorAll(".nav-item");
  const viewSections = document.querySelectorAll(".view-section");
  const toastContainer = document.getElementById("toastContainer");

  // Apply Theme
  applyTheme(store.getState().theme || "default");

  // Initialize UI
  initClock();
  initNavigation();
  renderDashboard();
  renderKanban();
  renderChat();
  renderDocs();
  renderTeam();
  setupModals();
  setupShortcuts();

  /* ==========================================================================
     Navigation & View Switching
     ========================================================================== */
  function initNavigation() {
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const targetView = item.dataset.view;
        if (!targetView) return;

        navItems.forEach(n => n.classList.remove("active"));
        item.classList.add("active");

        viewSections.forEach(section => {
          section.classList.remove("active-view");
          if (section.id === `view-${targetView}`) {
            section.classList.add("active-view");
          }
        });

        // Set Header Title
        const viewNames = {
          dashboard: "Command Dashboard",
          kanban: "Sprint Task Board",
          chat: "Team Channels & Chat",
          docs: "Repo Pilot Knowledge Hub",
          team: "Team Radar & Directory",
          settings: "Workplace Settings"
        };
        viewTitle.textContent = viewNames[targetView] || "Repo Pilot Workplace";

        // Refresh dynamic view contents
        if (targetView === "kanban") renderKanban();
        if (targetView === "chat") renderChat();
        if (targetView === "docs") renderDocs();
        if (targetView === "team") renderTeam();
      });
    });
  }

  /* ==========================================================================
     Clock & Date
     ========================================================================== */
  function initClock() {
    const clockEl = document.getElementById("liveClock");
    const dateEl = document.getElementById("liveDate");
    function update() {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     Dashboard View
     ========================================================================== */
  function renderDashboard() {
    const state = store.getState();
    const taskCountEl = document.getElementById("dashActiveTasks");
    const velocityEl = document.getElementById("dashVelocity");
    const teamEl = document.getElementById("dashTeamOnline");
    const docsEl = document.getElementById("dashDocsCount");

    if (taskCountEl) taskCountEl.textContent = state.tasks.length;
    if (velocityEl) velocityEl.textContent = state.metrics.velocityRate;
    if (teamEl) teamEl.textContent = state.team.filter(m => m.state !== "away").length;
    if (docsEl) docsEl.textContent = state.docs.length;
  }

  /* ==========================================================================
     Kanban Board View
     ========================================================================== */
  function renderKanban() {
    const state = store.getState();
    const columns = {
      todo: document.getElementById("col-todo-list"),
      progress: document.getElementById("col-progress-list"),
      review: document.getElementById("col-review-list"),
      done: document.getElementById("col-done-list")
    };

    const counts = {
      todo: document.getElementById("count-todo"),
      progress: document.getElementById("count-progress"),
      review: document.getElementById("count-review"),
      done: document.getElementById("count-done")
    };

    // Clear lists
    Object.values(columns).forEach(col => {
      if (col) col.innerHTML = "";
    });

    const colCounts = { todo: 0, progress: 0, review: 0, done: 0 };

    state.tasks.forEach(task => {
      if (currentFilter !== "all" && task.priority !== currentFilter) return;

      const col = columns[task.column];
      if (!col) return;

      colCounts[task.column]++;

      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <span class="task-priority-tag priority-${task.priority}">${task.priority}</span>
        <div class="task-title">${escapeHTML(task.title)}</div>
        <div class="task-desc">${escapeHTML(task.desc)}</div>
        <div class="task-footer">
          <div class="task-assignee">
            <div class="assignee-avatar">${task.assigneeInitials}</div>
            <span>${escapeHTML(task.assignee)}</span>
          </div>
          <div class="task-actions">
            ${task.column !== "todo" ? `<button class="task-move-btn" data-action="prev" data-id="${task.id}" title="Move left">←</button>` : ""}
            ${task.column !== "done" ? `<button class="task-move-btn" data-action="next" data-id="${task.id}" title="Move right">→</button>` : ""}
            <button class="task-move-btn" data-action="delete" data-id="${task.id}" title="Delete task">✕</button>
          </div>
        </div>
      `;

      col.appendChild(card);
    });

    // Update counts
    Object.keys(counts).forEach(key => {
      if (counts[key]) counts[key].textContent = colCounts[key];
    });

    // Attach task action events
    document.querySelectorAll(".task-move-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const colOrder = ["todo", "progress", "review", "done"];
        const task = store.getState().tasks.find(t => t.id === id);
        if (!task) return;

        const currentIndex = colOrder.indexOf(task.column);

        if (action === "next" && currentIndex < colOrder.length - 1) {
          store.moveTask(id, colOrder[currentIndex + 1]);
          showToast(`Task moved to ${colOrder[currentIndex + 1].toUpperCase()}`);
        } else if (action === "prev" && currentIndex > 0) {
          store.moveTask(id, colOrder[currentIndex - 1]);
          showToast(`Task moved to ${colOrder[currentIndex - 1].toUpperCase()}`);
        } else if (action === "delete") {
          store.deleteTask(id);
          showToast("Task removed from board");
        }

        renderKanban();
        renderDashboard();
      });
    });

    // Filter Chips
    const chips = document.querySelectorAll(".filter-chip");
    chips.forEach(chip => {
      chip.onclick = () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilter = chip.dataset.filter;
        renderKanban();
      };
    });
  }

  /* ==========================================================================
     Chat View
     ========================================================================== */
  function renderChat() {
    const state = store.getState();
    const channelsContainer = document.getElementById("channelListContainer");
    const messagesContainer = document.getElementById("chatMessagesScroll");
    const channelTopicEl = document.getElementById("chatChannelTopic");
    const activeChannelTitleEl = document.getElementById("activeChannelTitle");

    if (channelsContainer) {
      channelsContainer.innerHTML = state.channels.map(ch => `
        <button class="channel-btn ${ch.id === activeChannel ? 'active' : ''}" data-channel="${ch.id}">
          <span>#</span> ${escapeHTML(ch.name.replace('#', ''))}
        </button>
      `).join("");

      channelsContainer.querySelectorAll(".channel-btn").forEach(btn => {
        btn.onclick = () => {
          activeChannel = btn.dataset.channel;
          renderChat();
        };
      });
    }

    const currentChan = state.channels.find(c => c.id === activeChannel);
    if (activeChannelTitleEl && currentChan) activeChannelTitleEl.textContent = currentChan.name;
    if (channelTopicEl && currentChan) channelTopicEl.textContent = currentChan.topic;

    const msgs = state.messages[activeChannel] || [];
    if (messagesContainer) {
      messagesContainer.innerHTML = msgs.map(m => `
        <div class="chat-msg">
          <div class="msg-avatar">${m.initials}</div>
          <div class="msg-body">
            <div class="msg-meta">
              <span class="msg-author">${escapeHTML(m.author)}</span>
              <span class="msg-time">${escapeHTML(m.time)}</span>
            </div>
            <div class="msg-bubble">${escapeHTML(m.text)}</div>
          </div>
        </div>
      `).join("");
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Chat send form
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  if (chatForm && chatInput) {
    chatForm.onsubmit = (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const newMsg = {
        id: "msg-" + Date.now(),
        author: "You (Admin)",
        initials: "ME",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: text
      };

      store.addMessage(activeChannel, newMsg);
      chatInput.value = "";
      renderChat();

      // Simulated Intelligent Response
      setTimeout(() => {
        const smartReplies = [
          "Noted! Updating sprint milestone status on Repo Pilot core.",
          "Acknowledged. Telemetry metrics remain within optimal bounds.",
          "Great point. I've synced this update with the team.",
          "Confirmed! Ready to deploy updates across active nodes."
        ];
        const replyText = smartReplies[Math.floor(Math.random() * smartReplies.length)];

        store.addMessage(activeChannel, {
          id: "msg-ai-" + Date.now(),
          author: "Repo Pilot Neural Bot",
          initials: "RP",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: replyText
        });
        renderChat();
      }, 900);
    };
  }

  /* ==========================================================================
     Knowledge Hub / Docs View
     ========================================================================== */
  function renderDocs() {
    const state = store.getState();
    const docListContainer = document.getElementById("docListContainer");
    const docTitleInput = document.getElementById("docTitleInput");
    const docEditorText = document.getElementById("docEditorText");
    const docCategoryBadge = document.getElementById("docCategoryBadge");

    if (docListContainer) {
      docListContainer.innerHTML = state.docs.map(doc => `
        <button class="doc-item-btn ${doc.id === activeDocId ? 'active' : ''}" data-doc="${doc.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHTML(doc.title)}</span>
        </button>
      `).join("");

      docListContainer.querySelectorAll(".doc-item-btn").forEach(btn => {
        btn.onclick = () => {
          activeDocId = btn.dataset.doc;
          renderDocs();
        };
      });
    }

    const currentDoc = state.docs.find(d => d.id === activeDocId);
    if (currentDoc) {
      if (docTitleInput) docTitleInput.value = currentDoc.title;
      if (docEditorText) docEditorText.value = currentDoc.content;
      if (docCategoryBadge) docCategoryBadge.textContent = currentDoc.category;
    }
  }

  // Doc Save handler
  const saveDocBtn = document.getElementById("saveDocBtn");
  if (saveDocBtn) {
    saveDocBtn.onclick = () => {
      const docTitleInput = document.getElementById("docTitleInput");
      const docEditorText = document.getElementById("docEditorText");
      if (!docTitleInput || !docEditorText || !activeDocId) return;

      store.updateDoc(activeDocId, docTitleInput.value, docEditorText.value);
      showToast("Document saved successfully");
      renderDocs();
      renderDashboard();
    };
  }

  const newDocBtn = document.getElementById("newDocBtn");
  if (newDocBtn) {
    newDocBtn.onclick = () => {
      const newDoc = {
        id: "doc-" + Date.now(),
        title: "Untitled Knowledge Note",
        category: "General",
        content: "# New Document\n\nDraft your team documentation and architectural notes here..."
      };
      store.addDoc(newDoc);
      activeDocId = newDoc.id;
      renderDocs();
      showToast("Created new document");
    };
  }

  /* ==========================================================================
     Team Directory View
     ========================================================================== */
  function renderTeam() {
    const state = store.getState();
    const teamGrid = document.getElementById("teamGridContainer");
    if (!teamGrid) return;

    teamGrid.innerHTML = state.team.map(member => `
      <div class="team-card">
        <div class="team-avatar-lg">${member.initials}</div>
        <div class="team-name">${escapeHTML(member.name)}</div>
        <div class="team-role-tag">${escapeHTML(member.role)}</div>
        <div class="team-status-line">Status: ${escapeHTML(member.status)}</div>
        <button class="btn-secondary" style="width: 100%; justify-content: center; font-size: 0.8rem;" onclick="window.repoPilotNavigateToChat()">Direct Message</button>
      </div>
    `).join("");
  }

  window.repoPilotNavigateToChat = () => {
    const chatNavItem = document.querySelector('.nav-item[data-view="chat"]');
    if (chatNavItem) chatNavItem.click();
  };
  window.hexonNavigateToChat = window.repoPilotNavigateToChat;

  /* ==========================================================================
     Modals Setup
     ========================================================================== */
  function setupModals() {
    const modalOverlay = document.getElementById("modalOverlay");
    const openTaskModalBtn = document.getElementById("openTaskModalBtn");
    const openTaskModalBtn2 = document.getElementById("openTaskModalBtn2");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const taskForm = document.getElementById("taskForm");

    function openModal() {
      if (modalOverlay) modalOverlay.classList.add("active");
    }
    function closeModal() {
      if (modalOverlay) modalOverlay.classList.remove("active");
    }

    if (openTaskModalBtn) openTaskModalBtn.onclick = openModal;
    if (openTaskModalBtn2) openTaskModalBtn2.onclick = openModal;
    if (closeModalBtn) closeModalBtn.onclick = closeModal;

    if (modalOverlay) {
      modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) closeModal();
      };
    }

    if (taskForm) {
      taskForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById("taskTitle").value.trim();
        const desc = document.getElementById("taskDesc").value.trim();
        const priority = document.getElementById("taskPriority").value;
        const column = document.getElementById("taskColumn").value;
        const assignee = document.getElementById("taskAssignee").value;

        if (!title) return;

        const initials = assignee.split(" ").map(n => n[0]).join("").toUpperCase();

        store.addTask({
          id: "task-" + Date.now(),
          title,
          desc: desc || "No description provided.",
          priority,
          column,
          assignee,
          assigneeInitials: initials
        });

        taskForm.reset();
        closeModal();
        renderKanban();
        renderDashboard();
        showToast("New task logged to Repo Pilot Board");
      };
    }
  }

  /* ==========================================================================
     Settings & Theme Selector
     ========================================================================== */
  function applyTheme(theme) {
    document.body.className = "";
    if (theme === "violet") document.body.classList.add("theme-violet");
    if (theme === "emerald") document.body.classList.add("theme-emerald");
  }

  const themeSelectors = document.querySelectorAll(".theme-opt-btn");
  themeSelectors.forEach(btn => {
    btn.onclick = () => {
      const theme = btn.dataset.theme;
      store.setTheme(theme);
      applyTheme(theme);
      showToast(`Workplace theme set to ${theme.toUpperCase()}`);
    };
  });

  /* ==========================================================================
     Command Palette & Shortcuts
     ========================================================================== */
  function setupShortcuts() {
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("globalSearchInput");
        if (searchInput) {
          searchInput.focus();
          showToast("Search Repo Pilot Command Center");
        }
      }
    });
  }

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${escapeHTML(message)}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
});
