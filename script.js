// year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// sticky nav border on scroll
const nav = document.getElementById("nav");
const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// mobile menu
const toggle = document.querySelector(".nav__toggle");
const mobile = document.getElementById("mobile-menu");

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobile.classList.toggle("is-open", open);
  if (open) {
    mobile.removeAttribute("hidden");
  } else {
    mobile.setAttribute("hidden", "");
  }
};

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  setMenu(open);
});

mobile.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => setMenu(false));
});

// carousel
const slides = document.querySelectorAll(".carousel__slide");
const dots = document.querySelectorAll(".carousel__dot");
let carouselIdx = 0;
let carouselTimer = null;

const goToSlide = (i) => {
  carouselIdx = (i + slides.length) % slides.length;
  slides.forEach((s, n) => s.classList.toggle("is-active", n === carouselIdx));
  dots.forEach((d, n) => d.classList.toggle("is-active", n === carouselIdx));
};

const startCarousel = () => {
  stopCarousel();
  carouselTimer = setInterval(() => goToSlide(carouselIdx + 1), 2000);
};

const stopCarousel = () => {
  if (carouselTimer) clearInterval(carouselTimer);
  carouselTimer = null;
};

dots.forEach((d) => {
  d.addEventListener("click", () => {
    goToSlide(parseInt(d.dataset.dot, 10));
    startCarousel();
  });
});

if (slides.length) startCarousel();

// booking modal
const modal = document.getElementById("bookingModal");
const bookingTitle = document.getElementById("bookingTitle");
const bookingForm = document.getElementById("bookingForm");
const WA_NUMBER = "61401233618";
let activePackage = null;
let lastFocused = null;

const openBookingModal = (pkg, price, trigger) => {
  activePackage = `${pkg} (${price})`;
  bookingTitle.textContent = `${pkg} — ${price}`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  lastFocused = trigger || document.activeElement;
  setTimeout(() => document.getElementById("b_name")?.focus(), 30);
};

const closeBookingModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  bookingForm.reset();
  activePackage = null;
  lastFocused?.focus?.();
};

document.querySelectorAll(".service__book").forEach((btn) => {
  btn.addEventListener("click", () =>
    openBookingModal(btn.dataset.package, btn.dataset.price, btn)
  );
});

modal.querySelectorAll("[data-close]").forEach((el) =>
  el.addEventListener("click", closeBookingModal)
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open"))
    closeBookingModal();
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = bookingForm.name.value.trim();
  if (!name) {
    bookingForm.name.focus();
    return;
  }
  const stylist = bookingForm.stylist.value;
  const length = bookingForm.length.value;
  const notes = bookingForm.notes.value.trim();

  let msg = `Hi Lurosa, I'd like to book the *${activePackage}*.\n\n`;
  msg += `Name: ${name}\n`;
  msg += `Preferred stylist: ${stylist}\n`;
  msg += `Hair length: ${length}`;
  if (notes) msg += `\nNotes: ${notes}`;

  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank",
    "noopener"
  );
  closeBookingModal();
});

// gallery
// ---------------------------------------------------------------------------
// To add a photo: drop it in /img/ then add a line below.
// Use { src, alt, tall: true } to make an item span 2 rows.
// ---------------------------------------------------------------------------
const galleryPhotos = [
  { src: "img/gallery-01.webp", alt: "Lurosa storefront on opening day", tall: true },
  { src: "img/gallery-02.webp", alt: "Entrance with packages menu" },
  { src: "img/gallery-03.webp", alt: "Wash stations" },
  { src: "img/gallery-04.webp", alt: "Side profile under treatment", tall: true },
  { src: "img/gallery-05.webp", alt: "Stylist mid-cut" },
  { src: "img/gallery-06.webp", alt: "Scissors at the chair" },
  { src: "img/gallery-07.webp", alt: "Styling at the chair", tall: true },
  { src: "img/gallery-08.webp", alt: "Two stylists working together" },
  { src: "img/gallery-09.webp", alt: "Blowdry finish" },
  { src: "img/gallery-10.webp", alt: "Sectioning for color" },
  { src: "img/gallery-11.webp", alt: "Precision bob in progress", tall: true },
  { src: "img/gallery-12.webp", alt: "Pravana color line" },
];

const galleryGrid = document.getElementById("galleryGrid");
if (galleryGrid) {
  galleryGrid.innerHTML = galleryPhotos
    .map(
      (p, i) => `
      <figure class="gallery__item${p.tall ? " gallery__item--tall" : ""}" data-lightbox-index="${i}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" decoding="async" />
        <figcaption class="gallery__caption">${p.alt}</figcaption>
      </figure>
    `
    )
    .join("");
}

// lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
let lightboxIdx = 0;

const openLightbox = (i) => {
  lightboxIdx = (i + galleryPhotos.length) % galleryPhotos.length;
  const p = galleryPhotos[lightboxIdx];
  lightboxImg.src = p.src;
  lightboxImg.alt = p.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};
const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};
const stepLightbox = (n) => openLightbox(lightboxIdx + n);

galleryGrid?.addEventListener("click", (e) => {
  const fig = e.target.closest("[data-lightbox-index]");
  if (fig) openLightbox(parseInt(fig.dataset.lightboxIndex, 10));
});
lightbox
  ?.querySelector("[data-lightbox-close]")
  ?.addEventListener("click", closeLightbox);
lightbox
  ?.querySelector("[data-lightbox-prev]")
  ?.addEventListener("click", () => stepLightbox(-1));
lightbox
  ?.querySelector("[data-lightbox-next]")
  ?.addEventListener("click", () => stepLightbox(1));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

// google reviews
// ---------------------------------------------------------------------------
// To go live, replace fetchReviews() with one of:
//   (a) Google Places API: fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=PLACE_ID&fields=reviews,rating,user_ratings_total&key=API_KEY`)
//       Note: the API key is exposed in client JS — restrict it to your domain
//       in Google Cloud Console (HTTP referrers).
//   (b) Third-party widget (Elfsight / Trustindex / Featurable) — paste their
//       script tag inside the .reviews__list container instead of this code.
// Each review needs: { name, initial, rating (1-5), text, when }.
// ---------------------------------------------------------------------------
const fetchReviews = () =>
  Promise.resolve({
    aggregate: { rating: 4.9, total: 127 },
    items: [
      {
        name: "Maya R.",
        initial: "M",
        rating: 5,
        when: "2 weeks ago",
        text: "The first salon I haven't dreaded leaving. They actually listened and the cut grew out perfectly.",
      },
      {
        name: "Sienna L.",
        initial: "S",
        rating: 5,
        when: "a month ago",
        text: "Color that finally looks like me. Six months in and still getting compliments — worth every dollar.",
      },
      {
        name: "Priya S.",
        initial: "P",
        rating: 5,
        when: "2 months ago",
        text: "Calm, careful, and the cut grows out beautifully. I drive across the city for it.",
      },
    ],
  });

const googleSvg = `
  <svg class="review__google" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
    <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#FBBC05" d="M24 44c5.3 0 10.2-2 13.9-5.3l-6.4-5.4C29.5 34.7 26.9 35.5 24 35.5c-6 0-10.7-4-12.5-9.3l-6.5 5C8.4 39.7 15.6 44 24 44z"/>
    <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.6 2.6-2.1 4.8-4.1 6.3l6.4 5.4C42.4 36.8 45 30.9 45 24c0-1.3-.2-2.7-.5-4z"/>
  </svg>
`;

const renderReviews = ({ aggregate, items }) => {
  const ratingEl = document.getElementById("reviewsRating");
  const fillEl = document.getElementById("reviewsStarsFill");
  const countEl = document.getElementById("reviewsCount");
  const listEl = document.getElementById("reviewsList");
  if (!listEl) return;

  if (ratingEl) ratingEl.textContent = aggregate.rating.toFixed(1);
  if (fillEl) fillEl.style.width = `${(aggregate.rating / 5) * 100}%`;
  if (countEl)
    countEl.textContent = `${aggregate.total} review${aggregate.total === 1 ? "" : "s"}`;

  listEl.innerHTML = items
    .map(
      (r) => `
      <li class="review">
        <div class="review__head">
          <div class="review__avatar" aria-hidden="true">${r.initial}</div>
          <div class="review__who">
            <span class="review__name">${r.name}</span>
            <span class="review__date">${r.when}</span>
          </div>
          ${googleSvg}
        </div>
        <div class="review__stars" role="img" aria-label="${r.rating} out of 5 stars" style="width: ${(r.rating / 5) * 88}px"></div>
        <blockquote class="review__text">"${r.text}"</blockquote>
      </li>
    `
    )
    .join("");
};

fetchReviews().then(renderReviews).catch(() => {});

// reveal on scroll — with staggered delay per sibling
const revealTargets = document.querySelectorAll(
  ".section h2, .section .eyebrow, .service, .stylist, .visit__map, .contact__form, .about__image, .gallery__item"
);
revealTargets.forEach((el) => {
  el.classList.add("reveal");
  // stagger items inside a grid by their sibling index
  const parent = el.parentElement;
  if (
    parent &&
    (parent.classList.contains("services__grid") ||
      parent.classList.contains("team__grid") ||
      parent.classList.contains("gallery__grid"))
  ) {
    const idx = Array.from(parent.children).indexOf(el);
    el.style.setProperty("--reveal-delay", `${Math.min(idx * 80, 480)}ms`);
  }
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
revealTargets.forEach((el) => io.observe(el));

// magnetic hero CTA — gently follows the cursor
const magneticBtn = document.querySelector(".carousel__cta");
if (magneticBtn && matchMedia("(hover: hover)").matches) {
  const STRENGTH = 0.25;
  magneticBtn.addEventListener("mousemove", (e) => {
    const r = magneticBtn.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    magneticBtn.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH - 2}px)`;
  });
  magneticBtn.addEventListener("mouseleave", () => {
    magneticBtn.style.transform = "";
  });
}

// hero scroll indicator
document
  .getElementById("carouselScroll")
  ?.addEventListener("click", () =>
    window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })
  );

// mouse spotlight on package cards
document.querySelectorAll(".service").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

