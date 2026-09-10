/* ============================================================
   PORTFOLIO ASSISTANT — 100% local, no API, no backend, no network
   requests, no cost. Everything below runs in the visitor's browser.

   Nothing heavy runs until the visitor actually opens the chat
   (see "LAZY INIT" near the bottom) — the only thing that exists
   on page load is the small floating button.
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     EDIT ME — your portfolio info. This is the only section you
     should need to touch to keep the assistant's answers current.
     ============================================================ */
  var portfolioKnowledge = {
    name: 'Mustaqeem Hassan',
    role: 'Web Designer & Developer',
    experience: "Still growing — I'm an engineering student who has been building real client websites while learning web development and AI tools.",
    services: [
      'Website Design',
      'WordPress Development',
      'E-commerce Websites',
      'Landing Pages',
      'Website Redesign'
    ],
    skills: ['WordPress', 'WooCommerce', 'Elementor', 'HTML', 'CSS', 'JavaScript', 'Figma', 'GitHub'],
    projects: [
      { name: 'Real Estate Website', category: 'Property / Business', description: 'A property listings website built to present homes clearly, with a clean layout for browsing by location and price.' },
      { name: 'Twin Base & Sons Enterprises', category: 'E-commerce', description: 'A WooCommerce storefront for a paint and wallpaper retailer, built on Elementor with a custom navy-and-gold footer.' },
      { name: 'Portfolio Landing Page', category: 'Portfolio', description: 'A minimal, editorial portfolio for a creative developer, focused on immersive visuals and a distraction-free experience.' },
      { name: 'Restaurant Website', category: 'Restaurant / Business', description: 'A menu-forward site built around clear navigation, an online menu and easy ways for customers to get in touch.' },
      { name: 'Portfolio Website', category: 'Portfolio', description: 'A bold portfolio experience combining expressive typography, fluid motion and a structured case-study layout.' },
      { name: 'Clothing E-commerce Website', category: 'E-commerce', description: 'A modern online store built to turn visitors into customers through a seamless, visually engaging shopping experience.' }
    ],
    contact: {
      whatsapp: '2349122068094',
      email: 'hassanmustaqeem001@gmail.com'
    }
  };

  /* ============================================================
     INTENTS — plain keyword/phrase matching, no AI model.
     Each intent: a list of phrases/words that should trigger it,
     and a few response variations so it doesn't sound robotic.
     Longer, more specific phrases score higher than single words,
     so "how do you work" (process) won't get swallowed by a
     stray "work" match elsewhere.
     ============================================================ */
  function buildIntents() {
    var wa = 'https://wa.me/' + portfolioKnowledge.contact.whatsapp;

    return [
      {
        id: 'greeting',
        phrases: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', "what's up"],
        responses: [
          "Hey! Ask me anything about " + portfolioKnowledge.name + "'s services, projects or how to get started.",
          "Hi there! Happy to help — ask about services, past projects, skills, or how to reach out."
        ]
      },
      {
        id: 'thanks',
        phrases: ['thank you', 'thanks', 'appreciate it', 'thank u'],
        responses: ["You're welcome! Anything else you'd like to know?", 'Anytime! Let me know if you have more questions.']
      },
      {
        id: 'about',
        phrases: ['who are you', 'about you', 'tell me about yourself', 'who built this', 'who made this website', 'your name', 'who is ' + portfolioKnowledge.name.toLowerCase()],
        responses: [
          "I'm the portfolio assistant for " + portfolioKnowledge.name + ', a ' + portfolioKnowledge.role + '. ' + portfolioKnowledge.experience,
          portfolioKnowledge.name + ' is a ' + portfolioKnowledge.role + '. ' + portfolioKnowledge.experience
        ]
      },
      {
        id: 'services',
        phrases: ['what do you do', 'what services', 'what can you build', 'can you design websites', 'what can you help me with', 'what kind of websites', 'services do you offer', 'services do you provide'],
        words: ['services', 'service'],
        responses: [
          'I design and build modern websites for businesses, including ' + portfolioKnowledge.services.slice(0, -1).join(', ') + ' and ' + portfolioKnowledge.services[portfolioKnowledge.services.length - 1] + '.',
          'Main focus areas: ' + portfolioKnowledge.services.join(' · ') + '.',
          'I help businesses build a stronger online presence — from full websites to focused landing pages and online stores.'
        ],
        actions: ['services']
      },
      {
        id: 'ecommerce',
        phrases: ['online store', 'e-commerce website', 'ecommerce website', 'woocommerce store', 'build a store', 'sell online', 'online shop'],
        words: ['ecommerce', 'woocommerce'],
        responses: [
          "Yes — I build WooCommerce online stores, from product catalogs to checkout. Twin Base & Sons and the Clothing Store project are both examples.",
          'E-commerce is one of my main focus areas — WooCommerce stores with clean product browsing and checkout.'
        ],
        actions: ['work']
      },
      {
        id: 'wordpress',
        phrases: ['use wordpress', 'wordpress websites', 'work with elementor', 'wordpress developer'],
        words: ['wordpress', 'elementor'],
        responses: [
          'Yes, WordPress and Elementor are my main tools — they make sites easy for you to manage yourself after launch.',
          "I build primarily on WordPress with Elementor, plus WooCommerce for stores."
        ]
      },
      {
        id: 'projects',
        phrases: ['what projects', 'show me your work', 'what websites have you built', 'your portfolio', 'past work', 'previous projects'],
        words: ['projects', 'portfolio'],
        responses: buildProjectResponses(),
        actions: ['work']
      },
      {
        id: 'skills',
        phrases: ['what technologies', 'what are your skills', 'what tools do you use', 'tech stack'],
        words: ['skills', 'technologies'],
        responses: [
          'Skills: ' + portfolioKnowledge.skills.join(' · ') + '.',
          'I mainly work with ' + portfolioKnowledge.skills.slice(0, 4).join(', ') + ', plus ' + portfolioKnowledge.skills.slice(4).join(', ') + '.'
        ]
      },
      {
        id: 'experience',
        phrases: ['years of experience', 'how experienced', 'how long have you been'],
        responses: [portfolioKnowledge.experience]
      },
      {
        id: 'pricing',
        phrases: ['how much do you charge', 'what are your prices', 'how much does a website cost', 'your rates', 'your fees', 'pricing'],
        words: ['price', 'cost', 'charge'],
        responses: ['Pricing depends on the project and its requirements. Send me a message through the contact section and we can discuss what you need.'],
        actions: ['contact']
      },
      {
        id: 'process',
        phrases: ['how do you work', "what's your process", 'how do projects work', 'how does this work'],
        responses: [
          "Usually: we talk through what you need, I put together a plan and quote, then I build, share progress, and launch once you're happy with it.",
          'Simple flow: quick chat about your needs → quote and timeline → design and build → review → launch.'
        ]
      },
      {
        id: 'contact',
        phrases: ['how can i contact you', 'how do i hire you', 'contact you on whatsapp', 'how can we work together', 'get in touch', 'reach you'],
        words: ['contact', 'whatsapp', 'email'],
        responses: ['You can reach out through the contact section on this site, or message directly on WhatsApp — whichever is easier for you.'],
        actions: ['contact', 'whatsapp']
      },
      {
        id: 'leadgen',
        phrases: ['i need a website', 'i want a website', 'want to work with you', 'need a site', 'interested in working together', 'hire you', 'start a project', 'i want to hire you'],
        responses: ['Great! What type of website are you looking for — business, e-commerce, portfolio, landing page or something else?'],
        setState: 'awaiting-type'
      }
    ];

    function buildProjectResponses() {
      var list = portfolioKnowledge.projects.map(function (p) { return p.name + ' (' + p.category + ')'; }).join(', ');
      return [
        'A few things I\u2019ve built: ' + list + '. You can see all of them in the Work section.',
        'Recent projects include ' + list + '.'
      ];
    }
  }

  /* ============================================================
     Below this line is implementation — shouldn't need editing.
     ============================================================ */

  var launcher = document.getElementById('mh-chat-launcher');
  if (!launcher) return;

  var initialized = false;
  var chatWindow, backdrop, messagesEl, inputEl, sendBtn;
  var messages = [];
  var leadState = 'idle';
  var leadType = '';
  var intents = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function normalize(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function matchIntent(rawText) {
    var text = normalize(rawText);
    var best = null;
    var bestScore = 0;

    intents.forEach(function (intent) {
      var score = 0;
      var padded = ' ' + text + ' ';
      (intent.phrases || []).forEach(function (p) {
        if (padded.indexOf(' ' + p + ' ') !== -1) score += 3;
      });
      (intent.words || []).forEach(function (w) {
        if (padded.indexOf(' ' + w + ' ') !== -1) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    });

    return bestScore > 0 ? best : null;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---------- DOM building (lazy — only runs on first open) ---------- */

  function buildChatWindow() {
    backdrop = document.createElement('div');
    backdrop.className = 'mh-chat-backdrop';
    backdrop.hidden = true;
    backdrop.addEventListener('click', closeChat);
    document.body.appendChild(backdrop);

    chatWindow = document.createElement('div');
    chatWindow.className = 'mh-chat-window';
    chatWindow.setAttribute('role', 'dialog');
    chatWindow.setAttribute('aria-modal', 'true');
    chatWindow.setAttribute('aria-label', 'Portfolio assistant chat');
    chatWindow.hidden = true;

    chatWindow.innerHTML =
      '<div class="mh-chat-header">' +
        '<div>' +
          '<p class="mh-chat-header__title"><span class="mh-chat-header__badge">AI</span>Portfolio Assistant</p>' +
          '<p class="mh-chat-header__status"><span class="mh-chat-dot"></span>Online</p>' +
        '</div>' +
        '<div class="mh-chat-header__actions">' +
          '<button type="button" class="mh-chat-icon-btn" id="mh-chat-clear" aria-label="Clear conversation" title="Clear conversation">↺</button>' +
          '<button type="button" class="mh-chat-icon-btn" id="mh-chat-minimize" aria-label="Minimize chat" title="Minimize">–</button>' +
          '<button type="button" class="mh-chat-icon-btn" id="mh-chat-close" aria-label="Close chat" title="Close">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="mh-chat-messages" id="mh-chat-messages" aria-live="polite"></div>' +
      '<div class="mh-chat-input-row">' +
        '<textarea class="mh-chat-input" id="mh-chat-input" placeholder="Ask a question..." rows="1" aria-label="Type a message"></textarea>' +
        '<button type="button" class="mh-chat-send" id="mh-chat-send" aria-label="Send message">↑</button>' +
      '</div>';

    document.body.appendChild(chatWindow);

    messagesEl = chatWindow.querySelector('#mh-chat-messages');
    inputEl = chatWindow.querySelector('#mh-chat-input');
    sendBtn = chatWindow.querySelector('#mh-chat-send');

    chatWindow.querySelector('#mh-chat-close').addEventListener('click', closeChat);
    chatWindow.querySelector('#mh-chat-minimize').addEventListener('click', closeChat);
    chatWindow.querySelector('#mh-chat-clear').addEventListener('click', resetConversation);

    sendBtn.addEventListener('click', handleSendClick);
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendClick();
      }
    });
    inputEl.addEventListener('input', function () {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 96) + 'px';
    });

    /* Event delegation for every action/suggestion button rendered inside messages */
    messagesEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      runAction(btn.getAttribute('data-action'));
    });
    messagesEl.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-suggestion]');
      if (!chip) return;
      sendMessage(chip.getAttribute('data-suggestion'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !chatWindow.hidden) closeChat();
    });
  }

  function addMessage(role, html, opts) {
    opts = opts || {};
    var row = document.createElement('div');
    row.className = 'mh-chat-msg mh-chat-msg--' + role;
    row.innerHTML = '<div class="mh-chat-bubble">' + html + '</div>';
    messagesEl.appendChild(row);
    if (!reduceMotion) {
      requestAnimationFrame(function () { row.classList.add('is-in'); });
    } else {
      row.classList.add('is-in');
    }
    scrollToBottom();
    messages.push({ role: role, html: html });
  }

  function addActionButtons(actions) {
    var map = {
      services: { label: 'View Services', fn: function () { scrollToSection('mh-portfolio-services'); } },
      work: { label: 'View My Work', fn: function () { scrollToSection('mh-portfolio-work'); } },
      contact: { label: 'Contact Me', fn: function () { scrollToSection('mh-portfolio-contact'); } },
      whatsapp: { label: 'WhatsApp Me', fn: function () { window.open('https://wa.me/' + portfolioKnowledge.contact.whatsapp, '_blank', 'noopener'); } },
      'start-project': { label: 'Start a Project', fn: function () { scrollToSection('mh-portfolio-contact'); } }
    };
    var html = '<div class="mh-chat-actions">' + actions.map(function (a) {
      return '<button type="button" class="mh-chat-action-btn" data-action="' + a + '">' + map[a].label + '</button>';
    }).join('') + '</div>';
    var row = document.createElement('div');
    row.className = 'mh-chat-msg mh-chat-msg--bot';
    row.innerHTML = html;
    messagesEl.appendChild(row);
    if (!reduceMotion) requestAnimationFrame(function () { row.classList.add('is-in'); });
    else row.classList.add('is-in');
    scrollToBottom();
  }

  function runAction(key) {
    if (key === 'services') scrollToSection('mh-portfolio-services');
    else if (key === 'work') scrollToSection('mh-portfolio-work');
    else if (key === 'contact' || key === 'start-project') scrollToSection('mh-portfolio-contact');
    else if (key === 'whatsapp') window.open('https://wa.me/' + portfolioKnowledge.contact.whatsapp, '_blank', 'noopener');
  }

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      closeChat();
    } else if (id === 'mh-portfolio-work' && /work\.html$/.test(window.location.pathname)) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      closeChat();
    } else if (id === 'mh-portfolio-certifications' && /certificates\.html$/.test(window.location.pathname)) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      closeChat();
    } else {
      window.location.href = 'index.html#' + id;
    }
  }

  function showSuggestions(list) {
    var row = document.createElement('div');
    row.className = 'mh-chat-msg mh-chat-msg--bot';
    row.innerHTML = '<div class="mh-chat-suggestions">' + list.map(function (q) {
      return '<button type="button" class="mh-chat-suggestion-chip" data-suggestion="' + q.replace(/"/g, '&quot;') + '">' + q + '</button>';
    }).join('') + '</div>';
    messagesEl.appendChild(row);
    if (!reduceMotion) requestAnimationFrame(function () { row.classList.add('is-in'); });
    else row.classList.add('is-in');
    scrollToBottom();
  }

  function showTyping() {
    var row = document.createElement('div');
    row.className = 'mh-chat-msg mh-chat-msg--bot mh-chat-typing-row';
    row.innerHTML = '<div class="mh-chat-bubble mh-chat-typing"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Conversation logic ---------- */

  function handleSendClick() {
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendMessage(text);
  }

  function sendMessage(text) {
    addMessage('user', escapeHtml(text));

    var typingRow = showTyping();
    var delay = 150 + Math.random() * 350;

    setTimeout(function () {
      typingRow.remove();
      respondTo(text);
    }, delay);
  }

  function respondTo(text) {
    /* Lead-gen mini conversation takes priority while active */
    if (leadState === 'awaiting-type') {
      leadType = text;
      leadState = 'awaiting-detail';
      var lower = text.toLowerCase();
      if (lower.indexOf('store') !== -1 || lower.indexOf('shop') !== -1 || lower.indexOf('ecommerce') !== -1 || lower.indexOf('e-commerce') !== -1) {
        addMessage('bot', 'Nice. What will you be selling?');
      } else {
        leadState = 'idle';
        addMessage('bot', "Great, a " + escapeHtml(text) + ' project. When you\u2019re ready, you can start things off through the contact section.');
        addActionButtons(['start-project']);
      }
      return;
    }

    if (leadState === 'awaiting-detail') {
      leadState = 'idle';
      var cleanType = leadType.replace(/^(a|an|the)\s+/i, '');
      addMessage('bot', 'Perfect. I can help you plan a modern ' + escapeHtml(cleanType) + ' site for ' + escapeHtml(text) + '. When you\u2019re ready, you can start a project through the contact section.');
      addActionButtons(['start-project']);
      return;
    }

    var intent = matchIntent(text);

    if (!intent) {
      addMessage('bot', "I'm not sure about that yet. I can answer questions about the services, projects, skills and information available on this portfolio.");
      addActionButtons(['services', 'work', 'contact']);
      return;
    }

    addMessage('bot', pick(intent.responses));
    if (intent.setState) leadState = intent.setState;
    if (intent.actions && intent.actions.length) addActionButtons(intent.actions);
  }

  function resetConversation() {
    messages = [];
    leadState = 'idle';
    messagesEl.innerHTML = '';
    renderWelcome();
  }

  function renderWelcome() {
    addMessage('bot', "Hi! I'm the portfolio assistant. Ask me anything about my services, projects, skills or how to work with me.");
    showSuggestions([
      'What services do you offer?',
      'Tell me about your projects',
      'Do you build e-commerce websites?',
      'What technologies do you use?',
      'How can I contact you?'
    ]);
  }

  /* ---------- Open / close ---------- */

  function openChat() {
    if (!initialized) {
      initialized = true;
      intents = buildIntents();
      buildChatWindow();
      renderWelcome();
    }
    backdrop.hidden = false;
    chatWindow.hidden = false;
    requestAnimationFrame(function () {
      backdrop.classList.add('is-open');
      chatWindow.classList.add('is-open');
    });
    launcher.setAttribute('aria-expanded', 'true');
    if (inputEl) inputEl.focus();
  }

  function closeChat() {
    if (!chatWindow) return;
    chatWindow.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    var hide = function () {
      chatWindow.hidden = true;
      backdrop.hidden = true;
    };
    if (reduceMotion) hide();
    else setTimeout(hide, 220);
  }

  function toggleChat() {
    if (chatWindow && !chatWindow.hidden) closeChat();
    else openChat();
  }

  /* ---------- LAZY INIT: the only thing that runs on page load ---------- */
  launcher.setAttribute('aria-expanded', 'false');
  launcher.addEventListener('click', toggleChat);
})();
