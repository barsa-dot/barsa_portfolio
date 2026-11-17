const intro = document.querySelector("#intro");
const portfolio = document.querySelector("#portfolio");
const enter_button = document.querySelector("#enter");
const badge = document.querySelector(".badge");

const motion_preference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let opening = false;
let observer;

portfolio.hidden = true;

function add_scroll_effects() {
  if (motion_preference.matches) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const items = portfolio.querySelectorAll(
    ".section > h2, .section > p, .intro-tags, .text-link, " +
    ".experience-item, .activities, .skill-groups > div, " +
    ".contact-links, footer"
  );

  for (let item_number = 0; item_number < items.length; item_number++) {
    const item = items[item_number];
    item.classList.add("reveal");
  }

  const card_groups = portfolio.querySelectorAll(".cards, .highlights");

  for (let group_number = 0; group_number < card_groups.length; group_number++) {
    const group = card_groups[group_number];
    const cards = Array.from(group.children);

    for (let card_number = 0; card_number < cards.length; card_number++) {
      const card = cards[card_number];
      const wrapper = document.createElement("div");

      wrapper.classList.add("reveal");
      let delay = "0ms";

      if (card_number % 2 === 1) {
        delay = "90ms";
      }

      wrapper.style.setProperty("--reveal-delay", delay);

      card.before(wrapper);
      wrapper.appendChild(card);
    }
  }

  observer = new IntersectionObserver(function (entries) {
    for (let entry_number = 0; entry_number < entries.length; entry_number++) {
      const entry = entries[entry_number];
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, {
    threshold: 0.08
  });

  const hidden_items = portfolio.querySelectorAll(".reveal");

  for (let item_number = 0; item_number < hidden_items.length; item_number++) {
    const item = hidden_items[item_number];
    observer.observe(item);
  }
}

function open_portfolio() {
  intro.hidden = true;
  portfolio.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

  add_scroll_effects();
  portfolio.classList.add("portfolio-entered");
  portfolio.focus({
    preventScroll: true
  });
}

enter_button.addEventListener("click", function (event) {
  event.preventDefault();

  if (opening) {
    return;
  }
  opening = true;

  if (motion_preference.matches) {
    open_portfolio();
    return;
  }

  const card_animations = badge.getAnimations();

  for (let animation_number = 0; animation_number < card_animations.length; animation_number++) {
    const animation = card_animations[animation_number];
    animation.finish();
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      intro.classList.add("zooming");
      window.setTimeout(open_portfolio, 850);
    });
  });
});

motion_preference.addEventListener("change", function (event) {
  if (!event.matches) {
    return;
  }

  if (observer) {
    observer.disconnect();
  }

  const hidden_items = portfolio.querySelectorAll(".reveal");

  for (let item_number = 0; item_number < hidden_items.length; item_number++) {
    const item = hidden_items[item_number];
    item.classList.add("is-visible");
  }
});