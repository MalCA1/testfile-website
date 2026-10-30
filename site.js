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

const AI_CHAT_ENDPOINT = "";
const assistantForm = document.getElementById("assistantForm");
if (assistantForm) {
  const input = document.getElementById("assistantInput");
  const messages = document.getElementById("assistantMessages");
  const sendButton = document.getElementById("assistantSend");
  const status = document.getElementById("assistantStatus");

  function addMessage(text, kind) {
    const message = document.createElement("div");
    message.className = `assistant-message${kind ? ` ${kind}` : ""}`;
    message.textContent = text;
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
  }

  document.querySelectorAll(".assistant-suggestion").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.textContent;
      assistantForm.requestSubmit();
    });
  });

  assistantForm.addEventListener("submit", async event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    input.value = "";
    if (!AI_CHAT_ENDPOINT) {
      addMessage("The assistant isn't connected yet, so your question wasn't sent. Please check back later or use the store's official contact details.", "error");
      return;
    }

    sendButton.disabled = true;
    status.textContent = "Thinking...";
    try {
      const response = await fetch(AI_CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ message: question })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data && data.error ? data.error : `Service returned ${response.status}.`);
      if (!data || typeof data.reply !== "string" || !data.reply.trim()) throw new Error("The assistant returned an invalid response.");
      addMessage(data.reply.trim());
      if (typeof data.contactUrl === "string") {
        try {
          const contactUrl = new URL(data.contactUrl);
          if (contactUrl.protocol === "https:") {
            const contact = document.getElementById("assistantContact");
            contact.replaceChildren(document.createTextNode("Need a person? "));
            const link = document.createElement("a");
            link.href = contactUrl.href;
            link.textContent = "Contact Lucky Kids Sports";
            link.rel = "noopener noreferrer";
            contact.append(link, document.createTextNode("."));
          }
        } catch {
          // Keep the plain-text contact guidance for invalid optional URLs.
        }
      }
      status.textContent = "Ready to help";
    } catch {
      addMessage("Sorry, I couldn't get an answer just now. Please try again later or use the store's official contact details.", "error");
      status.textContent = "Temporarily unavailable";
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  });
}
