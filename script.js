(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* =========================================================
     FAIL-SAFE
  ========================================================= */

  if (!window.gsap) {
    document.body.classList.remove("invitation-locked");

    const card = $("#inviteCard");
    const flap = $("#envelopeFlap");
    const seal = $("#waxSeal");

    if (card) {
      card.style.visibility = "visible";
      card.style.opacity = "1";
    }

    if (flap) {
      flap.style.transform = "rotateX(-180deg)";
      flap.style.zIndex = "2";
    }

    if (seal) seal.style.display = "none";

    return;
  }

  gsap.config({
    nullTargetWarn: false,
    force3D: true
  });

  gsap.ticker.lagSmoothing(500, 33);


  /* =========================================================
     ENVELOPE
  ========================================================= */

  const btn = $("#openInvitation");
  const shell = $("#envelopeShell");
  const flap = $("#envelopeFlap");
  const seal = $("#waxSeal");
  const card = $("#inviteCard");
  const ring = $("#inviteRing");
  const hint = $("#openingScroll");

  let isOpen = false;
  let idleTween = null;


  function unlockPage() {
    document.body.classList.remove("invitation-locked");
  }


  if (shell && !reduceMotion.matches) {
    idleTween = gsap.to(shell, {
      y: -3,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }


  function openEnvelope() {
    if (isOpen || !btn) return;

    isOpen = true;
    btn.disabled = true;
    idleTween?.kill();

    if (card) {
      gsap.set(card, {
        visibility: "hidden",
        opacity: 0,
        yPercent: 30,
        zIndex: 4
      });
    }

    if (ring) {
      gsap.set(ring, {
        opacity: 0,
        y: 24,
        scale: .82
      });
    }

    

    const tl = gsap.timeline({
      onComplete: unlockPage
    });

    if (seal) {
      tl
        .to(seal, {
          scale: .91,
          duration: .12,
          ease: "power2.out"
        })
        .to(seal, {
          scale: 1,
          duration: .14,
          ease: "back.out(2)"
        })
        .to(seal, {
          opacity: 0,
          scale: .78,
          duration: .24,
          ease: "power2.in"
        });
    }

    if (flap) {
      tl
        .to(
          flap,
          {
            rotationX: -88,
            duration: .56,
            ease: "power2.in"
          },
          "-=.03"
        )
        .set(flap, {
          zIndex: 2
        })
        .to(flap, {
          rotationX: -180,
          duration: .56,
          ease: "power2.out"
        });
    }

    if (card) {
      tl
        .set(card, {
          visibility: "visible",
          opacity: 1,
          yPercent: 26
        })
        .to(card, {
          yPercent: -55,
          duration: 1.05,
          ease: "power3.out"
        })
        .to(card, {
          yPercent: -53,
          duration: .18,
          ease: "sine.out"
        });
    }

   if (ring) {
  tl.to(
    ring,
    {
      opacity: 1,
      y: 22,  // ბეჭედი უფრო დაბლა გაჩერდება
      scale: 1,
      duration: .48,
      ease: "back.out(1.45)"
    },
    "-=.22"
  );
}
  

    if (hint) {
      tl.to(
        hint,
        {
          opacity: 1,
          y: -3,
          duration: .25
        },
        "-=.08"
      );
    }

    gsap.to(".opening-copy", {
      opacity: 0,
      y: -8,
      duration: .25,
      overwrite: true
    });
  }


  btn?.addEventListener("click", openEnvelope, {
    once: true
  });


  window.setTimeout(() => {
    if (!isOpen) {
      document.body.classList.remove("invitation-locked");
    }
  }, 5000);


  /* =========================================================
     LIGHTWEIGHT SECTION REVEALS
  ========================================================= */

  const revealEls = $$(".reveal");

  if (
    revealEls.length &&
    "IntersectionObserver" in window &&
    !reduceMotion.matches
  ) {
    document.documentElement.classList.add("js-reveal-ready");

    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: .04
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }


  /* =========================================================
     GALLERY FALLBACK
  ========================================================= */

  const gallery = $("#gallery");
  const galleryImages = gallery ? $$("img", gallery) : [];

  if (gallery && galleryImages.length) {
    let failed = 0;

    galleryImages.forEach(img => {
      img.addEventListener(
        "error",
        () => {
          failed += 1;
          img.closest(".polaroid")?.setAttribute("hidden", "");

          if (failed === galleryImages.length) {
            gallery.setAttribute("hidden", "");
          }
        },
        { once: true }
      );
    });
  }


  /* =========================================================
     CINEMATIC WORLD
  ========================================================= */

  const scene = $("#walkScene");
  const stage = $("#walkStage");

  let sceneTimeline = null;
  let waiterWalk = null;
  let tubaPlaying = null;
  let backgroundDance = null;

  let sceneVisible = false;
  let pageVisible = !document.hidden;


  if (scene && stage) {
    const walkWorld = $("#walkWorld");
    const waiterRig = $("#waiterRig");
    const waiter = $("#walkWaiter");
    const waiterShadow = $("#waiterShadow");

    const cupid = $("#walkCupid");
    const curtain = $("#walkLoopCurtain");

    const dancingWoman = $("#dancingWoman");
    const dancingMan = $("#dancingMan");
    const dancingCouple = $("#dancingCouple");
    const champagneWoman = $("#champagneWoman");

    const tubaPlayer = $("#tubaPlayer");

    const LOOP = 26;


    sceneTimeline = gsap.timeline({
      repeat: -1,
      paused: true,
      defaults: {
        ease: "none"
      }
    });


    /* =====================================================
       INITIAL POSITIONS
    ===================================================== */

    if (walkWorld) {
      gsap.set(walkWorld, {
        x: "8vw"
      });
    }

    if (waiterRig) {
      gsap.set(waiterRig, {
        x: "-38vw"
      });
    }


    /* =====================================================
       BACKGROUND CHARACTER SIZE

       ოდნავ გაზრდილი:
       woman      1.08
       man        1.08
       couple     1.08
       champagne  1.08
       tuba       1.10
    ===================================================== */

    if (dancingWoman) {
      gsap.set(dancingWoman, {
        scale: 1.08,
        transformOrigin: "50% 100%"
      });
    }

    if (dancingMan) {
      gsap.set(dancingMan, {
        scale: 1.08,
        transformOrigin: "50% 100%"
      });
    }

    if (dancingCouple) {
      gsap.set(dancingCouple, {
        scale: 1.08,
        transformOrigin: "50% 100%"
      });
    }

    if (champagneWoman) {
      gsap.set(champagneWoman, {
        scale: 1.08,
        transformOrigin: "50% 100%"
      });
    }

    if (tubaPlayer) {
      gsap.set(tubaPlayer, {
        scale: 1.1,
        transformOrigin: "50% 100%"
      });
    }


    /* =====================================================
       CUPID INITIAL POSITION
    ===================================================== */

    if (cupid) {
      gsap.set(cupid, {
        left: "auto",
        right: "-22vw",
        top: "7%",
        x: 0,
        y: -75,
        scaleX: -1,
        rotation: -5,
        opacity: 0
      });
    }


    /* =====================================================
       CURTAIN OPEN
    ===================================================== */

    if (curtain) {
      gsap.set(curtain, {
        opacity: 1
      });

      sceneTimeline.to(
        curtain,
        {
          opacity: 0,
          duration: .35,
          ease: "power1.out"
        },
        0
      );
    }


    /* =====================================================
       WORLD MOVEMENT
    ===================================================== */

    if (walkWorld) {
      sceneTimeline.fromTo(
        walkWorld,
        {
          x: "8vw"
        },
        {
          x: "-205vw",
          duration: LOOP - .65,
          ease: "none"
        },
        0
      );
    }


    /* =====================================================
       WAITER TRAVEL
       იგივე მოძრაობაა — არ შემიცვლია
    ===================================================== */

    if (waiterRig) {
      sceneTimeline.fromTo(
        waiterRig,
        {
          x: "-38vw"
        },
        {
          x: "112vw",
          duration: LOOP - 1.5,
          ease: "none"
        },
        .3
      );
    }


    /* =====================================================
       BACKGROUND DANCERS

       ყველა ერთად მუდმივად მოძრაობს.
       მოძრაობა განზრახ პატარაა, რომ PNG არ "იფრინოს".
    ===================================================== */

    backgroundDance = gsap.timeline({
      repeat: -1,
      yoyo: true,
      paused: true
    });


    /* -------------------------
       DANCING WOMAN
    ------------------------- */

    if (dancingWoman) {
      backgroundDance.to(
        dancingWoman,
        {
          rotation: 2.4,
          x: 5,
          y: -5,
          scale: 1.1,
          duration: .72,
          ease: "sine.inOut",
          transformOrigin: "50% 100%"
        },
        0
      );
    }


    /* -------------------------
       DANCING MAN
    ------------------------- */

    if (dancingMan) {
      backgroundDance.to(
        dancingMan,
        {
          rotation: -2.2,
          x: -5,
          y: -4,
          scale: 1.1,
          duration: .78,
          ease: "sine.inOut",
          transformOrigin: "50% 100%"
        },
        0
      );
    }


    /* -------------------------
       DANCING COUPLE
    ------------------------- */

    if (dancingCouple) {
      backgroundDance.to(
        dancingCouple,
        {
          rotation: 1.8,
          x: 4,
          y: -5,
          scale: 1.095,
          duration: .85,
          ease: "sine.inOut",
          transformOrigin: "50% 100%"
        },
        0
      );
    }


    /* -------------------------
       CHAMPAGNE WOMAN
    ------------------------- */

    if (champagneWoman) {
      backgroundDance.to(
        champagneWoman,
        {
          rotation: -1.8,
          x: -4,
          y: -5,
          scale: 1.095,
          duration: .82,
          ease: "sine.inOut",
          transformOrigin: "50% 100%"
        },
        0
      );
    }


    /* =====================================================
       CUPID
    ===================================================== */

    if (cupid) {
      sceneTimeline
        .fromTo(
          cupid,
          {
            right: "-22vw",
            y: -75,
            scaleX: -1,
            rotation: -5,
            opacity: 0
          },
          {
            right: "9vw",
            y: 30,
            scaleX: -1,
            rotation: 1.5,
            opacity: 1,
            duration: 2.7,
            ease: "power1.out"
          },
          14.15
        )
        .to(
          cupid,
          {
            right: "25vw",
            y: 55,
            rotation: -2,
            duration: 1.7,
            ease: "sine.inOut"
          },
          16.85
        )
        .to(
          cupid,
          {
            right: "108vw",
            y: 5,
            rotation: 5,
            opacity: 0,
            duration: 2.3,
            ease: "power1.in"
          },
          18.55
        );
    }


    /* =====================================================
       CLOSE LOOP
    ===================================================== */

    if (curtain) {
      sceneTimeline.to(
        curtain,
        {
          opacity: 1,
          duration: .25,
          ease: "power1.in"
        },
        LOOP - .25
      );
    }


    /* =====================================================
       WAITER WALKING
       იგივე დარჩა
    ===================================================== */

    if (waiter) {
      waiterWalk = gsap.timeline({
        repeat: -1,
        paused: true,
        defaults: {
          ease: "sine.inOut"
        }
      });

      waiterWalk
        .to(waiter, {
          rotation: .8,
          scaleY: .994,
          duration: .24,
          transformOrigin: "50% 100%"
        })
        .to(waiter, {
          rotation: -.8,
          scaleY: 1,
          duration: .24,
          transformOrigin: "50% 100%"
        })
        .to(waiter, {
          rotation: .65,
          scaleY: .995,
          duration: .24,
          transformOrigin: "50% 100%"
        })
        .to(waiter, {
          rotation: -.55,
          scaleY: 1,
          duration: .24,
          transformOrigin: "50% 100%"
        });
    }

    if (waiterShadow) {
      gsap.set(waiterShadow, {
        transformOrigin: "50% 100%"
      });
    }


    /* =====================================================
       TUBA PLAYER / მესაყვირე

       უფრო შესამჩნევი, მაგრამ რბილი მოძრაობა.
    ===================================================== */

    if (tubaPlayer) {
      tubaPlaying = gsap.timeline({
        repeat: -1,
        paused: true,
        defaults: {
          ease: "sine.inOut"
        }
      });

      tubaPlaying
        .to(tubaPlayer, {
          rotation: -2.3,
          x: -3,
          y: -4,
          scale: 1.115,
          duration: .42,
          transformOrigin: "50% 100%"
        })

        .to(tubaPlayer, {
          rotation: 2.1,
          x: 3,
          y: 0,
          scale: 1.1,
          duration: .48,
          transformOrigin: "50% 100%"
        })

        .to(tubaPlayer, {
          rotation: -1.5,
          x: -2,
          y: -3,
          scale: 1.12,
          duration: .38,
          transformOrigin: "50% 100%"
        })

        .to(tubaPlayer, {
          rotation: 1.2,
          x: 2,
          y: 0,
          scale: 1.1,
          duration: .42,
          transformOrigin: "50% 100%"
        });
    }


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    const syncScenePlayback = () => {
      const shouldPlay =
        sceneVisible &&
        pageVisible &&
        !reduceMotion.matches;

      scene.classList.toggle(
        "is-active",
        shouldPlay
      );

      if (shouldPlay) {
        sceneTimeline?.play();
        waiterWalk?.play();
        backgroundDance?.play();
        tubaPlaying?.play();
      } else {
        sceneTimeline?.pause();
        waiterWalk?.pause();
        backgroundDance?.pause();
        tubaPlaying?.pause();
      }
    };


    /* =====================================================
       ONLY RUN WHEN VISIBLE
    ===================================================== */

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        entries => {
          sceneVisible =
            entries.some(
              entry => entry.isIntersecting
            );

          syncScenePlayback();
        },
        {
          rootMargin: "10% 0px 10% 0px",
          threshold: .01
        }
      );

      observer.observe(scene);
    } else {
      sceneVisible = true;
      syncScenePlayback();
    }


    /* =====================================================
       TAB VISIBILITY
    ===================================================== */

    document.addEventListener(
      "visibilitychange",
      () => {
        pageVisible =
          !document.hidden;

        syncScenePlayback();
      }
    );


    reduceMotion.addEventListener?.(
      "change",
      syncScenePlayback
    );


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    if (reduceMotion.matches) {
      sceneTimeline.pause(14);

      backgroundDance?.pause(0);
      tubaPlaying?.pause(0);

      if (curtain) {
        gsap.set(curtain, {
          opacity: 0
        });
      }

      if (cupid) {
        gsap.set(cupid, {
          opacity: 0
        });
      }
    }
  }


  /* =========================================================
     COUNTDOWN
  ========================================================= */

  const countdown = $("#countdown");

  if (countdown) {
    const target =
      new Date(
        countdown.dataset.date
      ).getTime();

    const pad = (
      n,
      len = 2
    ) =>
      String(
        Math.max(0, n)
      ).padStart(
        len,
        "0"
      );

    const daysEl =
      $(
        "[data-days]",
        countdown
      );

    const hoursEl =
      $(
        "[data-hours]",
        countdown
      );

    const minutesEl =
      $(
        "[data-minutes]",
        countdown
      );

    const secondsEl =
      $(
        "[data-seconds]",
        countdown
      );


    const tick = () => {
      const distance =
        Math.max(
          0,
          target - Date.now()
        );

      const days =
        Math.floor(
          distance / 86400000
        );

      const hours =
        Math.floor(
          (
            distance %
            86400000
          ) /
          3600000
        );

      const minutes =
        Math.floor(
          (
            distance %
            3600000
          ) /
          60000
        );

      const seconds =
        Math.floor(
          (
            distance %
            60000
          ) /
          1000
        );

      if (daysEl) {
        daysEl.textContent =
          pad(days, 2);
      }

      if (hoursEl) {
        hoursEl.textContent =
          pad(hours);
      }

      if (minutesEl) {
        minutesEl.textContent =
          pad(minutes);
      }

      if (secondsEl) {
        secondsEl.textContent =
          pad(seconds);
      }
    };

    tick();

    window.setInterval(
      tick,
      1000
    );
  }


  /* =========================================================
     RSVP
  ========================================================= */

  const rsvpForm =
    $("#rsvpForm");

  const formStatus =
    $("#formStatus");


  rsvpForm?.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      if (
        !rsvpForm.checkValidity()
      ) {
        rsvpForm.reportValidity();
        return;
      }

      if (formStatus) {
        formStatus.textContent =
          "ფორმა მზადაა — გაგზავნისთვის საჭიროა Google Sheets endpoint-ის დაკავშირება.";
      }
    }
  );


  /* =========================================================
     LOAD
  ========================================================= */

  window.addEventListener(
    "load",
    () => {
      if (
        !document.body.classList.contains(
          "invitation-locked"
        )
      ) {
        document.body.style.overflowY = "";
      }
    },
    {
      once: true
    }
  );

})();