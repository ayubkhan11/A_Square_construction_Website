(function () {
  "use strict";

  const CHATBOT_CONFIG = {
    apiEndpoint: "/api/chatbot",
    companyName: "A Square Construction",
    ownerName: "K.P. Zakir Hussain",
    welcomeMessage:
      "Welcome to A Square Construction! We specialize in residential, commercial, industrial & luxury interior projects in Krishnagiri and beyond. How can we help you today?",
    primaryColor: "primary-yellow",
    quickActions: [
      { label: "Our Services", message: "What services do you offer?" },
      { label: "Projects", message: "Show me your completed projects" },
      { label: "Contact", message: "How can I contact you?" },
    ],
  };

  if (window.ASquareChatbot) return;

  /* -----------------------------------------------------------
     CHAT UI
  ----------------------------------------------------------- */
  function createChatUI() {
    return `
      <div class="asquare-chat-icon" id="asquareChatIcon">💬</div>

      <div class="asquare-chat-widget" id="asquareChatWidget">
        
        <div class="asquare-chat-header">
          <div>
            <h5>${CHATBOT_CONFIG.companyName}</h5>
            <div class="asquare-online">● Online — Ready to help</div>
          </div>
          <button class="asquare-close-btn" id="asquareCloseBtn">×</button>
        </div>

        <div class="asquare-chat-messages" id="asquareChatMessages">
          <div class="asquare-message ai">
            <div class="asquare-message-content">${CHATBOT_CONFIG.welcomeMessage}</div>
          </div>
        </div>

        <div class="asquare-quick-actions">
          ${CHATBOT_CONFIG.quickActions.map(b => 
            `<button class="asquare-quick-btn" onclick="ASquareChatbot.sendQuickMessage('${b.message}')">${b.label}</button>`
          ).join("")}
        </div>

        <div class="asquare-chat-input-container">
          <form class="asquare-chat-input-form" id="asquareChatForm">
            <div class="input-wrapper">
              <input type="text" id="asquareMessageInput" class="asquare-message-input" placeholder="How can I help you today?" autocomplete="off">
              <button type="submit" class="asquare-send-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </form>
        </div>

      </div>
    `;
  }

  /* -----------------------------------------------------------
     CHATBOT CLASS
  ----------------------------------------------------------- */
  class ASquareChatbot {
    constructor() {
      this.sessionId = "asquare_" + Date.now();
      this.init();
    }

    init() {
      this.createWidget();
      this.bindEvents();
      
      // Simple mobile check to ensure icon is visible
      this.checkMobileVisibility();
      
      // Listen for resize
      window.addEventListener('resize', () => this.checkMobileVisibility());
    }

    createWidget() {
      const container = document.createElement("div");
      container.id = "asquare-chatbot-widget";
      container.innerHTML = createChatUI();
      document.body.appendChild(container);

      this.chatWidget = document.getElementById("asquareChatWidget");
      this.chatIcon = document.getElementById("asquareChatIcon");
      this.closeBtn = document.getElementById("asquareCloseBtn");
      this.chatForm = document.getElementById("asquareChatForm");
      this.messageInput = document.getElementById("asquareMessageInput");
      this.messagesContainer = document.getElementById("asquareChatMessages");
      
    }

    bindEvents() {
     this.chatIcon.onclick = () => {
  this.chatWidget.classList.add("open");
  this.chatIcon.classList.add("hidden");  // instead of style.display = "none"
};

this.closeBtn.onclick = () => {
  this.chatWidget.classList.remove("open");
  this.chatIcon.classList.remove("hidden");  // instead of style.display = "flex"
};

      this.chatForm.onsubmit = (e) => this.handleSubmit(e);
    }

    // SIMPLE mobile visibility check
    checkMobileVisibility() {
  // Optional: only ensure it's not hidden accidentally
  if (window.innerWidth <= 768 && !this.chatWidget.classList.contains("open")) {
    this.chatIcon.classList.remove("hidden");
  }
}

    addMessage(text, type) {
      const wrapper = document.createElement("div");

      // CORRECT alignment class
      wrapper.className = "asquare-message";
      if (type === "user") wrapper.classList.add("user");
      if (type === "ai") wrapper.classList.add("ai");

      const bubble = document.createElement("div");
      bubble.className = "asquare-message-content";

      // NEVER use innerHTML unless needed
      bubble.textContent = text;

      wrapper.appendChild(bubble);
      this.messagesContainer.appendChild(wrapper);

      // Auto scroll
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async handleSubmit(e) {
      e.preventDefault();

      const message = this.messageInput.value.trim();
      if (!message) return;

      this.addMessage(message, "user");
      this.messageInput.value = "";

      try {
        const res = await fetch(CHATBOT_CONFIG.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            sessionId: this.sessionId
          }),
        });

        const data = await res.json();
        this.addMessage(data.response || "Thank you!", "ai");

      } catch (e) {
        this.addMessage("Network error. Please try again.", "ai");
      }
    }

    static sendQuickMessage(message) {
      if (window.asquareChatbotInstance) {
        window.asquareChatbotInstance.messageInput.value = message;
        window.asquareChatbotInstance.chatForm.dispatchEvent(new Event("submit"));
      }
    }
  }

  function init() {
    if (window.asquareChatbotInstance) return;
    window.asquareChatbotInstance = new ASquareChatbot();
    window.ASquareChatbot = ASquareChatbot;
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();

})();