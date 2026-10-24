const revealItems = document.querySelectorAll(".design-item:not(.is-static)");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -8%" });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const backgroundMusic = document.querySelector("[data-background-music]");
if (backgroundMusic) {
  backgroundMusic.volume = 0.55;

  const unlockEvents = ["pointerdown", "touchstart", "keydown"];
  const removeUnlockListeners = () => {
    unlockEvents.forEach((eventName) => {
      document.removeEventListener(eventName, startBackgroundMusic);
    });
  };
  const startBackgroundMusic = () => {
    backgroundMusic.play().then(removeUnlockListeners).catch(() => {});
  };

  unlockEvents.forEach((eventName) => {
    document.addEventListener(eventName, startBackgroundMusic, { passive: true });
  });
  window.addEventListener("load", startBackgroundMusic, { once: true });
}

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];
const monthNamesGenitive = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

document.querySelectorAll("[data-calendar]").forEach((calendar) => {
  const calendarDate = calendar.dataset.date || document.body.dataset.eventDate?.split("T")[0];
  const selectedDate = new Date(`${calendarDate}T12:00:00`);
  if (Number.isNaN(selectedDate.getTime())) return;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const selectedDay = selectedDate.getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  calendar.setAttribute("aria-label", `Календарь: ${selectedDay} ${monthNamesGenitive[month]} ${year} года`);

  calendar.innerHTML = `
    <div class="calendar-head"><span>${monthNames[month]}</span><span>${year}</span></div>
    <div class="calendar-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div>
    <div class="calendar-days">
      ${Array.from({ length: firstWeekday }, () => "<span></span>").join("")}
      ${Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return `<span class="calendar-day${day === selectedDay ? " is-selected" : ""}">${day}</span>`;
      }).join("")}
    </div>`;
});

const eventDate = new Date(document.body.dataset.eventDate || "");
const countdown = document.querySelector("[data-countdown]");

if (countdown && !Number.isNaN(eventDate.getTime())) {
  const fields = {
    days: countdown.querySelector("[data-countdown-days]"),
    hours: countdown.querySelector("[data-countdown-hours]"),
    minutes: countdown.querySelector("[data-countdown-minutes]"),
    seconds: countdown.querySelector("[data-countdown-seconds]")
  };

  const updateCountdown = () => {
    const difference = Math.max(0, eventDate.getTime() - Date.now());
    const totalSeconds = Math.floor(difference / 1000);
    fields.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
    fields.hours.textContent = String(Math.floor(totalSeconds / 3600) % 24).padStart(2, "0");
    fields.minutes.textContent = String(Math.floor(totalSeconds / 60) % 60).padStart(2, "0");
    fields.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}
