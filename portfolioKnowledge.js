/* ============================================================
   PORTFOLIO KNOWLEDGE BASE
   ============================================================
   This is the ONLY file you should need to edit to keep the AI
   assistant's answers accurate and current.

   Nothing here is sent anywhere — this file is loaded directly
   in the browser and read locally by ai.js. No API, no backend,
   no network request.

   Where things marked EXAMPLE / EDIT appear, replace them with
   your real information. Never invented: pricing, experience,
   or achievements you haven't provided — those are written to
   stay honest until you fill them in yourself.
   ============================================================ */

var portfolioKnowledge = {

  /* ---------- 1. PERSONAL — your name, role, bio, contact ---------- */
  personal: {
    name: 'Mustaqeem Hassan',                 // EDIT: your full name
    professionalName: 'Mustaqeem Hassan',      // EDIT: how you want to be introduced (can be same as name)
    role: 'Web Designer & Developer',          // EDIT: your title
    location: 'Nigeria',                       // EDIT: your city/country
    experience: "Still growing — I'm an engineering student who has been building real client websites while learning web development and AI tools.", // EDIT: keep this honest — don't state years you haven't done
    email: 'hassanmustaqeem001@gmail.com',      // EDIT
    phone: '',                                  // EDIT: optional, leave blank to omit
    whatsapp: '2349122068094',                  // EDIT: digits only, country code, no + or leading 0
    shortBio: 'I design and build fast, modern WordPress websites that help small businesses look professional, attract customers and grow online.', // EDIT
    longBio: "I'm an engineering student who designs and builds practical, modern websites for small businesses — from WooCommerce stores to landing pages. I care about clean structure, fast load times, and sites that stay easy to update long after launch." // EDIT
  },

  /* ---------- 2. SERVICES — copy one object to add another ---------- */
  services: [
    {
      name: 'Web Design',
      description: 'Modern, conversion-focused websites designed around each business.',
      includes: ['Custom layout & visual design', 'Mobile-responsive build', 'Fast load times']
    },
    {
      name: 'WordPress Development',
      description: 'Fast, responsive and easy-to-manage WordPress websites.',
      includes: ['WordPress setup & theming', 'Elementor page building', 'Easy content editing after handoff']
    },
    {
      name: 'E-commerce',
      description: 'Online stores designed to make browsing and purchasing simple.',
      includes: ['WooCommerce setup', 'Product catalog & checkout', 'Payment integration']
    },
    {
      name: 'Landing Pages',
      description: 'High-converting landing pages for businesses, products and campaigns.',
      includes: ['Single-page focused design', 'Clear call-to-action', 'Fast turnaround']
    },
    {
      name: 'Website Redesign',
      description: 'Transform outdated websites into modern digital experiences.',
      includes: ['Design refresh', 'Performance improvements', 'Content migration']
    }
  ],

  /* ---------- 3. SKILLS — general skill list ---------- */
  skills: ['WordPress', 'WooCommerce', 'Elementor', 'HTML', 'CSS', 'JavaScript', 'Figma', 'GitHub'],

  /* ---------- 4. TOOLS — software/platforms you work in day to day ---------- */
  tools: ['WordPress', 'Elementor', 'WooCommerce', 'Figma', 'VS Code', 'GitHub'],

  /* ---------- 5. PROJECTS — copy one object to add another ---------- */
  projects: [
    {
      name: 'Real Estate Website',
      category: 'Property / Business',
      description: 'A property listings website built to present homes clearly, with a clean layout for browsing by location and price.',
      problem: '',   // EDIT: what problem the client had, if you want the AI to be able to explain it
      solution: '',  // EDIT
      technologies: ['WordPress', 'WooCommerce', 'Elementor'],
      result: '',    // EDIT: only fill this in with something real — leave blank if unknown, never invented
      url: ''
    },
    {
      name: 'Twin Base & Sons Enterprises',
      category: 'E-commerce',
      description: 'A WooCommerce storefront for a paint and wallpaper retailer, built on Elementor with a custom navy-and-gold footer, a themed 404 page and an optimized product catalog.',
      problem: '',
      solution: '',
      technologies: ['WordPress', 'WooCommerce', 'Elementor'],
      result: '',
      url: 'https://twinsbaseandsons.vercel.app/'
    },
    {
      name: 'Portfolio Landing Page',
      category: 'Portfolio',
      description: 'A minimal, editorial portfolio for a creative developer, focused on immersive visuals and a distraction-free experience.',
      problem: '',
      solution: '',
      technologies: ['WordPress', 'Elementor'],
      result: '',
      url: ''
    },
    {
      name: 'Restaurant Website',
      category: 'Restaurant / Business',
      description: 'A menu-forward site built around clear navigation, an online menu and easy ways for customers to get in touch.',
      problem: '',
      solution: '',
      technologies: ['Custom-Built'],
      result: '',
      url: 'https://mustirestaur-myypplsx.manus.space'
    },
    {
      name: 'Portfolio Website',
      category: 'Portfolio',
      description: 'A bold portfolio experience combining expressive typography, fluid motion and a structured case-study layout.',
      problem: '',
      solution: '',
      technologies: ['Custom-Built'],
      result: '',
      url: 'https://mustiporfolio.vercel.app/'
    },
    {
      name: 'Clothing E-commerce Website',
      category: 'E-commerce',
      description: 'A modern online store built to turn visitors into customers through a seamless, visually engaging shopping experience.',
      problem: '',
      solution: '',
      technologies: ['WordPress', 'Elementor'],
      result: '',
      url: ''
    }
    // EDIT: copy one whole { ... } object above (including the comma before it)
    // to add another project. Keep "technologies" as a plain array of strings.
  ],

  /* ---------- 6. CERTIFICATIONS ---------- */
  certifications: [
    {
      name: 'Introduction to Artificial Intelligence',
      organization: 'Claude (Anthropic)',
      year: '2026',
      description: ''  // EDIT: optional one-line description
    },
    {
      name: 'Responsive Web Design',
      organization: 'freeCodeCamp',
      year: '2025',
      description: ''
    },
    {
      name: 'Front-End Development',
      organization: 'Techy Jaunt',
      year: '2025',
      description: ''
    }
    // EDIT: copy one whole { ... } object above to add another certificate.
  ],

  /* ---------- 7. EXPERIENCE — a timeline, if you want one ---------- */
  experience: [
    // EXAMPLE — replace or delete. Only add entries that are real:
    // { role: 'Freelance Web Developer', period: '2025 — Present', description: 'Building WordPress and custom websites for small businesses.' }
  ],

  /* ---------- 8. PRICING — never state a number unless you add one ---------- */
  pricing: {
    note: 'Pricing depends on the project and its requirements. Send a message through the contact section and we can discuss what you need.'
    // EDIT: you can add fields like `startingFrom: "..."` later if you decide to publish a starting price.
  },

  /* ---------- 9. PROCESS — how a project usually runs ---------- */
  process: [
    'Quick chat about what you need',
    'Quote and timeline',
    'Design and build',
    'Review together',
    'Launch'
    // EDIT: adjust the steps to match how you actually work
  ],

  /* ---------- 10. FAQs — copy one object to add another ---------- */
  faqs: [
    { question: 'How long does a typical project take?', answer: 'Most small business websites take 1–3 weeks from kickoff to launch, depending on scope.' },
    { question: 'Do you offer support after launch?', answer: 'Yes — every project includes a short period of free support after launch, and ongoing maintenance is available too.' },
    { question: 'Do I need to provide my own content and images?', answer: "Ideally yes — text and images specific to your business make the site feel authentic. If you're missing some, I can help." }
    { question: 'Do you only build WordPress websites?', answer: "WordPress and WooCommerce are my main focus since they're flexible and easy for you to manage afterward, but I also build lightweight custom-coded sites like this one when that's a better fit." }
    { question: 'How much does a website cost?', answer: "It depends on the size and features you need — a landing page costs less than a full online store. Tell me about your project and I'll give you a clear quote upfront, with no surprise fees." }
    { question: 'Can you redesign my existing website?', answer: "Yes — whether it's an outdated WordPress site or something built elsewhere, I can rebuild it with a modern design while keeping the content and structure that already works for you." }
    { question: 'How do we get started?', answer: "Reach out through the contact form or WhatsApp with a bit about your business and what you need. I'll follow up with questions, a quote, and a timeline before any work begins." }
    { question: 'Who built you?', answer: "My boss MUSTI built me." }
    { question: 'Who built this site?', answer: "My boss MUSTI built it."}
    { question: 'Who own you?', answer: "My boss MUSTI own me." }
    { question: 'How are you?', answer: "I am fine, you?." }
    { question: 'wagwan', answer: "Wagwan bro." }
    // EDIT: add more Q&A pairs the assistant should be able to answer directly.
  ],

  /* ---------- 11. SOCIAL / CONTACT LINKS ---------- */
  socialLinks: {
    whatsapp: 'https://wa.me/2349122068094', // EDIT
    email: 'mailto:hassanmustaqeem001@gmail.com', // EDIT
    linkedin: '', // EDIT
    github: ''    // EDIT
  }

};
