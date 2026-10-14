(() => {
  const section = document.querySelector(".container");
  const track = document.querySelector(".track");
  const letters = gsap.utils.toArray(".letter");
  const cta = document.querySelector(".cta");
  const letterIndexes = new Map();
  let textIndex = 0;
  let previousWord = null;

  letters.forEach((letter) => {
    const word = letter.closest(".word");
    if (previousWord && word !== previousWord) textIndex += 1;
    letterIndexes.set(letter, textIndex);
    textIndex += 1;
    previousWord = word;
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    section.classList.add("is-static");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(track, { x: () => window.innerWidth });

  letters.forEach((letter) => {
    const fromTop = letterIndexes.get(letter) % 2 === 0;
    gsap.set(letter, {
      y: fromTop ? -90 : 90,
      rotation: fromTop ? -8 : 8,
      opacity: 0,
    });
  });

  gsap.set(cta, { y: 90, rotation: 6, opacity: 0 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () =>
        `+=${Math.max(track.scrollWidth * 1.4, window.innerHeight * 2.2)}`,
      scrub: 0.9,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  timeline.to(
    track,
    {
      x: () => -(track.scrollWidth - window.innerWidth * 0.15),
      ease: "none",
      duration: 1,
    },
    0,
  );

  const totalDistance = track.scrollWidth + window.innerWidth;
  letters.forEach((letter) => {
    const fromTop = letterIndexes.get(letter) % 2 === 0;
    const letterOffset = letter.parentElement.offsetLeft + letter.offsetLeft;
    const at = Math.min(0.82, letterOffset / totalDistance);
    timeline.fromTo(
      letter,
      {
        y: fromTop ? -90 : 90,
        rotation: fromTop ? -8 : 8,
        opacity: 0,
      },
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: "power2.out",
        duration: 0.12,
      },
      Math.max(0, at),
    );
  });

  timeline.fromTo(
    cta,
    {
      y: 90,
      rotation: 6,
      opacity: 0,
    },
    {
      y: 0,
      rotation: 0,
      opacity: 1,
      ease: "power2.out",
      duration: 0.15,
    },
    Math.max(0, Math.min(0.88, cta.offsetLeft / totalDistance)),
  );

  window.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
  });
  
  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();
