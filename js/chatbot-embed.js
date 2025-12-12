(function () {
  "use strict";

  const CHATBOT_CONFIG = {
    apiEndpoint: "/api/chatbot/chat",
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
     INJECT FIXED, CLEAN, ALIGNED, RESPONSIVE CSS
  ----------------------------------------------------------- */
  function injectStyles() {
    if (document.getElementById("asquare-chatbot-styles")) return;

    const style = document.createElement("style");
    style.id = "asquare-chatbot-styles";

 style.textContent = `
  /* Main Container */
  #asquare-chatbot-widget {position:fixed;right:15px;bottom:20px;z-index:999999;font-family:'Poppins','Segoe UI',sans-serif;transform:scale(0.9);transform-origin:bottom right;}

  /* Hide icon when widget is open */
  #asquare-chatbot-widget:has(.asquare-chat-widget.open) .asquare-chat-icon {
    display: none;
  }

  /* Floating Icon */
  .asquare-chat-icon {width:56px;height:56px;background:linear-gradient(135deg,${CHATBOT_CONFIG.primaryColor},#d48c1c);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:25px;box-shadow:0 6px 25px rgba(238,157,30,0.5);transition:all .3s;animation:pulse 2.5s infinite;}
  .asquare-chat-icon:hover {transform:scale(1.12);}
  @keyframes pulse {0%,100%{box-shadow:0 6px 25px rgba(238,157,30,0.5)}50%{box-shadow:0 12px 45px rgba(238,157,30,0.7)}}

  /* Chat Widget */
  .asquare-chat-widget {width:342px;max-width:calc(100vw - 30px);height:522px;background:white;border-radius:23px;box-shadow:0 25px 70px rgba(0,0,0,0.3);display:none;flex-direction:column;position:fixed;bottom:95px;right:15px;border:1px solid #eee;overflow:hidden;}
  .asquare-chat-widget.open {display:flex;animation:slideUp .4s ease-out;}
  @keyframes slideUp {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  /* Header */
  .asquare-chat-header {background:linear-gradient(135deg,${CHATBOT_CONFIG.primaryColor},#d48c1c);color:white;padding:18px 22px;border-radius:23px 23px 0 0;display:flex;justify-content:space-between;align-items:flex-start;min-height:68px;flex-shrink:0;}
  .asquare-chat-header h3 {margin:0;font-size:16.2px;font-weight:600;line-height:1.3;margin-bottom:2px;}
  .asquare-online {font-size:11.7px;opacity:0.9;}
  .asquare-close-btn {background:none;border:none;color:white;font-size:22px;cursor:pointer;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-left:9px;margin-top:-5px;}
  .asquare-close-btn:hover {background:rgba(255,255,255,0.2);}

  /* Messages Area – EXACTLY like your screenshot */
  .asquare-chat-messages {
    flex:1;overflow-y:auto;padding:20px 18px 10px;background:#f8f9fa;display:flex;flex-direction:column;gap:16px;
  }

  .asquare-message {
    display:flex;align-items:flex-end;max-width:100%;margin:0;
  }
  .asquare-message.user {justify-content:flex-end;}
  .asquare-message.ai {justify-content:flex-start;}

  .asquare-message-content {
    max-width:82%;padding:11px 16px;border-radius:18px;font-size:13.4px;line-height:1.48;word-break:break-word;
    box-shadow:0 1px 3px rgba(0,0,0,0.1);position:relative;
  }

  /* AI bubble – white with tiny tail on bottom-left */
  .asquare-message.ai .asquare-message-content {
    background:#ffffff;border:1px solid #e5e5e5;color:#333;
    border-radius:18px 18px 18px 4px;
  }

  /* User bubble – orange gradient with tiny tail on bottom-right */
  .asquare-message.user .asquare-message-content {
    background:linear-gradient(135deg,${CHATBOT_CONFIG.primaryColor},#d48c1c);color:white;
    border-radius:18px 18px 4px 18px;
  }

  /* Quick Actions */
  .asquare-quick-actions {
    padding:12px 14px;background:#f8f9fa;display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid #eee;flex-shrink:0;
  }
  .asquare-quick-btn {
    background:#ffffff;border:1.8px solid ${CHATBOT_CONFIG.primaryColor};color:${CHATBOT_CONFIG.primaryColor};
    padding:9px 16px;border-radius:30px;cursor:pointer;font-size:12.4px;font-weight:600;transition:all .3s;
  }
  .asquare-quick-btn:hover {background:${CHATBOT_CONFIG.primaryColor};color:white;transform:translateY(-1px);}

  /* Input Area */
  .asquare-chat-input-container {padding:16px 18px 24px;background:white;border-top:1px solid #eee;flex-shrink:0;}
  .input-wrapper {position:relative;width:100%;}
  .asquare-message-input {
    width:100%;padding:14px 56px 14px 20px;border:2px solid #e0e0e0;border-radius:30px;outline:none;
    font-size:14px;background:#fdfdfd;transition:all .3s;
  }
  .asquare-message-input:focus {border-color:${CHATBOT_CONFIG.primaryColor};background:white;box-shadow:0 0 0 4px rgba(238,157,30,0.15);}
  .asquare-send-button {
    position:absolute;right:8px;top:50%;transform:translateY(-50%);
    background:linear-gradient(135deg,${CHATBOT_CONFIG.primaryColor},#d48c1c);
    border:none;width:42px;height:42px;border-radius:50%;cursor:pointer;
    display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(238,157,30,0.4);
  }
  .asquare-send-button:hover {transform:translateY(-50%) scale(1.1);}
  .asquare-send-button svg {width:19px;height:19px;color:white;}

  /* Mobile */
  @media (max-width:480px) {
    #asquare-chatbot-widget {right:10px;bottom:10px;transform:scale(0.95);}
    .asquare-chat-icon {width:52px;height:52px;font-size:23px;}
    .asquare-chat-widget {width:calc(100vw - 20px);height:calc(100vh - 100px);max-height:580px;bottom:72px;right:10px;}
    .asquare-chat-messages {padding:18px 14px 8px;gap:14px;}
    .asquare-message-content {max-width:86%;padding:11px 15px;font-size:13.2px;border-radius:16px;}
    .asquare-message.ai .asquare-message-content {border-radius:16px 16px 16px 4px;}
    .asquare-message.user .asquare-message-content {border-radius:16px 16px 4px 16px;}
    .asquare-quick-btn {padding:8px 14px;font-size:12px;}
    .asquare-chat-input-container {padding:14px 15px 22px;}
    .asquare-message-input {padding:13px 50px 13px 18px;}
    .asquare-send-button {width:38px;height:38px;right:7px;}
  }
`;

document.head.appendChild(style);
  }

  /* -----------------------------------------------------------
     CHAT UI
  ----------------------------------------------------------- */
  function createChatUI() {
    return `
      <div class="asquare-chat-icon" id="asquareChatIcon">💬</div>

      <div class="asquare-chat-widget" id="asquareChatWidget">
        
        <div class="asquare-chat-header">
          <div>
            <h3>${CHATBOT_CONFIG.companyName}</h3>
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
      injectStyles();
      this.createWidget();
      this.bindEvents();
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
        this.chatIcon.style.display = "none";
      };

      this.closeBtn.onclick = () => {
        this.chatWidget.classList.remove("open");
        this.chatIcon.style.display = "flex";
      };

      this.chatForm.onsubmit = (e) => this.handleSubmit(e);
    }

    /* FIXED — PERFECT MESSAGE STRUCTURE */
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
