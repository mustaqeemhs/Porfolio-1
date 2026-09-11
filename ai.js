/* ============================================================
   MUSTI AI — page logic.
   100% local: no API, no backend, no network requests. Reads
   from the global `portfolioKnowledge` object defined in
   portfolioKnowledge.js (loaded before this file).
   ============================================================ */
(function () {
  'use strict';

  if (typeof portfolioKnowledge === 'undefined') {
    console.error('portfolioKnowledge.js must be loaded before ai.js');
    return;
  }

  var K = portfolioKnowledge;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var thread = document.getElementById('mh-ai-thread');
  var input = document.getElementById('mh-ai-input');
  var sendBtn = document.getElementById('mh-ai-send');
  var closeBtn = document.getElementById('mh-ai-close');

  /* ---------- conversation state ---------- */
  var lastIntentId = null;
  var leadState = 'idle'; // idle -> awaiting-type -> awaiting-business -> awaiting-features
  var lead = { type: '', business: '', features: '' };

  /* ============================================================
     INTENTS — built from portfolioKnowledge so answers always
     reflect whatever is currently in that file.
     ============================================================ */
  function buildIntents() {
    var toolsList = K.tools && K.tools.length ? K.tools.join(', ') : K.skills.join(', ');

    return [
      {
        id: 'greeting',
        phrases: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        responses: [
          'Hey! Ask me about ' + K.personal.professionalName + "'s services, projects, skills or how to get started.",
          'Hi there! Happy to help — ask about services, past projects, or how to reach out.'
        ]
      },
      {
        id: 'thanks',
        phrases: ['thank you', 'thanks', 'appreciate it'],
        responses: ["You're welcome! Anything else you'd like to know?", 'Anytime! Let me know if you have more questions.']
      },
      {
        id: 'about',
        phrases: ['who are you', 'about you', 'tell me about yourself', 'who built this', 'who made this website', 'your name'],
        responses: [K.personal.longBio || K.personal.shortBio]
      },
      {
        id: 'services',
        phrases: ['what do you do', 'what services', 'what can you build', 'can you design websites', 'what can you help me with', 'what kind of websites', 'services do you offer', 'services do you provide', 'type of work'],
        words: ['services', 'service'],
        responses: [
          'Main services: ' + K.services.map(function (s) { return s.name; }).join(' · ') + '.',
          K.personal.shortBio
        ],
        actions: ['services']
      },
      {
        id: 'ecommerce',
        phrases: ['online store', 'online stores', 'e-commerce website', 'ecommerce website', 'woocommerce store', 'build a store', 'build stores', 'sell online', 'online shop', 'online shops', 'build an online store'],
        words: ['ecommerce', 'woocommerce'],
        responses: ['Yes — I build WooCommerce online stores, from product catalogs to checkout.'],
        actions: ['work']
      },
      {
        id: 'wordpress',
        phrases: ['use wordpress', 'wordpress websites', 'work with elementor', 'wordpress developer'],
        words: ['wordpress', 'elementor'],
        responses: ['Yes, WordPress and Elementor are my main tools — they make sites easy for you to manage yourself after launch.']
      },
      {
        id: 'projects',
        phrases: ['what projects', 'show me your work', 'what websites have you built', 'your portfolio', 'past work', 'previous projects'],
        words: ['projects', 'portfolio'],
        responses: [
          'A few things I\u2019ve built: ' + K.projects.map(function (p) { return p.name + ' (' + p.category + ')'; }).join(', ') + '.'
        ],
        actions: ['work']
      },
      {
        id: 'skills',
        phrases: ['what technologies', 'what are your skills', 'what tools do you use', 'tech stack'],
        words: ['skills', 'technologies', 'tools'],
        responses: ['Skills: ' + K.skills.join(' · ') + '.']
      },
      {
        id: 'experience',
        phrases: ['years of experience', 'how experienced', 'how long have you been', 'what is your experience'],
        responses: [K.personal.experience]
      },
      {
        id: 'certifications',
        phrases: ['what certificates', 'your certifications', 'are you certified', 'what credentials'],
        words: ['certificate', 'certificates', 'certification', 'certifications', 'credentials'],
        responses: [
          K.certifications.length
            ? 'Certifications: ' + K.certifications.map(function (c) { return c.name + ' (' + c.organization + ', ' + c.year + ')'; }).join(', ') + '.'
            : "I don't have certifications listed yet."
        ],
        actions: ['certifications']
      },
      {
        id: 'pricing',
        phrases: ['how much do you charge', 'what are your prices', 'how much does a website cost', 'your rates', 'your fees', 'pricing'],
        words: ['price', 'cost', 'charge'],
        responses: [K.pricing.note],
        actions: ['contact']
      },
      {
        id: 'process',
        phrases: ['how do you work', "what's your process", 'how do projects work', 'how does this work'],
        responses: ['Usually: ' + K.process.join(' → ') + '.']
      },
      {
        id: 'contact',
        phrases: ['how can i contact you', 'how do i hire you', 'contact you on whatsapp', 'how can we work together', 'get in touch', 'reach you'],
        words: ['contact', 'whatsapp', 'email'],
        responses: ['You can reach out through the contact section on the portfolio, or message directly on WhatsApp.'],
        actions: ['contact', 'whatsapp']
      },
      {
        id: 'leadgen',
        phrases: ['i need a website', 'i want a website', 'want to work with you', 'need a site', 'interested in working together', 'hire you', 'start a project', 'i want to hire you'],
        responses: ['What type of website do you need — business, e-commerce, portfolio, landing page or something else?'],
        setState: 'awaiting-type'
      }
    ];
  }

  var intents = buildIntents();

  /* ---------- matching ---------- */
  function normalize(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  var FAQ_STOPWORDS = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'you', 'your', 'i', 'my', 'me', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'this', 'that', 'it', 'and', 'how', 'what', 'why', 'when', 'where', 'who'];

  function matchFaq(text) {
    var norm = normalize(text);
    var padded = ' ' + norm + ' ';
    var tokens = norm.split(' ');
    var best = null;
    var bestScore = 0;

    (K.faqs || []).some(function (faq) {
      var qNorm = normalize(faq.question);

      /* Strongest signal: the whole question appears in what they typed —
         handles short/idiomatic questions ("wagwan?", "how are you?")
         that don't have enough distinguishing keywords to score on. */
      if (qNorm && padded.indexOf(' ' + qNorm + ' ') !== -1) {
        best = faq;
        return true; // stop — exact phrase wins outright
      }

      var qWords = qNorm.split(' ').filter(function (w) { return w.length > 2 && FAQ_STOPWORDS.indexOf(w) === -1; });
      if (!qWords.length) return false;

      var score = 0;
      qWords.forEach(function (w) {
        var hit = tokens.some(function (t) { return t === w || (w.length >= 3 && t.indexOf(w) === 0 && t.length <= w.length + 2); });
        if (hit) score++;
      });

      /* Short questions need fewer matching words to count as a hit —
         a 1-2 word question shouldn't need an impossible score of 2. */
      var threshold = qWords.length <= 2 ? 1 : 2;
      if (score >= threshold && score > bestScore) {
        bestScore = score;
        best = faq;
      }
      return false;
    });

    return best;
  }

  function matchIntent(rawText) {
    var text = normalize(rawText);
    var tokens = text.split(' ');
    var padded = ' ' + text + ' ';
    var best = null;
    var bestScore = 0;

    intents.forEach(function (intent) {
      var score = 0;
      (intent.phrases || []).forEach(function (p) {
        if (padded.indexOf(' ' + p + ' ') !== -1) score += 3;
      });
      (intent.words || []).forEach(function (w) {
        var hit = tokens.some(function (t) { return t === w || (w.length >= 3 && t.indexOf(w) === 0 && t.length <= w.length + 2); });
        if (hit) score += 1;
      });
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    });

    return bestScore > 0 ? best : null;
  }

  /* ---------- lightweight conversation context ---------- */
  var continuationCues = ['platform', 'which one', 'what about', 'what tools', 'how about', 'and what', 'what do you use', 'why', 'which'];

  function tryContextFollowUp(rawText) {
    if (!lastIntentId) return null;
    var text = normalize(rawText);
    var isContinuation = continuationCues.some(function (c) { return text.indexOf(c) !== -1; });
    if (!isContinuation) return null;

    if (lastIntentId === 'ecommerce') {
      return 'For e-commerce I build on WooCommerce (WordPress) — handles products, cart and checkout without needing a custom backend.';
    }
    if (lastIntentId === 'services' || lastIntentId === 'projects') {
      return 'Mainly ' + (K.tools && K.tools.length ? K.tools.join(', ') : K.skills.join(', ')) + '.';
    }
    if (lastIntentId === 'pricing') {
      return K.pricing.note;
    }
    if (lastIntentId === 'process') {
      return 'Each step is collaborative — I share progress and get your input before moving to the next one.';
    }
    return null;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ---------- DOM helpers ---------- */
  function addMessage(role, html) {
    var row = document.createElement('div');
    row.className = 'mh-ai-msg mh-ai-msg--' + role;
    row.innerHTML = '<div class="mh-ai-bubble">' + html + '</div>';
    thread.appendChild(row);
    if (!reduceMotion) requestAnimationFrame(function () { row.classList.add('is-in'); });
    else row.classList.add('is-in');
    scrollToBottom();
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  var actionLabels = {
    services: 'View Services',
    work: 'View My Work',
    certifications: 'View Certifications',
    contact: 'Contact Me',
    whatsapp: 'WhatsApp Me',
    'start-project': 'Start a Project'
  };

  function runAction(key) {
    if (key === 'services') window.location.href = 'index.html#mh-portfolio-services';
    else if (key === 'work') window.location.href = 'index.html#mh-portfolio-work';
    else if (key === 'certifications') window.location.href = 'index.html#mh-portfolio-certifications';
    else if (key === 'contact' || key === 'start-project') window.location.href = 'index.html#mh-portfolio-contact';
    else if (key === 'whatsapp') window.open(K.socialLinks.whatsapp || ('https://wa.me/' + K.personal.whatsapp), '_blank', 'noopener');
  }

  function addActions(keys) {
    var html = '<div class="mh-ai-actions">' + keys.map(function (k) {
      return '<button type="button" class="mh-ai-action-btn" data-action="' + k + '">' + actionLabels[k] + '</button>';
    }).join('') + '</div>';
    var row = document.createElement('div');
    row.className = 'mh-ai-msg mh-ai-msg--bot';
    row.innerHTML = html;
    thread.appendChild(row);
    if (!reduceMotion) requestAnimationFrame(function () { row.classList.add('is-in'); });
    else row.classList.add('is-in');
    scrollToBottom();
  }

  function addChips(list) {
    var html = '<div class="mh-ai-chips">' + list.map(function (q) {
      return '<button type="button" class="mh-ai-chip" data-suggestion="' + q.replace(/"/g, '&quot;') + '">' + q + '</button>';
    }).join('') + '</div>';
    var row = document.createElement('div');
    row.className = 'mh-ai-msg mh-ai-msg--bot';
    row.innerHTML = html;
    thread.appendChild(row);
    if (!reduceMotion) requestAnimationFrame(function () { row.classList.add('is-in'); });
    else row.classList.add('is-in');
    scrollToBottom();
  }

  function showTyping() {
    var row = document.createElement('div');
    row.className = 'mh-ai-msg mh-ai-msg--bot';
    row.innerHTML = '<div class="mh-ai-bubble mh-ai-typing"><span></span><span></span><span></span></div>';
    thread.appendChild(row);
    scrollToBottom();
    return row;
  }

  function scrollToBottom() {
    var main = document.getElementById('mh-ai-main');
    main.scrollTop = main.scrollHeight;
  }

  thread.addEventListener('click', function (e) {
    var actionBtn = e.target.closest('[data-action]');
    if (actionBtn) { runAction(actionBtn.getAttribute('data-action')); return; }
    var chip = e.target.closest('[data-suggestion]');
    if (chip) { sendMessage(chip.getAttribute('data-suggestion')); }
  });

  /* ---------- conversation logic ---------- */
  function handleSendClick() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
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
      lead.type = text.replace(/^(a|an|the)\s+/i, '');
      leadState = 'awaiting-business';
      addMessage('bot', 'Got it. What does your business do?');
      return;
    }
    if (leadState === 'awaiting-business') {
      lead.business = text;
      leadState = 'awaiting-features';
      addMessage('bot', 'And what features do you need — things like a store, bookings, a blog, contact forms?');
      return;
    }
    if (leadState === 'awaiting-features') {
      lead.features = text;
      leadState = 'idle';
      addMessage('bot', 'Perfect — a ' + escapeHtml(lead.type) + ' site for a business that ' + escapeHtml(lead.business) + ', with ' + escapeHtml(lead.features) + '. That\u2019s enough to get started on a quote.');
      addActions(['start-project', 'contact', 'whatsapp']);
      return;
    }

    var faq = matchFaq(text);
    if (faq) {
      addMessage('bot', faq.answer);
      return;
    }

    var intent = matchIntent(text);

    if (!intent) {
      var followUp = tryContextFollowUp(text);
      if (followUp) {
        addMessage('bot', followUp);
        return;
      }
      addMessage('bot', "I don't have that information yet. You can contact me directly and I'll be happy to answer.");
      addActions(['contact', 'whatsapp']);
      return;
    }

    addMessage('bot', pick(intent.responses));
    lastIntentId = intent.id;
    if (intent.setState) leadState = intent.setState;
    if (intent.actions && intent.actions.length) addActions(intent.actions);
  }

  /* ---------- welcome ---------- */
  function renderWelcome() {
    addMessage('bot', "Hi! I'm Musti AI, the assistant for this portfolio. Ask me anything about my work, services, skills, experience, projects or how to work with me.");
    addChips([
      'What services do you offer?',
      'Tell me about your projects',
      'What technologies do you use?',
      'Do you build e-commerce websites?',
      'What is your experience?',
      'How can I contact you?'
    ]);
  }

  /* ---------- events ---------- */
  sendBtn.addEventListener('click', handleSendClick);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  });
  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  function goBackToPortfolio() {
    if (document.referrer && document.referrer.indexOf(window.location.host) !== -1 && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  }

  closeBtn.addEventListener('click', goBackToPortfolio);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') goBackToPortfolio();
  });

  renderWelcome();
  input.focus();
})();
