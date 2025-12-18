// (function () {
//   "use strict";

//   const CHATBOT_CONFIG = {
//     apiEndpoint: "/api/chatbot",
//     companyName: "A Square Construction",
//     ownerName: "K.P. Zakir Hussain",
//     welcomeMessage:
//       "Welcome to A Square Construction! We specialize in residential, commercial, industrial & luxury interior projects in Krishnagiri and beyond. How can we help you today?",
//     primaryColor: "primary-yellow",
//     quickActions: [
//       { label: "Our Services", message: "What services do you offer?" },
//       { label: "Projects", message: "Show me your completed projects" },
//       { label: "Contact", message: "How can I contact you?" },
//     ],
//   };

//   if (window.ASquareChatbot) return;

//   /* -----------------------------------------------------------
//      CHAT UI
//   ----------------------------------------------------------- */
//   function createChatUI() {
//     return `
//       <div class="asquare-chat-icon" id="asquareChatIcon">💬</div>

//       <div class="asquare-chat-widget" id="asquareChatWidget">
        
//         <div class="asquare-chat-header">
//           <div>
//             <h5>${CHATBOT_CONFIG.companyName}</h5>
//             <div class="asquare-online">● Online — Ready to help</div>
//           </div>
//           <button class="asquare-close-btn" id="asquareCloseBtn">×</button>
//         </div>

//         <div class="asquare-chat-messages" id="asquareChatMessages">
//           <div class="asquare-message ai">
//             <div class="asquare-message-content">${CHATBOT_CONFIG.welcomeMessage}</div>
//           </div>
//         </div>

//         <div class="asquare-quick-actions">
//           ${CHATBOT_CONFIG.quickActions.map(b => 
//             `<button class="asquare-quick-btn" onclick="ASquareChatbot.sendQuickMessage('${b.message}')">${b.label}</button>`
//           ).join("")}
//         </div>

//         <div class="asquare-chat-input-container">
//           <form class="asquare-chat-input-form" id="asquareChatForm">
//             <div class="input-wrapper">
//               <input type="text" id="asquareMessageInput" class="asquare-message-input" placeholder="How can I help you today?" autocomplete="off">
//               <button type="submit" class="asquare-send-button">
//                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
//                   <line x1="22" y1="2" x2="11" y2="13"/>
//                   <polygon points="22 2 15 22 11 13 2 9 22 2"/>
//                 </svg>
//               </button>
//             </div>
//           </form>
//         </div>

//       </div>
//     `;
//   }

//   /* -----------------------------------------------------------
//      CHATBOT CLASS
//   ----------------------------------------------------------- */
//   class ASquareChatbot {
//     constructor() {
//       this.sessionId = "asquare_" + Date.now();
//       this.init();
//     }

//     init() {
//       this.createWidget();
//       this.bindEvents();
      
//       // Simple mobile check to ensure icon is visible
//       this.checkMobileVisibility();
      
//       // Listen for resize
//       window.addEventListener('resize', () => this.checkMobileVisibility());
//     }

//     createWidget() {
//       const container = document.createElement("div");
//       container.id = "asquare-chatbot-widget";
//       container.innerHTML = createChatUI();
//       document.body.appendChild(container);

//       this.chatWidget = document.getElementById("asquareChatWidget");
//       this.chatIcon = document.getElementById("asquareChatIcon");
//       this.closeBtn = document.getElementById("asquareCloseBtn");
//       this.chatForm = document.getElementById("asquareChatForm");
//       this.messageInput = document.getElementById("asquareMessageInput");
//       this.messagesContainer = document.getElementById("asquareChatMessages");
      
//     }

//     bindEvents() {
//      this.chatIcon.onclick = () => {
//   this.chatWidget.classList.add("open");
//   this.chatIcon.classList.add("hidden");  // instead of style.display = "none"
// };

// this.closeBtn.onclick = () => {
//   this.chatWidget.classList.remove("open");
//   this.chatIcon.classList.remove("hidden");  // instead of style.display = "flex"
// };

//       this.chatForm.onsubmit = (e) => this.handleSubmit(e);
//     }

//     // SIMPLE mobile visibility check
//     checkMobileVisibility() {
//   // Optional: only ensure it's not hidden accidentally
//   if (window.innerWidth <= 768 && !this.chatWidget.classList.contains("open")) {
//     this.chatIcon.classList.remove("hidden");
//   }
// }

//     addMessage(text, type) {
//       const wrapper = document.createElement("div");

//       // CORRECT alignment class
//       wrapper.className = "asquare-message";
//       if (type === "user") wrapper.classList.add("user");
//       if (type === "ai") wrapper.classList.add("ai");

//       const bubble = document.createElement("div");
//       bubble.className = "asquare-message-content";

//       // NEVER use innerHTML unless needed
//       bubble.textContent = text;

//       wrapper.appendChild(bubble);
//       this.messagesContainer.appendChild(wrapper);

//       // Auto scroll
//       this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
//     }

//     async handleSubmit(e) {
//       e.preventDefault();

//       const message = this.messageInput.value.trim();
//       if (!message) return;

//       this.addMessage(message, "user");
//       this.messageInput.value = "";

//       try {
//         const res = await fetch(CHATBOT_CONFIG.apiEndpoint, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             message,
//             sessionId: this.sessionId
//           }),
//         });

//         const data = await res.json();
//         this.addMessage(data.response || "Thank you!", "ai");

//       } catch (e) {
//         this.addMessage("Network error. Please try again.", "ai");
//       }
//     }

//     static sendQuickMessage(message) {
//       if (window.asquareChatbotInstance) {
//         window.asquareChatbotInstance.messageInput.value = message;
//         window.asquareChatbotInstance.chatForm.dispatchEvent(new Event("submit"));
//       }
//     }
//   }

//   function init() {
//     if (window.asquareChatbotInstance) return;
//     window.asquareChatbotInstance = new ASquareChatbot();
//     window.ASquareChatbot = ASquareChatbot;
//   }

//   document.readyState === "loading"
//     ? document.addEventListener("DOMContentLoaded", init)
//     : init();

// })();

(function () {
  "use strict";

  /* ============================================================
     CONFIG
  ============================================================ */
  const CHATBOT_CONFIG = {
    // Use absolute URL for production
    apiEndpoint: window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api/chatbot'
      : '/api/chatbot',
    companyName: "A Square Construction",
    welcomeMessage:
      "Welcome to A Square Construction! We handle residential, commercial, industrial & luxury interior projects. How can I assist you today?",
    quickActions: [
      { label: "Our Services", message: "What services do you offer?" },
      { label: "Projects", message: "Can you show me your completed projects?" },
      { label: "Contact", message: "How can I contact you?" },
    ],
  };

  if (window.ASquareChatbot) return;

  /* ============================================================
     UI TEMPLATE
  ============================================================ */
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
            <div class="asquare-message-content">
              ${CHATBOT_CONFIG.welcomeMessage}
            </div>
          </div>
        </div>

        <div class="asquare-quick-actions">
          ${CHATBOT_CONFIG.quickActions
            .map(
              (b) =>
                `<button class="asquare-quick-btn" onclick="ASquareChatbot.sendQuickMessage('${b.message}')">${b.label}</button>`
            )
            .join("")}
        </div>

        <div class="asquare-chat-input-container">
          <form id="asquareChatForm">
            <input
              type="text"
              id="asquareMessageInput"
              placeholder="Type your message..."
              autocomplete="off"
            />
            <button type="submit">➤</button>
          </form>
        </div>
      </div>
    `;
  }

  /* ============================================================
     CHATBOT CLASS
  ============================================================ */
  class ASquareChatbot {
    constructor() {
      this.sessionId = "asquare_" + Date.now();
      this.isProcessing = false;
      this.init();
    }

    init() {
      this.createWidget();
      this.bindEvents();
      this.testConnection();
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
      
      // Allow Enter key to send message
      this.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.chatForm.dispatchEvent(new Event('submit'));
        }
      });
    }

    addMessage(text, type) {
      const wrapper = document.createElement("div");
      wrapper.className = `asquare-message ${type}`;

      const bubble = document.createElement("div");
      bubble.className = "asquare-message-content";
      bubble.textContent = text;

      wrapper.appendChild(bubble);
      this.messagesContainer.appendChild(wrapper);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTyping() {
      const typing = document.createElement("div");
      typing.className = "asquare-message ai typing";
      typing.id = "asquareTyping";
      typing.innerHTML = '<div class="asquare-message-content"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>';
      this.messagesContainer.appendChild(typing);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typing = document.getElementById("asquareTyping");
      if (typing) typing.remove();
    }

    async testConnection() {
      // Test if API is reachable (silent test)
      try {
        const res = await fetch(CHATBOT_CONFIG.apiEndpoint, {
          method: 'OPTIONS',
        });
        console.log('API Connection test:', res.ok ? '✓ OK' : '✗ Failed');
      } catch (err) {
        console.warn('API may not be available:', err.message);
      }
    }

    async handleSubmit(e) {
      e.preventDefault();

      if (this.isProcessing) return;
      
      const message = this.messageInput.value.trim();
      if (!message) return;

      this.isProcessing = true;
      this.addMessage(message, "user");
      this.messageInput.value = "";
      this.showTyping();

      try {
        console.log('Sending to:', CHATBOT_CONFIG.apiEndpoint, 'Message:', message);
        
        const res = await fetch(CHATBOT_CONFIG.apiEndpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            message,
            sessionId: this.sessionId,
          }),
        });

        console.log('Response status:', res.status, res.statusText);
        
        if (!res.ok) {
          let errorMsg = `Server error: ${res.status}`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorData.message || errorMsg;
          } catch (e) {
            // Couldn't parse JSON error
          }
          throw new Error(errorMsg);
        }

        const data = await res.json();
        console.log('Response data:', data);
        
        this.hideTyping();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (!data.response) {
          throw new Error('No response from server');
        }
        
        this.addMessage(data.response, "ai");
      } catch (err) {
        console.error('Chatbot error:', err);
        this.hideTyping();
        
        // User-friendly error messages
        let errorMessage = "Sorry, we're experiencing technical difficulties. ";
        
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage += "Please check your internet connection and try again.";
        } else if (err.message.includes('500')) {
          errorMessage += "Our servers are temporarily unavailable. Please try again in a few minutes.";
        } else if (err.message.includes('405')) {
          errorMessage += "The chat service is currently undergoing maintenance.";
        } else {
          errorMessage += "Please try again later or contact us directly.";
        }
        
        this.addMessage(errorMessage, "ai");
      } finally {
        this.isProcessing = false;
        this.messageInput.focus();
      }
    }

    static sendQuickMessage(message) {
      if (window.asquareChatbotInstance && !window.asquareChatbotInstance.isProcessing) {
        window.asquareChatbotInstance.messageInput.value = message;
        window.asquareChatbotInstance.chatForm.dispatchEvent(new Event("submit"));
      }
    }
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    if (window.asquareChatbotInstance) return;
    window.asquareChatbotInstance = new ASquareChatbot();
    window.ASquareChatbot = ASquareChatbot;
    
    // Add a debug helper
    window.debugChatbot = function() {
      console.log('Chatbot instance:', window.asquareChatbotInstance);
      console.log('Config:', CHATBOT_CONFIG);
      console.log('Session ID:', window.asquareChatbotInstance.sessionId);
    };
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();