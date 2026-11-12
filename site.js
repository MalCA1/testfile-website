"use strict";

const page = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a, .footer-nav a").forEach(link => {
  const target = new URL(link.href, window.location.href).pathname.split("/").pop() || "index.html";
  if (target === page) link.setAttribute("aria-current", "page");
});

document.querySelectorAll(".current-year").forEach(node => {
  node.textContent = new Date().getFullYear();
});

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("open", !expanded);
  });
  navigation.addEventListener("click", event => {
    if (event.target.closest("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("open");
    }
  });
}

const launchDate = document.querySelector("[data-launch-date]");
if (launchDate) {
  const target = new Date(launchDate.dataset.launchDate).getTime();
  const countdown = document.getElementById("countdown");
  const launched = document.getElementById("launchMessage");
  const pad = number => String(number).padStart(2, "0");
  const updateCountdown = () => {
    const difference = target - Date.now();
    if (!Number.isFinite(target) || difference <= 0) {
      if (countdown) countdown.hidden = true;
      if (launched) launched.hidden = false;
      return false;
    }
    const values = {
      days: Math.floor(difference / 86400000),
      hours: Math.floor(difference / 3600000) % 24,
      minutes: Math.floor(difference / 60000) % 60,
      seconds: Math.floor(difference / 1000) % 60
    };
    Object.entries(values).forEach(([unit, value]) => {
      const output = document.querySelector(`[data-countdown="${unit}"]`);
      if (output) output.textContent = pad(value);
    });
    return true;
  };
  if (updateCountdown()) {
    const timer = setInterval(() => {
      if (!updateCountdown()) clearInterval(timer);
    }, 1000);
  }
}

const joinForm = document.getElementById("joinForm");
if (joinForm) {
  joinForm.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("joinMessage");
    message.textContent = "The mailing list is not connected yet, so your address was not sent or saved.";
    message.classList.add("error");
  });
}

const assistantForm = document.getElementById("assistantForm");
if (assistantForm) {
  const input = document.getElementById("assistantInput");
  const messages = document.getElementById("assistantMessages");
  const faqAnswers = [
    {
      keywords: ["products", "product", "gear", "sell", "offer", "skipping rope", "skip rope", "jump rope", "agility ladder", "soccer goal", "mini goal"],
      answer: "The store plans to offer skipping ropes, agility ladders, and mini soccer goals. They're planned products; current stock and availability aren't confirmed."
    },
    {
      keywords: ["deliver", "delivery", "shipping", "ship", "australia", "australian", "tracked", "postage"],
      answer: "The launch information says delivery will be available Australia-wide and tracked. Shipping costs and delivery timeframes haven't been confirmed."
    },
    {
      keywords: ["launch", "opening date", "launch date", "launching", "when is the launch"],
      answer: "The currently published launch date is 15 November 2026 at 9:00 AM Melbourne time. Launch plans can change, so please check the website for the latest update."
    },
    {
      keywords: ["quality", "sturdy", "kid friendly", "children", "age", "material", "size", "specification"],
      answer: "The store describes its planned gear as sturdy and kid-friendly, selected for backyard use. Detailed materials, sizes, and product specifications aren't published yet."
    },
    {
      keywords: ["price", "prices", "cost", "how much", "payment", "pay"],
      answer: "Prices, payment details, and shipping fees aren't published yet. Please check back when the store launches or use the Contact Us page."
    },
    {
      keywords: ["stock", "available", "availability", "buy", "purchase", "order", "in stock"],
      answer: "The products are listed as planned for launch, but current stock and availability aren't confirmed. Please check back for updates."
    },
    {
      keywords: ["return", "refund", "exchange", "warranty", "guarantee"],
      answer: "Returns, refunds, exchanges, and warranty details haven't been published yet. Please check the Contact Us page for official help when contact details are available."
    },
    {
      keywords: ["contact", "email", "phone", "address", "talk", "person", "human"],
      answer: "Official email and phone details aren't published yet. Visit the Contact Us page for updates."
    },
    {
      keywords: ["join", "signup", "sign up", "newsletter", "early access", "notify", "mailing list"],
      answer: "The site has a launch-updates signup area, but its mailing-list service isn't connected yet. Your address won't be submitted or stored from this page."
    },
    {
      keywords: ["our story", "about lucky kids sports", "who is lucky kids sports"],
      answer: "Lucky Kids Sports is preparing kids' sports gear to encourage active outdoor play and bring more fun to backyard days. Visit the Our Story page to read more."
    }
  ];
  const unknownAnswer = "I don't have a confirmed answer for that yet. Please check the relevant page or visit Contact Us. Official email and phone details aren't published yet.";

  function addMessage(text, kind) {
    const message = document.createElement("div");
    message.className = `assistant-message${kind ? ` ${kind}` : ""}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function findFaqAnswer(question) {
    const normalized = question.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
    let bestMatch = null;
    let bestScore = 0;
    for (const faq of faqAnswers) {
      let score = 0;
      for (const keyword of faq.keywords) {
        const term = keyword.toLowerCase();
        if (normalized.includes(term)) score += term.includes(" ") ? 3 : 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }
    return bestMatch ? bestMatch.answer : unknownAnswer;
  }

  document.getElementById("assistantStatus").textContent = "Instant FAQ answers";
  document.querySelectorAll(".assistant-suggestion").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      assistantForm.requestSubmit();
    });
  });

  assistantForm.addEventListener("submit", event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    input.value = "";
    addMessage(findFaqAnswer(question));
    input.focus();
  });
}
